"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PLATFORM_NAV_ITEMS } from "@/config/platform-navigation";
import { stripLocalePrefix } from "@/config/auth";
import { cn } from "@/lib/ui/cn";

export function PlatformSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const current = stripLocalePrefix(pathname);

  return (
    <nav
      aria-label="Platform navigation"
      className="flex w-full shrink-0 flex-col gap-1 rounded-xl border bg-card p-2 lg:w-60"
    >
      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Platform
      </p>
      {PLATFORM_NAV_ITEMS.map((item) => {
        const active =
          item.href === "/app/platform"
            ? current === item.href
            : current === item.href || current.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={`/${locale}${item.href}`}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
