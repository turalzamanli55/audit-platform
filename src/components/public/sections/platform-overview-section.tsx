import type { MarketingLabels } from "@/i18n/marketing-types";
import {
  PublicIconBrain,
  PublicIconChart,
  PublicIconFile,
  PublicIconScale,
  PublicIconShield,
  PublicIconZap,
} from "../icons";
import { PublicFeatureCard } from "../ui/public-feature-card";
import { PublicSectionShell } from "../ui/public-section-shell";

type PlatformOverviewSectionProps = {
  labels: MarketingLabels["overview"];
};

export function PlatformOverviewSection({ labels }: PlatformOverviewSectionProps) {
  const items = [
    { icon: <PublicIconBrain />, ...labels.items.aiAudit },
    { icon: <PublicIconFile />, ...labels.items.workingPapers },
    { icon: <PublicIconChart />, ...labels.items.financialStatements },
    { icon: <PublicIconScale />, ...labels.items.trialBalance },
    { icon: <PublicIconZap />, ...labels.items.automation },
    { icon: <PublicIconShield />, ...labels.items.compliance },
  ];

  return (
    <PublicSectionShell
      id="overview"
      title={labels.title}
      description={labels.description}
      variant="muted"
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <PublicFeatureCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </PublicSectionShell>
  );
}
