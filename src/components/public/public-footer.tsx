import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { MarketingLabels } from "@/i18n/marketing-types";

type PublicFooterProps = {
  locale: string;
  labels: MarketingLabels["footer"];
};

export function PublicFooter({ locale, labels }: PublicFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-card/50" role="contentinfo">
      <div className="ds-container py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <div className="space-y-4">
            <p className="text-base font-semibold tracking-tight text-foreground">{siteConfig.name}</p>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{labels.tagline}</p>
            <div className="flex gap-3 pt-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-muted/30 text-xs text-muted-foreground" aria-label={labels.socialTwitter}>
                X
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-muted/30 text-xs text-muted-foreground" aria-label={labels.socialLinkedIn}>
                in
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-muted/30 text-xs text-muted-foreground" aria-label={labels.socialGitHub}>
                GH
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{labels.product}</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#overview" className="text-muted-foreground transition-colors hover:text-foreground">{labels.overview}</a></li>
                <li><a href="#features" className="text-muted-foreground transition-colors hover:text-foreground">{labels.features}</a></li>
                <li><a href="#ai" className="text-muted-foreground transition-colors hover:text-foreground">AI</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{labels.legal}</p>
              <ul className="space-y-2 text-sm">
                <li><Link href={`/${locale}/privacy`} className="text-muted-foreground transition-colors hover:text-foreground">{labels.privacy}</Link></li>
                <li><Link href={`/${locale}/terms`} className="text-muted-foreground transition-colors hover:text-foreground">{labels.terms}</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{labels.supportColumn}</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground transition-colors hover:text-foreground">{labels.documentation}</a></li>
                <li><a href="mailto:support@audit.platform" className="text-muted-foreground transition-colors hover:text-foreground">{labels.support}</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border/60 pt-8 text-sm text-muted-foreground">
          © {year} {siteConfig.name}. {labels.copyright}
        </div>
      </div>
    </footer>
  );
}
