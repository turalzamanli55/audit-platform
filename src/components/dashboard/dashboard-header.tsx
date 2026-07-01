"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

export function DashboardBrand() {
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] ?? siteConfig.defaultLocale;

  return (
    <Link
      href={`/${locale}/app/dashboard`}
      className="flex min-w-0 items-center gap-2.5 rounded-xl px-1 py-1 transition-opacity hover:opacity-80"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
        {siteConfig.name.slice(0, 1)}
      </span>
      <span className="truncate text-base font-semibold tracking-tight text-sidebar-foreground lg:text-foreground">
        {siteConfig.name}
      </span>
    </Link>
  );
}
