"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { IconCheck, IconChevronDown, IconFileText } from "@/components/ui/icons";
import { cn } from "@/lib/ui/cn";

export type EngagementSwitcherItem = {
  id: string;
  name: string;
  slug?: string;
  companyId?: string;
  companyName?: string;
  isArchived?: boolean;
};

type EngagementSwitcherProps = {
  label: string;
  items: EngagementSwitcherItem[];
  currentId?: string | null;
  emptyLabel?: string;
  onSelect?: (id: string) => void;
  className?: string;
};

export function EngagementSwitcher({
  label,
  items,
  currentId,
  emptyLabel = "—",
  onSelect,
  className,
}: EngagementSwitcherProps) {
  const current = items.find((item) => item.id === currentId) ?? items[0];

  if (items.length === 0) {
    return (
      <div className={cn("px-2.5 text-sm text-muted-foreground", className)}>
        {label}: {emptyLabel}
      </div>
    );
  }

  if (items.length === 1) {
    return (
      <div
        className={cn("flex h-10 items-center gap-2 px-2.5 text-sm", className)}
        aria-label={`${label}: ${current?.name ?? emptyLabel}`}
        title={`${label}: ${current?.name ?? emptyLabel}`}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <IconFileText width={16} height={16} />
        </span>
        <span className="hidden max-w-[10rem] truncate font-medium text-foreground sm:inline">
          {current?.name ?? emptyLabel}
        </span>
      </div>
    );
  }

  return (
    <DropdownMenu
      className={className}
      trigger={
        <Button
          variant="ghost"
          className="group h-10 gap-2 px-2.5 font-normal"
          aria-label={`${label}: ${current?.name ?? emptyLabel}`}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <IconFileText width={16} height={16} />
          </span>
          <span className="hidden max-w-[10rem] truncate sm:inline">{current?.name ?? emptyLabel}</span>
          <IconChevronDown className="text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      }
    >
      <DropdownMenuLabel>{label}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {items.map((item) => (
        <DropdownMenuItem
          key={item.id}
          selected={item.id === current?.id}
          onSelect={() => onSelect?.(item.id)}
        >
          <Avatar name={item.name} size="xs" />
          <span className="min-w-0 flex-1 truncate">
            <span className="block truncate">{item.name}</span>
            {item.companyName ? (
              <span className="block truncate text-xs text-muted-foreground">{item.companyName}</span>
            ) : null}
          </span>
          {item.id === current?.id ? <IconCheck width={16} height={16} className="text-primary" /> : null}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );
}
