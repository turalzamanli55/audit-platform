"use client";

import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import type { RecycleBinItem } from "@/lib/object-lifecycle";
import type { DeleteReasonCode, LifecycleObjectType, RestoreMode } from "@/lib/object-lifecycle";
import { DELETE_REASON_CODES } from "@/lib/object-lifecycle/types";
import { retentionRemainingParts } from "@/lib/object-lifecycle/retention";

export type GovernanceLabels = {
  title: string;
  description: string;
  search: string;
  emptyTitle: string;
  emptyDescription: string;
  colObject: string;
  colType: string;
  colCompany: string;
  colDeletedAt: string;
  colDeletedBy: string;
  colReason: string;
  colRetention: string;
  colLegalHold: string;
  colActions: string;
  restore: string;
  restoreOnly: string;
  restoreChildren: string;
  restoreHierarchy: string;
  previewTitle: string;
  permanentDelete: string;
  export: string;
  legalHold: string;
  clearLegalHold: string;
  legalHoldOn: string;
  legalHoldOff: string;
  selected: string;
  bulkRestore: string;
  bulkExport: string;
  bulkPermanentDelete: string;
  retentionExpired: string;
  retentionRemaining: string;
  years: string;
  months: string;
  days: string;
  typeDelete: string;
  typeDeleteHint: string;
  finalConfirm: string;
  cancel: string;
  confirm: string;
  reasonLabel: string;
  reasonOther: string;
  objectsToRestore: string;
  dependencies: string;
  engagements: string;
  users: string;
  workspaces: string;
  companies: string;
  workingPapers: string;
  reports: string;
  documents: string;
  noPermanentDelete?: string;
  reasons: Record<DeleteReasonCode, string>;
  objectTypes: Partial<Record<LifecycleObjectType, string>>;
  toastRestored: string;
  toastDeleted: string;
  toastExported: string;
  toastHoldUpdated: string;
  allowBeforeRetention: string;
};

type Props = {
  items: RecycleBinItem[];
  labels: GovernanceLabels;
  locale: string;
  allowPermanentDelete: boolean;
  allowLegalHold: boolean;
  onRestore: (input: {
    objectType: LifecycleObjectType;
    objectId: string;
    organizationId: string | null;
    mode: RestoreMode;
  }) => Promise<void>;
  onBulkRestore?: (input: {
    items: Array<{ objectType: LifecycleObjectType; objectId: string; organizationId: string | null }>;
    mode: RestoreMode;
  }) => Promise<void>;
  onExport?: (input: {
    objectType: LifecycleObjectType;
    objectId: string;
    organizationId: string | null;
  }) => Promise<void>;
  onPermanentDelete?: (input: {
    objectType: LifecycleObjectType;
    objectId: string;
    organizationId: string | null;
    reasonCode: DeleteReasonCode;
    reasonText: string;
    confirmation: string;
    allowBeforeRetention: boolean;
  }) => Promise<void>;
  onBulkPermanentDelete?: (input: {
    items: Array<{ objectType: LifecycleObjectType; objectId: string; organizationId: string | null }>;
    reasonCode: DeleteReasonCode;
    reasonText: string;
    confirmation: string;
    allowBeforeRetention: boolean;
  }) => Promise<void>;
  onToggleLegalHold?: (input: {
    objectType: LifecycleObjectType;
    objectId: string;
    organizationId: string | null;
    enabled: boolean;
  }) => Promise<void>;
  loadPreview?: (input: {
    objectType: LifecycleObjectType;
    objectId: string;
    mode: RestoreMode;
  }) => Promise<{
    objectsToRestore: Array<{ objectType: string; id: string; name: string }>;
    dependencies: {
      engagements: number;
      users: number;
      workspaces: number;
      companies: number;
      workingPapers: number;
      reports: number;
      documents: number;
    };
  }>;
};

