import type {
  EntityLifecycleAdapter,
  LifecycleActionId,
  LifecycleActor,
  LifecycleCapabilities,
  LifecycleEntityState,
} from "./registry-types";

/**
 * Resolve menu capabilities from registry metadata + actor + entity state.
 * Pages must not hardcode canArchive / canSoftDelete / etc.
 */
export function resolveLifecycleCapabilities(
  adapter: EntityLifecycleAdapter,
  actor: LifecycleActor,
  state: LifecycleEntityState,
): LifecycleCapabilities {
  const allowed = new Set<LifecycleActionId>(adapter.actionsByActor[actor] ?? []);

  const has = (action: LifecycleActionId) =>
    allowed.has(action) && adapter.supportedActions.includes(action);

  const canPermanentDelete =
    has("permanentDelete") &&
    adapter.permanentDeleteSupport &&
    actor === "platform_owner" &&
    Boolean(state.isSoftDeleted);

  return {
    canEdit: has("edit"),
    canRename: has("rename"),
    canArchive: has("archive") && !state.isArchived && adapter.archiveStrategy !== "none",
    canRestore: has("restore") && state.isArchived && adapter.restoreStrategy !== "none",
    canSoftDelete:
      has("softDelete") && !state.isArchived && !state.isSoftDeleted && adapter.softDeleteStrategy !== "none",
    canViewHistory: has("history") && adapter.historyStrategy === "href",
    canExport: has("export") && adapter.exportStrategy !== "none",
    canPermanentDelete,
  };
}

export function supportsLifecycleUndo(
  adapter: EntityLifecycleAdapter,
  actor: LifecycleActor,
): boolean {
  const allowed = adapter.actionsByActor[actor] ?? [];
  return adapter.undoSupport && allowed.includes("undo");
}
