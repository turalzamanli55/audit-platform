"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
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

type EngagementListRowProps = {
  item: EngagementListItem;
  locale: string;
  labels: EngagementListLabels;
  selected: boolean;
  focused: boolean;
  onToggleSelect: () => void;
  onFocus: () => void;
};

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
  const menuId = useId();
  const rowRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const href = `/${locale}/app/engagements/${item.slug}`;

  useEffect(() => {
    if (focused) {
      rowRef.current?.scrollIntoView({ block: "nearest" });
    }
  }, [focused]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rowRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  return (
    <div
      ref={rowRef}
      role="option"
      aria-selected={selected}
      data-focused={focused}
      onMouseEnter={onFocus}
      onContextMenu={(event) => {
        event.preventDefault();
        setMenuOpen(true);
      }}
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
              <EngagementArchiveBadge />
            ) : (
              <EngagementStatusBadge status={item.status} />
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
            <EngagementArchiveBadge />
          ) : (
            <EngagementStatusBadge status={item.status} />
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

          <div className="relative flex items-center gap-1">
            <Link
              href={href}
              className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
            >
              {labels.viewEngagement}
            </Link>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={(event) => {
                event.stopPropagation();
                setMenuOpen((open) => !open);
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="sr-only">{labels.openMenu}</span>
              <MoreIcon />
            </button>

            {menuOpen ? (
              <div
                id={menuId}
                role="menu"
                aria-label={labels.quickActions}
                className="absolute right-0 top-full z-20 mt-2 min-w-[10rem] rounded-xl border border-border/60 bg-card p-1 shadow-lg"
              >
                <Link
                  href={href}
                  role="menuitem"
                  className="block rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setMenuOpen(false)}
                >
                  {labels.viewEngagement}
                </Link>
              </div>
            ) : null}
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
