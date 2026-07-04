"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FieldworkWorkspaceSection } from "@/lib/fieldwork/fieldwork-workspace-view";

export type FieldworkWorkspaceNavItem = {
  id: FieldworkWorkspaceSection;
  label: string;
  href: string;
};

export type FieldworkWorkspaceNavGroup = {
  id: "overview" | "program" | "execution" | "documentation" | "governance" | "admin";
  label: string;
  items: FieldworkWorkspaceNavItem[];
};

type FieldworkWorkspaceSidebarProps = {
  items: FieldworkWorkspaceNavItem[];
  groups?: FieldworkWorkspaceNavGroup[];
  ariaLabel: string;
  isArchived?: boolean;
  className?: string;
};

function isActive(pathname: string, item: FieldworkWorkspaceNavItem): boolean {
  if (item.id === "overview") {
    return pathname === item.href || pathname === `${item.href}/`;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function FieldworkWorkspaceSidebar({
  items,
  groups,
  ariaLabel,
  isArchived = false,
  className = "",
}: FieldworkWorkspaceSidebarProps) {
  const pathname = usePathname();

  const renderItem = (item: FieldworkWorkspaceNavItem) => {
    const active = isActive(pathname, item);
    const readOnly = isArchived && item.id !== "history" && item.id !== "settings";

    return (
      <li key={item.id} className="shrink-0 lg:shrink">
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          aria-disabled={readOnly}
          className={`flex items-center rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 lg:px-4 lg:py-2.5 ${
            active
              ? "bg-foreground/[0.06] text-foreground"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          } ${readOnly ? "pointer-events-none opacity-50" : ""}`}
        >
          {item.label}
        </Link>
      </li>
    );
  };

  return (
    <nav aria-label={ariaLabel} className={className}>
      {groups && groups.length > 0 ? (
        <div className="-mx-1 flex gap-1 overflow-x-auto overscroll-x-contain px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {groups.map((group) => (
            <div key={group.id} className="shrink-0 lg:shrink">
              <p className="mb-1.5 hidden px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground lg:block">
                {group.label}
              </p>
              <ul className="flex gap-1 lg:flex-col lg:gap-0.5">{group.items.map(renderItem)}</ul>
            </div>
          ))}
        </div>
      ) : (
        <ul className="-mx-1 flex gap-1 overflow-x-auto overscroll-x-contain px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {items.map(renderItem)}
        </ul>
      )}
    </nav>
  );
}
