import type { EngagementActivityView } from "@/lib/engagement/load-engagement-activity";
import type { EngagementWorkspaceView } from "@/lib/engagement/engagement-workspace-view";
import type { Dictionary } from "@/i18n/get-dictionary";
import { formatDate, formatDateTime } from "@/lib/engagement/format-engagement-workspace";
import { EngagementWorkspaceSectionShell } from "@/components/engagement/workspace/engagement-workspace-section-shell";
import { EngagementWorkspaceMetadataPanel } from "@/components/engagement/workspace/engagement-workspace-metadata-panel";
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
      <EngagementWorkspaceSectionShell
        title={labels.title}
        description={labels.description}
        headingId="engagement-workspace-history"
      >
        <EngagementActivitySummaryCard summary={activity.summary} labels={labels.summary} />
      </EngagementWorkspaceSectionShell>

      <EngagementActivityTimeline
        entries={activity.entries}
        locale={locale}
        labels={labels.timeline}
      />

      <EngagementWorkspaceSectionShell
        title={labels.version.title}
        description={labels.version.description}
        headingId="engagement-history-version"
      >
        <EngagementWorkspaceMetadataPanel
          title={labels.version.cardTitle}
          items={[
            { id: "version", label: labels.version.recordVersion, value: String(engagement.version) },
            {
              id: "created",
              label: labels.version.created,
              value: formatDate(engagement.createdAt, locale),
            },
            {
              id: "updated",
              label: engagementsLabels.columnUpdated,
              value: formatDate(engagement.updatedAt, locale),
            },
            {
              id: "archived",
              label: labels.version.archived,
              value: engagement.deletedAt
                ? formatDateTime(engagement.deletedAt, locale)
                : labels.version.notArchived,
            },
            {
              id: "restored",
              label: labels.version.restored,
              value: labels.version.restoredHint,
            },
          ]}
        />
      </EngagementWorkspaceSectionShell>
    </div>
  );
}
