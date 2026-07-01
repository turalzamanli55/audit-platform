import type { ReactNode } from "react";

type EngagementFilterBarProps = {
  children?: ReactNode;
  label?: ReactNode;
  className?: string;
};

export function EngagementFilterBar({ children, label, className = "" }: EngagementFilterBarProps) {
  if (!children) {
    return null;
  }

  return (
    <div
      role="group"
      aria-label={typeof label === "string" ? label : "Engagement filters"}
      className={`flex min-w-0 flex-1 flex-wrap items-center gap-2 ${className}`}
    >
      {label ? (
        <span className="hidden text-xs font-medium uppercase tracking-wide text-muted-foreground sm:inline">
          {label}
        </span>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

type EngagementFilterChipProps = {
  children: ReactNode;
  active?: boolean;
  className?: string;
};

export function EngagementFilterChip({
  children,
  active = false,
  className = "",
}: EngagementFilterChipProps) {
  return (
    <span
      data-active={active}
      className={`inline-flex h-8 items-center rounded-lg border px-3 text-xs font-medium transition-colors ${
        active
          ? "border-primary/20 bg-accent text-accent-foreground"
          : "border-border/60 bg-card text-muted-foreground"
      } ${className}`}
    >
      {children}
    </span>
  );
}
