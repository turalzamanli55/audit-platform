import type { PlanningActivityView } from "@/lib/planning/load-planning-activity";
import type { PlanningWorkspaceView } from "@/lib/planning/planning-workspace-view";
import type { Dictionary } from "@/i18n/get-dictionary";
import { formatPlanningActivityAction } from "@/lib/planning/planning-workspace-display";
import { formatDate, formatDateTime } from "@/lib/engagement/format-engagement-workspace";
import { PlanningWorkspaceSectionShell } from "@/components/planning/workspace/planning-workspace-section-shell";
import { EngagementWorkspaceMetadataPanel } from "@/components/engagement/workspace/engagement-workspace-metadata-panel";

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
      <PlanningWorkspaceSectionShell
        title={labels.title}
        description={labels.description}
        headingId="planning-history"
      >
        {activity.entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 px-6 py-10 text-center">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {labels.emptyTitle}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {labels.emptyDescription}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/80">
            <ul className="divide-y divide-border/40">
              {activity.entries.map((entry) => (
                <li key={entry.id} className="space-y-1 px-5 py-4">
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
                </li>
              ))}
            </ul>
          </div>
        )}
      </PlanningWorkspaceSectionShell>

      {plan && plan.revisionHistory.length > 0 ? (
        <PlanningWorkspaceSectionShell
          title={labels.revision.title}
          description={labels.revision.description}
          headingId="planning-revision-history"
        >
          <ul className="divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">
            {plan.revisionHistory.map((entry, index) => (
              <li key={`${entry.planVersion}-${index}`} className="space-y-1 px-5 py-4">
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
              </li>
            ))}
          </ul>
        </PlanningWorkspaceSectionShell>
      ) : null}

      {plan ? (
        <PlanningWorkspaceSectionShell
          title={labels.version.title}
          description={labels.version.description}
          headingId="planning-history-version"
        >
          <EngagementWorkspaceMetadataPanel
            title={labels.version.cardTitle}
            items={[
              { id: "version", label: labels.version.recordVersion, value: String(plan.version) },
              {
                id: "plan-version",
                label: labels.version.planVersion,
                value: String(plan.planVersion),
              },
              {
                id: "submitted",
                label: labels.version.submitted,
                value: plan.submittedAt
                  ? formatDateTime(plan.submittedAt, locale)
                  : labels.version.notSubmitted,
              },
              {
                id: "approved",
                label: labels.version.approved,
                value: plan.approvedAt
                  ? formatDateTime(plan.approvedAt, locale)
                  : labels.version.notApproved,
              },
              {
                id: "created",
                label: labels.version.created,
                value: formatDate(plan.createdAt, locale),
              },
              {
                id: "updated",
                label: labels.version.updated,
                value: formatDate(plan.updatedAt, locale),
              },
              {
                id: "archived",
                label: labels.version.archived,
                value: plan.deletedAt
                  ? formatDateTime(plan.deletedAt, locale)
                  : labels.version.notArchived,
              },
            ]}
          />
        </PlanningWorkspaceSectionShell>
      ) : null}
    </div>
  );
}
