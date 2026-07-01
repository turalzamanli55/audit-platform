"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { IconCheck, IconChevronDown, IconLayoutDashboard } from "@/components/ui/icons";
import { useTenant } from "@/providers/tenant-provider";

type WorkspaceSwitcherProps = {
  label: string;
};

function WorkspaceDisplay({ label, name }: { label: string; name: string }) {
  return (
    <div
      className="flex h-10 items-center gap-2 px-2.5 text-sm"
      aria-label={`${label}: ${name}`}
      title={`${label}: ${name}`}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <IconLayoutDashboard width={16} height={16} />
      </span>
      <span className="hidden max-w-[8rem] truncate font-medium text-foreground sm:inline">{name}</span>
    </div>
  );
}

export function WorkspaceSwitcher({ label }: WorkspaceSwitcherProps) {
  const tenant = useTenant();
  const workspaces = Array.isArray(tenant.workspaces) ? tenant.workspaces : [];
  const current = workspaces.find((w) => w.id === tenant.currentWorkspaceId);

  if (workspaces.length === 0) {
    return <span className="px-2.5 text-sm text-muted-foreground">{label}: —</span>;
  }

  if (workspaces.length === 1) {
    return (
      <WorkspaceDisplay label={label} name={current?.name ?? workspaces[0]?.name ?? "—"} />
    );
  }

  return (
    <DropdownMenu
      trigger={
        <Button
          variant="ghost"
          loading={tenant.isSwitching}
          className="group h-10 gap-2 px-2.5 font-normal"
          aria-label={`${label}: ${current?.name ?? "—"}`}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconLayoutDashboard width={16} height={16} />
          </span>
          <span className="hidden max-w-[8rem] truncate font-medium sm:inline">{current?.name ?? "—"}</span>
          <IconChevronDown className="text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      }
    >
      <DropdownMenuLabel>{label}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {workspaces.map((workspace) => (
        <DropdownMenuItem
          key={workspace.id}
          disabled={tenant.isSwitching}
          selected={workspace.id === tenant.currentWorkspaceId}
          onSelect={() => tenant.switchWorkspace(workspace.id)}
        >
          <span className="flex-1">{workspace.name}</span>
          {workspace.id === tenant.currentWorkspaceId ?
            <IconCheck width={16} height={16} className="text-primary" />
          : null}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );
}
