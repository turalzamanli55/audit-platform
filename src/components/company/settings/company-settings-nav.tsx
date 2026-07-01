"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CompanySettingsNavItem } from "@/lib/company/company-settings-sections";

export type { CompanySettingsNavItem };

type CompanySettingsNavProps = {
  items: CompanySettingsNavItem[];
  ariaLabel: string;
  className?: string;
};

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function CompanySettingsNav({ items, ariaLabel, className = "" }: CompanySettingsNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul className="flex gap-1 overflow-x-auto pb-1 md:flex-col md:gap-0.5 md:overflow-visible md:pb-0">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.id} className="shrink-0 md:shrink">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 md:px-4 ${
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
