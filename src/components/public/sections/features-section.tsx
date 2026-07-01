import type { MarketingLabels } from "@/i18n/marketing-types";
import { PublicIconLayers, PublicIconSpark } from "../icons";
import { PublicFeatureCard } from "../ui/public-feature-card";
import { PublicSectionShell } from "../ui/public-section-shell";

type FeaturesSectionProps = {
  labels: MarketingLabels["features"];
};

const featureIcons = [<PublicIconSpark key="0" />, <PublicIconLayers key="1" />];

export function FeaturesSection({ labels }: FeaturesSectionProps) {
  return (
    <PublicSectionShell id="features" title={labels.title} description={labels.description}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {labels.items.map((item, index) => (
          <PublicFeatureCard
            key={item.title}
            icon={featureIcons[index % featureIcons.length] ?? <PublicIconSpark />}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </PublicSectionShell>
  );
}
