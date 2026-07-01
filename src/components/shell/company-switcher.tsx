"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { IconBriefcase, IconChevronDown } from "@/components/ui/icons";
import { cn } from "@/lib/ui/cn";

export type CompanySwitcherItem = {
  id: string;
  name: string;
  slug?: string;
};

type CompanySwitcherProps = {
  label: string;
  items: CompanySwitcherItem[];
  currentId?: string | null;
  emptyLabel?: string;
  onSelect?: (id: string) => void;
  className?: string;
};

export function CompanySwitcher({
  label,
  items,
  currentId,
  emptyLabel = "—",
  onSelect,
  className,
}: CompanySwitcherProps) {
  const current = items.find((item) => item.id === currentId) ?? items[0];

  if (items.length === 0) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)}>
        {label}: {emptyLabel}
      </div>
    );
  }

  return (
    <DropdownMenu
      className={className}
      trigger={
        <Button variant="ghost" className="h-10 gap-2 px-2.5 font-normal" aria-label={`${label}: ${current?.name ?? emptyLabel}`}>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <IconBriefcase width={16} height={16} />
          </span>
          <span className="hidden max-w-[10rem] truncate sm:inline">{current?.name ?? emptyLabel}</span>
          <IconChevronDown className="text-muted-foreground" />
        </Button>
      }
    >
      <DropdownMenuLabel>{label}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {items.map((item) => (
        <DropdownMenuItem
          key={item.id}
          onSelect={() => onSelect?.(item.id)}
          className={item.id === current?.id ? "bg-accent/60" : undefined}
        >
          <Avatar name={item.name} size="xs" />
          <span className="truncate">{item.name}</span>
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );
}
