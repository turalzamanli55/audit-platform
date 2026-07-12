import { aiWorkspaceTokens } from "@/components/ai/shared/ai-tokens";
import { cn } from "@/lib/ui/cn";

export function AiSkeletonBlock({ className }: { className?: string }) {
  return <div className={cn(aiWorkspaceTokens.skeleton, className)} aria-hidden />;
}

export function AiWorkspaceLoading({ label }: { label: string }) {
  return (
    <div
      className="flex h-full min-h-[20rem] flex-col items-center justify-center gap-4 p-8"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <AiSkeletonBlock className="h-10 w-10 rounded-full" />
      <div className="w-full max-w-sm space-y-2">
        <AiSkeletonBlock className="h-4 w-3/4" />
        <AiSkeletonBlock className="h-4 w-full" />
        <AiSkeletonBlock className="h-4 w-5/6" />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function AiPanelLoading({ label }: { label: string }) {
  return (
    <div className="space-y-3 p-4" role="status" aria-label={label}>
      <AiSkeletonBlock className="h-3 w-24" />
      <AiSkeletonBlock className="h-16 w-full" />
      <AiSkeletonBlock className="h-16 w-full" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
