import type { ReactNode } from "react";

type EngagementEmptyStateProps = {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EngagementEmptyState({
  title,
  description,
  icon,
  action,
  className = "",
}: EngagementEmptyStateProps) {
  return (
    <div
      className={`flex min-h-[16rem] flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-border/70 bg-muted/20 px-8 py-12 text-center sm:min-h-[18rem] ${className}`}
    >
      {icon ? (
        <div
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground"
        >
          {icon}
        </div>
      ) : (
        <DefaultEmptyIcon />
      )}
      <div className="max-w-md space-y-2">
        <p className="text-base font-medium tracking-tight text-foreground">{title}</p>
        {description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}

function DefaultEmptyIcon() {
  return (
    <div
      aria-hidden="true"
      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="6" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
