"use client";

/**
 * Strategy → existing server-action dispatch.
 * Pages never call domain archive/restore directly for lifecycle menus.
 */

import { archiveCompanyAction } from "@/lib/actions/company/archive-company";
import { restoreCompanyAction } from "@/lib/actions/company/restore-company";
import { archiveEngagementAction } from "@/lib/actions/engagement/archive-engagement";
import { restoreEngagementAction } from "@/lib/actions/engagement/restore-engagement";
import {
  companyRestoreGovernedAction,
  companySoftDeleteGovernedAction,
} from "@/lib/actions/company-administration/governance-actions";
import {
  softDeleteGovernedAction,
  restoreGovernedAction,
  permanentDeleteGovernedAction,
  requestExportBeforeDeleteAction,
} from "@/lib/platform-console/actions/governance";
import {
  archiveTenantAction,
  restoreTenantAction,
} from "@/lib/platform-console/actions/organizations";
import type { ActionResult } from "@/lib/actions/types";
import type { DeleteReasonInput, LifecycleObjectType, RestoreMode } from "./types";
import type { EntityLifecycleAdapter, LifecycleActor, LifecycleTarget } from "./registry-types";
import { getEntityLifecycleAdapter } from "./registry";
import { ensureEntityLifecycleAdaptersRegistered } from "./entity-adapters";

function fail(message: string): ActionResult<never> {
  return { success: false, error: { code: "LIFECYCLE_UNSUPPORTED", message } };
}

function requireVersion(target: LifecycleTarget): number | null {
  return typeof target.version === "number" ? target.version : null;
}

async function domainArchive(
  objectType: LifecycleObjectType,
  target: LifecycleTarget,
  reason: DeleteReasonInput,
): Promise<ActionResult<unknown>> {
  const version = requireVersion(target);
  if (objectType === "company") {
    if (version == null) return fail("Company version is required");
    return archiveCompanyAction({
      companyId: target.id,
      version,
      archiveReason: reason.customText ?? reason.code,
    });
  }
  if (objectType === "engagement") {
    if (version == null) return fail("Engagement version is required");
    return archiveEngagementAction({
      engagementId: target.id,
      version,
      archiveReason: reason.customText ?? reason.code,
    });
  }
  return fail(`No domain archive handler for ${objectType}`);
}

async function domainRestore(
  objectType: LifecycleObjectType,
  target: LifecycleTarget,
): Promise<ActionResult<unknown>> {
  const version = requireVersion(target);
  if (objectType === "company") {
    if (version == null) return fail("Company version is required");
    return restoreCompanyAction({ companyId: target.id, version });
  }
  if (objectType === "engagement") {
    if (version == null) return fail("Engagement version is required");
    return restoreEngagementAction({ engagementId: target.id, version });
  }
  return fail(`No domain restore handler for ${objectType}`);
}

async function governedSoftDelete(
  actor: LifecycleActor,
  objectType: LifecycleObjectType,
  target: LifecycleTarget,
  reason: DeleteReasonInput,
): Promise<ActionResult<unknown>> {
  if (actor === "platform_owner") {
    return softDeleteGovernedAction({
      objectType,
      objectId: target.id,
      organizationId: target.organizationId ?? (objectType === "organization" ? target.id : null),
      workspaceId: target.workspaceId,
      reason,
    });
  }
  return companySoftDeleteGovernedAction({
    objectType,
    objectId: target.id,
    workspaceId: target.workspaceId,
    reason,
  });
}

async function governedRestore(
  actor: LifecycleActor,
  objectType: LifecycleObjectType,
  target: LifecycleTarget,
  mode: RestoreMode = "only",
): Promise<ActionResult<unknown>> {
  if (actor === "platform_owner") {
    return restoreGovernedAction({
      objectType,
      objectId: target.id,
      organizationId: target.organizationId ?? (objectType === "organization" ? target.id : null),
      workspaceId: target.workspaceId,
      mode,
    });
  }
  return companyRestoreGovernedAction({
    objectType,
    objectId: target.id,
    mode,
  });
}

