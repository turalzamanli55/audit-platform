"use server";

import { createPlatformAction } from "@/lib/platform-console/platform-action";
import { recordPlatformEvent } from "@/lib/platform-console/events";
import { ValidationError } from "@/lib/errors";
import {
  loadRecycleBin,
  orchestrateSoftDelete,
  orchestrateRestore,
  orchestratePermanentDelete,
  orchestrateLegalHold,
  buildRestorePreview,
  analyzeDependencies,
  type DeleteReasonInput,
  type LifecycleObjectType,
  type RestoreMode,
} from "@/lib/object-lifecycle";
import type { TablesInsert } from "@/types/supabase";

export type GovernanceTarget = {
  objectType: LifecycleObjectType;
  objectId: string;
  organizationId?: string | null;
  workspaceId?: string | null;
};

export const loadPlatformRecycleBinAction = createPlatformAction<
  {
    organizationId?: string | null;
    objectTypes?: LifecycleObjectType[];
    limit?: number;
  },
  Awaited<ReturnType<typeof loadRecycleBin>>
>({ module: "platform.governance.recycle_bin.list" }, async (input, ctx) => {
  return loadRecycleBin(ctx.service, {
    organizationId: input.organizationId,
    objectTypes: input.objectTypes,
    limit: input.limit ?? 200,
  });
});

export const softDeleteGovernedAction = createPlatformAction<
  GovernanceTarget & { reason: DeleteReasonInput },
  { id: string }
>({ module: "platform.governance.soft_delete" }, async (input, ctx) => {
  const result = await orchestrateSoftDelete(ctx.service, {
    objectType: input.objectType,
    objectId: input.objectId,
    actorUserId: ctx.ownerUserId,
    organizationId: input.organizationId ?? null,
    workspaceId: input.workspaceId,
    reason: input.reason,
  });
  await recordPlatformEvent(ctx.service, {
    eventCode: `${input.objectType}.soft_deleted`,
    actorUserId: ctx.ownerUserId,
    organizationId: input.organizationId ?? null,
    severity: "warning",
    details: { reason: input.reason },
  });
  return result;
});

export const previewRestoreGovernedAction = createPlatformAction<
  GovernanceTarget & { mode: RestoreMode },
  Awaited<ReturnType<typeof buildRestorePreview>>
>({ module: "platform.governance.restore.preview" }, async (input, ctx) => {
  return buildRestorePreview(ctx.service, input.objectType, input.objectId, input.mode);
});

export const restoreGovernedAction = createPlatformAction<
  GovernanceTarget & { mode: RestoreMode },
  { restoredIds: string[] }
>({ module: "platform.governance.restore" }, async (input, ctx) => {
  const result = await orchestrateRestore(ctx.service, {
    objectType: input.objectType,
    objectId: input.objectId,
    mode: input.mode,
    actorUserId: ctx.ownerUserId,
    organizationId: input.organizationId,
  });
  await recordPlatformEvent(ctx.service, {
    eventCode: `${input.objectType}.restored`,
    actorUserId: ctx.ownerUserId,
    organizationId: input.organizationId ?? null,
    details: { mode: input.mode, restoredIds: result.restoredIds },
  });
  return result;
});

export const bulkRestoreGovernedAction = createPlatformAction<
  { items: GovernanceTarget[]; mode: RestoreMode },
  { restored: string[]; failed: Array<{ id: string; message: string }> }
>({ module: "platform.governance.restore.bulk" }, async (input, ctx) => {
  const restored: string[] = [];
  const failed: Array<{ id: string; message: string }> = [];
  for (const item of input.items) {
    try {
      const result = await orchestrateRestore(ctx.service, {
        objectType: item.objectType,
        objectId: item.objectId,
        mode: input.mode,
        actorUserId: ctx.ownerUserId,
        organizationId: item.organizationId,
      });
      restored.push(...result.restoredIds);
    } catch (error) {
      failed.push({
        id: item.objectId,
        message: error instanceof Error ? error.message : "Restore failed",
      });
    }
  }
  return { restored, failed };
});

export const setLegalHoldGovernedAction = createPlatformAction<
  GovernanceTarget & { enabled: boolean; reason?: string | null },
  { enabled: boolean }
