"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { MODULE_OPTIONS } from "@/config/platform-options";
import type { FeatureFlagRow, OrganizationOption } from "@/lib/platform-console/data";
import { setModuleAccessAction } from "@/lib/platform-console/actions/modules";
import { useActionRunner } from "./use-action-runner";

export function ModuleManager({
  organizations,
  moduleFlags,
}: {
  organizations: OrganizationOption[];
  moduleFlags: FeatureFlagRow[];
}) {
  const { run, pendingId } = useActionRunner();
  const [scope, setScope] = useState<"platform" | "tenant">("platform");
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id ?? "");
  const [moduleCode, setModuleCode] = useState<string>(MODULE_OPTIONS[0].value);

  function submit(enabled: boolean) {
    void run(
      "set-module",
      () =>
        setModuleAccessAction({
          moduleCode,
          enabled,
          organizationId: scope === "tenant" ? organizationId : null,
        }),
      { success: `Module ${enabled ? "enabled" : "disabled"}` },
    );
  }

  const busy = pendingId === "set-module";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/60 p-4">
        <h3 className="mb-3 text-sm font-semibold">Set module access</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="mod-scope">Scope</Label>
            <Select id="mod-scope" value={scope} onChange={(e) => setScope(e.target.value as "platform" | "tenant")}>
              <option value="platform">Platform (all tenants)</option>
              <option value="tenant">Tenant</option>
            </Select>
          </div>
          {scope === "tenant" ? (
            <div className="space-y-1">
              <Label htmlFor="mod-org">Tenant</Label>
              <Select id="mod-org" value={organizationId} onChange={(e) => setOrganizationId(e.target.value)}>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </Select>
            </div>
          ) : null}
          <div className="space-y-1">
            <Label htmlFor="mod-code">Module</Label>
            <Select id="mod-code" value={moduleCode} onChange={(e) => setModuleCode(e.target.value)}>
              {MODULE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Button size="sm" loading={busy} disabled={scope === "tenant" && !organizationId} onClick={() => submit(true)}>
            Enable
          </Button>
          <Button size="sm" variant="outline" loading={busy} disabled={scope === "tenant" && !organizationId} onClick={() => submit(false)}>
            Disable
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Per-workspace and per-user overrides are supported by the action but not yet exposed in this form.
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold">Current module flags</h3>
        {moduleFlags.length === 0 ? (
          <EmptyState title="No module overrides" description="Modules default to their plan entitlement." />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border/60">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5">Module</th>
                  <th className="px-4 py-2.5">Scope</th>
                  <th className="px-4 py-2.5">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {moduleFlags.map((flag) => (
                  <tr key={`${flag.flagCode}-${flag.scope}`}>
                    <td className="px-4 py-2.5 font-medium">{flag.flagCode.replace("module:", "")}</td>
                    <td className="px-4 py-2.5 capitalize text-muted-foreground">{flag.scope}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={flag.flagState === "enabled" ? "success" : "secondary"}>{flag.flagState}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