export type LifecycleActionDispatch = {
  archive: (reason: DeleteReasonInput) => Promise<ActionResult<unknown>>;
  restore: () => Promise<ActionResult<unknown>>;
  softDelete: (reason: DeleteReasonInput) => Promise<ActionResult<unknown>>;
  undoSoftDelete: () => Promise<ActionResult<unknown>>;
  exportObject: () => Promise<ActionResult<unknown>>;
  permanentDelete: (input: {
    reason: DeleteReasonInput;
    confirmation: string;
  }) => Promise<ActionResult<unknown>>;
};

/**
 * Build lifecycle action dispatchers from adapter strategies + actor.
 * Uses existing governance / domain actions only.
 */
export function createLifecycleActionDispatch(input: {
  objectType: LifecycleObjectType;
  target: LifecycleTarget;
  actor: LifecycleActor;
  adapter?: EntityLifecycleAdapter | null;
}): LifecycleActionDispatch {
  ensureEntityLifecycleAdaptersRegistered();
  const adapter = input.adapter ?? getEntityLifecycleAdapter(input.objectType);
  const { objectType, target, actor } = input;

  if (!adapter) {
    const unsupported = async () => fail(`No adapter for ${objectType}`);
    return {
      archive: unsupported,
      restore: unsupported,
      softDelete: unsupported,
      undoSoftDelete: unsupported,
      exportObject: unsupported,
      permanentDelete: unsupported,
    };
  }

  return {
    archive: async (reason) => {
      if (adapter.archiveStrategy === "status_archive" && objectType === "organization") {
        return archiveTenantAction({ id: target.id });
      }
      if (adapter.archiveStrategy === "domain_archive") {
        return domainArchive(objectType, target, reason);
      }
      if (adapter.archiveStrategy === "none") return fail("Archive not supported");
      return fail("Archive strategy not implemented");
    },
    restore: async () => {
      if (adapter.restoreStrategy === "status_restore" && objectType === "organization") {
        return restoreTenantAction({ id: target.id });
      }
      if (adapter.restoreStrategy === "domain_restore") {
        return domainRestore(objectType, target);
      }
      if (adapter.restoreStrategy === "governed") {
        return governedRestore(actor, objectType, target, "only");
      }
      return fail("Restore not supported");
    },
    softDelete: async (reason) => {
      if (adapter.softDeleteStrategy === "domain_archive") {
        return domainArchive(objectType, target, reason);
      }
      if (adapter.softDeleteStrategy === "governed") {
        return governedSoftDelete(actor, objectType, target, reason);
      }
      return fail("Soft delete not supported");
    },
    undoSoftDelete: async () => {
      if (adapter.restoreStrategy === "domain_restore" || adapter.archiveEqualsSoftDelete) {
        if (adapter.restoreStrategy === "domain_restore") {
          return domainRestore(objectType, target);
        }
      }
      if (adapter.softDeleteStrategy === "governed" || adapter.restoreStrategy === "governed") {
        return governedRestore(actor, objectType, target, "only");
      }
      if (adapter.restoreStrategy === "status_restore" && objectType === "organization") {
        // Soft-delete undo for orgs uses governed restore (deleted_at), not status restore.
        return governedRestore(actor, objectType, target, "only");
      }
      return fail("Undo not supported");
    },
    exportObject: async () => {
      if (adapter.exportStrategy !== "governed") return fail("Export not supported");
      if (actor !== "platform_owner") return fail("Export requires Platform Owner");
      return requestExportBeforeDeleteAction({
        objectType,
        objectId: target.id,
        organizationId: target.organizationId ?? (objectType === "organization" ? target.id : null),
        workspaceId: target.workspaceId,
      });
    },
    permanentDelete: async ({ reason, confirmation }) => {
      if (!adapter.permanentDeleteSupport || actor !== "platform_owner") {
        return fail("Permanent delete is Platform Owner only");
      }
      return permanentDeleteGovernedAction({
        objectType,
        objectId: target.id,
        organizationId: target.organizationId ?? (objectType === "organization" ? target.id : null),
        workspaceId: target.workspaceId,
        reason,
        confirmation,
      });
    },
  };
}
