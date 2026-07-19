import type { ReactNode } from "react";
import { cookies, headers } from "next/headers";
import { forbidden } from "next/navigation";
import { getPlatformOwnerIdentity } from "@/lib/auth/server";
import { PlatformSidebar } from "@/components/platform-console/platform-sidebar";
import { PlatformHeader } from "@/components/platform-console/platform-header";
import { PLATFORM_OWNER_EMAIL } from "@/lib/platform-bootstrap";
import { BUILD_DATE, GIT_COMMIT, PLATFORM_VERSION } from "@/lib/platform-console/version";
import {
  PLATFORM_LOCALE_COOKIE,
  resolveConsoleLocale,
} from "@/lib/platform-console/i18n";
import { isValidLocale, type Locale } from "@/i18n";
import { defaultLocale } from "@/i18n/config";

/**
 * Platform Owner console layout. Lives OUTSIDE the tenant `(protected)` shell,
 * so it never renders tenant/workspace/company navigation or switchers.
 * Only the Platform Owner may enter; everyone else receives a real HTTP 403.
 * Interface language and appearance are user-interface preferences only and do
 * not affect routing, permissions, or any business logic.
 */
export default async function PlatformLayout({ children }: { children: ReactNode }) {
  const owner = await getPlatformOwnerIdentity();
  if (!owner) {
    forbidden();
  }

  const headerStore = await headers();
  const localeHeader = headerStore.get("x-locale");
  const locale = (localeHeader && isValidLocale(localeHeader) ? localeHeader : defaultLocale) as Locale;

  const cookieStore = await cookies();
  const consoleLocale = resolveConsoleLocale(cookieStore.get(PLATFORM_LOCALE_COOKIE)?.value);
  const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PlatformHeader
        locale={locale}
        consoleLocale={consoleLocale}
        ownerEmail={owner.email ?? PLATFORM_OWNER_EMAIL}
        environment={environment}
        version={PLATFORM_VERSION}
        buildDate={BUILD_DATE}
        gitCommit={GIT_COMMIT}
      />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 lg:flex-row lg:p-6">
        <PlatformSidebar locale={locale} consoleLocale={consoleLocale} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
