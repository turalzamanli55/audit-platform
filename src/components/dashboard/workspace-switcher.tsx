"use client";

import { useTenant } from "@/providers/tenant-provider";

type WorkspaceSwitcherProps = {
  label: string;
};

export function WorkspaceSwitcher({ label }: WorkspaceSwitcherProps) {
  const tenant = useTenant();
  const workspaces = Array.isArray(tenant.workspaces) ? tenant.workspaces : [];

  if (workspaces.length === 0) {
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
        value={tenant.currentWorkspaceId ?? ""}
        onChange={(event) => tenant.switchWorkspace(event.target.value)}
        disabled={tenant.isSwitching}
      >
        {workspaces.map((workspace) => (
          <option key={workspace.id} value={workspace.id}>
            {workspace.name}
          </option>
        ))}
      </select>
    </label>
  );
}
