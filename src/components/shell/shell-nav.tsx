"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SearchCommandTrigger } from "./search-command-trigger";
import { useShell } from "./shell-provider";
import { cn } from "@/lib/ui/cn";

type GlobalSearchTriggerProps = {
  placeholder: string;
  label?: string;
  shortcutLabel?: string;
};

export function GlobalSearchTrigger({
  placeholder,
  label = "Open search",
  shortcutLabel,
}: GlobalSearchTriggerProps) {
  return (
    <SearchCommandTrigger
      placeholder={placeholder}
      label={label}
      shortcutLabel={shortcutLabel}
    />
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
        "group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.99] motion-reduce:transform-none",
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
