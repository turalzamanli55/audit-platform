import { AUDIT_ACTIONS } from "@/lib/audit/constants";
import type { EngagementActivityEntry } from "@/lib/engagement/load-engagement-activity";
import { formatDateTime } from "@/lib/engagement/format-engagement-workspace";

type EngagementActivityTimelineProps = {
  entries: EngagementActivityEntry[];
  locale: string;
  labels: {
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
    actions: Record<string, string>;
    reasonArchive: string;
    reasonRestore: string;
    fieldsChanged: string;
  };
};

function actionLabel(action: string, labels: EngagementActivityTimelineProps["labels"]): string {
  return labels.actions[action] ?? action;
}

function metadataDetail(
  entry: EngagementActivityEntry,
  labels: EngagementActivityTimelineProps["labels"],
): string | null {
  const reason =
    typeof entry.metadata.archiveReason === "string"
      ? entry.metadata.archiveReason
      : typeof entry.metadata.restoreReason === "string"
        ? entry.metadata.restoreReason
        : null;

  if (reason) {
    return entry.action === AUDIT_ACTIONS.ENGAGEMENT_ARCHIVED
      ? `${labels.reasonArchive}: ${reason}`
      : `${labels.reasonRestore}: ${reason}`;
  }

  const fields = entry.metadata.fields;
  if (Array.isArray(fields) && fields.length > 0) {
    return `${labels.fieldsChanged}: ${fields.join(", ")}`;
  }

  return entry.summary;
}

export function EngagementActivityTimeline({
  entries,
  locale,
  labels,
}: EngagementActivityTimelineProps) {
  if (entries.length === 0) {
    return (
      <section className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">{labels.title}</h3>
          <p className="text-sm text-muted-foreground">{labels.description}</p>
        </div>
        <div className="rounded-2xl border border-dashed border-border/70 bg-muted/15 px-6 py-10 text-center">
          <p className="text-sm font-medium text-foreground">{labels.emptyTitle}</p>
          <p className="mt-2 text-sm text-muted-foreground">{labels.emptyDescription}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4" aria-label={labels.title}>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">{labels.title}</h3>
        <p className="text-sm text-muted-foreground">{labels.description}</p>
      </div>
      <ol className="space-y-3">
        {entries.map((entry) => {
          const detail = metadataDetail(entry, labels);
          return (
            <li
              key={entry.id}
              className="rounded-2xl border border-border/50 bg-card/80 px-4 py-4 shadow-xs sm:px-5"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {actionLabel(entry.action, labels)}
                  </p>
                  {detail ? (
                    <p className="text-sm leading-relaxed text-muted-foreground">{detail}</p>
                  ) : null}
                </div>
                <time
                  dateTime={entry.createdAt}
                  className="shrink-0 text-xs text-muted-foreground sm:text-sm"
                >
                  {formatDateTime(entry.createdAt, locale)}
                </time>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
