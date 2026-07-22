"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Sheet } from "@/components/ui/sheet";
import { IconSearch } from "@/components/ui/icons";
import { PlatformHeader } from "@/components/platform-console/platform-header";
import { PlatformSidebar } from "@/components/platform-console/platform-sidebar";
import { usePlatformLabels } from "@/i18n/use-platform-labels";
import { PLATFORM_DASHBOARD_PATH } from "@/config/auth";

type HeaderProps = {
  ownerEmail: string;
  environment: string;
  version: string;
  buildDate?: string;
  gitCommit?: string;
  databaseVersion?: string;
};

/**
 * Responsive Platform Console chrome: sticky header with search + mobile menu,
 * desktop sidebar, and a left Sheet drawer on smaller viewports.
 */
export function PlatformShell({
  locale,
  header,
  children,
}: {
  locale: string;
  header: HeaderProps;
  children: ReactNode;
}) {
  const t = usePlatformLabels();
  const [navOpen, setNavOpen] = useState(false);
  const searchHref = `/${locale}${PLATFORM_DASHBOARD_PATH}/search`;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PlatformHeader
        {...header}
        searchHref={searchHref}
        onOpenNav={() => setNavOpen(true)}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6 lg:flex-row">
        <aside className="hidden shrink-0 lg:block">
          <div className="sticky top-20 rounded-xl border border-border/60 bg-card p-2">
            <PlatformSidebar locale={locale} />
          </div>
        </aside>

        <Sheet
          open={navOpen}
          onOpenChange={setNavOpen}
          side="left"
          title={t.nav.heading}
          description={t.header.console}
        >
          <PlatformSidebar locale={locale} onNavigate={() => setNavOpen(false)} />
        </Sheet>

        <main className="min-w-0 flex-1 pb-20 lg:pb-8">{children}</main>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 lg:hidden">
        <Link
          href={searchHref}
          className="pointer-events-auto inline-flex h-11 min-w-[11rem] items-center justify-center gap-2 rounded-full border border-border/60 bg-card/95 px-5 text-sm font-medium text-foreground shadow-lg backdrop-blur-xl"
        >
          <IconSearch width={16} height={16} />
          {t.ux.search}
        </Link>
      </div>
    </div>
  );
}
