import type { EngagementLifecycleStatus } from "@/types/engagement";

type EngagementLifecycleBadgeProps = {
  status: EngagementLifecycleStatus | string;
  label?: string;
  className?: string;
};

const LIFECYCLE_STYLES: Record<EngagementLifecycleStatus, string> = {
  draft: "border-border/60 bg-muted text-muted-foreground",
  planning: "border-primary/20 bg-primary/10 text-primary",
  fieldwork: "border-primary/20 bg-primary/10 text-primary",
  review: "border-warning/25 bg-warning/10 text-warning",
  completed: "border-success/20 bg-success/10 text-success",
  closed: "border-border/70 bg-muted/80 text-muted-foreground",
};

function resolveLifecycle(status: string): EngagementLifecycleStatus | null {
  if (status in LIFECYCLE_STYLES) {
    return status as EngagementLifecycleStatus;
  }
  return null;
}

export function EngagementLifecycleBadge({
  status,
  label,
  className = "",
}: EngagementLifecycleBadgeProps) {
  const resolved = resolveLifecycle(status);
  const styles = resolved ? LIFECYCLE_STYLES[resolved] : "border-border/60 bg-muted text-muted-foreground";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles} ${className}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-80" />
      <span>{label ?? status}</span>
    </span>
  );
}
