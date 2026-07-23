"use client";

import { useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { activityGroupKey, formatRelativeTime } from "@/lib/object-lifecycle/format";

export type ActivityFeedEntry = {
  id: string;
  timestamp: string;
  userLabel: string;
  actionLabel: string;
  objectLabel: string;
  reason?: string | null;
};

type Labels = {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  today: string;
  yesterday: string;
  lastWeek: string;
  lastMonth: string;
  earlier: string;
  user: string;
  action: string;
  object: string;
  reason: string;
};

/**
 * Premium Activity Feed — upgrades existing history UI.
 * Reuses audit-derived entries; no second activity system.
 */
export function ActivityFeed({
  entries,
  locale,
  labels,
}: {
  entries: ActivityFeedEntry[];
  locale: string;
  labels: Labels;
}) {
  const groups = useMemo(() => {
    const map: Record<string, ActivityFeedEntry[]> = {
      today: [],
      yesterday: [],
      lastWeek: [],
      lastMonth: [],
      earlier: [],
    };
    for (const entry of entries) {
      map[activityGroupKey(entry.timestamp)].push(entry);
    }
    return map;
  }, [entries]);

  const order = [
    ["today", labels.today],
    ["yesterday", labels.yesterday],
    ["lastWeek", labels.lastWeek],
    ["lastMonth", labels.lastMonth],
    ["earlier", labels.earlier],
  ] as const;

  if (entries.length === 0) {
    return <EmptyState title={labels.emptyTitle} description={labels.emptyDescription} />;
  }

  return (
    <section className="space-y-6" aria-label={labels.title}>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold tracking-tight">{labels.title}</h3>
        <p className="text-sm text-muted-foreground">{labels.description}</p>
      </div>
      {order.map(([key, title]) => {
        const rows = groups[key];
        if (!rows?.length) return null;
        return (
          <div key={key} className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {title}
            </h4>
            <ol className="space-y-3">
              {rows.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-xl border border-border/60 bg-card px-4 py-3"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-medium text-foreground">{entry.actionLabel}</p>
                      <p className="text-xs text-muted-foreground">
                        {labels.user}: {entry.userLabel} · {labels.object}: {entry.objectLabel}
                      </p>
                      {entry.reason ? (
                        <p className="text-xs text-muted-foreground">
                          {labels.reason}: {entry.reason}
                        </p>
                      ) : null}
                    </div>
                    <time className="shrink-0 text-xs text-muted-foreground">
                      {formatRelativeTime(entry.timestamp, locale)}
                    </time>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </section>
  );
}
