"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useCommonLabels } from "@/i18n/use-common-labels";

export type EngagementBreadcrumbItem = {
  label: ReactNode;
  href?: string;
};

type EngagementBreadcrumbProps = {
  items: EngagementBreadcrumbItem[];
  className?: string;
};

function BreadcrumbSeparator() {
  return (
    <span aria-hidden="true" className="select-none text-muted-foreground/50">
      /
    </span>
  );
}

export function EngagementBreadcrumb({ items, className = "" }: EngagementBreadcrumbProps) {
  const { breadcrumbLabel, backTo } = useCommonLabels();

  if (items.length === 0) {
    return null;
  }

  const current = items[items.length - 1];
  const ancestors = items.slice(0, -1);
  const backHref = ancestors.length > 0 ? ancestors[ancestors.length - 1]?.href : undefined;

  return (
    <nav aria-label={breadcrumbLabel} className={className}>
      <div className="flex min-w-0 items-center gap-2 sm:hidden">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeftIcon />
            <span className="sr-only">{backTo} </span>
            <span className="truncate">{ancestors[ancestors.length - 1]?.label}</span>
          </Link>
        ) : null}
        <span aria-current="page" className="truncate text-sm font-medium text-foreground">
          {current?.label}
        </span>
      </div>

      <ol className="hidden flex-wrap items-center gap-2 text-sm sm:flex">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex min-w-0 items-center gap-2">
              {index > 0 ? <BreadcrumbSeparator /> : null}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={`truncate ${isLast ? "font-medium text-foreground" : "text-muted-foreground"}`}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="truncate text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
