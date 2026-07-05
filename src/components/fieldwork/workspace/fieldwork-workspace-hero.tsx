import Link from "next/link";
import { EngagementBreadcrumb } from "@/components/engagement";
import {
  WorkspaceBackLink,
  WorkspaceHero,
  WorkspaceNoticeBanner,
  WorkspaceStatusBadge,
} from "@/components/workspace";
import type { FieldworkWorkspaceView } from "@/lib/fieldwork/fieldwork-workspace-view";
import type { Dictionary } from "@/i18n/get-dictionary";
import { isProcedureComplete } from "@/lib/fieldwork/fieldwork-rules";
import { formatFieldworkCount } from "@/lib/fieldwork/fieldwork-workspace-display";

type FieldworkWorkspaceHeroProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  fieldwork: FieldworkWorkspaceView | null;
  planningApproved: boolean;
  labels: Dictionary["fieldwork"]["workspace"];
  engagementsLabels: Dictionary["engagements"];
  fieldworkLabels: Dictionary["fieldwork"];
};

export function FieldworkWorkspaceHero({
  locale,
  engagementSlug,
  engagementName,
  fieldwork,
  planningApproved,
  labels,
  engagementsLabels,
  fieldworkLabels,
}: FieldworkWorkspaceHeroProps) {
  const engagementsPath = `/${locale}/app/engagements`;
  const engagementPath = `${engagementsPath}/${engagementSlug}`;

  const completeCount = fieldwork
    ? fieldwork.procedures.filter((p) => isProcedureComplete(p.procedureStatus)).length
    : 0;
  const openFindings = fieldwork
    ? fieldwork.findings.filter((f) => f.findingStatus === "open").length
    : 0;

  const statusVariant =
    fieldwork?.packageStatus === "substantially_complete"
      ? "success"
      : fieldwork?.pendingReviewCount
        ? "warning"
        : "secondary";

  const alerts = (
    <>
      {!planningApproved ? (
        <WorkspaceNoticeBanner
          title={labels.planningGateTitle}
          description={labels.planningGateDescription}
        />
      ) : null}
      {fieldwork?.isArchived ? (
        <WorkspaceNoticeBanner
          title={labels.archivedTitle}
          description={labels.archivedDescription}
        />
      ) : null}
    </>
  );

  return (
    <WorkspaceHero
      breadcrumb={
        <EngagementBreadcrumb
          items={[
            { label: engagementsLabels.breadcrumbRoot, href: engagementsPath },
            { label: engagementName, href: engagementPath },
            { label: labels.breadcrumbFieldwork },
          ]}
        />
      }
      alerts={alerts}
      eyebrow={labels.heroEyebrow}
      title={engagementName}
      subtitle={
        fieldwork
          ? `${labels.summaryVersion} ${fieldwork.programVersion}`
          : fieldworkLabels.empty.description
      }
      badges={
        fieldwork ? (
          <>
            <WorkspaceStatusBadge
              label={fieldworkLabels.statuses[fieldwork.packageStatus]}
              variant={statusVariant}
            />
            <WorkspaceStatusBadge
              label={`${labels.summaryProcedures}: ${completeCount}/${fieldwork.procedures.length}`}
              variant="outline"
            />
            <WorkspaceStatusBadge
              label={`${labels.summaryFindings}: ${openFindings}`}
              variant="outline"
            />
            {fieldwork.pendingReviewCount > 0 ? (
              <WorkspaceStatusBadge
                label={formatFieldworkCount(
                  labels.summaryPendingReviewBadge,
                  fieldwork.pendingReviewCount,
                )}
                variant="warning"
              />
            ) : null}
          </>
        ) : undefined
      }
      progress={
        fieldwork ? { label: labels.summaryProgress, value: fieldwork.progressPct } : undefined
      }
      action={<WorkspaceBackLink href={engagementPath} label={labels.backToEngagement} />}
    />
  );
}
