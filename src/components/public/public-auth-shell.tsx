import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";

type PublicAuthShellProps = {
  children: ReactNode;
  locale: string;
};

export function PublicAuthShell({ children, locale }: PublicAuthShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="border-b border-border/60 bg-card/70 backdrop-blur-xl">
        <div className="ds-container flex h-[var(--ds-header-height)] items-center">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 rounded-xl px-1 py-1 transition-opacity hover:opacity-80"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
              {siteConfig.name.slice(0, 1)}
            </span>
            <span className="text-base font-semibold tracking-tight">{siteConfig.name}</span>
          </Link>
        </div>
      </header>
      <main id="main-content" className="flex flex-1 items-center justify-center px-4 py-10" role="main">
        {children}
      </main>
    </div>
  );
}
