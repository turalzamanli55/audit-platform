"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui";
import { GovernanceUndoToast } from "@/components/governance/undo-toast";
import type { ActionResult } from "@/lib/actions/types";
import { DELETE_REASON_CODES, type DeleteReasonCode } from "@/lib/object-lifecycle/types";
import type { LifecycleCapabilities } from "@/lib/object-lifecycle/registry-types";

export type EntityLifecycleLabels = {
  moreActions: string;
  edit: string;
  rename?: string;
  archive: string;
  restore: string;
  softDelete: string;
  viewHistory: string;
  permanentDelete?: string;
  export?: string;
  cancel: string;
  confirm: string;
  reasonLabel: string;
  reasonOther: string;
  deleteConfirm: string;
  permanentConfirm?: string;
  typeDelete?: string;
  undoMessage: string;
  undoAction: string;
  toastArchived: string;
  toastRestored: string;
  toastDeleted: string;
  toastExported?: string;
  reasons: Record<DeleteReasonCode, string>;
};

export type EntityLifecycleCapabilities = LifecycleCapabilities;

export type LifecycleActionResult = { success: boolean; error?: string };

/** Normalize ActionResult into the lifecycle menu callback shape. */
export function mapActionResult(result: ActionResult<unknown>): LifecycleActionResult {
  if (result.success) return { success: true };
  return { success: false, error: result.error.message };
}

type Props = {
  labels: EntityLifecycleLabels;
  capabilities: EntityLifecycleCapabilities;
  isArchived: boolean;
  editHref?: string;
  historyHref?: string;
  renameHref?: string;
  trigger?: ReactNode;
  /** Extra items rendered after Edit/Rename/History (e.g. Suspend). */
  leadingExtraItems?: ReactNode;
  /** Extra items rendered before Soft Delete / Permanent Delete. */
  trailingExtraItems?: ReactNode;
  onEdit?: () => void;
  onRename?: () => void;
  onArchive: (reason: { code: DeleteReasonCode; customText?: string }) => Promise<LifecycleActionResult>;
  onRestore: () => Promise<LifecycleActionResult>;
  onSoftDelete: (reason: {
    code: DeleteReasonCode;
    customText?: string;
  }) => Promise<LifecycleActionResult>;
  onUndoSoftDelete?: () => Promise<LifecycleActionResult>;
  onExport?: () => Promise<LifecycleActionResult>;
  onPermanentDelete?: (input: {
    reason: { code: DeleteReasonCode; customText?: string };
    confirmation: string;
  }) => Promise<LifecycleActionResult>;
};

/**
 * Shared enterprise lifecycle action menu for management screens.
 * Soft delete / restore / archive call into existing domain + governance actions via callbacks.
 */
