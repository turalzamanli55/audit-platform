import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type ShellProps = {
  children?: ReactNode;
  title?: string;
  description?: string;
};

export function EmptyStateShell({ title, description, children }: ShellProps) {
  return (
    <div
      className={cn(
        "flex min-h-[16rem] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border/70 bg-muted/15 p-10 text-center",
      )}
    >
      <p className="text-base font-medium text-foreground">{title ?? "Nothing here yet"}</p>
      {description ? <p className="max-w-md text-sm text-muted-foreground">{description}</p> : null}
      {children}
    </div>
  );
}
