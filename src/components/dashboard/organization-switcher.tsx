"use client";

import { useTenant } from "@/providers/tenant-provider";

type OrganizationSwitcherProps = {
  label: string;
};

export function OrganizationSwitcher({ label }: OrganizationSwitcherProps) {
  const tenant = useTenant();
  const organizations = Array.isArray(tenant.organizations) ? tenant.organizations : [];

  if (organizations.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        {label}: —
      </div>
    );
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <select
        className="h-9 rounded-lg border border-input bg-card px-2 text-sm"
        value={tenant.currentOrganizationId ?? ""}
        onChange={(event) => tenant.switchOrganization(event.target.value)}
        disabled={tenant.isSwitching}
      >
        {organizations.map((organization) => (
          <option key={organization.id} value={organization.id}>
            {organization.name}
          </option>
        ))}
      </select>
    </label>
  );
}
