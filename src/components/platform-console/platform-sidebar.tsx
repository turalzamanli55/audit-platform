"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PLATFORM_PRIMARY_NAV } from "@/config/platform-navigation";
import { stripLocalePrefix } from "@/config/auth";
import { usePlatformLabels } from "@/i18n/use-platform-labels";
import { cn } from "@/lib/ui/cn";

export function PlatformSidebar({
  locale,
  onNavigate,
}: {
  locale: string;
  /** Called after a nav link is activated (closes mobile drawer). */
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const current = stripLocalePrefix(pathname);
  const t = usePlatformLabels();

  return (
    <nav
      aria-label={t.nav.heading}
      className="flex w-full shrink-0 flex-col gap-1 lg:w-56"
    >
      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t.nav.heading}
      </p>
      {PLATFORM_PRIMARY_NAV.map((item) => {
        const active =
          item.href === "/app/platform"
            ? current === item.href
            : current === item.href || current.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={`/${locale}${item.href}`}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
            className={cn(
              "flex min-h-11 items-center rounded-lg px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
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
