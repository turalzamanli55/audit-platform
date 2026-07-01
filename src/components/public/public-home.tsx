import dynamic from "next/dynamic";
import type { MarketingLabels } from "@/i18n/marketing-types";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroSection } from "./sections/hero-section";
import { PlatformOverviewSection } from "./sections/platform-overview-section";
import { FeaturesSection } from "./sections/features-section";

const EnterpriseSection = dynamic(
  () => import("./sections/enterprise-section").then((m) => ({ default: m.EnterpriseSection })),
  { loading: () => <SectionSkeleton /> },
);

const SecuritySection = dynamic(
  () => import("./sections/security-section").then((m) => ({ default: m.SecuritySection })),
  { loading: () => <SectionSkeleton /> },
);

const AiSection = dynamic(
  () => import("./sections/ai-section").then((m) => ({ default: m.AiSection })),
  { loading: () => <SectionSkeleton /> },
);

const CtaSection = dynamic(
  () => import("./sections/cta-section").then((m) => ({ default: m.CtaSection })),
  { loading: () => <SectionSkeleton short /> },
);

function SectionSkeleton({ short = false }: { short?: boolean }) {
  return (
    <div className="ds-container py-20" aria-hidden="true">
      <Skeleton className="mx-auto mb-8 h-8 w-64" />
      <Skeleton className="mx-auto mb-12 h-4 w-96 max-w-full" />
      <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${short ? "max-w-3xl mx-auto" : ""}`}>
        {Array.from({ length: short ? 1 : 3 }).map((_, i) => (
          <Skeleton key={i} className={short ? "h-32" : "h-40"} />
        ))}
      </div>
    </div>
  );
}

type PublicHomeProps = {
  locale: string;
  marketing: MarketingLabels;
};

export function PublicHome({ locale, marketing }: PublicHomeProps) {
  return (
    <>
      <HeroSection locale={locale} labels={marketing.hero} />
      <PlatformOverviewSection labels={marketing.overview} />
      <FeaturesSection labels={marketing.features} />
      <EnterpriseSection labels={marketing.enterprise} />
      <SecuritySection labels={marketing.security} />
      <AiSection labels={marketing.ai} />
      <CtaSection locale={locale} labels={marketing.cta} />
    </>
  );
}
