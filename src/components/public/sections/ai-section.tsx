import type { MarketingLabels } from "@/i18n/marketing-types";
import { Badge } from "@/components/ui/badge";
import { PublicIconBrain, PublicIconChart, PublicIconSpark } from "../icons";
import { PublicFeatureCard } from "../ui/public-feature-card";
import { PublicSectionShell } from "../ui/public-section-shell";
import { IllustrationPlaceholder } from "../ui/illustration-placeholder";

type AiSectionProps = {
  labels: MarketingLabels["ai"];
};

export function AiSection({ labels }: AiSectionProps) {
  const items = Object.values(labels.items);
  const icons = [
    <PublicIconBrain key="a" />,
    <PublicIconSpark key="b" />,
    <PublicIconChart key="c" />,
    <PublicIconBrain key="d" />,
    <PublicIconChart key="e" />,
    <PublicIconSpark key="f" />,
  ];

  return (
    <PublicSectionShell
      id="ai"
      eyebrow={labels.badge}
      title={labels.title}
      description={labels.description}
    >
      <div className="mb-10 flex justify-center">
        <Badge variant="info">{labels.badge}</Badge>
      </div>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
        <IllustrationPlaceholder label={labels.title} variant="ai" />
        <div className="grid gap-5 sm:grid-cols-2">
          {items.map((item, index) => (
            <PublicFeatureCard
              key={item.title}
              icon={icons[index] ?? <PublicIconBrain />}
              title={item.title}
              description={item.description}
              interactive={false}
            />
          ))}
        </div>
      </div>
    </PublicSectionShell>
  );
}