export function RecycleBinExperience({
  items,
  labels,
  allowPermanentDelete,
  allowLegalHold,
  onRestore,
  onBulkRestore,
  onExport,
  onPermanentDelete,
  onBulkPermanentDelete,
  onToggleLegalHold,
  loadPreview,
}: Props) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const [restoreTarget, setRestoreTarget] = useState<RecycleBinItem | null>(null);
  const [restoreMode, setRestoreMode] = useState<RestoreMode>("only");
  const [preview, setPreview] = useState<Awaited<ReturnType<NonNullable<Props["loadPreview"]>>> | null>(
    null,
  );
  const [purgeTarget, setPurgeTarget] = useState<RecycleBinItem | null>(null);
  const [purgeConfirm, setPurgeConfirm] = useState("");
  const [purgeReason, setPurgeReason] = useState<DeleteReasonCode>("compliance_request");
  const [purgeOther, setPurgeOther] = useState("");
  const [allowEarly, setAllowEarly] = useState(false);
  const [bulkPurge, setBulkPurge] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (typeFilter !== "all" && item.objectType !== typeFilter) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.objectType.toLowerCase().includes(q) ||
        (item.deleteReasonCode ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, query, typeFilter]);

  function keyOf(item: RecycleBinItem) {
    return `${item.objectType}:${item.id}`;
  }

  function toggle(item: RecycleBinItem) {
    const key = keyOf(item);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function selectedItems() {
    return filtered.filter((item) => selected.has(keyOf(item)));
  }

  function retentionLabel(item: RecycleBinItem) {
    const parts = retentionRemainingParts(item.retentionRemainingDays);
    if (parts.expired) return labels.retentionExpired;
    return labels.retentionRemaining
      .replace("{years}", String(parts.years))
      .replace("{months}", String(parts.months))
      .replace("{days}", String(parts.days));
  }

  async function openRestore(item: RecycleBinItem, mode: RestoreMode) {
    setRestoreTarget(item);
    setRestoreMode(mode);
    if (loadPreview) {
      const data = await loadPreview({
        objectType: item.objectType,
        objectId: item.id,
        mode,
      });
      setPreview(data);
    } else {
      setPreview(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">{labels.title}</h2>
          <p className="text-sm text-muted-foreground">{labels.description}</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Input
            className="min-h-11 sm:w-56"
            placeholder={labels.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Select
            className="min-h-11 sm:w-44"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">{labels.colType}</option>
            {Object.keys(labels.objectTypes).map((type) => (
              <option key={type} value={type}>
                {labels.objectTypes[type as LifecycleObjectType]}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {selected.size > 0 ? (
        <div className="flex flex-wrap gap-2 rounded-xl border border-border/60 bg-muted/30 p-3">
          <span className="text-sm text-muted-foreground">
            {labels.selected.replace("{count}", String(selected.size))}
          </span>
          <Button
            size="sm"
            className="min-h-11"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await onBulkRestore?.({
                  items: selectedItems().map((i) => ({
                    objectType: i.objectType,
                    objectId: i.id,
                    organizationId: i.organizationId,
                  })),
                  mode: "only",
                });
                setSelected(new Set());
              })
            }
          >
            {labels.bulkRestore}
          </Button>
          {allowPermanentDelete ? (
            <Button
              size="sm"
              variant="destructive"
              className="min-h-11"
              onClick={() => setBulkPurge(true)}
            >
              {labels.bulkPermanentDelete}
            </Button>
          ) : null}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState title={labels.emptyTitle} description={labels.emptyDescription} />
      ) : (
        <>
          <div className="space-y-3 lg:hidden">
            {filtered.map((item) => (
              <article key={keyOf(item)} className="rounded-xl border border-border/60 p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4"
                    checked={selected.has(keyOf(item))}
                    onChange={() => toggle(item)}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {labels.objectTypes[item.objectType] ?? item.objectType}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(item.deletedAt).toLocaleString()} · {retentionLabel(item)}
                    </p>
                    {item.legalHoldEnabled ? (
                      <Badge variant="warning" className="mt-2">
                        {labels.legalHoldOn}
                      </Badge>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Button
                        size="sm"
                        className="min-h-11"
                        disabled={pending}
                        onClick={() => void openRestore(item, "only")}
                      >
                        {labels.restore}
                      </Button>
                      {allowPermanentDelete ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="min-h-11"
                          disabled={item.legalHoldEnabled}
                          onClick={() => setPurgeTarget(item)}
                        >
                          {labels.permanentDelete}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-xl border border-border/60 lg:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-3" />
                  <th className="px-3 py-3">{labels.colObject}</th>
                  <th className="px-3 py-3">{labels.colType}</th>
                  <th className="px-3 py-3">{labels.colDeletedAt}</th>
                  <th className="px-3 py-3">{labels.colReason}</th>
                  <th className="px-3 py-3">{labels.colRetention}</th>
                  <th className="px-3 py-3">{labels.colLegalHold}</th>
                  <th className="px-3 py-3 text-right">{labels.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((item) => (
                  <tr key={keyOf(item)} className="hover:bg-muted/20">
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={selected.has(keyOf(item))}
                        onChange={() => toggle(item)}
                      />
                    </td>
                    <td className="px-3 py-3 font-medium">{item.name}</td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {labels.objectTypes[item.objectType] ?? item.objectType}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {new Date(item.deletedAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {item.deleteReasonCode
                        ? labels.reasons[item.deleteReasonCode as DeleteReasonCode] ??
                          item.deleteReasonCode
                        : "—"}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{retentionLabel(item)}</td>
                    <td className="px-3 py-3">
                      <Badge variant={item.legalHoldEnabled ? "warning" : "secondary"}>
                        {item.legalHoldEnabled ? labels.legalHoldOn : labels.legalHoldOff}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={pending}
                          onClick={() => void openRestore(item, "only")}
                        >
                          {labels.restore}
                        </Button>
                        {onExport ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={pending}
                            onClick={() =>
                              startTransition(async () => {
                                await onExport({
                                  objectType: item.objectType,
                                  objectId: item.id,
                                  organizationId: item.organizationId,
                                });
                              })
                            }
                          >
                            {labels.export}
                          </Button>
                        ) : null}
                        {allowLegalHold && onToggleLegalHold ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={pending || !item.organizationId}
                            onClick={() =>
                              startTransition(async () => {
                                await onToggleLegalHold({
                                  objectType: item.objectType,
                                  objectId: item.id,
                                  organizationId: item.organizationId,
                                  enabled: !item.legalHoldEnabled,
                                });
                              })
                            }
                          >
                            {item.legalHoldEnabled ? labels.clearLegalHold : labels.legalHold}
                          </Button>
                        ) : null}
                        {allowPermanentDelete ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={item.legalHoldEnabled}
                            onClick={() => setPurgeTarget(item)}
                          >
                            {labels.permanentDelete}
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Modal
        open={restoreTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRestoreTarget(null);
            setPreview(null);
          }
        }}
        title={labels.previewTitle}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setRestoreTarget(null)}>
              {labels.cancel}
            </Button>
            <Button
              size="sm"
              loading={pending}
              onClick={() => {
                if (!restoreTarget) return;
                startTransition(async () => {
                  await onRestore({
                    objectType: restoreTarget.objectType,
                    objectId: restoreTarget.id,
                    organizationId: restoreTarget.organizationId,
                    mode: restoreMode,
                  });
                  setRestoreTarget(null);
                  setPreview(null);
                });
              }}
            >
              {labels.confirm}
            </Button>
          </>
        }
      >
        {restoreTarget ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>{labels.restore}</Label>
              <Select
                className="min-h-11"
                value={restoreMode}
                onChange={(e) => {
                  const mode = e.target.value as RestoreMode;
                  setRestoreMode(mode);
                  void openRestore(restoreTarget, mode);
                }}
              >
                <option value="only">{labels.restoreOnly}</option>
                <option value="with_children">{labels.restoreChildren}</option>
                <option value="hierarchy">{labels.restoreHierarchy}</option>
              </Select>
            </div>
            {preview ? (
              <div className="space-y-2 rounded-xl bg-muted/40 p-3 text-sm">
                <p className="font-medium">{labels.objectsToRestore}</p>
                <ul className="list-inside list-disc text-muted-foreground">
                  {preview.objectsToRestore.slice(0, 20).map((obj) => (
                    <li key={`${obj.objectType}:${obj.id}`}>
                      {obj.name} ({obj.objectType})
                    </li>
                  ))}
                </ul>
                <p className="pt-2 font-medium">{labels.dependencies}</p>
                <dl className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    {labels.engagements}: {preview.dependencies.engagements}
                  </div>
                  <div>
                    {labels.users}: {preview.dependencies.users}
                  </div>
                  <div>
                    {labels.workspaces}: {preview.dependencies.workspaces}
                  </div>
                  <div>
                    {labels.companies}: {preview.dependencies.companies}
                  </div>
                  <div>
                    {labels.workingPapers}: {preview.dependencies.workingPapers}
                  </div>
                  <div>
                    {labels.reports}: {preview.dependencies.reports}
                  </div>
                </dl>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>

      <Modal
        open={purgeTarget !== null || bulkPurge}
        onOpenChange={(open) => {
          if (!open) {
            setPurgeTarget(null);
            setBulkPurge(false);
            setPurgeConfirm("");
          }
        }}
        title={labels.permanentDelete}
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPurgeTarget(null);
                setBulkPurge(false);
              }}
            >
              {labels.cancel}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              loading={pending}
              disabled={purgeConfirm !== "DELETE"}
              onClick={() => {
                startTransition(async () => {
                  if (bulkPurge) {
                    await onBulkPermanentDelete?.({
                      items: selectedItems().map((i) => ({
                        objectType: i.objectType,
                        objectId: i.id,
                        organizationId: i.organizationId,
                      })),
                      reasonCode: purgeReason,
                      reasonText: purgeOther,
                      confirmation: purgeConfirm,
                      allowBeforeRetention: allowEarly,
                    });
                    setSelected(new Set());
                  } else if (purgeTarget) {
                    await onPermanentDelete?.({
                      objectType: purgeTarget.objectType,
                      objectId: purgeTarget.id,
                      organizationId: purgeTarget.organizationId,
                      reasonCode: purgeReason,
                      reasonText: purgeOther,
                      confirmation: purgeConfirm,
                      allowBeforeRetention: allowEarly,
                    });
                  }
                  setPurgeTarget(null);
                  setBulkPurge(false);
                  setPurgeConfirm("");
                });
              }}
            >
              {labels.finalConfirm}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>{labels.reasonLabel}</Label>
            <Select
              className="min-h-11"
              value={purgeReason}
              onChange={(e) => setPurgeReason(e.target.value as DeleteReasonCode)}
            >
              {DELETE_REASON_CODES.map((code) => (
                <option key={code} value={code}>
                  {labels.reasons[code]}
                </option>
              ))}
            </Select>
          </div>
          {purgeReason === "other" ? (
            <Input
              className="min-h-11"
              placeholder={labels.reasonOther}
              value={purgeOther}
              onChange={(e) => setPurgeOther(e.target.value)}
            />
          ) : null}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={allowEarly}
              onChange={(e) => setAllowEarly(e.target.checked)}
            />
            {labels.allowBeforeRetention}
          </label>
          <div className="space-y-1">
            <Label>{labels.typeDelete}</Label>
            <p className="text-xs text-muted-foreground">{labels.typeDeleteHint}</p>
            <Input
              className="min-h-11"
              value={purgeConfirm}
              onChange={(e) => setPurgeConfirm(e.target.value)}
              placeholder="DELETE"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
