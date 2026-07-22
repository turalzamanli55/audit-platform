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
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { TENANT_TYPE_OPTIONS } from "@/config/platform-options";
import { usePlatformLabels } from "@/i18n/use-platform-labels";
import { fillPlatform } from "@/i18n/platform-labels";
import type { PlanRow, TenantRow } from "@/lib/platform-console/data";
import {
  createTenantAction,
  updateTenantAction,
  suspendTenantAction,
  activateTenantAction,
  archiveTenantAction,
  restoreTenantAction,
  deleteTenantAction,
} from "@/lib/platform-console/actions/organizations";
import { useActionRunner } from "./use-action-runner";
import { CreateCompanyWizard } from "./create-company-wizard";

type Mode = "tenant" | "organization";

const STATUS_VARIANT: Record<string, "success" | "warning" | "secondary" | "destructive"> = {
  active: "success",
  suspended: "warning",
  archived: "secondary",
  inactive: "secondary",
};

export function EntityManager({
  entities,
  mode,
  detailBasePath,
  plans = [],
}: {
  entities: TenantRow[];
  mode: Mode;
  detailBasePath?: string;
  /** Required for tenant create wizard (plan + seats steps). */
  plans?: PlanRow[];
}) {
  const t = usePlatformLabels();
  const { run, pendingId } = useActionRunner();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<TenantRow | null>(null);

  const label = mode === "tenant" ? t.common.tenant : t.common.organization;

  return (
    <div className="space-y-4">
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
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-border/60 md:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">{t.common.name}</th>
                  <th className="px-4 py-3">{t.common.type}</th>
                  <th className="px-4 py-3">{t.common.status}</th>
                  <th className="px-4 py-3 text-right">{t.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {entities.map((entity) => (
                  <tr key={entity.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3">
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
                        <p className="truncate text-xs text-muted-foreground">{entity.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">{entity.tenantType}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANT[entity.status] ?? "secondary"}>{entity.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <EntityActions
                        entity={entity}
                        mode={mode}
                        label={label}
                        busy={pendingId?.startsWith(entity.id) ?? false}
                        pendingId={pendingId}
                        run={run}
                        onEdit={() => setEditing(entity)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {entities.map((entity) => (
              <article
                key={entity.id}
                className="rounded-xl border border-border/60 bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
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
                    <p className="mt-0.5 text-xs text-muted-foreground">{entity.slug}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {entity.tenantType}
                      </Badge>
                      <Badge variant={STATUS_VARIANT[entity.status] ?? "secondary"}>{entity.status}</Badge>
                    </div>
                  </div>
                  <EntityActions
                    entity={entity}
                    mode={mode}
                    label={label}
                    busy={pendingId?.startsWith(entity.id) ?? false}
                    pendingId={pendingId}
                    run={run}
                    onEdit={() => setEditing(entity)}
                  />
                </div>
              </article>
            ))}
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

function EntityActions({
  entity,
  mode,
  label,
  busy,
  pendingId,
  run,
  onEdit,
}: {
  entity: TenantRow;
  mode: Mode;
  label: string;
  busy: boolean;
  pendingId: string | null;
  run: Runner;
  onEdit: () => void;
}) {
  const t = usePlatformLabels();

  return (
    <DropdownMenu
      align="end"
      trigger={
        <Button variant="outline" size="sm" className="min-h-11" disabled={busy}>
          {t.ux.moreActions}
        </Button>
      }
    >
      <DropdownMenuItem onSelect={onEdit}>{t.common.edit}</DropdownMenuItem>
      <DropdownMenuSeparator />
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
      {entity.status !== "archived" ? (
        <DropdownMenuItem
          disabled={busy}
          onSelect={() =>
            void run(`${entity.id}:archive`, () => archiveTenantAction({ id: entity.id }), {
              success: fillPlatform(t.entityManager.toastArchived, { label }),
            })
          }
        >
          {t.common.archive}
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem
          disabled={busy}
          onSelect={() =>
            void run(`${entity.id}:restore`, () => restoreTenantAction({ id: entity.id }), {
              success: fillPlatform(t.entityManager.toastRestored, { label }),
            })
          }
        >
          {t.common.restore}
        </DropdownMenuItem>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem
        destructive
        disabled={busy || pendingId === `${entity.id}:delete`}
        onSelect={() => {
          if (!window.confirm(fillPlatform(t.entityManager.deleteConfirm, { name: entity.name, label }))) return;
          void run(`${entity.id}:delete`, () => deleteTenantAction({ id: entity.id }), {
            success: fillPlatform(t.entityManager.toastDeleted, { label }),
          });
        }}
      >
        {t.common.delete}
      </DropdownMenuItem>
    </DropdownMenu>
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
