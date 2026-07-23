import type { TimelineEvent } from "@/lib/platform-console/detail-data";
import { EmptyState } from "@/components/ui/empty-state";
import { activityGroupKey, formatRelativeTime } from "@/lib/object-lifecycle/format";

function dotClass(severity: string): string {
  if (severity === "critical") return "bg-destructive";
  if (severity === "warning") return "bg-amber-500";
  return "bg-primary/60";
}

/** Chronological event timeline used across company / user / license views. */
export function Timeline({
  events,
  empty,
  emptyTitle,
  locale = "en",
  groupLabels,
}: {
  events: TimelineEvent[];
  empty?: string;
  emptyTitle?: string;
  locale?: string;
  groupLabels?: {
    today: string;
    yesterday: string;
    lastWeek: string;
    lastMonth: string;
    earlier: string;
  };
}) {
  if (events.length === 0) {
    return (
      <EmptyState
        title={emptyTitle ?? "No events"}
        description={empty ?? "No activity has been recorded yet."}
      />
    );
  }

  const labels = groupLabels ?? {
    today: "Today",
    yesterday: "Yesterday",
    lastWeek: "Last week",
    lastMonth: "Last month",
    earlier: "Earlier",
  };

  const groups: Record<string, TimelineEvent[]> = {
    today: [],
    yesterday: [],
    lastWeek: [],
    lastMonth: [],
    earlier: [],
  };
  for (const event of events) {
    groups[activityGroupKey(event.timestamp)].push(event);
  }

  const order = [
    ["today", labels.today],
    ["yesterday", labels.yesterday],
    ["lastWeek", labels.lastWeek],
    ["lastMonth", labels.lastMonth],
    ["earlier", labels.earlier],
  ] as const;

  return (
    <div className="space-y-6">
      {order.map(([key, title]) => {
        const rows = groups[key];
        if (!rows.length) return null;
        return (
          <div key={key} className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h4>
            <ol className="relative space-y-4 border-l border-border/60 pl-6">
              {rows.map((event) => (
                <li key={event.id} className="relative">
                  <span
                    className={`absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full ${dotClass(event.severity)}`}
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    <time className="text-xs text-muted-foreground">
                      {formatRelativeTime(event.timestamp, locale)}
                    </time>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="uppercase tracking-wide">{event.category}</span>
                    {event.detail ? ` · ${event.detail}` : ""}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}
