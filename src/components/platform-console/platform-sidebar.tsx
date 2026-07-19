"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PLATFORM_NAV_ITEMS } from "@/config/platform-navigation";
import { stripLocalePrefix } from "@/config/auth";
import { getConsoleStrings, type ConsoleLocale } from "@/lib/platform-console/i18n";
import { cn } from "@/lib/ui/cn";

export function PlatformSidebar({
  locale,
  consoleLocale,
}: {
  locale: string;
  consoleLocale: ConsoleLocale;
}) {
  const pathname = usePathname();
  const current = stripLocalePrefix(pathname);
  const t = getConsoleStrings(consoleLocale);

  return (
    <nav
      aria-label={t.sidebar.platform}
      className="flex w-full shrink-0 flex-col gap-1 rounded-xl border border-border/60 bg-card p-2 lg:w-60"
    >
      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t.sidebar.platform}
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
              "rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-card",
              active
                ? "bg-primary font-medium text-primary-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {t.nav[item.key] ?? item.label}
          </Link>
        );
      })}
    </nav>
  );
}
