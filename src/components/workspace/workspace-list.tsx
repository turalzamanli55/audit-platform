import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

const listClasses =
  "divide-y divide-border/30 overflow-hidden rounded-2xl border border-border/50 bg-card/90";

type WorkspaceListProps = {
  children: ReactNode;
  className?: string;
  as?: "ul" | "div";
};

export function WorkspaceList({
  children,
  className,
  as = "ul",
}: WorkspaceListProps) {
  if (as === "div") {
    return <div className={cn(listClasses, className)}>{children}</div>;
  }
  return <ul className={cn(listClasses, className)}>{children}</ul>;
}

export function WorkspaceListItem({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLLIElement> & { children: ReactNode }) {
  return (
    <li className={cn("px-4 py-3.5 sm:px-5 transition-colors hover:bg-muted/15", className)} {...props}>
      {children}
    </li>
  );
}

export function WorkspaceListEntry({
  title,
  subtitle,
  meta,
  badge,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  badge?: ReactNode;
  className?: string;
}) {
  return (
    <WorkspaceListItem className={className}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-medium text-foreground">{title}</p>
            {badge}
          </div>
          {subtitle ? (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {meta ? <span className="shrink-0 text-xs text-muted-foreground">{meta}</span> : null}
      </div>
    </WorkspaceListItem>
  );
}
