import type { EngagementLifecycleStatus } from "@/types/engagement";

type EngagementWorkspaceLifecycleProgressProps = {
  lifecycleStatus: EngagementLifecycleStatus;
  lifecycleLabel: string;
  progressLabel: string;
  percent: number;
};

export function EngagementWorkspaceLifecycleProgress({
  lifecycleStatus,
  lifecycleLabel,
  progressLabel,
  percent,
}: EngagementWorkspaceLifecycleProgressProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="space-y-4 rounded-2xl border border-border/50 bg-card/80 p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {progressLabel}
          </p>
          <p className="text-sm font-medium text-foreground">{lifecycleLabel}</p>
        </div>
        <span className="text-2xl font-semibold tabular-nums text-foreground">{clamped}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${progressLabel}: ${lifecycleLabel}`}
        className="h-2 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${clamped}%` }}
          data-status={lifecycleStatus}
        />
      </div>
    </div>
  );
}
