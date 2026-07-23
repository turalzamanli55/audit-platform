"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { EngagementListItem } from "@/lib/engagement/engagement-list-item";
import {
  EngagementArchiveBadge,
  EngagementLifecycleBadge,
  EngagementStatusBadge,
} from "@/components/engagement";
import {
  formatEngagementTypeLabel,
  formatFrameworkLabel,
  formatLifecycleStatusLabel,
} from "@/lib/engagement/format-engagement-workspace";
import type { EngagementListLabels } from "./engagement-list-experience";
import { BoundEntityLifecycleMenu } from "@/components/governance/bound-entity-lifecycle-menu";

type EngagementListRowProps = {
  item: EngagementListItem;
  locale: string;
  labels: EngagementListLabels;
  selected: boolean;
  focused: boolean;
  onToggleSelect: () => void;
  onFocus: () => void;
};

function statusLabel(status: EngagementListItem["status"], labels: EngagementListLabels): string {
  switch (status) {
    case "active":
      return labels.filterActive;
    case "inactive":
      return labels.filterInactive;
    case "archived":
      return labels.filterArchived;
    case "suspended":
      return labels.filterSuspended;
    default:
      return status;
  }
}

function formatUpdatedAt(value: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function EngagementAvatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <span
      aria-hidden="true"
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary"
    >
      {initial}
    </span>
  );
}

export function EngagementListRow({
  item,
  locale,
  labels,
  selected,
  focused,
  onToggleSelect,
  onFocus,
}: EngagementListRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const href = `/${locale}/app/engagements/${item.slug}`;
  const editHref = `/${locale}/app/engagements/${item.slug}/settings`;
  const historyHref = `/${locale}/app/engagements/${item.slug}/history`;

  useEffect(() => {
    if (focused) {
      rowRef.current?.scrollIntoView({ block: "nearest" });
    }
  }, [focused]);

  return (
    <div
      ref={rowRef}
      role="option"
      aria-selected={selected}
      data-focused={focused}
      onMouseEnter={onFocus}
      className={`group relative rounded-2xl border bg-card transition-all duration-200 ${
        selected
          ? "border-primary/30 bg-accent/20 shadow-sm"
          : "border-border/50 hover:-translate-y-px hover:border-border hover:shadow-md"
      } ${focused ? "ring-2 ring-ring/30" : ""}`}
    >
      <div className="flex flex-col gap-4 p-4 xl:grid xl:grid-cols-[auto_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.7fr)_minmax(0,0.6fr)_minmax(0,0.7fr)_auto] xl:items-center xl:gap-4">
        <div className="flex items-center gap-3 xl:contents">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            onClick={(event) => event.stopPropagation()}
            aria-label={`${labels.columnEngagement}: ${item.name}`}
            className="h-4 w-4 rounded border-input text-primary focus-visible:ring-2 focus-visible:ring-ring"
          />
          <EngagementAvatar name={item.name} />
          <div className="min-w-0 flex-1 xl:col-start-2">
            <Link
              href={href}
              className="block rounded-lg font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="line-clamp-1">{item.name}</span>
            </Link>
            <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground xl:hidden">
              {item.companyName}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2 xl:hidden">
            {item.isArchived ? (
              <EngagementArchiveBadge label={labels.filterArchived} />
            ) : (
              <EngagementStatusBadge
                status={item.status}
                label={statusLabel(item.status, labels)}
              />
            )}
          </div>
        </div>

        <p className="hidden line-clamp-1 text-sm text-muted-foreground xl:col-start-3 xl:block">
          {item.companyName}
        </p>
        <p className="hidden text-sm text-foreground xl:col-start-4 xl:block">
          {formatEngagementTypeLabel(item.engagementType, labels.create.engagementTypes)}
        </p>
        <div className="hidden xl:col-start-5 xl:block">
          <EngagementLifecycleBadge
            status={item.lifecycleStatus}
            label={formatLifecycleStatusLabel(item.lifecycleStatus, labels.lifecycleStatuses)}
          />
        </div>
        <p className="hidden text-sm text-foreground xl:col-start-6 xl:block">
          {formatFrameworkLabel(item.reportingFramework, labels)}
        </p>
        <div className="hidden xl:col-start-7 xl:block">
          {item.isArchived ? (
            <EngagementArchiveBadge label={labels.filterArchived} />
          ) : (
            <EngagementStatusBadge
              status={item.status}
              label={statusLabel(item.status, labels)}
            />
          )}
        </div>
        <p className="hidden text-sm text-muted-foreground xl:col-start-8 xl:block">
          <span className="sr-only">{labels.updated}: </span>
          {formatUpdatedAt(item.updatedAt, locale)}
        </p>

        <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-3 xl:col-start-9 xl:block xl:border-0 xl:pt-0">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground xl:hidden">
            <span>{formatEngagementTypeLabel(item.engagementType, labels.create.engagementTypes)}</span>
            <span>{formatFrameworkLabel(item.reportingFramework, labels)}</span>
            <span>{formatUpdatedAt(item.updatedAt, locale)}</span>
          </div>

          <div className="relative flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Link
              href={href}
              className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
            >
              {labels.viewEngagement}
            </Link>
            <BoundEntityLifecycleMenu
              objectType="engagement"
              actor="tenant"
              target={{ id: item.id, version: item.version, slug: item.slug, name: item.name }}
              state={{ isArchived: item.isArchived, isSoftDeleted: item.isArchived }}
              hrefs={{ edit: editHref, history: historyHref }}
              trigger={
                <button
                  type="button"
                  aria-label={labels.openMenu}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <MoreIcon />
                </button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="3.5" r="1" fill="currentColor" />
      <circle cx="8" cy="8" r="1" fill="currentColor" />
      <circle cx="8" cy="12.5" r="1" fill="currentColor" />
    </svg>
  );
}
