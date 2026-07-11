"use client";

import { usePathname } from "next/navigation";
import { IconBriefcase, IconLayoutDashboard, IconUsers, IconZap } from "@/components/ui/icons";
import { ShellNavItem } from "@/components/shell/shell-nav";
import { useShell } from "@/components/shell/shell-provider";
import { coerceDashboardNavItems, type DashboardNavItem } from "@/config/dashboard-navigation";
import { defaultLocale, isValidLocale } from "@/i18n";

type DashboardNavProps = {
  items: DashboardNavItem[] | unknown;
  navAriaLabel?: string;
};

function resolveLocale(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment && isValidLocale(segment) ? segment : defaultLocale;
}

function navIcon(href: string) {
  if (href.includes("companies")) {
    return <IconBriefcase width={18} height={18} />;
  }
  if (href.includes("engagements")) {
    return <IconUsers width={18} height={18} />;
  }
  if (href.includes("import-intelligence")) {
    return <IconZap width={18} height={18} />;
  }
  return <IconLayoutDashboard width={18} height={18} />;
}

export function DashboardNav({ items, navAriaLabel }: DashboardNavProps) {
  const pathname = usePathname();
  const locale = resolveLocale(pathname);
  const { sidebarCollapsed } = useShell();
  const safeItems = coerceDashboardNavItems(items);

  if (safeItems.length === 0) {
    return <nav className="space-y-1" aria-label={navAriaLabel} />;
  }

  return (
    <nav className="space-y-1" aria-label={navAriaLabel}>
      {safeItems.map((item) => (
        <ShellNavItem
          key={item.href}
          href={`/${locale}${item.href}`}
          label={item.label}
          icon={navIcon(item.href)}
          collapsed={sidebarCollapsed}
        />
      ))}
    </nav>
  );
}
