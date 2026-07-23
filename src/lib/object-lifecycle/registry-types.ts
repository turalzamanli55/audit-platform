/**
 * Universal Object Lifecycle Engine — registry metadata only.
 * Adapters never render UI. Orchestration stays in existing governance paths.
 */

import type { LifecycleObjectType, RestoreMode } from "./types";

/** Actor contexts that may see lifecycle actions. Visibility comes from the registry. */
export type LifecycleActor =
  | "platform_owner"
  | "company_admin"
  | "tenant";

/** Canonical lifecycle actions the menu can expose. */
export type LifecycleActionId =
  | "edit"
  | "rename"
  | "archive"
  | "restore"
  | "softDelete"
  | "history"
  | "export"
  | "undo"
  | "permanentDelete";

/**
 * How persistence actions are executed.
 * Handlers map these strategies — pages never choose buttons.
 */
export type LifecycleDeleteStrategy = "domain_archive" | "governed" | "none";
export type LifecycleArchiveStrategy = "domain_archive" | "status_archive" | "none";
export type LifecycleRestoreStrategy = "domain_restore" | "status_restore" | "governed" | "none";
export type LifecycleExportStrategy = "governed" | "none";
export type LifecycleHistoryStrategy = "href" | "none";

export type EntityLifecycleAdapter = {
  objectType: LifecycleObjectType;
  /** i18n key under platform.governance.objectTypes */
  displayNameKey: LifecycleObjectType;
  /** Actions this object type supports in principle (before actor/state filters). */
  supportedActions: readonly LifecycleActionId[];
  /** Per-actor allow-list. Missing actor ⇒ no lifecycle menu. */
  actionsByActor: Partial<Record<LifecycleActor, readonly LifecycleActionId[]>>;
  archiveStrategy: LifecycleArchiveStrategy;
  softDeleteStrategy: LifecycleDeleteStrategy;
  restoreStrategy: LifecycleRestoreStrategy;
  exportStrategy: LifecycleExportStrategy;
  historyStrategy: LifecycleHistoryStrategy;
  /** Undo after soft delete when strategy supports restore. */
  undoSupport: boolean;
  /** Permanent delete only for platform_owner and only when soft-deleted. */
  permanentDeleteSupport: boolean;
  /** Restore modes offered by governance preview (metadata). */
  restoreModes: readonly RestoreMode[];
  /** Soft delete and archive share the same persistence for this type. */
  archiveEqualsSoftDelete: boolean;
};

export type LifecycleTarget = {
  id: string;
  version?: number | null;
  organizationId?: string | null;
  workspaceId?: string | null;
  slug?: string | null;
  name?: string | null;
};

export type LifecycleEntityState = {
  isArchived: boolean;
  /** Soft-deleted (deleted_at set). Required for permanent delete. */
  isSoftDeleted?: boolean;
  status?: string | null;
};

export type LifecycleHrefBag = {
  edit?: string;
  rename?: string;
  history?: string;
};

/** Menu capability flags resolved from registry + actor + state. */
export type LifecycleCapabilities = {
  canEdit?: boolean;
  canRename?: boolean;
  canArchive?: boolean;
  canRestore?: boolean;
  canSoftDelete?: boolean;
  canViewHistory?: boolean;
  canExport?: boolean;
  canPermanentDelete?: boolean;
};
