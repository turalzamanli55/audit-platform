import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";
import { WorkspaceEmpty } from "./workspace-primitives";
import { workspaceTokens } from "./workspace-tokens";

export type WorkspaceTableColumn<T> = {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
};

type WorkspaceTableProps<T> = {
  columns: WorkspaceTableColumn<T>[];
  rows: T[];
  keyFn: (row: T) => string;
  emptyTitle: string;
  emptyDescription?: string;
  className?: string;
};

export function WorkspaceTable<T>({
  columns,
  rows,
  keyFn,
  emptyTitle,
  emptyDescription,
  className,
}: WorkspaceTableProps<T>) {
  if (rows.length === 0) {
    return <WorkspaceEmpty title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-border/50", className)}>
      <table className="w-full min-w-[32rem] text-left text-sm">
        <thead>
          <tr className="border-b border-border/40 bg-muted/20">
            {columns.map((col) => (
              <th
                key={col.id}
                scope="col"
                className={cn(
                  "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                  col.hideOnMobile && "hidden sm:table-cell",
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {rows.map((row) => (
            <tr
              key={keyFn(row)}
              className="transition-colors hover:bg-muted/20"
            >
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
  return (
    <div className={cn("divide-y divide-border/30", className)}>{children}</div>
  );
}
