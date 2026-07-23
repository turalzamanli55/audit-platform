import type { LifecycleObjectType } from "./types";
import { registerEntityLifecycleAdapter } from "./registry";
import type { EntityLifecycleAdapter, LifecycleActionId } from "./registry-types";

const FULL_TENANT: readonly LifecycleActionId[] = [
  "edit",
  "rename",
  "archive",
  "restore",
  "softDelete",
  "history",
  "undo",
];

const FULL_ADMIN: readonly LifecycleActionId[] = [
  "edit",
  "archive",
  "restore",
  "softDelete",
  "history",
  "export",
  "undo",
];

const PLATFORM_ORG: readonly LifecycleActionId[] = [
  "edit",
  "archive",
  "restore",
  "softDelete",
  "history",
  "export",
  "undo",
  "permanentDelete",
];

const WORKSPACE_ADMIN: readonly LifecycleActionId[] = ["softDelete", "undo", "history"];

const MEMBERSHIP_ADMIN: readonly LifecycleActionId[] = ["softDelete", "undo"];

const GOVERNED_DEFAULT: readonly LifecycleActionId[] = [
  "edit",
  "archive",
  "restore",
  "softDelete",
  "history",
  "export",
  "undo",
  "permanentDelete",
];

function adapter(
  objectType: LifecycleObjectType,
  partial: Omit<EntityLifecycleAdapter, "objectType" | "displayNameKey"> & {
    displayNameKey?: LifecycleObjectType;
  },
): EntityLifecycleAdapter {
  return {
    objectType,
    displayNameKey: partial.displayNameKey ?? objectType,
    ...partial,
  };
}

/**
 * Metadata-only Entity Lifecycle Adapters.
 * Register once at module load. Adapters never render UI.
 */
export const ENTITY_LIFECYCLE_ADAPTERS: EntityLifecycleAdapter[] = [
  adapter("organization", {
    supportedActions: PLATFORM_ORG,
    actionsByActor: {
      platform_owner: PLATFORM_ORG,
    },
    archiveStrategy: "status_archive",
    softDeleteStrategy: "governed",
    restoreStrategy: "status_restore",
    exportStrategy: "governed",
    historyStrategy: "href",
    undoSupport: true,
    permanentDeleteSupport: true,
    restoreModes: ["only", "with_children", "hierarchy"],
    archiveEqualsSoftDelete: false,
  }),
  adapter("company", {
    supportedActions: [...FULL_TENANT, "export", "permanentDelete"],
    actionsByActor: {
      tenant: FULL_TENANT,
      company_admin: FULL_ADMIN,
      platform_owner: [...FULL_ADMIN, "permanentDelete"],
    },
    archiveStrategy: "domain_archive",
    softDeleteStrategy: "domain_archive",
    restoreStrategy: "domain_restore",
    exportStrategy: "none",
    historyStrategy: "href",
    undoSupport: true,
    permanentDeleteSupport: true,
    restoreModes: ["only", "with_children", "hierarchy"],
    archiveEqualsSoftDelete: true,
  }),
  adapter("engagement", {
    supportedActions: [...FULL_TENANT, "export", "permanentDelete"],
    actionsByActor: {
      tenant: FULL_TENANT,
      company_admin: FULL_ADMIN,
      platform_owner: [...FULL_ADMIN, "permanentDelete"],
    },
    archiveStrategy: "domain_archive",
    softDeleteStrategy: "domain_archive",
    restoreStrategy: "domain_restore",
    exportStrategy: "none",
    historyStrategy: "href",
    undoSupport: true,
    permanentDeleteSupport: true,
    restoreModes: ["only", "with_children", "hierarchy"],
    archiveEqualsSoftDelete: true,
  }),
  adapter("workspace", {
    supportedActions: WORKSPACE_ADMIN,
    actionsByActor: {
      company_admin: WORKSPACE_ADMIN,
      platform_owner: [...WORKSPACE_ADMIN, "export", "permanentDelete"],
    },
    archiveStrategy: "none",
    softDeleteStrategy: "governed",
    restoreStrategy: "governed",
    exportStrategy: "none",
    historyStrategy: "none",
    undoSupport: true,
    permanentDeleteSupport: true,
    restoreModes: ["only", "with_children", "hierarchy"],
    archiveEqualsSoftDelete: false,
  }),
  adapter("membership", {
    supportedActions: MEMBERSHIP_ADMIN,
    actionsByActor: {
      company_admin: MEMBERSHIP_ADMIN,
      platform_owner: [...MEMBERSHIP_ADMIN, "permanentDelete"],
    },
    archiveStrategy: "none",
    softDeleteStrategy: "governed",
    restoreStrategy: "governed",
    exportStrategy: "none",
    historyStrategy: "none",
    undoSupport: true,
    permanentDeleteSupport: true,
    restoreModes: ["only"],
    archiveEqualsSoftDelete: false,
  }),
  // Future objects: register adapter only — menu + capabilities resolve automatically.
  ...(["working_paper", "risk_assessment", "financial_statement", "document", "report", "template", "folder", "evidence", "comment", "task"] as const).map(
    (objectType) =>
      adapter(objectType, {
        supportedActions: GOVERNED_DEFAULT,
        actionsByActor: {
          tenant: ["edit", "softDelete", "history", "undo"] as const,
          company_admin: ["edit", "softDelete", "history", "export", "undo"] as const,
          platform_owner: GOVERNED_DEFAULT,
        },
        archiveStrategy: "none",
        softDeleteStrategy: "governed",
        restoreStrategy: "governed",
        exportStrategy: "governed",
        historyStrategy: "href",
        undoSupport: true,
        permanentDeleteSupport: true,
        restoreModes: ["only", "with_children", "hierarchy"],
        archiveEqualsSoftDelete: false,
      }),
  ),
];

let registered = false;

/** Idempotent registration of all built-in adapters. */
export function ensureEntityLifecycleAdaptersRegistered(): void {
  if (registered) return;
  for (const entry of ENTITY_LIFECYCLE_ADAPTERS) {
    registerEntityLifecycleAdapter(entry);
  }
  registered = true;
}

ensureEntityLifecycleAdaptersRegistered();
