"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { PublicLocaleThemeControls } from "./public-locale-theme-controls";

type PublicAuthChromeLabels = {
  language: string;
  theme: string;
  themeLight: string;
  themeDark: string;
};

type PublicAuthChromeProps = {
  locale: string;
  labels: PublicAuthChromeLabels;
};

export function PublicAuthChrome({ locale, labels }: PublicAuthChromeProps) {
  return (
    <header className="border-b border-border/60 bg-card/70 backdrop-blur-xl ds-safe-top">
      <div className="ds-container flex h-[var(--ds-header-height)] items-center justify-between gap-4">
        <Link
          href={`/${locale}`}
          className="flex min-w-0 items-center gap-2.5 rounded-xl px-1 py-1 transition-opacity hover:opacity-80"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
            {siteConfig.name.slice(0, 1)}
          </span>
          <span className="truncate text-base font-semibold tracking-tight">{siteConfig.name}</span>
        </Link>
        <PublicLocaleThemeControls labels={labels} />
      </div>
    </header>
  );
}
