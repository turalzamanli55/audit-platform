"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { IconBuilding, IconChevronDown } from "@/components/ui/icons";
import { useTenant } from "@/providers/tenant-provider";

type OrganizationSwitcherProps = {
  label: string;
};

export function OrganizationSwitcher({ label }: OrganizationSwitcherProps) {
  const tenant = useTenant();
  const organizations = Array.isArray(tenant.organizations) ? tenant.organizations : [];
  const current = organizations.find((o) => o.id === tenant.currentOrganizationId);

  if (organizations.length === 0) {
    return <span className="text-sm text-muted-foreground">{label}: —</span>;
  }

  if (organizations.length === 1) {
    const name = current?.name ?? organizations[0]?.name;
    return (
      <Button
        variant="ghost"
        className="h-10 gap-2 px-2.5 font-normal"
        aria-label={`${label}: ${name}`}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <IconBuilding width={16} height={16} />
        </span>
        <span className="hidden max-w-[10rem] truncate font-medium sm:inline">
          {current?.name ?? organizations[0]?.name}
        </span>
      </Button>
    );
  }

  return (
    <DropdownMenu
      trigger={
        <Button variant="ghost" className="h-10 gap-2 px-2.5 font-normal" aria-label={`${label}: ${current?.name ?? "—"}`}>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IconBuilding width={16} height={16} />
          </span>
          <span className="hidden max-w-[10rem] truncate font-medium sm:inline">
            {current?.name ?? "—"}
          </span>
          <IconChevronDown className="text-muted-foreground" />
        </Button>
      }
    >
      <DropdownMenuLabel>{label}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {organizations.map((organization) => (
        <DropdownMenuItem
          key={organization.id}
          disabled={tenant.isSwitching}
          onSelect={() => tenant.switchOrganization(organization.id)}
        >
          <span className={organization.id === tenant.currentOrganizationId ? "font-medium" : undefined}>
            {organization.name}
          </span>
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );
}
