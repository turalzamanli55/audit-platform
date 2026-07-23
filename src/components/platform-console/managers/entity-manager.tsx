"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TENANT_TYPE_OPTIONS } from "@/config/platform-options";
import { usePlatformLabels } from "@/i18n/use-platform-labels";
import { fillPlatform } from "@/i18n/platform-labels";
import type { PlanRow, TenantRow } from "@/lib/platform-console/data";
import {
  createTenantAction,
  updateTenantAction,
  suspendTenantAction,
  activateTenantAction,
} from "@/lib/platform-console/actions/organizations";
import { useActionRunner } from "./use-action-runner";
import { CreateCompanyWizard } from "./create-company-wizard";
import { GovernanceUndoToast } from "@/components/governance/undo-toast";
import { BoundEntityLifecycleMenu } from "@/components/governance/bound-entity-lifecycle-menu";
import { restoreGovernedAction } from "@/lib/platform-console/actions/governance";
import { useLanguage } from "@/providers";

type Mode = "tenant" | "organization";

const STATUS_VARIANT: Record<string, "success" | "warning" | "secondary" | "destructive"> = {
  active: "success",
  suspended: "warning",
  archived: "secondary",
  inactive: "secondary",
  expired: "destructive",
};

function warningText(
  key: string | null,
  daysRemaining: number | null,
  t: ReturnType<typeof usePlatformLabels>,
): string | null {
  if (!key) return null;
  const map = t.entityManager.warnings as Record<string, string>;
  const template = map?.[key];
  if (!template) return null;
  return fillPlatform(template, { days: Math.abs(daysRemaining ?? 0) });
}

