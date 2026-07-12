"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type {
  AiWorkspaceConversationMeta,
  AiWorkspaceHistoryBucket,
  AiWorkspaceLabels,
} from "@/components/ai/types";
import { AiEmptyState } from "@/components/ai/empty/empty-states";
import { AiPanelLoading } from "@/components/ai/loading/skeletons";
import { aiWorkspaceTokens } from "@/components/ai/shared/ai-tokens";
import { cn } from "@/lib/ui/cn";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function bucketConversation(
  conversation: AiWorkspaceConversationMeta,
  now = new Date(),
): AiWorkspaceHistoryBucket {
  if (conversation.favorite) return "favorites";
  const updated = startOfDay(new Date(conversation.updatedAt));
  const today = startOfDay(now);
  const dayMs = 86_400_000;
  if (updated === today) return "today";
  if (updated === today - dayMs) return "yesterday";
  if (updated > today - 7 * dayMs) return "thisWeek";
  return "older";
}

const BUCKET_ORDER: AiWorkspaceHistoryBucket[] = [
  "favorites",
  "today",
  "yesterday",
  "thisWeek",
  "older",
];

export function AiConversationHistory({
  labels,
  conversations,
  activeId,
  loading,
  onSelect,
  onCreate,
  onPin,
  onFavorite,
  onRename,
  onArchive,
  onDelete,
}: {
  labels: AiWorkspaceLabels;
  conversations: AiWorkspaceConversationMeta[];
  activeId: string | null;
  loading?: boolean;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onPin: (id: string) => void;
  onFavorite: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const filtered = conversations
      .filter((item) => !item.archived)
      .filter((item) => item.title.toLowerCase().includes(query.trim().toLowerCase()));
    const map = new Map<AiWorkspaceHistoryBucket, AiWorkspaceConversationMeta[]>();
    for (const bucket of BUCKET_ORDER) map.set(bucket, []);
    for (const item of filtered) {
      const bucket = bucketConversation(item);
      map.get(bucket)?.push(item);
    }
    for (const list of map.values()) {
      list.sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return b.updatedAt.localeCompare(a.updatedAt);
      });
    }
    return map;
  }, [conversations, query]);

  const bucketLabel: Record<AiWorkspaceHistoryBucket, string> = {
    favorites: labels.history.favorites,
    today: labels.history.today,
    yesterday: labels.history.yesterday,
    thisWeek: labels.history.thisWeek,
    older: labels.history.older,
  };

  if (loading) return <AiPanelLoading label={labels.loading.history} />;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-3 border-b border-border/40 p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className={aiWorkspaceTokens.panelTitle.replace("px-4 py-3 ", "")}>{labels.history.title}</h2>
          <Button type="button" size="sm" variant="outline" onClick={onCreate}>
            {labels.history.newConversation}
          </Button>
        </div>
        <label className="sr-only" htmlFor="ai-history-search">
          {labels.history.search}
        </label>
        <input
          id="ai-history-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={labels.history.search}
          className="h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {conversations.filter((item) => !item.archived).length === 0 ? (
          <AiEmptyState title={labels.history.empty} />
        ) : (
          BUCKET_ORDER.map((bucket) => {
            const items = grouped.get(bucket) ?? [];
            if (items.length === 0) return null;
            return (
              <div key={bucket} className="mb-4">
                <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {bucketLabel[bucket]}
                </p>
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item.id}>
                      <div
                        className={cn(
                          "group rounded-xl border px-2.5 py-2 transition-colors",
                          activeId === item.id
                            ? "border-primary/30 bg-primary/5"
                            : "border-transparent hover:border-border/50 hover:bg-card/80",
                        )}
                      >
                        <button
                          type="button"
                          className="w-full truncate text-left text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          onClick={() => onSelect(item.id)}
                        >
                          {item.pinned ? "📌 " : ""}
                          {item.title}
                        </button>
                        <div className="mt-1.5 flex flex-wrap gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                          <HistoryAction
                            label={item.pinned ? labels.history.unpin : labels.history.pin}
                            onClick={() => onPin(item.id)}
                          />
                          <HistoryAction
                            label={item.favorite ? labels.history.unfavorite : labels.history.favorite}
                            onClick={() => onFavorite(item.id)}
                          />
                          <HistoryAction
                            label={labels.history.rename}
                            onClick={() => {
                              const next = window.prompt(labels.history.rename, item.title);
                              if (next?.trim()) onRename(item.id, next.trim());
                            }}
                          />
                          <HistoryAction label={labels.history.archive} onClick={() => onArchive(item.id)} />
                          <HistoryAction label={labels.history.delete} onClick={() => onDelete(item.id)} />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function HistoryAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="rounded-md px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
