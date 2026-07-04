import type { PlanningActivityView } from "@/lib/planning/load-planning-activity";
import type { PlanningWorkspaceView } from "@/lib/planning/planning-workspace-view";
import type { Dictionary } from "@/i18n/get-dictionary";
import { formatPlanningActivityAction } from "@/lib/planning/planning-workspace-display";
import { formatDate, formatDateTime } from "@/lib/engagement/format-engagement-workspace";
import { CompanyInfoList, CompanyInfoRow } from "@/components/company";
import {
  WorkspaceCard,
  WorkspaceEmptyPanel,
  WorkspaceList,
  WorkspaceListItem,
  WorkspaceSectionShell,
} from "@/components/workspace";

type PlanningHistoryExperienceProps = {
  plan: PlanningWorkspaceView | null;
  activity: PlanningActivityView;
  locale: string;
  labels: Dictionary["planning"]["history"];
  planningLabels: Dictionary["planning"];
};

export function PlanningHistoryExperience({
  plan,
  activity,
  locale,
  labels,
  planningLabels,
}: PlanningHistoryExperienceProps) {
  return (
    <div className="space-y-10">
      <WorkspaceSectionShell
        title={labels.title}
        description={labels.description}
        headingId="planning-history"
      >
        {activity.entries.length === 0 ? (
          <WorkspaceEmptyPanel title={labels.emptyTitle} description={labels.emptyDescription} />
        ) : (
          <WorkspaceList>
            {activity.entries.map((entry) => (
              <WorkspaceListItem key={entry.id} className="space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {formatPlanningActivityAction(entry.action, labels.actions)}
                  </p>
                  <time className="text-xs text-muted-foreground" dateTime={entry.createdAt}>
                    {formatDateTime(entry.createdAt, locale)}
                  </time>
                </div>
                {entry.summary ? (
                  <p className="text-sm text-muted-foreground">{entry.summary}</p>
                ) : null}
              </WorkspaceListItem>
            ))}
          </WorkspaceList>
        )}
      </WorkspaceSectionShell>

      {plan && plan.revisionHistory.length > 0 ? (
        <WorkspaceSectionShell
          title={labels.revision.title}
          description={labels.revision.description}
          headingId="planning-revision-history"
        >
          <WorkspaceList>
            {plan.revisionHistory.map((entry, index) => (
              <WorkspaceListItem key={`${entry.planVersion}-${index}`} className="space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {labels.revision.entryTitle.replace("{version}", String(entry.planVersion))}
                  </p>
                  <time className="text-xs text-muted-foreground" dateTime={entry.revisedAt}>
                    {formatDateTime(entry.revisedAt, locale)}
                  </time>
                </div>
                <p className="text-sm text-muted-foreground">
                  {planningLabels.statuses[entry.planningStatus]}
                </p>
                {entry.summary ? (
                  <p className="text-sm text-muted-foreground">{entry.summary}</p>
                ) : null}
              </WorkspaceListItem>
            ))}
          </WorkspaceList>
        </WorkspaceSectionShell>
      ) : null}

      {plan ? (
        <WorkspaceSectionShell
          title={labels.version.title}
          description={labels.version.description}
          headingId="planning-history-version"
        >
          <WorkspaceCard title={labels.version.cardTitle}>
            <CompanyInfoList>
              <CompanyInfoRow label={labels.version.recordVersion} value={String(plan.version)} />
              <CompanyInfoRow
                label={labels.version.planVersion}
                value={String(plan.planVersion)}
              />
              <CompanyInfoRow
                label={labels.version.submitted}
                value={
                  plan.submittedAt
                    ? formatDateTime(plan.submittedAt, locale)
                    : labels.version.notSubmitted
                }
              />
              <CompanyInfoRow
                label={labels.version.approved}
                value={
                  plan.approvedAt
                    ? formatDateTime(plan.approvedAt, locale)
                    : labels.version.notApproved
                }
              />
              <CompanyInfoRow
                label={labels.version.created}
                value={formatDate(plan.createdAt, locale)}
              />
              <CompanyInfoRow
                label={labels.version.updated}
                value={formatDate(plan.updatedAt, locale)}
              />
              <CompanyInfoRow
                label={labels.version.archived}
                value={
                  plan.deletedAt
                    ? formatDateTime(plan.deletedAt, locale)
                    : labels.version.notArchived
                }
              />
            </CompanyInfoList>
          </WorkspaceCard>
        </WorkspaceSectionShell>
      ) : null}
    </div>
  );
}
