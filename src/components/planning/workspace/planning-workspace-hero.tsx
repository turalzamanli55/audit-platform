import Link from "next/link";
import { EngagementBreadcrumb } from "@/components/engagement";
import { Badge } from "@/components/ui/badge";
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

  const statusVariant =
    plan?.planningStatus === "approved"
      ? "success"
      : plan?.planningStatus === "pending_review"
        ? "warning"
        : plan?.planningStatus === "returned"
          ? "destructive"
          : "secondary";

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

      <div className="flex flex-col gap-6 border-b border-border/50 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {labels.heroEyebrow}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-[2rem] lg:leading-tight">
              {engagementName}
            </h1>
            {plan ? (
              <p className="text-sm text-muted-foreground">
                {labels.summaryVersion} {plan.planVersion}
                {plan.financialReportingFramework?.trim()
                  ? ` · ${plan.financialReportingFramework.trim()}`
                  : ""}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">{planningLabels.empty.description}</p>
            )}
          </div>

          {plan ? (
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={statusVariant}>{planningLabels.statuses[plan.planningStatus]}</Badge>
              {plan.isLocked ? (
                <Badge variant="outline">{planningLabels.workflow.lockedBadge}</Badge>
              ) : null}
              <Badge variant="outline">
                {labels.status.checklistProgress}: {plan.checklistProgress}%
              </Badge>
              <Badge variant="outline">
                {labels.status.kpiProgress}: {plan.kpiProgress}%
              </Badge>
            </div>
          ) : null}

          {plan ? (
            <div className="max-w-md space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{labels.status.progressLabel}</span>
                <span className="font-medium tabular-nums text-foreground">{plan.kpiProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${plan.kpiProgress}%` }}
                  role="progressbar"
                  aria-valuenow={plan.kpiProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          ) : null}
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
