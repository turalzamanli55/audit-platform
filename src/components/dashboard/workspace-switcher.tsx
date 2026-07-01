"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { IconChevronDown, IconLayoutDashboard } from "@/components/ui/icons";
import { useTenant } from "@/providers/tenant-provider";

type WorkspaceSwitcherProps = {
  label: string;
};

export function WorkspaceSwitcher({ label }: WorkspaceSwitcherProps) {
  const tenant = useTenant();
  const workspaces = Array.isArray(tenant.workspaces) ? tenant.workspaces : [];
  const current = workspaces.find((w) => w.id === tenant.currentWorkspaceId);

  if (workspaces.length === 0) {
    return <span className="text-sm text-muted-foreground">{label}: —</span>;
  }

  if (workspaces.length === 1) {
    const name = current?.name ?? workspaces[0]?.name;
    return (
      <Button
        variant="ghost"
        className="h-10 gap-2 px-2.5 font-normal"
        title={`${label}: ${name}`}
        aria-label={`${label}: ${name}`}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <IconLayoutDashboard width={16} height={16} />
        </span>
        <span className="hidden max-w-[8rem] truncate font-medium sm:inline">{name}</span>
      </Button>
    );
  }

  return (
    <DropdownMenu
      trigger={
        <Button variant="ghost" className="h-10 gap-2 px-2.5 font-normal" aria-label={`${label}: ${current?.name ?? "—"}`}>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconLayoutDashboard width={16} height={16} />
          </span>
          <span className="hidden max-w-[8rem] truncate font-medium sm:inline">{current?.name ?? "—"}</span>
          <IconChevronDown className="text-muted-foreground" />
        </Button>
      }
    >
      <DropdownMenuLabel>{label}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {workspaces.map((workspace) => (
        <DropdownMenuItem
          key={workspace.id}
          disabled={tenant.isSwitching}
          onSelect={() => tenant.switchWorkspace(workspace.id)}
        >
          <span className={workspace.id === tenant.currentWorkspaceId ? "font-medium" : undefined}>
            {workspace.name}
          </span>
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );
}
