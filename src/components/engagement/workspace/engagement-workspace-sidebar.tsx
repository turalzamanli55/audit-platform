"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { EngagementWorkspaceSection } from "@/lib/engagement/engagement-workspace-display";

export type EngagementWorkspaceNavItem = {
  id: EngagementWorkspaceSection;
  label: string;
  href: string;
};

type EngagementWorkspaceSidebarProps = {
  items: EngagementWorkspaceNavItem[];
  ariaLabel: string;
  className?: string;
};

function isActive(pathname: string, item: EngagementWorkspaceNavItem): boolean {
  if (item.id === "overview") {
    return pathname === item.href || pathname === `${item.href}/`;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function EngagementWorkspaceSidebar({
  items,
  ariaLabel,
  className = "",
}: EngagementWorkspaceSidebarProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul className="-mx-1 flex gap-1 overflow-x-auto overscroll-x-contain px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const active = isActive(pathname, item);
          return (
            <li key={item.id} className="shrink-0 lg:shrink">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 lg:px-4 lg:py-2.5 ${
                  active
                    ? "bg-foreground/[0.06] text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
