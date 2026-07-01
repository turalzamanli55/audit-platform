"use client";

import Link from "next/link";
import type { EngagementListPageResult, EngagementListQuery } from "@/lib/engagement/apply-list-query";
import { buildEngagementListSearchParams } from "@/lib/engagement/apply-list-query";
import type { EngagementListLabels } from "./engagement-list-experience";

type EngagementListPaginationProps = {
  basePath: string;
  query: EngagementListQuery;
  pagination: EngagementListPageResult;
  labels: EngagementListLabels;
};

function pageHref(basePath: string, query: EngagementListQuery, page: number): string {
  const params = buildEngagementListSearchParams(query, { page });
  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

export function EngagementListPagination({
  basePath,
  query,
  pagination,
  labels,
}: EngagementListPaginationProps) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  const previousPage = Math.max(1, pagination.page - 1);
  const nextPage = Math.min(pagination.totalPages, pagination.page + 1);

  return (
    <nav
      aria-label="Engagement list pagination"
      className="flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 sm:flex-row"
    >
      <p className="text-sm text-muted-foreground">
        {labels.page} {pagination.page} {labels.of} {pagination.totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Link
          href={pageHref(basePath, query, previousPage)}
          aria-disabled={pagination.page <= 1}
          className={`inline-flex h-10 items-center rounded-xl border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            pagination.page <= 1
              ? "pointer-events-none border-border/40 text-muted-foreground/50"
              : "border-border/60 bg-card text-foreground hover:bg-muted"
          }`}
        >
          {labels.previous}
        </Link>
        <Link
          href={pageHref(basePath, query, nextPage)}
          aria-disabled={pagination.page >= pagination.totalPages}
          className={`inline-flex h-10 items-center rounded-xl border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            pagination.page >= pagination.totalPages
              ? "pointer-events-none border-border/40 text-muted-foreground/50"
              : "border-border/60 bg-card text-foreground hover:bg-muted"
          }`}
        >
          {labels.next}
        </Link>
      </div>
    </nav>
  );
}
