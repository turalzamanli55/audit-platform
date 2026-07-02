import Link from "next/link";
import { EngagementBreadcrumb } from "@/components/engagement";
import type { PlanningWorkspaceView } from "@/lib/planning/planning-workspace-view";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Alert } from "@/components/ui";

type PlanningWorkspaceHeroProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  plan: PlanningWorkspaceView | null;
  labels: Dictionary["planning"]["workspace"];
  engagementsLabels: Dictionary["engagements"];
  planningLabels: Dictionary["planning"];
};

export function PlanningWorkspaceHero({
  locale,
  engagementSlug,
  engagementName,
  plan,
  labels,
  engagementsLabels,
  planningLabels,
}: PlanningWorkspaceHeroProps) {
  const engagementsPath = `/${locale}/app/engagements`;
  const engagementPath = `${engagementsPath}/${engagementSlug}`;

  return (
    <div className="space-y-6">
      <EngagementBreadcrumb
        items={[
          { label: engagementsLabels.breadcrumbRoot, href: engagementsPath },
          { label: engagementName, href: engagementPath },
          { label: labels.breadcrumbPlanning },
        ]}
      />

      {plan?.isArchived ? (
        <Alert variant="warning" title={labels.archivedTitle}>
          {labels.archivedDescription}
        </Alert>
      ) : null}

      <div className="flex flex-col gap-4 border-b border-border/50 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {labels.heroEyebrow}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {engagementName}
          </h1>
          {plan ? (
            <p className="text-sm text-muted-foreground">
              {planningLabels.statuses[plan.planningStatus]} · {labels.summaryVersion}{" "}
              {plan.planVersion}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">{planningLabels.empty.description}</p>
          )}
        </div>
        <Link
          href={engagementPath}
          className="inline-flex h-10 shrink-0 items-center rounded-xl border border-border/60 bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {labels.backToEngagement}
        </Link>
      </div>
    </div>
  );
}