>({ module: "platform.governance.legal_hold" }, async (input, ctx) => {
  if (!input.organizationId) throw new ValidationError("Organization is required");
  const state = await orchestrateLegalHold(ctx.service, {
    objectType: input.objectType,
    objectId: input.objectId,
    organizationId: input.organizationId,
    workspaceId: input.workspaceId,
    enabled: input.enabled,
    actorUserId: ctx.ownerUserId,
    reason: input.reason,
  });
  return { enabled: state.enabled };
});

export const requestExportBeforeDeleteAction = createPlatformAction<
  GovernanceTarget & { exportScope?: string },
  { requestId: string }
>({ module: "platform.governance.export" }, async (input, ctx) => {
  if (!input.organizationId) throw new ValidationError("Organization is required");
  const payload: TablesInsert<"export_and_portability_requests"> = {
    organization_id: input.organizationId,
    workspace_id: input.workspaceId ?? null,
    requested_by: ctx.ownerUserId,
    export_scope: input.exportScope ?? `${input.objectType}:${input.objectId}`,
    request_status: "queued",
    created_by: ctx.ownerUserId,
    updated_by: ctx.ownerUserId,
  };
  const { data, error } = await ctx.service
    .from("export_and_portability_requests")
    .insert(payload)
    .select("id")
    .single();
  if (error || !data) throw new ValidationError(error?.message ?? "Export request failed");
  await recordPlatformEvent(ctx.service, {
    eventCode: "export.requested",
    actorUserId: ctx.ownerUserId,
    organizationId: input.organizationId,
    details: { requestId: data.id, target: input },
  });
  return { requestId: data.id };
});

export const permanentDeleteGovernedAction = createPlatformAction<
  GovernanceTarget & {
    reason: DeleteReasonInput;
    confirmation: string;
    allowBeforeRetention?: boolean;
  },
  { deletedIds: string[] }
>({ module: "platform.governance.permanent_delete" }, async (input, ctx) => {
  const result = await orchestratePermanentDelete(ctx.service, {
    objectType: input.objectType,
    objectId: input.objectId,
    actorUserId: ctx.ownerUserId,
    reason: input.reason,
    confirmation: input.confirmation,
    allowBeforeRetention: input.allowBeforeRetention,
  });
  await recordPlatformEvent(ctx.service, {
    eventCode: `${input.objectType}.permanently_deleted`,
    actorUserId: ctx.ownerUserId,
    organizationId: input.organizationId ?? null,
    severity: "critical",
    details: {
      deletedIds: result.deletedIds,
      dependencies: result.dependencies,
      reason: input.reason,
    },
  });
  return { deletedIds: result.deletedIds };
});

export const bulkPermanentDeleteGovernedAction = createPlatformAction<
  {
    items: GovernanceTarget[];
    reason: DeleteReasonInput;
    confirmation: string;
    allowBeforeRetention?: boolean;
  },
  { deleted: string[]; failed: Array<{ id: string; message: string }> }
>({ module: "platform.governance.permanent_delete.bulk" }, async (input, ctx) => {
  if (input.confirmation !== "DELETE") {
    throw new ValidationError("Type DELETE to confirm permanent deletion");
  }
  const deleted: string[] = [];
  const failed: Array<{ id: string; message: string }> = [];
  for (const item of input.items) {
    try {
      const result = await orchestratePermanentDelete(ctx.service, {
        objectType: item.objectType,
        objectId: item.objectId,
        actorUserId: ctx.ownerUserId,
        reason: input.reason,
        confirmation: "DELETE",
        allowBeforeRetention: input.allowBeforeRetention,
      });
      deleted.push(...result.deletedIds);
    } catch (error) {
      failed.push({
        id: item.objectId,
        message: error instanceof Error ? error.message : "Permanent delete failed",
      });
    }
  }
  return { deleted, failed };
});

export const analyzeDependenciesGovernedAction = createPlatformAction<
  GovernanceTarget,
  Awaited<ReturnType<typeof analyzeDependencies>>
>({ module: "platform.governance.dependencies" }, async (input, ctx) => {
  return analyzeDependencies(ctx.service, input.objectType, input.objectId);
});
