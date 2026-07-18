"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { FeatureFlagRow, OrganizationOption } from "@/lib/platform-console/data";
import {
  createFeatureFlagAction,
  updateFeatureFlagAction,
  enableFeatureFlagAction,
  disableFeatureFlagAction,
  deleteFeatureFlagAction,
} from "@/lib/platform-console/actions/feature-flags";
import { useActionRunner } from "./use-action-runner";

const FLAG_STATES = ["enabled", "disabled", "preview", "experimental", "deprecated"] as const;

function stateVariant(state: string): "success" | "warning" | "destructive" | "secondary" {
  if (state === "enabled") return "success";
  if (state === "preview" || state === "experimental") return "warning";
  if (state === "deprecated") return "destructive";
  return "secondary";
}

export function FeatureFlagManager({
  flags,
  organizations,
}: {
  flags: FeatureFlagRow[];
  organizations: OrganizationOption[];
}) {
  const { run, pendingId } = useActionRunner();
  const [createOpen, setCreateOpen] = useState(false);
  const orgName = (id: string | null) => (id ? organizations.find((o) => o.id === id)?.name ?? id : null);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          Create flag
        </Button>
      </div>

      {flags.length === 0 ? (
        <EmptyState title="No feature flags" description="Create a platform or tenant feature flag." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5">Flag</th>
                <th className="px-4 py-2.5">Scope</th>
                <th className="px-4 py-2.5">State</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {flags.map((flag) => {
                const busy = pendingId?.startsWith(flag.id) ?? false;
                return (
                  <tr key={flag.id}>
                    <td className="px-4 py-2.5 font-medium">{flag.flagCode}</td>
                    <td className="px-4 py-2.5 capitalize text-muted-foreground">
                      {flag.scope}
                      {flag.scope === "tenant" && orgName(flag.organizationId)
                        ? ` · ${orgName(flag.organizationId)}`
                        : ""}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge variant={stateVariant(flag.flagState)}>{flag.flagState}</Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        {flag.flagState === "enabled" ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            loading={pendingId === `${flag.id}:disable`}
                            disabled={busy}
                            onClick={() =>
                              run(`${flag.id}:disable`, () => disableFeatureFlagAction({ id: flag.id }), {
                                success: "Flag disabled",
                              })
                            }
                          >
                            Disable
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            loading={pendingId === `${flag.id}:enable`}
                            disabled={busy}
                            onClick={() =>
                              run(`${flag.id}:enable`, () => enableFeatureFlagAction({ id: flag.id }), {
                                success: "Flag enabled",
                              })
                            }
                          >
                            Enable
                          </Button>
                        )}
                        <Select
                          aria-label="Set flag state"
                          className="h-8 w-36"
                          value={flag.flagState}
                          disabled={busy}
                          onChange={(e) =>
                            run(`${flag.id}:state`, () => updateFeatureFlagAction({ id: flag.id, flagState: e.target.value }), {
                              success: "Flag state updated",
                            })
                          }
                        >
                          {FLAG_STATES.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </Select>
                        <Button
                          size="sm"
                          variant="destructive"
                          loading={pendingId === `${flag.id}:delete`}
                          disabled={busy}
                          onClick={() => {
                            if (!window.confirm(`Delete flag ${flag.flagCode}?`)) return;
                            void run(`${flag.id}:delete`, () => deleteFeatureFlagAction({ id: flag.id }), {
                              success: "Flag deleted",
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

      <CreateFlagModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        organizations={organizations}
        pending={pendingId === "create-flag"}
        onSubmit={(values) =>
          run("create-flag", () => createFeatureFlagAction(values), {
            success: "Feature flag created",
            onSuccess: () => setCreateOpen(false),
          })
        }
      />
    </div>
  );
}

function CreateFlagModal({
  open,
  onClose,
  organizations,
  onSubmit,
  pending,
}: {
  open: boolean;
  onClose: () => void;
  organizations: OrganizationOption[];
  onSubmit: (values: { flagCode: string; flagState: string; organizationId: string | null }) => void;
  pending: boolean;
}) {
  const [flagCode, setFlagCode] = useState("");
  const [flagState, setFlagState] = useState<string>("enabled");
  const [scope, setScope] = useState<"platform" | "tenant">("platform");
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id ?? "");

  return (
    <Modal
      open={open}
      onOpenChange={(next) => (next ? null : onClose())}
      title="Create feature flag"
      description="Platform-scoped flags apply everywhere; tenant-scoped flags override a single company."
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            loading={pending}
            onClick={() =>
              onSubmit({
                flagCode,
                flagState,
                organizationId: scope === "tenant" ? organizationId || null : null,
              })
            }
          >
            Create
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="flag-code">Flag code</Label>
          <Input id="flag-code" value={flagCode} onChange={(e) => setFlagCode(e.target.value)} placeholder="new_dashboard" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="flag-state">State</Label>
          <Select id="flag-state" value={flagState} onChange={(e) => setFlagState(e.target.value)}>
            {FLAG_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="flag-scope">Scope</Label>
          <Select id="flag-scope" value={scope} onChange={(e) => setScope(e.target.value as "platform" | "tenant")}>
            <option value="platform">Platform (all tenants)</option>
            <option value="tenant">Tenant</option>
          </Select>
        </div>
        {scope === "tenant" ? (
          <div className="space-y-1">
            <Label htmlFor="flag-org">Tenant</Label>
            <Select id="flag-org" value={organizationId} onChange={(e) => setOrganizationId(e.target.value)}>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </Select>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