export function EntityLifecycleMenu({
  labels,
  capabilities,
  isArchived,
  editHref,
  historyHref,
  renameHref,
  trigger,
  leadingExtraItems,
  trailingExtraItems,
  onEdit,
  onRename,
  onArchive,
  onRestore,
  onSoftDelete,
  onUndoSoftDelete,
  onExport,
  onPermanentDelete,
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [reasonOpen, setReasonOpen] = useState<"archive" | "softDelete" | "purge" | null>(null);
  const [reasonCode, setReasonCode] = useState<DeleteReasonCode>("mistaken_entry");
  const [reasonText, setReasonText] = useState("");
  const [purgeConfirm, setPurgeConfirm] = useState("");
  const [showUndo, setShowUndo] = useState(false);

  function refresh() {
    startTransition(() => router.refresh());
  }

  function run(
    action: () => Promise<LifecycleActionResult>,
    successMessage: string,
    opts?: { undo?: boolean },
  ) {
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        toast({ title: result.error ?? "Action failed", variant: "error" });
        return;
      }
      toast({ title: successMessage, variant: "success" });
      if (opts?.undo) setShowUndo(true);
      setReasonOpen(null);
      setPurgeConfirm("");
      refresh();
    });
  }

  const menuTrigger = trigger ?? (
    <Button variant="outline" size="sm" className="min-h-11 w-11 px-0" aria-label={labels.moreActions}>
      ⋮
    </Button>
  );

  const showEdit = capabilities.canEdit !== false && Boolean(editHref || onEdit);
  const showRename = Boolean(capabilities.canRename && (renameHref || onRename));
  const showHistory = capabilities.canViewHistory !== false && Boolean(historyHref);

  return (
    <>
      <DropdownMenu align="end" trigger={menuTrigger}>
        {showEdit ? (
          editHref ? (
            <DropdownMenuItem onSelect={() => router.push(editHref)}>{labels.edit}</DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={() => onEdit?.()}>{labels.edit}</DropdownMenuItem>
          )
        ) : null}

        {showRename ? (
          renameHref ? (
            <DropdownMenuItem onSelect={() => router.push(renameHref)}>
              {labels.rename ?? labels.edit}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={() => onRename?.()}>{labels.rename ?? labels.edit}</DropdownMenuItem>
          )
        ) : null}

        {showHistory ? (
          <DropdownMenuItem onSelect={() => router.push(historyHref!)}>{labels.viewHistory}</DropdownMenuItem>
        ) : null}

        {leadingExtraItems}

        {(showEdit || showRename || showHistory || leadingExtraItems) &&
        (capabilities.canArchive !== false ||
          capabilities.canRestore !== false ||
          capabilities.canSoftDelete !== false) ? (
          <DropdownMenuSeparator />
        ) : null}

        {!isArchived && capabilities.canArchive !== false ? (
          <DropdownMenuItem disabled={pending} onSelect={() => setReasonOpen("archive")}>
            {labels.archive}
          </DropdownMenuItem>
        ) : null}

        {isArchived && capabilities.canRestore !== false ? (
          <DropdownMenuItem disabled={pending} onSelect={() => run(onRestore, labels.toastRestored)}>
            {labels.restore}
          </DropdownMenuItem>
        ) : null}

        {trailingExtraItems}

        {!isArchived && capabilities.canSoftDelete !== false ? (
          <DropdownMenuItem disabled={pending} onSelect={() => setReasonOpen("softDelete")}>
            {labels.softDelete}
          </DropdownMenuItem>
        ) : null}

        {capabilities.canExport && onExport ? (
          <DropdownMenuItem
            disabled={pending}
            onSelect={() => run(onExport, labels.toastExported ?? labels.toastDeleted)}
          >
            {labels.export}
          </DropdownMenuItem>
        ) : null}

        {capabilities.canPermanentDelete && onPermanentDelete ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive disabled={pending} onSelect={() => setReasonOpen("purge")}>
              {labels.permanentDelete}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenu>

      <Modal
        open={reasonOpen !== null}
        onOpenChange={(open) => {
          if (!open) {
            setReasonOpen(null);
            setPurgeConfirm("");
          }
        }}
        title={
          reasonOpen === "purge"
            ? (labels.permanentDelete ?? labels.softDelete)
            : reasonOpen === "archive"
              ? labels.archive
              : labels.softDelete
        }
        footer={
          <>
            <Button variant="outline" size="sm" className="min-h-11" onClick={() => setReasonOpen(null)}>
              {labels.cancel}
            </Button>
            <Button
              size="sm"
              className="min-h-11"
              variant={reasonOpen === "purge" ? "destructive" : "primary"}
              loading={pending}
              disabled={reasonOpen === "purge" && purgeConfirm !== "DELETE"}
              onClick={() => {
                const reason = {
                  code: reasonCode,
                  customText: reasonCode === "other" ? reasonText : undefined,
                };
                if (reasonOpen === "archive") {
                  run(() => onArchive(reason), labels.toastArchived);
                } else if (reasonOpen === "softDelete") {
                  run(() => onSoftDelete(reason), labels.toastDeleted, {
                    undo: Boolean(onUndoSoftDelete),
                  });
                } else if (reasonOpen === "purge" && onPermanentDelete) {
                  run(
                    () => onPermanentDelete({ reason, confirmation: purgeConfirm }),
                    labels.toastDeleted,
                  );
                }
              }}
            >
              {labels.confirm}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {reasonOpen === "purge" ? (labels.permanentConfirm ?? labels.deleteConfirm) : labels.deleteConfirm}
          </p>
          <div className="space-y-1">
            <Label>{labels.reasonLabel}</Label>
            <Select
              className="min-h-11"
              value={reasonCode}
              onChange={(e) => setReasonCode(e.target.value as DeleteReasonCode)}
            >
              {DELETE_REASON_CODES.map((code) => (
                <option key={code} value={code}>
                  {labels.reasons[code]}
                </option>
              ))}
            </Select>
          </div>
          {reasonCode === "other" ? (
            <Input
              className="min-h-11"
              placeholder={labels.reasonOther}
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
            />
          ) : null}
          {reasonOpen === "purge" ? (
            <div className="space-y-1">
              <Label>{labels.typeDelete ?? "DELETE"}</Label>
              <Input
                className="min-h-11"
                value={purgeConfirm}
                onChange={(e) => setPurgeConfirm(e.target.value)}
                placeholder="DELETE"
              />
            </div>
          ) : null}
        </div>
      </Modal>

      {showUndo && onUndoSoftDelete ? (
        <GovernanceUndoToast
          message={labels.undoMessage}
          undoLabel={labels.undoAction}
          onUndo={async () => {
            const result = await onUndoSoftDelete();
            if (!result.success) {
              toast({ title: result.error ?? "Undo failed", variant: "error" });
              return;
            }
            toast({ title: labels.toastRestored, variant: "success" });
            setShowUndo(false);
            refresh();
          }}
          onDismiss={() => setShowUndo(false)}
        />
      ) : null}
    </>
  );
}

/** Build lifecycle labels from platform.governance + common strings. */
export function buildLifecycleLabels(input: EntityLifecycleLabels): EntityLifecycleLabels {
  return input;
}
