import type { MarketingLabels } from "@/i18n/marketing-types";
import { PublicIconLock, PublicIconShield } from "../icons";
import { PublicFeatureCard } from "../ui/public-feature-card";
import { PublicSectionShell } from "../ui/public-section-shell";

type SecuritySectionProps = {
  labels: MarketingLabels["security"];
};

export function SecuritySection({ labels }: SecuritySectionProps) {
  const items = Object.values(labels.items);
  const icons = [
    <PublicIconLock key="0" />,
    <PublicIconShield key="1" />,
    <PublicIconShield key="2" />,
    <PublicIconShield key="3" />,
    <PublicIconLock key="4" />,
  ];

  return (
    <PublicSectionShell id="security" title={labels.title} description={labels.description} variant="muted">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <PublicFeatureCard
            key={item.title}
            icon={icons[index] ?? <PublicIconShield />}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </PublicSectionShell>
  );
}
