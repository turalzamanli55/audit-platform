"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { IconCommand, IconSearch } from "@/components/ui/icons";
import { useShell } from "./shell-provider";
import { cn } from "@/lib/ui/cn";

type GlobalSearchTriggerProps = {
  placeholder: string;
  shortcutLabel?: string;
};

export function GlobalSearchTrigger({
  placeholder,
  shortcutLabel = "⌘K",
}: GlobalSearchTriggerProps) {
  const { setCommandPaletteOpen } = useShell();

  return (
    <button
      type="button"
      onClick={() => setCommandPaletteOpen(true)}
      className="group flex h-10 w-full max-w-md items-center gap-3 rounded-xl border border-border/60 bg-muted/30 px-3.5 text-sm text-muted-foreground transition-all duration-200 hover:border-border-strong hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <IconSearch className="text-muted-foreground transition-colors group-hover:text-foreground" />
      <span className="flex-1 truncate text-left">{placeholder}</span>
      <kbd className="hidden items-center gap-0.5 rounded-md border border-border/60 bg-card px-2 py-0.5 text-[0.6875rem] font-medium text-muted-foreground sm:inline-flex">
        <IconCommand />
        K
      </kbd>
      <span className="sr-only">{shortcutLabel}</span>
    </button>
  );
}

type ShellNavItemProps = {
  href: string;
  label: string;
  icon?: ReactNode;
  collapsed?: boolean;
};

export function ShellNavItem({ href, label, icon, collapsed = false }: ShellNavItemProps) {
  const pathname = usePathname();
  const { setMobileNavOpen } = useShell();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      onClick={() => setMobileNavOpen(false)}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-xs"
          : "text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
        collapsed && "justify-center px-2",
      )}
      aria-current={active ? "page" : undefined}
    >
      {icon ? (
        <span
          className={cn(
            "shrink-0 transition-colors",
            active ? "text-sidebar-accent-foreground" : "text-sidebar-muted group-hover:text-sidebar-foreground",
          )}
        >
          {icon}
        </span>
      ) : null}
      {!collapsed ? <span className="truncate">{label}</span> : null}
    </Link>
  );
}
