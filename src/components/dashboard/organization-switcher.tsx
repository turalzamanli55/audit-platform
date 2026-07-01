"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { IconBuilding, IconCheck, IconChevronDown } from "@/components/ui/icons";
import { useTenant } from "@/providers/tenant-provider";

type OrganizationSwitcherProps = {
  label: string;
};

function OrganizationDisplay({
  label,
  name,
}: {
  label: string;
  name: string;
}) {
  return (
    <div
      className="flex h-10 items-center gap-2 px-2.5 text-sm"
      aria-label={`${label}: ${name}`}
      title={`${label}: ${name}`}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <IconBuilding width={16} height={16} />
      </span>
      <span className="hidden max-w-[10rem] truncate font-medium text-foreground sm:inline">{name}</span>
    </div>
  );
}

export function OrganizationSwitcher({ label }: OrganizationSwitcherProps) {
  const tenant = useTenant();
  const organizations = Array.isArray(tenant.organizations) ? tenant.organizations : [];
  const current = organizations.find((o) => o.id === tenant.currentOrganizationId);

  if (organizations.length === 0) {
    return <span className="px-2.5 text-sm text-muted-foreground">{label}: —</span>;
  }

  if (organizations.length === 1) {
    return (
      <OrganizationDisplay
        label={label}
        name={current?.name ?? organizations[0]?.name ?? "—"}
      />
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
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IconBuilding width={16} height={16} />
          </span>
          <span className="hidden max-w-[10rem] truncate font-medium sm:inline">
            {current?.name ?? "—"}
          </span>
          <IconChevronDown className="text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      }
    >
      <DropdownMenuLabel>{label}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {organizations.map((organization) => (
        <DropdownMenuItem
          key={organization.id}
          disabled={tenant.isSwitching}
          selected={organization.id === tenant.currentOrganizationId}
          onSelect={() => tenant.switchOrganization(organization.id)}
        >
          <span className="flex-1">{organization.name}</span>
          {organization.id === tenant.currentOrganizationId ?
            <IconCheck width={16} height={16} className="text-primary" />
          : null}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );
}
