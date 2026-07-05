"use client";

import Link from "next/link";
import type { CompanyListPageResult, CompanyListQuery } from "@/lib/company/apply-list-query";
import { buildCompanyListSearchParams } from "@/lib/company/apply-list-query";
import type { CompanyListLabels } from "./company-list-experience";

type CompanyListPaginationProps = {
  basePath: string;
  query: CompanyListQuery;
  pagination: CompanyListPageResult;
  labels: CompanyListLabels;
};

function pageHref(basePath: string, query: CompanyListQuery, page: number): string {
  const params = buildCompanyListSearchParams(query, { page });
  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

export function CompanyListPagination({
  basePath,
  query,
  pagination,
  labels,
}: CompanyListPaginationProps) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  const previousPage = Math.max(1, pagination.page - 1);
  const nextPage = Math.min(pagination.totalPages, pagination.page + 1);

  return (
    <nav
      aria-label={labels.paginationAriaLabel}
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
