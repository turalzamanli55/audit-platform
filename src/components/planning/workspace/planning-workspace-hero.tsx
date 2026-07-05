import { EngagementBreadcrumb } from "@/components/engagement";
import {
  WorkspaceBackLink,
  WorkspaceHero,
  WorkspaceNoticeBanner,
  WorkspaceStatusBadge,
} from "@/components/workspace";
import type { PlanningWorkspaceView } from "@/lib/planning/planning-workspace-view";
import type { Dictionary } from "@/i18n/get-dictionary";

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
    <WorkspaceHero
      breadcrumb={
        <EngagementBreadcrumb
          items={[
            { label: engagementsLabels.breadcrumbRoot, href: engagementsPath },
            { label: engagementName, href: engagementPath },
            { label: labels.breadcrumbPlanning },
          ]}
        />
      }
      alerts={
        plan?.isArchived ? (
          <WorkspaceNoticeBanner
            title={labels.archivedTitle}
            description={labels.archivedDescription}
          />
        ) : null
      }
      eyebrow={labels.heroEyebrow}
      title={engagementName}
      subtitle={
        plan
          ? `${labels.summaryVersion} ${plan.planVersion}${
              plan.financialReportingFramework?.trim()
                ? ` · ${plan.financialReportingFramework.trim()}`
                : ""
            }`
          : planningLabels.empty.description
      }
      badges={
        plan ? (
          <>
            <WorkspaceStatusBadge
              label={planningLabels.statuses[plan.planningStatus]}
              variant={statusVariant}
            />
            {plan.isLocked ? (
              <WorkspaceStatusBadge
                label={planningLabels.workflow.lockedBadge}
                variant="outline"
              />
            ) : null}
            <WorkspaceStatusBadge
              label={`${labels.status.checklistProgress}: ${plan.checklistProgress}%`}
              variant="outline"
            />
            <WorkspaceStatusBadge
              label={`${labels.status.kpiProgress}: ${plan.kpiProgress}%`}
              variant="outline"
            />
          </>
        ) : undefined
      }
      progress={plan ? { label: labels.status.progressLabel, value: plan.kpiProgress } : undefined}
      action={<WorkspaceBackLink href={engagementPath} label={labels.backToEngagement} />}
    />
  );
}
