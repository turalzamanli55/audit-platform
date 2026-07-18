import type { ReactNode } from "react";
import { headers } from "next/headers";
import { forbidden } from "next/navigation";
import { isPlatformOwner } from "@/lib/auth/server";
import { PlatformSidebar } from "@/components/platform-console/platform-sidebar";
import { isValidLocale, type Locale } from "@/i18n";
import { defaultLocale } from "@/i18n/config";

/**
 * Platform Owner console layout. Only the Platform Owner may enter; everyone
 * else receives a real HTTP 403 via forbidden().
 */
export default async function PlatformLayout({ children }: { children: ReactNode }) {
  const owner = await isPlatformOwner();
  if (!owner) {
    forbidden();
  }

  const headerStore = await headers();
  const localeHeader = headerStore.get("x-locale");
  const locale = (localeHeader && isValidLocale(localeHeader) ? localeHeader : defaultLocale) as Locale;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 lg:flex-row lg:p-6">
      <PlatformSidebar locale={locale} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
