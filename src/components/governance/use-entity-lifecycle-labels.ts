"use client";

import { usePlatformLabels } from "@/i18n/use-platform-labels";
import type { EntityLifecycleLabels } from "@/components/governance/entity-lifecycle-menu";

/** Shared lifecycle copy from platform.governance — never duplicate per screen. */
export function useEntityLifecycleLabels(overrides?: Partial<EntityLifecycleLabels>): EntityLifecycleLabels {
  const t = usePlatformLabels();
  return {
    moreActions: t.ux.moreActions,
    edit: t.common.edit,
    archive: t.common.archive,
    restore: t.common.restore,
    softDelete: t.governance.softDelete,
    viewHistory: t.governance.viewHistory,
    permanentDelete: t.governance.permanentDelete,
    export: t.governance.export,
    cancel: t.common.cancel,
    confirm: t.governance.confirmAction,
    reasonLabel: t.governance.reasonLabel,
    reasonOther: t.governance.reasonOther,
    deleteConfirm: t.governance.softDeleteConfirm,
    permanentConfirm: t.governance.typeDeleteHint,
    typeDelete: t.governance.typeDelete,
    undoMessage: t.governance.undoMessage,
    undoAction: t.governance.undoAction,
    toastArchived: t.governance.toastArchived,
    toastRestored: t.governance.toastRestored,
    toastDeleted: t.governance.toastSoftDeleted,
    toastExported: t.governance.toastExported,
    reasons: t.governance.reasons,
    ...overrides,
  };
}
