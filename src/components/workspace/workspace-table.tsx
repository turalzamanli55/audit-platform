"use client";

import { useMemo, useState, type ReactNode } from "react";
import { WorkspaceInlineLoading } from "./workspace-states";
import { cn } from "@/lib/ui/cn";
import { WorkspaceEmpty } from "./workspace-primitives";
import { WorkspaceErrorState } from "./workspace-states";

export type WorkspaceTableColumn<T> = {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
};

type WorkspaceTableProps<T> = {
  columns: WorkspaceTableColumn<T>[];
  rows: T[];
  keyFn: (row: T) => string;
  emptyTitle: string;
  emptyDescription?: string;
  className?: string;
  isLoading?: boolean;
  error?: string | null;
  stickyHeader?: boolean;
  defaultSort?: { columnId: string; direction: "asc" | "desc" };
};

export function WorkspaceTable<T>({
  columns,
  rows,
  keyFn,
  emptyTitle,
  emptyDescription,
  className,
  isLoading = false,
  error = null,
  stickyHeader = true,
  defaultSort,
}: WorkspaceTableProps<T>) {
  const [sort, setSort] = useState(defaultSort ?? null);

  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    const column = columns.find((c) => c.id === sort.columnId);
    if (!column?.sortValue) return rows;
    const sorted = [...rows].sort((a, b) => {
      const av = column.sortValue!(a);
      const bv = column.sortValue!(b);
      if (av < bv) return sort.direction === "asc" ? -1 : 1;
      if (av > bv) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [rows, sort, columns]);

  const toggleSort = (columnId: string, sortable?: boolean, sortValue?: (row: T) => string | number) => {
    if (!sortable || !sortValue) return;
    setSort((current) => {
      if (current?.columnId !== columnId) return { columnId, direction: "asc" };
      return { columnId, direction: current.direction === "asc" ? "desc" : "asc" };
    });
  };

  if (error) {
    return <WorkspaceErrorState title={emptyTitle} description={error} />;
  }

  if (isLoading) {
    return (
      <div className={cn("rounded-2xl border border-border/50 p-4", className)}>
        <WorkspaceInlineLoading />
      </div>
    );
  }

  if (sortedRows.length === 0) {
    return <WorkspaceEmpty title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-border/50", className)}>
      <table className="w-full min-w-[32rem] text-left text-sm">
        <thead className={cn(stickyHeader && "sticky top-0 z-10")}>
          <tr className="border-b border-border/40 bg-muted/30 backdrop-blur-sm">
            {columns.map((col) => {
              const isActive = sort?.columnId === col.id;
              return (
                <th
                  key={col.id}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                    col.hideOnMobile && "hidden sm:table-cell",
                    col.sortable && "cursor-pointer select-none hover:text-foreground",
                    col.className,
                  )}
                  onClick={() => toggleSort(col.id, col.sortable, col.sortValue)}
                  aria-sort={
                    isActive ? (sort!.direction === "asc" ? "ascending" : "descending") : undefined
                  }
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {isActive ? (
                      <span className="text-[10px] text-foreground" aria-hidden>
                        {sort!.direction === "asc" ? "↑" : "↓"}
                      </span>
                    ) : null}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {sortedRows.map((row) => (
            <tr key={keyFn(row)} className="transition-colors hover:bg-muted/15">
              {columns.map((col) => (
                <td
                  key={col.id}
                  className={cn(
                    "px-4 py-3.5 text-foreground",
                    col.hideOnMobile && "hidden sm:table-cell",
                    col.className,
                  )}
                >
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WorkspaceDataList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("divide-y divide-border/30", className)}>{children}</div>;
}

const badgeVariants: Record<
  "default" | "secondary" | "success" | "warning" | "destructive" | "outline",
  string
> = {
  default: "border-primary/20 bg-primary/10 text-primary",
  secondary: "border-border/60 bg-muted text-muted-foreground",
  success: "border-success/20 bg-success/10 text-success",
  warning: "border-warning/25 bg-warning/10 text-warning",
  destructive: "border-destructive/20 bg-destructive/10 text-destructive",
  outline: "border-border/60 bg-transparent text-foreground",
};

export function WorkspaceStatusBadge({
  label,
  variant = "secondary",
}: {
  label: string;
  variant?: "default" | "secondary" | "success" | "warning" | "destructive" | "outline";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        badgeVariants[variant],
      )}
    >
      {label}
    </span>
  );
}
