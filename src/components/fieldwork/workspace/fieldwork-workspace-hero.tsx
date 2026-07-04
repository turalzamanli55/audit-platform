import Link from "next/link";
import { EngagementBreadcrumb } from "@/components/engagement";
import { Alert } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { WorkspaceBackLink, WorkspaceHero } from "@/components/workspace";
import type { FieldworkWorkspaceView } from "@/lib/fieldwork/fieldwork-workspace-view";
import type { Dictionary } from "@/i18n/get-dictionary";
import { isProcedureComplete } from "@/lib/fieldwork/fieldwork-rules";

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
        <Alert variant="warning" title={labels.planningGateTitle}>
          {labels.planningGateDescription}
        </Alert>
      ) : null}
      {fieldwork?.isArchived ? (
        <Alert variant="warning" title={labels.archivedTitle}>
          {labels.archivedDescription}
        </Alert>
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
            <Badge variant={statusVariant}>
              {fieldworkLabels.statuses[fieldwork.packageStatus]}
            </Badge>
            <Badge variant="outline">
              {labels.summaryProcedures}: {completeCount}/{fieldwork.procedures.length}
            </Badge>
            <Badge variant="outline">
              {labels.summaryFindings}: {openFindings}
            </Badge>
            {fieldwork.pendingReviewCount > 0 ? (
              <Badge variant="warning">
                {fieldwork.pendingReviewCount} {labels.summaryPendingReview.toLowerCase()}
              </Badge>
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
