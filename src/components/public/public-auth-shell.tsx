import type { ReactNode } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/ui/cn";

type PublicAuthShellProps = {
  children: ReactNode;
  locale: string;
  wide?: boolean;
};

export function PublicAuthShell({ children, locale, wide = false }: PublicAuthShellProps) {
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
      <main
        id="main-content"
        className={cn(
          "flex flex-1 px-4 py-10 sm:px-6",
          wide ? "items-start justify-center lg:items-center lg:py-12" : "items-center justify-center",
        )}
        role="main"
      >
        {children}
      </main>
    </div>
  );
}
