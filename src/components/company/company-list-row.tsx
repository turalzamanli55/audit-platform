"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { CompanyListItem } from "@/lib/company/company-list-item";
import {
  CompanyArchiveBadge,
  CompanyAvatar,
  CompanyStatusBadge,
} from "@/components/company";
import type { CompanyListLabels } from "./company-list-experience";

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

export function CompanyListRow({
  item,
  locale,
  labels,
  selected,
  focused,
  onToggleSelect,
  onFocus,
}: CompanyListRowProps) {
  const menuId = useId();
  const rowRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const href = `/${locale}/app/companies/${item.slug}`;

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
            {item.isArchived ? <CompanyArchiveBadge /> : <CompanyStatusBadge status={item.status} />}
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
          {item.isArchived ? <CompanyArchiveBadge /> : <CompanyStatusBadge status={item.status} />}
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

          <div className="relative flex items-center gap-1">
            <Link
              href={href}
              className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
            >
              {labels.viewCompany}
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
                  {labels.viewCompany}
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
