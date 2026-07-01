"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { IconChevronDown } from "@/components/ui/icons";
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
    return (
      <span className="hidden items-center gap-2 text-sm text-muted-foreground md:inline-flex">
        <span>{label}</span>
        <span className="font-medium text-foreground">{current?.name ?? workspaces[0]?.name}</span>
      </span>
    );
  }

  return (
    <DropdownMenu
      trigger={
        <Button variant="ghost" className="hidden h-10 gap-2 px-2.5 font-normal md:inline-flex">
          <span className="text-muted-foreground">{label}</span>
          <span className="max-w-[8rem] truncate font-medium">{current?.name ?? "—"}</span>
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
