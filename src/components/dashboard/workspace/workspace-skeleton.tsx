"use client";

import { useCommonLabels } from "@/i18n/use-common-labels";
import { workspaceTokens } from "@/components/workspace";
import { cn } from "@/lib/ui/cn";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-xl bg-muted/80", className)}
    />
  );
}

export function DashboardWorkspaceSkeleton() {
  const { loading } = useCommonLabels();

  return (
    <div
      className="mx-auto w-full max-w-[90rem] space-y-6 pb-10 sm:space-y-7"
      aria-busy="true"
      aria-live="polite"
      aria-label={loading}
    >
      <span className="sr-only">{loading}</span>
      <div className="flex flex-wrap gap-3">
        <SkeletonBlock className="h-10 w-44" />
        <SkeletonBlock className="h-10 w-40" />
        <SkeletonBlock className="h-10 w-36" />
      </div>

      <div className={cn(workspaceTokens.card, "p-8")}>
        <SkeletonBlock className="mb-3 h-3 w-32" />
        <SkeletonBlock className="mb-3 h-9 w-2/3" />
        <SkeletonBlock className="mb-4 h-4 w-1/2" />
        <div className="flex gap-2">
          <SkeletonBlock className="h-7 w-36 rounded-full" />
          <SkeletonBlock className="h-7 w-32 rounded-full" />
        </div>
      </div>

      {Array.from({ length: 3 }).map((_, row) => (
        <div key={row} className="space-y-3">
          <SkeletonBlock className="h-3 w-28" />
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3">
            {Array.from({ length: 4 }).map((__, col) => (
              <div key={col} className={cn(workspaceTokens.card, "p-5")}>
                <SkeletonBlock className="mb-3 h-4 w-1/3" />
                <SkeletonBlock className="h-3 w-full" />
                <SkeletonBlock className="mt-2 h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className={cn(workspaceTokens.card, "p-5")}>
        <SkeletonBlock className="mb-3 h-4 w-1/3" />
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="mt-2 h-3 w-2/3" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] xl:gap-6">
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={cn(workspaceTokens.card, "p-5")}>
              <SkeletonBlock className="mb-3 h-4 w-1/3" />
              <SkeletonBlock className="h-3 w-full" />
            </div>
          ))}
        </div>
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={cn(workspaceTokens.card, "p-5")}>
              <SkeletonBlock className="mb-3 h-4 w-1/3" />
              <SkeletonBlock className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
