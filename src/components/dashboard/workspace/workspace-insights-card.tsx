import Link from "next/link";
import { IconTrendingUp } from "@/components/ui/icons";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import { WorkspacePanel } from "./workspace-section";

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

function trendClass(trend: string): string {
  if (trend.toLowerCase().includes("attention") || trend.toLowerCase().includes("pending")) {
    return "text-warning";
  }
  if (trend.toLowerCase().includes("clear") || trend.toLowerCase().includes("approved")) {
    return "text-success";
  }
  return "text-muted-foreground";
}

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
        <p className="rounded-2xl border border-dashed border-border/60 bg-muted/10 px-4 py-8 text-center text-sm text-muted-foreground">
          {labels.emptySummary ?? labels.chartPlaceholder}
        </p>
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {visibleMetrics.map((metric) => {
            const href = metricLinks[metric.id]?.(locale);
            const tile = (
              <div className="rounded-2xl border border-border/40 bg-background/50 px-4 py-3 transition-colors hover:bg-muted/20">
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <p className="mt-1 text-xl font-semibold tracking-tight">{metric.value}</p>
                <p className={`mt-1 text-xs ${trendClass(metric.trend)}`}>{metric.trend}</p>
              </div>
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
