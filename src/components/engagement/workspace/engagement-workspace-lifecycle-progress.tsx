import type { EngagementLifecycleStatus } from "@/types/engagement";
import { WorkspacePanel, WorkspaceProgressBar } from "@/components/workspace";

type EngagementWorkspaceLifecycleProgressProps = {
  lifecycleStatus: EngagementLifecycleStatus;
  lifecycleLabel: string;
  progressLabel: string;
  percent: number;
};

export function EngagementWorkspaceLifecycleProgress({
  lifecycleStatus: _lifecycleStatus,
  lifecycleLabel,
  progressLabel,
  percent,
}: EngagementWorkspaceLifecycleProgressProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <WorkspacePanel padding="md" className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {progressLabel}
          </p>
          <p className="text-sm font-medium text-foreground">{lifecycleLabel}</p>
        </div>
        <span className="text-2xl font-semibold tabular-nums text-foreground">{clamped}%</span>
      </div>
      <WorkspaceProgressBar label={progressLabel} value={clamped} className="max-w-none" />
    </WorkspacePanel>
  );
}
