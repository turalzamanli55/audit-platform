import { cn } from "@/lib/ui/cn";
import { workspaceTokens } from "./workspace-tokens";

type WorkspaceProgressBarProps = {
  label: string;
  value: number;
  className?: string;
  size?: "sm" | "md";
};

export function WorkspaceProgressBar({
  label,
  value,
  className,
  size = "sm",
}: WorkspaceProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("max-w-md space-y-2", className)}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-medium tabular-nums text-foreground">{clamped}%</span>
      </div>
      <div
        className={cn(
          workspaceTokens.progressTrack,
          size === "md" && "h-2.5",
        )}
      >
        <div
          className={workspaceTokens.progressFill}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
    </div>
  );
}
