import type { ReactNode } from "react";
import { WorkspacePanel } from "@/components/workspace";

type WorkspaceNoticeBannerProps = {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

function RestoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8a5 5 0 019.2-2M13 8a5 5 0 01-9.2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 3h2v2M5 13H3v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WorkspaceNoticeBanner({
  title,
  description,
  action,
  className,
}: WorkspaceNoticeBannerProps) {
  return (
    <div role="status" aria-live="polite" className={className}>
      <WorkspacePanel
        variant="muted"
        padding="md"
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-background text-muted-foreground ring-1 ring-border/50">
          <RestoreIcon />
        </span>
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {description ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
      </WorkspacePanel>
    </div>
  );
}