export function EntityManager({
  entities,
  mode,
  detailBasePath,
  plans = [],
  objectType = "organization",
}: {
  entities: TenantRow[];
  mode: Mode;
  detailBasePath?: string;
  /** Required for tenant create wizard (plan + seats steps). */
  plans?: PlanRow[];
  /**
   * Registered lifecycle object type. EntityManager never hardcodes domain
   * lifecycle buttons — BoundEntityLifecycleMenu asks the registry.
   */
  objectType?: "organization";
}) {
  const t = usePlatformLabels();
  const { run, pendingId } = useActionRunner();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<TenantRow | null>(null);
  const [undo, setUndo] = useState<{ id: string; organizationId: string } | null>(null);

  const label = mode === "tenant" ? t.common.tenant : t.common.organization;

  return (
    <div className="space-y-4">
      {undo ? (
        <GovernanceUndoToast
          message={t.governance.undoMessage}
          undoLabel={t.governance.undoAction}
          onUndo={async () => {
            await restoreGovernedAction({
              objectType: "organization",
              objectId: undo.id,
              organizationId: undo.organizationId,
              mode: "only",
            });
            setUndo(null);
          }}
          onDismiss={() => setUndo(null)}
        />
      ) : null}
      <div className="flex justify-end">
        <Button size="sm" className="min-h-11" onClick={() => setCreateOpen(true)}>
          {fillPlatform(t.entityManager.create, { label })}
        </Button>
      </div>

      {entities.length === 0 ? (
        <EmptyState
          title={fillPlatform(t.entityManager.emptyTitle, { label })}
          description={fillPlatform(t.entityManager.emptyDescription, { label })}
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-border/60 lg:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-3">{t.common.name}</th>
                  <th className="px-3 py-3">{t.common.plan}</th>
                  <th className="px-3 py-3">{t.common.expiration}</th>
                  <th className="px-3 py-3">{t.common.seats}</th>
                  <th className="px-3 py-3">{t.entityManager.colAdmin}</th>
                  <th className="px-3 py-3">{t.entityManager.colHealth}</th>
                  <th className="px-3 py-3">{t.common.status}</th>
                  <th className="px-3 py-3 text-right">{t.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {entities.map((entity) => {
                  const warn = warningText(entity.warningKey, entity.daysRemaining, t);
                  return (
                  <tr key={entity.id} className="hover:bg-muted/20">
                    <td className="px-3 py-3">
                      <div className="min-w-0">
                        {detailBasePath ? (
                          <Link
                            href={`${detailBasePath}/companies/${entity.id}`}
                            className="font-medium text-foreground hover:underline"
                          >
                            {entity.name}
                          </Link>
                        ) : (
                          <span className="font-medium">{entity.name}</span>
                        )}
                        <p className="truncate text-xs capitalize text-muted-foreground">{entity.tenantType}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3">{entity.planName ?? t.common.none}</td>
                    <td className="px-3 py-3">
                      <div className="text-sm">
                        {entity.endsAt ? new Date(entity.endsAt).toLocaleDateString() : t.common.perpetual}
                      </div>
                      {entity.daysRemaining !== null ? (
                        <p className="text-xs text-muted-foreground">
                          {fillPlatform(t.entityManager.daysRemaining, { days: entity.daysRemaining })}
                        </p>
                      ) : null}
                      {warn ? <p className="text-xs text-amber-700 dark:text-amber-300">{warn}</p> : null}
                    </td>
                    <td className="px-3 py-3 tabular-nums">
                      {entity.seatsUsed}/{entity.seatLimit || "—"}
                      <p className="text-xs text-muted-foreground">
                        {fillPlatform(t.entityManager.seatsAvailable, { count: entity.seatsAvailable })}
                      </p>
                    </td>
                    <td className="max-w-[10rem] truncate px-3 py-3 text-xs">
                      {entity.administratorName || entity.administratorEmail || t.common.none}
                    </td>
                    <td className="px-3 py-3">
                      <Badge
                        variant={
                          entity.health === "healthy"
                            ? "success"
                            : entity.health === "attention"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {t.entityManager.health[entity.health]}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <Badge variant={STATUS_VARIANT[entity.displayStatus] ?? "secondary"}>
                        {t.entityManager.status[entity.displayStatus] ?? entity.displayStatus}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <EntityActions
                        entity={entity}
                        mode={mode}
                        label={label}
                        objectType={objectType}
                        busy={pendingId?.startsWith(entity.id) ?? false}
                        pendingId={pendingId}
                        run={run}
                        detailBasePath={detailBasePath}
                        onEdit={() => setEditing(entity)}
                        onSoftDeleted={(row) => setUndo({ id: row.id, organizationId: row.id })}
                      />
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Tablet/mobile cards */}
          <div className="space-y-3 lg:hidden">
            {entities.map((entity) => {
              const warn = warningText(entity.warningKey, entity.daysRemaining, t);
              return (
              <article
                key={entity.id}
                className="rounded-xl border border-border/60 bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-2">
                    {detailBasePath ? (
                      <Link
                        href={`${detailBasePath}/companies/${entity.id}`}
                        className="text-base font-medium text-foreground hover:underline"
                      >
                        {entity.name}
                      </Link>
                    ) : (
                      <p className="text-base font-medium">{entity.name}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={STATUS_VARIANT[entity.displayStatus] ?? "secondary"}>
                        {t.entityManager.status[entity.displayStatus] ?? entity.displayStatus}
                      </Badge>
                      <Badge
                        variant={
                          entity.health === "healthy"
                            ? "success"
                            : entity.health === "attention"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {t.entityManager.health[entity.health]}
                      </Badge>
                    </div>
                    <dl className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>
                        <dt>{t.common.plan}</dt>
                        <dd className="font-medium text-foreground">{entity.planName ?? t.common.none}</dd>
                      </div>
                      <div>
                        <dt>{t.common.seats}</dt>
                        <dd className="font-medium text-foreground">
                          {entity.seatsUsed}/{entity.seatLimit || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt>{t.common.expiration}</dt>
                        <dd className="font-medium text-foreground">
                          {entity.endsAt ? new Date(entity.endsAt).toLocaleDateString() : t.common.perpetual}
                        </dd>
                      </div>
                      <div>
                        <dt>{t.entityManager.colAdmin}</dt>
                        <dd className="truncate font-medium text-foreground">
                          {entity.administratorEmail ?? t.common.none}
                        </dd>
                      </div>
                    </dl>
                    {warn ? <p className="text-xs text-amber-700 dark:text-amber-300">{warn}</p> : null}
                  </div>
                  <EntityActions
                    entity={entity}
                    mode={mode}
                    label={label}
                    objectType={objectType}
                    busy={pendingId?.startsWith(entity.id) ?? false}
                    pendingId={pendingId}
                    run={run}
                    detailBasePath={detailBasePath}
                    onEdit={() => setEditing(entity)}
                    onSoftDeleted={(row) => setUndo({ id: row.id, organizationId: row.id })}
                  />
                </div>
              </article>
              );
            })}
          </div>
        </>
      )}

      {mode === "tenant" ? (
        <CreateCompanyWizard open={createOpen} onClose={() => setCreateOpen(false)} plans={plans} />
      ) : (
        <CreateEntityModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          label={label}
          onSubmit={(values) =>
            run("create", () => createTenantAction(values), {
              success: fillPlatform(t.entityManager.toastCreated, { label }),
              onSuccess: () => setCreateOpen(false),
            })
          }
          pending={pendingId === "create"}
        />
      )}

      {editing ? (
        <EditEntityModal
          entity={editing}
          label={label}
          onClose={() => setEditing(null)}
          onSubmit={(values) =>
            run("edit", () => updateTenantAction({ id: editing.id, ...values }), {
              success: fillPlatform(t.entityManager.toastUpdated, { label }),
              onSuccess: () => setEditing(null),
            })
          }
          pending={pendingId === "edit"}
        />
      ) : null}
    </div>
  );
}

type Runner = ReturnType<typeof useActionRunner>["run"];

/**
 * Lifecycle chrome for a registered object. Domain extras (suspend/activate)
 * are tenant-license controls — not lifecycle registry actions.
 */
function EntityActions({
  entity,
  mode,
  label,
  objectType,
  busy,
  run,
  onEdit,
  onSoftDeleted,
  detailBasePath,
}: {
  entity: TenantRow;
  mode: Mode;
  label: string;
  objectType: "organization";
  busy: boolean;
  pendingId: string | null;
  run: Runner;
  onEdit: () => void;
  onSoftDeleted?: (entity: TenantRow) => void;
  detailBasePath?: string;
}) {
  const t = usePlatformLabels();
  const { locale } = useLanguage();
  const historyHref = detailBasePath
    ? `${detailBasePath}/companies/${entity.id}`
    : `/${locale}/app/platform/companies/${entity.id}`;
  const isArchived = entity.status === "archived" || entity.displayStatus === "archived";

  return (
    <BoundEntityLifecycleMenu
      objectType={objectType}
      actor="platform_owner"
      target={{
        id: entity.id,
        organizationId: entity.id,
        slug: entity.slug,
        name: entity.name,
      }}
      state={{ isArchived, isSoftDeleted: false, status: entity.status }}
      hrefs={{ history: historyHref }}
      onEdit={onEdit}
      enableUndoToast={false}
      onSoftDeleted={() => onSoftDeleted?.(entity)}
      labelOverrides={{
        deleteConfirm: fillPlatform(t.entityManager.deleteConfirm, { name: entity.name, label }),
        toastArchived: fillPlatform(t.entityManager.toastArchived, { label }),
        toastRestored: fillPlatform(t.entityManager.toastRestored, { label }),
        toastDeleted: fillPlatform(t.entityManager.toastDeleted, { label }),
      }}
      trigger={
        <Button variant="outline" size="sm" className="min-h-11" disabled={busy}>
          {t.ux.moreActions}
        </Button>
      }
      leadingExtraItems={
        <>
          {mode === "tenant" && entity.status !== "suspended" ? (
            <DropdownMenuItem
              disabled={busy}
              onSelect={() =>
                void run(`${entity.id}:suspend`, () => suspendTenantAction({ id: entity.id }), {
                  success: fillPlatform(t.entityManager.toastSuspended, { label }),
                })
              }
            >
              {t.common.suspend}
            </DropdownMenuItem>
          ) : null}
          {entity.status === "suspended" || entity.status === "inactive" ? (
            <DropdownMenuItem
              disabled={busy}
              onSelect={() =>
                void run(`${entity.id}:activate`, () => activateTenantAction({ id: entity.id }), {
                  success: fillPlatform(t.entityManager.toastActivated, { label }),
                })
              }
            >
              {t.common.activate}
            </DropdownMenuItem>
          ) : null}
        </>
      }
    />
  );
}

function CreateEntityModal({
  open,
  onClose,
  label,
  onSubmit,
  pending,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  onSubmit: (values: { name: string; slug: string; tenantType: string; legalName?: string }) => void;
  pending: boolean;
}) {
  const t = usePlatformLabels();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [tenantType, setTenantType] = useState("business");
  const [legalName, setLegalName] = useState("");

  return (
    <Modal
      open={open}
      onOpenChange={(next) => (next ? null : onClose())}
      title={fillPlatform(t.entityManager.createTitle, { label })}
      description={t.entityManager.createDescription}
      footer={
        <>
          <Button variant="outline" size="sm" className="min-h-11" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button
            size="sm"
            className="min-h-11"
            loading={pending}
            onClick={() => onSubmit({ name, slug, tenantType, legalName })}
          >
            {t.common.create}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="entity-name">{t.entityManager.nameLabel}</Label>
          <Input
            id="entity-name"
            className="min-h-11"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.entityManager.namePlaceholder}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="entity-slug">{t.entityManager.slugLabel}</Label>
          <Input
            id="entity-slug"
            className="min-h-11"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={t.entityManager.slugPlaceholder}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="entity-type">{t.entityManager.tenantTypeLabel}</Label>
          <Select id="entity-type" className="min-h-11" value={tenantType} onChange={(e) => setTenantType(e.target.value)}>
            {TENANT_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t.options.tenantType[option.value]}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="entity-legal">{t.entityManager.legalNameLabel}</Label>
          <Input id="entity-legal" className="min-h-11" value={legalName} onChange={(e) => setLegalName(e.target.value)} />
        </div>
      </div>
    </Modal>
  );
}

function EditEntityModal({
  entity,
  label,
  onClose,
  onSubmit,
  pending,
}: {
  entity: TenantRow;
  label: string;
  onClose: () => void;
  onSubmit: (values: { name?: string; tenantType?: string }) => void;
  pending: boolean;
}) {
  const t = usePlatformLabels();
  const [name, setName] = useState(entity.name);
  const [tenantType, setTenantType] = useState(entity.tenantType);

  return (
    <Modal
      open
      onOpenChange={(next) => (next ? null : onClose())}
      title={fillPlatform(t.entityManager.editTitle, { label })}
      footer={
        <>
          <Button variant="outline" size="sm" className="min-h-11" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button size="sm" className="min-h-11" loading={pending} onClick={() => onSubmit({ name, tenantType })}>
            {t.common.save}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="edit-name">{t.entityManager.nameLabel}</Label>
          <Input id="edit-name" className="min-h-11" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="edit-type">{t.entityManager.tenantTypeLabel}</Label>
          <Select id="edit-type" className="min-h-11" value={tenantType} onChange={(e) => setTenantType(e.target.value)}>
            {TENANT_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t.options.tenantType[option.value]}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </Modal>
  );
}
