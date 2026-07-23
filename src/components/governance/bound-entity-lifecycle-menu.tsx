"use client";

import type { ReactNode } from "react";
import {
  EntityLifecycleMenu,
  mapActionResult,
  type EntityLifecycleLabels,
} from "@/components/governance/entity-lifecycle-menu";
import { useEntityLifecycleLabels } from "@/components/governance/use-entity-lifecycle-labels";
import type { LifecycleObjectType } from "@/lib/object-lifecycle/types";
import type {
  LifecycleActor,
  LifecycleEntityState,
  LifecycleHrefBag,
  LifecycleTarget,
} from "@/lib/object-lifecycle/registry-types";
import { getEntityLifecycleAdapter } from "@/lib/object-lifecycle/registry";
import { ensureEntityLifecycleAdaptersRegistered } from "@/lib/object-lifecycle/entity-adapters";
import {
  resolveLifecycleCapabilities,
  supportsLifecycleUndo,
} from "@/lib/object-lifecycle/resolve-capabilities";
import { createLifecycleActionDispatch } from "@/lib/object-lifecycle/lifecycle-handlers";

export type BoundEntityLifecycleMenuProps = {
  objectType: LifecycleObjectType;
  target: LifecycleTarget;
  actor: LifecycleActor;
  state: LifecycleEntityState;
  hrefs?: LifecycleHrefBag;
  trigger?: ReactNode;
  leadingExtraItems?: ReactNode;
  trailingExtraItems?: ReactNode;
  labelOverrides?: Partial<EntityLifecycleLabels>;
  onEdit?: () => void;
  onRename?: () => void;
  /** Fired after a successful soft delete (e.g. parent undo toast). */
  onSoftDeleted?: () => void;
  /** When false, skip built-in undo toast (parent owns undo UX). */
  enableUndoToast?: boolean;
};

/**
 * Universal lifecycle entry point.
 * Screens pass object identity + actor — never wire archive/delete handlers themselves.
 */
export function BoundEntityLifecycleMenu({
  objectType,
  target,
  actor,
  state,
  hrefs,
  trigger,
  leadingExtraItems,
  trailingExtraItems,
  labelOverrides,
  onEdit,
  onRename,
  onSoftDeleted,
  enableUndoToast = true,
}: BoundEntityLifecycleMenuProps) {
  ensureEntityLifecycleAdaptersRegistered();
  const adapter = getEntityLifecycleAdapter(objectType);
  const labels = useEntityLifecycleLabels(labelOverrides);

  if (!adapter) return null;

  const capabilities = resolveLifecycleCapabilities(adapter, actor, state);
  const dispatch = createLifecycleActionDispatch({ objectType, target, actor, adapter });
  const undo = enableUndoToast && supportsLifecycleUndo(adapter, actor);

  return (
    <EntityLifecycleMenu
      labels={labels}
      capabilities={capabilities}
      isArchived={state.isArchived}
      editHref={hrefs?.edit}
      renameHref={hrefs?.rename}
      historyHref={hrefs?.history}
      trigger={trigger}
      leadingExtraItems={leadingExtraItems}
      trailingExtraItems={trailingExtraItems}
      onEdit={onEdit}
      onRename={onRename}
      onArchive={async (reason) => mapActionResult(await dispatch.archive(reason))}
      onRestore={async () => mapActionResult(await dispatch.restore())}
      onSoftDelete={async (reason) => {
        const result = await dispatch.softDelete(reason);
        if (result.success) onSoftDeleted?.();
        return mapActionResult(result);
      }}
      onUndoSoftDelete={
        undo
          ? async () => mapActionResult(await dispatch.undoSoftDelete())
          : undefined
      }
      onExport={
        capabilities.canExport
          ? async () => mapActionResult(await dispatch.exportObject())
          : undefined
      }
      onPermanentDelete={
        capabilities.canPermanentDelete
          ? async (input) => mapActionResult(await dispatch.permanentDelete(input))
          : undefined
      }
    />
  );
}
