import Link from "next/link";
import { IconTrendingUp } from "@/components/ui/icons";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import { WorkspaceEmpty, WorkspaceMetricCard, WorkspacePanel } from "@/components/workspace";

type WorkspaceInsightsCardProps = {
  locale: string;
  labels: DashboardWorkspaceLabels["insights"];
  metrics: DashboardWorkspaceLabels["insights"]["metrics"];
};

const metricLinks: Record<string, (locale: string) => string> = {
  companies: (locale) => `/${locale}/app/companies`,
  engagements: (locale) => `/${locale}/app/engagements`,
  reviews: (locale) => `/${locale}/app/engagements`,
  planning: (locale) => `/${locale}/app/engagements`,
  findings: (locale) => `/${locale}/app/engagements`,
  risks: (locale) => `/${locale}/app/engagements`,
  materiality: (locale) => `/${locale}/app/engagements`,
};

export function WorkspaceInsightsCard({ locale, labels, metrics }: WorkspaceInsightsCardProps) {
  const visibleMetrics = metrics.filter((metric) => metric.value !== "—");

  return (
    <WorkspacePanel>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <IconTrendingUp />
        </span>
        <div>
          <h3 className="font-semibold tracking-tight">{labels.title}</h3>
          <p className="text-sm text-muted-foreground">{labels.description}</p>
        </div>
      </div>

      {visibleMetrics.length === 0 ? (
        <WorkspaceEmpty title={labels.emptySummary ?? labels.chartPlaceholder} />
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {visibleMetrics.map((metric) => {
            const href = metricLinks[metric.id]?.(locale);
            const tile = (
              <WorkspaceMetricCard
                label={metric.label}
                value={metric.value}
                hint={metric.trend}
                className="h-full"
              />
            );

            if (href) {
              return (
                <Link key={metric.id} href={href} className="block">
                  {tile}
                </Link>
              );
            }

            return <div key={metric.id}>{tile}</div>;
          })}
        </div>
      )}
    </WorkspacePanel>
  );
}
