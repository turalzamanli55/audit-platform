"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { EngagementListItem } from "@/lib/engagement/engagement-list-item";
import type { EngagementListPageResult, EngagementListQuery } from "@/lib/engagement/apply-list-query";
import { buildEngagementListSearchParams } from "@/lib/engagement/apply-list-query";
import {
  EngagementEmptyState,
  EngagementBreadcrumb,
  EngagementFilterBar,
  EngagementFilterChip,
  EngagementHeader,
  EngagementPageShell,
  EngagementSearch,
  EngagementToolbar,
} from "@/components/engagement";
import type { Dictionary } from "@/i18n/get-dictionary";
import { EngagementListPagination } from "./engagement-list-pagination";
import { EngagementListRow } from "./engagement-list-row";

export type EngagementListLabels = Dictionary["engagements"];

type EngagementListExperienceProps = {
  locale: string;
  labels: EngagementListLabels;
  dashboardLabel: string;
  items: EngagementListItem[];
  pagination: EngagementListPageResult;
  query: EngagementListQuery;
  createHref?: string | null;
};

function formatCount(template: string, count: number): string {
  return template.replace("{count}", String(count));
}

export function EngagementListExperience({
  locale,
  labels,
  dashboardLabel,
  items,
  pagination,
  query,
  createHref,
}: EngagementListExperienceProps) {
  const router = useRouter();
  const listRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headingId = useId();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [focusedIndex, setFocusedIndex] = useState(0);
  const clampedFocus = items.length === 0 ? 0 : Math.min(focusedIndex, items.length - 1);

  const basePath = `/${locale}/app/engagements`;

  const navigateQuery = useCallback(
    (patch: Partial<EngagementListQuery>) => {
      const params = buildEngagementListSearchParams(query, patch);
      const queryString = params.toString();
      router.push(queryString ? `${basePath}?${queryString}` : basePath);
    },
    [basePath, query, router],
  );

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSearchChange = (value: string) => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      navigateQuery({ q: value || undefined, page: 1 });
    }, 300);
  };

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (items.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusedIndex((index) => Math.min(index + 1, items.length - 1));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedIndex((index) => Math.max(index - 1, 0));
    }

    if (event.key === " " && event.target === listRef.current) {
      event.preventDefault();
      const item = items[clampedFocus];
      if (item) {
        toggleSelection(item.id);
      }
    }
  };

  const statusFilters: Array<{ key: EngagementListQuery["status"]; label: string }> = [
    { key: "all", label: labels.filterAll },
    { key: "active", label: labels.filterActive },
    { key: "inactive", label: labels.filterInactive },
    { key: "archived", label: labels.filterArchived },
    { key: "suspended", label: labels.filterSuspended },
  ];

  const lifecycleFilters: Array<{ key: EngagementListQuery["lifecycle"]; label: string }> = [
    { key: "all", label: labels.filterLifecycleAll },
    { key: "draft", label: labels.lifecycleStatuses.draft },
    { key: "planning", label: labels.lifecycleStatuses.planning },
    { key: "fieldwork", label: labels.lifecycleStatuses.fieldwork },
    { key: "review", label: labels.lifecycleStatuses.review },
    { key: "completed", label: labels.lifecycleStatuses.completed },
    { key: "closed", label: labels.lifecycleStatuses.closed },
  ];

  return (
    <EngagementPageShell labelledBy={headingId}>
      <EngagementBreadcrumb
        items={[
          { label: dashboardLabel, href: `/${locale}/app/dashboard` },
          { label: labels.breadcrumbRoot },
        ]}
        className="mb-2"
      />

      <EngagementHeader
        id={headingId}
        eyebrow={labels.breadcrumbRoot}
        title={labels.title}
        description={labels.subtitle}
        meta={
          <p className="text-sm text-muted-foreground">
            {formatCount(labels.results, pagination.total)}
          </p>
        }
        actions={
          createHref ? (
            <Link
              href={createHref}
              className="inline-flex h-11 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {labels.createEngagement}
            </Link>
          ) : null
        }
      />

      <EngagementToolbar
        search={
          <EngagementSearch
            key={query.q ?? "__all__"}
            defaultValue={query.q ?? ""}
            label={labels.search}
            placeholder={labels.search}
            onValueChange={handleSearchChange}
          />
        }
        filters={
          <div className="flex min-w-0 flex-1 flex-col gap-2 xl:flex-row xl:items-center">
            <EngagementFilterBar label={labels.columnStatus}>
              {statusFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => navigateQuery({ status: filter.key, page: 1 })}
                  className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <EngagementFilterChip active={(query.status ?? "all") === filter.key}>
                    {filter.label}
                  </EngagementFilterChip>
                </button>
              ))}
            </EngagementFilterBar>
            <EngagementFilterBar label={labels.columnLifecycle}>
              {lifecycleFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => navigateQuery({ lifecycle: filter.key, page: 1 })}
                  className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <EngagementFilterChip active={(query.lifecycle ?? "all") === filter.key}>
                    {filter.label}
                  </EngagementFilterChip>
                </button>
              ))}
            </EngagementFilterBar>
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="engagement-sort">
              Sort engagements
            </label>
            <select
              id="engagement-sort"
              value={`${query.sort ?? "name"}:${query.order ?? "asc"}`}
              onChange={(event) => {
                const [sort, order] = event.target.value.split(":") as [
                  EngagementListQuery["sort"],
                  EngagementListQuery["order"],
                ];
                navigateQuery({ sort, order, page: 1 });
              }}
              className="h-10 rounded-xl border border-input bg-card px-3 text-sm text-foreground shadow-none focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <option value="name:asc">
                {labels.sortName} · {labels.sortAsc}
              </option>
              <option value="name:desc">
                {labels.sortName} · {labels.sortDesc}
              </option>
              <option value="updated:desc">
                {labels.sortUpdated} · {labels.sortDesc}
              </option>
              <option value="updated:asc">
                {labels.sortUpdated} · {labels.sortAsc}
              </option>
            </select>
          </div>
        }
      />

      {selectedIds.size > 0 ? (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {formatCount(labels.selected, selectedIds.size)}
        </p>
      ) : null}

      {items.length === 0 ? (
        <EngagementEmptyState title={labels.emptyTitle} description={labels.emptyDescription} />
      ) : (
        <div
          ref={listRef}
          role="listbox"
          aria-label={labels.title}
          aria-multiselectable="true"
          tabIndex={0}
          onKeyDown={handleListKeyDown}
          className="space-y-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <div
            className="hidden grid-cols-[auto_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.7fr)_minmax(0,0.6fr)_minmax(0,0.7fr)_auto] gap-4 px-4 text-xs font-medium uppercase tracking-wide text-muted-foreground xl:grid"
            aria-hidden="true"
          >
            <span className="w-8" />
            <span>{labels.columnEngagement}</span>
            <span>{labels.columnClient}</span>
            <span>{labels.columnType}</span>
            <span>{labels.columnLifecycle}</span>
            <span>{labels.columnFramework}</span>
            <span>{labels.columnStatus}</span>
            <span>{labels.columnUpdated}</span>
            <span className="w-10" />
          </div>

          {items.map((item, index) => (
            <EngagementListRow
              key={item.id}
              item={item}
              locale={locale}
              labels={labels}
              selected={selectedIds.has(item.id)}
              focused={clampedFocus === index}
              onToggleSelect={() => toggleSelection(item.id)}
              onFocus={() => setFocusedIndex(index)}
            />
          ))}
        </div>
      )}

      <EngagementListPagination
        basePath={basePath}
        query={query}
        pagination={pagination}
        labels={labels}
      />
    </EngagementPageShell>
  );
}
