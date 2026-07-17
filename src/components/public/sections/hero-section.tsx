import type { MarketingLabels } from "@/i18n/marketing-types";
import { PublicLinkButton } from "../ui/public-link-button";
import { IllustrationPlaceholder } from "../ui/illustration-placeholder";
import { TrustBadge } from "../ui/trust-badge";

type HeroSectionProps = {
  locale: string;
  labels: MarketingLabels["hero"];
};

export function HeroSection({ locale, labels }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-8 sm:pt-12 lg:pt-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[520px] w-[min(100%,900px)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgb(37_99_235/0.12),transparent_70%)] blur-3xl" />
        <div className="absolute -right-24 top-32 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />
      </div>

      <div className="ds-container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div className="max-w-xl space-y-8 ds-animate-slide-up">
            <p className="ds-typography-overline text-primary">{labels.eyebrow}</p>
            <h1 className="ds-typography-display text-balance text-foreground">{labels.title}</h1>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {labels.subtitle}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <PublicLinkButton href={`/${locale}/login`} size="lg" className="w-full sm:w-auto">
                {labels.primaryCta}
              </PublicLinkButton>
              <PublicLinkButton
                href={`/${locale}/pricing`}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                {labels.secondaryCta}
              </PublicLinkButton>
            </div>
            <div className="flex flex-wrap gap-2 pt-2" aria-label={labels.trustAriaLabel}>
              {labels.trust.map((item) => (
                <TrustBadge key={item} label={item} />
              ))}
            </div>
          </div>

          <div className="ds-animate-fade-in lg:justify-self-end">
            <IllustrationPlaceholder label={labels.title} variant="hero" className="w-full max-w-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
