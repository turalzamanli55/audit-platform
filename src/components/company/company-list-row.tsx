"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { CompanyListItem } from "@/lib/company/company-list-item";
import {
  CompanyArchiveBadge,
  CompanyAvatar,
  CompanyStatusBadge,
} from "@/components/company";
import type { CompanyListLabels } from "./company-list-experience";
import { BoundEntityLifecycleMenu } from "@/components/governance/bound-entity-lifecycle-menu";

type CompanyListRowProps = {
  item: CompanyListItem;
  locale: string;
  labels: CompanyListLabels;
  selected: boolean;
  focused: boolean;
  onToggleSelect: () => void;
  onFocus: () => void;
};

function frameworkLabel(framework: string, labels: CompanyListLabels): string {
  switch (framework) {
    case "IFRS":
      return labels.frameworkIfrs;
    case "LOCAL_GAAP":
      return labels.frameworkLocalGaap;
    default:
      return labels.frameworkOther;
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

function statusLabel(status: CompanyListItem["status"], labels: CompanyListLabels): string {
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

export function CompanyListRow({
  item,
  locale,
  labels,
  selected,
  focused,
  onToggleSelect,
  onFocus,
}: CompanyListRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const href = `/${locale}/app/companies/${item.slug}`;
  const editHref = `/${locale}/app/companies/${item.slug}/identity`;
  const historyHref = `/${locale}/app/companies/${item.slug}/history`;

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
      <div className="flex flex-col gap-4 p-4 lg:grid lg:grid-cols-[auto_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_minmax(0,0.6fr)_minmax(0,0.7fr)_auto] lg:items-center lg:gap-4">
        <div className="flex items-center gap-3 lg:contents">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            onClick={(event) => event.stopPropagation()}
            aria-label={`${labels.columnCompany}: ${item.name}`}
            className="h-4 w-4 rounded border-input text-primary focus-visible:ring-2 focus-visible:ring-ring"
          />
          <CompanyAvatar name={item.name} size="md" className="lg:col-start-1" />
          <div className="min-w-0 flex-1 lg:col-start-2">
            <Link
              href={href}
              className="block rounded-lg font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="line-clamp-1">{item.name}</span>
            </Link>
            <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground lg:hidden">
              {item.legalName}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2 lg:hidden">
            {item.isArchived ? (
              <CompanyArchiveBadge label={labels.filterArchived} />
            ) : (
              <CompanyStatusBadge status={item.status} label={statusLabel(item.status, labels)} />
            )}
          </div>
        </div>

        <p className="hidden line-clamp-1 text-sm text-muted-foreground lg:col-start-3 lg:block">
          {item.legalName}
        </p>
        <p className="hidden text-sm text-foreground lg:col-start-4 lg:block">{item.jurisdiction}</p>
        <p className="hidden text-sm text-foreground lg:col-start-5 lg:block">
          {frameworkLabel(item.reportingFramework, labels)}
        </p>
        <div className="hidden lg:col-start-6 lg:block">
          {item.isArchived ? (
            <CompanyArchiveBadge label={labels.filterArchived} />
          ) : (
            <CompanyStatusBadge status={item.status} label={statusLabel(item.status, labels)} />
          )}
        </div>
        <p className="hidden text-sm text-muted-foreground lg:col-start-7 lg:block">
          <span className="sr-only">{labels.updated}: </span>
          {formatUpdatedAt(item.updatedAt, locale)}
        </p>

        <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-3 lg:col-start-8 lg:block lg:border-0 lg:pt-0">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground lg:hidden">
            <span>{item.jurisdiction}</span>
            <span>{frameworkLabel(item.reportingFramework, labels)}</span>
            <span>{formatUpdatedAt(item.updatedAt, locale)}</span>
          </div>

          <div className="relative flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Link
              href={href}
              className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
            >
              {labels.viewCompany}
            </Link>
            <BoundEntityLifecycleMenu
              objectType="company"
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
