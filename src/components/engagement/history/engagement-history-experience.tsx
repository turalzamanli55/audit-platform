import type { EngagementActivityView } from "@/lib/engagement/load-engagement-activity";
import type { EngagementWorkspaceView } from "@/lib/engagement/engagement-workspace-view";
import type { Dictionary } from "@/i18n/get-dictionary";
import { formatDate, formatDateTime } from "@/lib/engagement/format-engagement-workspace";
import { CompanyInfoList, CompanyInfoRow } from "@/components/company";
import { WorkspaceCard, WorkspaceSectionShell } from "@/components/workspace";
import { EngagementActivitySummaryCard } from "./engagement-activity-summary";
import { EngagementActivityTimeline } from "./engagement-activity-timeline";

type EngagementHistoryExperienceProps = {
  engagement: EngagementWorkspaceView;
  activity: EngagementActivityView;
  locale: string;
  labels: Dictionary["engagements"]["history"];
  engagementsLabels: Dictionary["engagements"];
};

export function EngagementHistoryExperience({
  engagement,
  activity,
  locale,
  labels,
  engagementsLabels,
}: EngagementHistoryExperienceProps) {
  return (
    <div className="space-y-10">
      <WorkspaceSectionShell
        title={labels.title}
        description={labels.description}
        headingId="engagement-workspace-history"
      >
        <EngagementActivitySummaryCard summary={activity.summary} labels={labels.summary} />
      </WorkspaceSectionShell>

      <EngagementActivityTimeline
        entries={activity.entries}
        locale={locale}
        labels={labels.timeline}
      />

      <WorkspaceSectionShell
        title={labels.version.title}
        description={labels.version.description}
        headingId="engagement-history-version"
      >
        <WorkspaceCard title={labels.version.cardTitle}>
          <CompanyInfoList>
            <CompanyInfoRow label={labels.version.recordVersion} value={String(engagement.version)} />
            <CompanyInfoRow
              label={labels.version.created}
              value={formatDate(engagement.createdAt, locale)}
            />
            <CompanyInfoRow
              label={engagementsLabels.columnUpdated}
              value={formatDate(engagement.updatedAt, locale)}
            />
            <CompanyInfoRow
              label={labels.version.archived}
              value={
                engagement.deletedAt
                  ? formatDateTime(engagement.deletedAt, locale)
                  : labels.version.notArchived
              }
            />
            <CompanyInfoRow label={labels.version.restored} value={labels.version.restoredHint} />
          </CompanyInfoList>
        </WorkspaceCard>
      </WorkspaceSectionShell>
    </div>
  );
}
