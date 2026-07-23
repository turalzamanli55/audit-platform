import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { emitAuditEvent } from "@/lib/audit/emit-audit-event";
import { ValidationError } from "@/lib/errors";
import {
  analyzeDependencies,
  listDeletedChildren,
  listSoftDeleted,
  loadSoftDeletedRecord,
  permanentDeleteRecord,
  restoreRecord,
  softDeleteRecord,
  supportedObjectTypes,
} from "./adapters";
import { computeRetention } from "./retention";
import { getObjectLegalHold, getOrganizationRetentionDays, setObjectLegalHold } from "./legal-hold";
import type {
  DeleteReasonInput,
  DependencySummary,
  LifecycleObjectType,
  RestoreMode,
  RestorePreview,
  SoftDeletedRecord,
} from "./types";
import { DELETE_REASON_CODES } from "./types";

type Service = SupabaseClient<Database>;

function assertReason(reason: DeleteReasonInput): void {
  if (!DELETE_REASON_CODES.includes(reason.code)) {
    throw new ValidationError("Invalid delete reason");
  }
  if (reason.code === "other" && !reason.customText?.trim()) {
    throw new ValidationError("Custom delete reason is required");
  }
}

async function latestDeleteReason(
  client: Service,
  objectType: LifecycleObjectType,
  objectId: string,
): Promise<{ code: string | null; text: string | null }> {
  const { data } = await client
    .from("audit_logs")
    .select("metadata")
    .eq("resource_type", objectType)
    .eq("resource_id", objectId)
    .in("action", [`${objectType}.soft_deleted`, `${objectType}.archived`, `${objectType}.deleted`])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const meta = (data?.metadata ?? {}) as Record<string, unknown>;
  return {
    code: typeof meta.deleteReasonCode === "string" ? meta.deleteReasonCode : null,
    text: typeof meta.deleteReasonText === "string" ? meta.deleteReasonText : null,
  };
}

export type RecycleBinItem = SoftDeletedRecord & {
  deleteReasonCode: string | null;
  deleteReasonText: string | null;
  retentionRemainingDays: number;
  retentionEligible: boolean;
  legalHoldEnabled: boolean;
};

/** Recycle Bin = filtered view of soft-deleted rows + audit metadata. */
export async function loadRecycleBin(
  client: Service,
  options: {
    organizationId?: string | null;
    objectTypes?: LifecycleObjectType[];
    limit?: number;
  } = {},
): Promise<RecycleBinItem[]> {
  const rows = await listSoftDeleted(client, options);
  const items: RecycleBinItem[] = [];

  for (const row of rows) {
    const orgId = row.organizationId ?? (row.objectType === "organization" ? row.id : null);
    const retentionDays = orgId ? await getOrganizationRetentionDays(client, orgId) : null;
    const retention = computeRetention(row.deletedAt, retentionDays);
    const reason = await latestDeleteReason(client, row.objectType, row.id);
    const hold =
      orgId != null
        ? await getObjectLegalHold(client, row.objectType, row.id, orgId)
        : { enabled: false, policyId: null, reason: null, enabledBy: null, enabledAt: null };

    items.push({
      ...row,
      deleteReasonCode: reason.code,
      deleteReasonText: reason.text,
      retentionRemainingDays: retention.remainingDays,
      retentionEligible: retention.eligibleForPermanentDelete,
      legalHoldEnabled: hold.enabled,
    });
  }

  return items;
}

export async function orchestrateSoftDelete(
  client: Service,
  input: {
    objectType: LifecycleObjectType;
    objectId: string;
    actorUserId: string;
    organizationId: string | null;
    workspaceId?: string | null;
    reason: DeleteReasonInput;
  },
): Promise<{ id: string }> {
  assertReason(input.reason);

  if (input.organizationId) {
    const hold = await getObjectLegalHold(
      client,
      input.objectType,
      input.objectId,
      input.organizationId,
    );
    // Soft delete still allowed under hold; permanent delete is blocked.
    void hold;
  }

  await softDeleteRecord(client, input.objectType, input.objectId, input.actorUserId);

  await emitAuditEvent({
    action: `${input.objectType}.soft_deleted`,
    resourceType: input.objectType,
    resourceId: input.objectId,
    organizationId: input.organizationId,
    workspaceId: input.workspaceId ?? null,
    userId: input.actorUserId,
    metadata: {
      deleteReasonCode: input.reason.code,
      deleteReasonText: input.reason.customText ?? null,
    },
  });

  return { id: input.objectId };
}

export async function buildRestorePreview(
  client: Service,
  objectType: LifecycleObjectType,
  objectId: string,
  mode: RestoreMode,
): Promise<RestorePreview> {
  const root = await loadSoftDeletedRecord(client, objectType, objectId);
  if (!root) throw new ValidationError("Deleted object not found");

  const dependencies = await analyzeDependencies(client, objectType, objectId);
  let objectsToRestore: SoftDeletedRecord[] = [root];

  if (mode === "with_children" || mode === "hierarchy") {
    const children = await listDeletedChildren(client, root, mode);
    objectsToRestore = [root, ...children];
  }

  return { root, mode, objectsToRestore, dependencies };
}

