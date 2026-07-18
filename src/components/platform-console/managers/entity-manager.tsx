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
import { TENANT_TYPE_OPTIONS } from "@/config/platform-options";
import type { TenantRow } from "@/lib/platform-console/data";
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
}: {
  entities: TenantRow[];
  mode: Mode;
  detailBasePath?: string;
}) {
  const { run, pendingId } = useActionRunner();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<TenantRow | null>(null);

  const label = mode === "tenant" ? "Tenant" : "Organization";

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          Create {label}
        </Button>
      </div>

      {entities.length === 0 ? (
        <EmptyState
          title={`No ${label.toLowerCase()}s yet`}
          description={`Create the first ${label.toLowerCase()} to begin provisioning.`}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Slug</th>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {entities.map((entity) => {
                const busy = pendingId?.startsWith(entity.id) ?? false;
                return (
                  <tr key={entity.id}>
                    <td className="px-4 py-2.5 font-medium">
                      {detailBasePath ? (
                        <Link href={`${detailBasePath}/companies/${entity.id}`} className="text-foreground hover:underline">
                          {entity.name}
                        </Link>
                      ) : (
                        entity.name
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{entity.slug}</td>
                    <td className="px-4 py-2.5 capitalize">{entity.tenantType}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={STATUS_VARIANT[entity.status] ?? "secondary"}>{entity.status}</Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <Button size="sm" variant="ghost" disabled={busy} onClick={() => setEditing(entity)}>
                          Edit
                        </Button>
                        {mode === "tenant" && entity.status !== "suspended" ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            loading={pendingId === `${entity.id}:suspend`}
                            disabled={busy}
                            onClick={() =>
                              run(`${entity.id}:suspend`, () => suspendTenantAction({ id: entity.id }), {
                                success: `${label} suspended`,
                              })
                            }
                          >
                            Suspend
                          </Button>
                        ) : null}
                        {entity.status === "suspended" || entity.status === "inactive" ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            loading={pendingId === `${entity.id}:activate`}
                            disabled={busy}
                            onClick={() =>
                              run(`${entity.id}:activate`, () => activateTenantAction({ id: entity.id }), {
                                success: `${label} activated`,
                              })
                            }
                          >
                            Activate
                          </Button>
                        ) : null}
                        {entity.status !== "archived" ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            loading={pendingId === `${entity.id}:archive`}
                            disabled={busy}
                            onClick={() =>
                              run(`${entity.id}:archive`, () => archiveTenantAction({ id: entity.id }), {
                                success: `${label} archived`,
                              })
                            }
                          >
                            Archive
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            loading={pendingId === `${entity.id}:restore`}
                            disabled={busy}
                            onClick={() =>
                              run(`${entity.id}:restore`, () => restoreTenantAction({ id: entity.id }), {
                                success: `${label} restored`,
                              })
                            }
                          >
                            Restore
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          loading={pendingId === `${entity.id}:delete`}
                          disabled={busy}
                          onClick={() => {
                            if (!window.confirm(`Delete ${entity.name}? This soft-deletes the ${label.toLowerCase()}.`)) return;
                            void run(`${entity.id}:delete`, () => deleteTenantAction({ id: entity.id }), {
                              success: `${label} deleted`,
                            });
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <CreateEntityModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        label={label}
        onSubmit={(values) =>
          run("create", () => createTenantAction(values), {
            success: `${label} created`,
            onSuccess: () => setCreateOpen(false),
          })
        }
        pending={pendingId === "create"}
      />

      {editing ? (
        <EditEntityModal
          entity={editing}
          label={label}
          onClose={() => setEditing(null)}
          onSubmit={(values) =>
            run("edit", () => updateTenantAction({ id: editing.id, ...values }), {
              success: `${label} updated`,
              onSuccess: () => setEditing(null),
            })
          }
          pending={pendingId === "edit"}
        />
      ) : null}
    </div>
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
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [tenantType, setTenantType] = useState("business");
  const [legalName, setLegalName] = useState("");

  return (
    <Modal
      open={open}
      onOpenChange={(next) => (next ? null : onClose())}
      title={`Create ${label}`}
      description="Provision a new tenant organization."
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" loading={pending} onClick={() => onSubmit({ name, slug, tenantType, legalName })}>
            Create
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="entity-name">Name</Label>
          <Input id="entity-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Audit LLP" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="entity-slug">Slug</Label>
          <Input id="entity-slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="acme-audit" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="entity-type">Tenant type</Label>
          <Select id="entity-type" value={tenantType} onChange={(e) => setTenantType(e.target.value)}>
            {TENANT_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="entity-legal">Legal name (optional)</Label>
          <Input id="entity-legal" value={legalName} onChange={(e) => setLegalName(e.target.value)} />
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
  const [name, setName] = useState(entity.name);
  const [tenantType, setTenantType] = useState(entity.tenantType);

  return (
    <Modal
      open
      onOpenChange={(next) => (next ? null : onClose())}
      title={`Edit ${label}`}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" loading={pending} onClick={() => onSubmit({ name, tenantType })}>
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="edit-name">Name</Label>
          <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="edit-type">Tenant type</Label>
          <Select id="edit-type" value={tenantType} onChange={(e) => setTenantType(e.target.value)}>
            {TENANT_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </Modal>
  );
}
