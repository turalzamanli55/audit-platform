import type { ReactNode } from "react";
import type { MarketingNavLabels } from "@/i18n/marketing-types";
import type { MarketingLabels } from "@/i18n/marketing-types";
import { PublicFooter } from "./public-footer";
import { PublicHeader } from "./public-header";

type PublicShellProps = {
  children: ReactNode;
  locale: string;
  navLabels: MarketingNavLabels;
  footerLabels: MarketingLabels["footer"];
  compact?: boolean;
};

export function PublicShell({
  children,
  locale,
  navLabels,
  footerLabels,
  compact = false,
}: PublicShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <PublicHeader locale={locale} labels={navLabels} />
      <main id="main-content" className="flex-1" role="main">
        {children}
      </main>
      {!compact ? <PublicFooter locale={locale} labels={footerLabels} /> : null}
    </div>
  );
}
