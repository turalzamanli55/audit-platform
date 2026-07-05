import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";
import { WorkspacePanel } from "./workspace-panel";

type WorkspaceNoticeVariant = "default" | "warning" | "error" | "success" | "info";

type WorkspaceNoticeBannerProps = {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  variant?: WorkspaceNoticeVariant;
  role?: "status" | "alert";
};

const variantPanelClasses: Record<WorkspaceNoticeVariant, string> = {
  default: "border-border/50 bg-muted/10",
  warning: "border-warning/40 bg-warning/5",
  error: "border-destructive/40 bg-destructive/5",
  success: "border-success/40 bg-success/5",
  info: "border-info/40 bg-info/5",
};

const variantIconClasses: Record<WorkspaceNoticeVariant, string> = {
  default: "bg-background text-muted-foreground ring-border/50",
  warning: "bg-warning/10 text-warning ring-warning/20",
  error: "bg-destructive/10 text-destructive ring-destructive/20",
  success: "bg-success/10 text-success ring-success/20",
  info: "bg-info/10 text-info ring-info/20",
};

function NoticeIcon({ variant }: { variant: WorkspaceNoticeVariant }) {
  if (variant === "error") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 5v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="11" r="0.75" fill="currentColor" />
      </svg>
    );
  }

  if (variant === "success") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M4.5 8.25L7 10.75L11.5 5.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

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
  variant = "default",
  role = "status",
}: WorkspaceNoticeBannerProps) {
  const body = description ?? title;

  return (
    <div role={role} aria-live="polite" className={className}>
      <WorkspacePanel
        variant="muted"
        padding="md"
        className={cn(
          "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
          variantPanelClasses[variant],
        )}
      >
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={cn(
              "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ring-1",
              variantIconClasses[variant],
            )}
          >
            <NoticeIcon variant={variant} />
          </span>
          <div className="min-w-0 space-y-1">
            {title && description ? (
              <p className="text-sm font-medium text-foreground">{title}</p>
            ) : null}
            {body ? (
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  title && description ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {body}
              </p>
            ) : null}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </WorkspacePanel>
    </div>
  );
}
