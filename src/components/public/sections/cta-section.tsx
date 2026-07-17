import type { MarketingLabels } from "@/i18n/marketing-types";
import { PublicLinkButton } from "../ui/public-link-button";

type CtaSectionProps = {
  locale: string;
  labels: MarketingLabels["cta"];
};

export function CtaSection({ locale, labels }: CtaSectionProps) {
  return (
    <section className="py-20 sm:py-24 lg:py-28">
      <div className="ds-container">
        <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/8 via-card to-accent/10 px-8 py-16 text-center shadow-sm sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgb(37_99_235/0.1),transparent_55%)]" />
          <div className="relative mx-auto max-w-2xl space-y-6">
            <h2 className="ds-typography-h2 text-balance text-foreground">{labels.title}</h2>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {labels.subtitle}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
              <PublicLinkButton href={`/${locale}/login`} size="lg">
                {labels.login}
              </PublicLinkButton>
              <PublicLinkButton href={`/${locale}/pricing`} variant="outline" size="lg">
                Pricing
              </PublicLinkButton>
              <PublicLinkButton href={`/${locale}/contact`} variant="ghost" size="lg">
                {labels.requestDemo}
              </PublicLinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
