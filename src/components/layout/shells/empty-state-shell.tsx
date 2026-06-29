import type { ReactNode } from "react";

type EmptyStateShellProps = {
  title?: string;
  description?: string;
  children?: ReactNode;
};

export function EmptyStateShell({
  title = "No content",
  description = "There is nothing to display here yet.",
  children,
}: EmptyStateShellProps) {
  return (
    <div className="flex min-h-[12rem] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}