/**
 * Restore orchestration.
 * mode=only: single object.
 * mode=with_children|hierarchy: all-or-nothing with compensation rollback.
 */
export async function orchestrateRestore(
  client: Service,
  input: {
    objectType: LifecycleObjectType;
    objectId: string;
    mode: RestoreMode;
    actorUserId: string;
    organizationId?: string | null;
  },
): Promise<{ restoredIds: string[] }> {
  const preview = await buildRestorePreview(client, input.objectType, input.objectId, input.mode);
  const restored: SoftDeletedRecord[] = [];

  try {
    for (const obj of preview.objectsToRestore) {
      await restoreRecord(client, obj.objectType, obj.id, input.actorUserId);
      restored.push(obj);
    }
  } catch (error) {
    // Compensation rollback — re-soft-delete anything already restored.
    for (const obj of [...restored].reverse()) {
      try {
        await softDeleteRecord(client, obj.objectType, obj.id, input.actorUserId);
      } catch {
        // best-effort compensation
      }
    }
    throw error instanceof Error ? error : new Error(String(error));
  }

  await emitAuditEvent({
    action: `${input.objectType}.restored`,
    resourceType: input.objectType,
    resourceId: input.objectId,
    organizationId: input.organizationId ?? preview.root.organizationId,
    userId: input.actorUserId,
    metadata: {
      mode: input.mode,
      restoredIds: restored.map((r) => r.id),
      restoredCount: restored.length,
    },
  });

  return { restoredIds: restored.map((r) => r.id) };
}

export async function orchestratePermanentDelete(
  client: Service,
  input: {
    objectType: LifecycleObjectType;
    objectId: string;
    actorUserId: string;
    reason: DeleteReasonInput;
    confirmation: string;
    allowBeforeRetention?: boolean;
  },
): Promise<{ deletedIds: string[]; dependencies: DependencySummary }> {
  assertReason(input.reason);
  if (input.confirmation !== "DELETE") {
    throw new ValidationError("Type DELETE to confirm permanent deletion");
  }

  const root = await loadSoftDeletedRecord(client, input.objectType, input.objectId);
  if (!root) throw new ValidationError("Object must be soft-deleted before permanent deletion");

  const orgId = root.organizationId ?? (root.objectType === "organization" ? root.id : null);
  if (!orgId) throw new ValidationError("Organization context required");

  const hold = await getObjectLegalHold(client, input.objectType, input.objectId, orgId);
  if (hold.enabled) {
    throw new ValidationError("Permanent delete is blocked while Legal Hold is enabled");
  }

  const retentionDays = await getOrganizationRetentionDays(client, orgId);
  const retention = computeRetention(root.deletedAt, retentionDays);
  if (!retention.eligibleForPermanentDelete && !input.allowBeforeRetention) {
    throw new ValidationError("Retention period has not elapsed");
  }

  const dependencies = await analyzeDependencies(client, input.objectType, input.objectId);
  const children = await listDeletedChildren(client, root, "hierarchy");
  const toRemove = [root, ...children];
  const deletedIds: string[] = [];

  for (const obj of toRemove) {
    const childHold = await getObjectLegalHold(client, obj.objectType, obj.id, orgId);
    if (childHold.enabled) {
      throw new ValidationError(`Legal Hold blocks permanent delete of ${obj.objectType}:${obj.id}`);
    }
  }

  for (const obj of toRemove) {
    await permanentDeleteRecord(client, obj.objectType, obj.id);
    deletedIds.push(obj.id);
  }

  await emitAuditEvent({
    action: `${input.objectType}.permanently_deleted`,
    resourceType: input.objectType,
    resourceId: input.objectId,
    organizationId: orgId,
    userId: input.actorUserId,
    metadata: {
      deletedBy: input.actorUserId,
      deletedAt: new Date().toISOString(),
      deleteReasonCode: input.reason.code,
      deleteReasonText: input.reason.customText ?? null,
      objectsRemoved: deletedIds,
      dependencySummary: dependencies,
    },
  });

  return { deletedIds, dependencies };
}

export async function orchestrateLegalHold(
  client: Service,
  input: {
    objectType: LifecycleObjectType;
    objectId: string;
    organizationId: string;
    workspaceId?: string | null;
    enabled: boolean;
    actorUserId: string;
    reason?: string | null;
  },
) {
  const state = await setObjectLegalHold(client, input);
  await emitAuditEvent({
    action: input.enabled ? `${input.objectType}.legal_hold.enabled` : `${input.objectType}.legal_hold.cleared`,
    resourceType: input.objectType,
    resourceId: input.objectId,
    organizationId: input.organizationId,
    workspaceId: input.workspaceId ?? null,
    userId: input.actorUserId,
    metadata: { reason: input.reason ?? null, legalHoldEnabled: input.enabled },
  });
  return state;
}

export { supportedObjectTypes, analyzeDependencies };
