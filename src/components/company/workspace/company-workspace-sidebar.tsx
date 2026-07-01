"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CompanyWorkspaceSection } from "@/lib/company/company-workspace-view";

export type CompanyWorkspaceNavItem = {
  id: CompanyWorkspaceSection;
  label: string;
  href: string;
};

type CompanyWorkspaceSidebarProps = {
  items: CompanyWorkspaceNavItem[];
  ariaLabel: string;
  className?: string;
};

function isActive(pathname: string, item: CompanyWorkspaceNavItem): boolean {
  if (item.id === "overview") {
    return pathname === item.href || pathname === `${item.href}/`;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/**
 * Vertical workspace navigation — highlights the active section from the URL.
 */
export function CompanyWorkspaceSidebar({
  items,
  ariaLabel,
  className = "",
}: CompanyWorkspaceSidebarProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0">
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
