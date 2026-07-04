import { WorkspaceEmpty, WorkspacePanel } from "@/components/workspace";
import { AUDIT_ACTIONS } from "@/lib/audit/constants";
import type { CompanyActivityEntry } from "@/lib/company/load-company-activity";
import { formatDateTime } from "@/lib/company/format-company-workspace";

type CompanyActivityTimelineProps = {
  entries: CompanyActivityEntry[];
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

function actionLabel(action: string, labels: CompanyActivityTimelineProps["labels"]): string {
  return labels.actions[action] ?? action;
}

function metadataDetail(
  entry: CompanyActivityEntry,
  labels: CompanyActivityTimelineProps["labels"],
): string | null {
  const reason =
    typeof entry.metadata.archiveReason === "string"
      ? entry.metadata.archiveReason
      : typeof entry.metadata.restoreReason === "string"
        ? entry.metadata.restoreReason
        : null;

  if (reason) {
    return entry.action === AUDIT_ACTIONS.COMPANY_ARCHIVED
      ? `${labels.reasonArchive}: ${reason}`
      : `${labels.reasonRestore}: ${reason}`;
  }

  const fields = entry.metadata.fields;
  if (Array.isArray(fields) && fields.length > 0) {
    return `${labels.fieldsChanged}: ${fields.join(", ")}`;
  }

  return null;
}

export function CompanyActivityTimeline({
  entries,
  locale,
  labels,
}: CompanyActivityTimelineProps) {
  if (entries.length === 0) {
    return (
      <section className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">{labels.title}</h3>
          <p className="text-sm text-muted-foreground">{labels.description}</p>
        </div>
        <WorkspaceEmpty title={labels.emptyTitle} description={labels.emptyDescription} />
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
            <li key={entry.id}>
              <WorkspacePanel padding="sm" className="px-4 py-4 sm:px-5">
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
              </WorkspacePanel>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
