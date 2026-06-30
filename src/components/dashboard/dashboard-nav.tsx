"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { coerceDashboardNavItems, type DashboardNavItem } from "@/config/dashboard-navigation";
import { defaultLocale, isValidLocale } from "@/i18n";

type DashboardNavProps = {
  items: DashboardNavItem[] | unknown;
};

function resolveLocale(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment && isValidLocale(segment) ? segment : defaultLocale;
}

export function DashboardNav({ items }: DashboardNavProps) {
  const pathname = usePathname();
  const locale = resolveLocale(pathname);
  const safeItems = coerceDashboardNavItems(items);

  if (safeItems.length === 0) {
    return <nav className="space-y-1" aria-label="Main navigation" />;
  }

  return (
    <nav className="space-y-1" aria-label="Main navigation">
      {safeItems.map((item) => {
        const href = `/${locale}${item.href}`;
        const active = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={item.href}
            href={href}
            className={`block rounded-xl px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-accent text-accent-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-border/40 hover:text-sidebar-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
