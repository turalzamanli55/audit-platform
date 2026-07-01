import type { MarketingLabels } from "@/i18n/marketing-types";
import { PublicIconBuilding, PublicIconLayers, PublicIconShield } from "../icons";
import { PublicFeatureCard } from "../ui/public-feature-card";
import { PublicSectionShell } from "../ui/public-section-shell";

type EnterpriseSectionProps = {
  labels: MarketingLabels["enterprise"];
};

const icons = [
  <PublicIconBuilding key="org" />,
  <PublicIconLayers key="ws" />,
  <PublicIconBuilding key="co" />,
  <PublicIconShield key="mt" />,
  <PublicIconShield key="perm" />,
  <PublicIconLayers key="audit" />,
  <PublicIconLayers key="ver" />,
];

export function EnterpriseSection({ labels }: EnterpriseSectionProps) {
  const items = Object.values(labels.items);

  return (
    <PublicSectionShell
      id="enterprise"
      title={labels.title}
      description={labels.description}
      variant="gradient"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item, index) => (
          <PublicFeatureCard
            key={item.title}
            icon={icons[index] ?? <PublicIconBuilding />}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </PublicSectionShell>
  );
}
