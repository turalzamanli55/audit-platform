"use client";

import { useClientDictionary } from "@/i18n/use-client-dictionary";

type EngagementLoadingSkeletonProps = {
  variant?: "list" | "detail" | "card";
  rows?: number;
  className?: string;
};

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-xl bg-muted/80 ${className}`} />;
}

function ListSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-2xl border border-border/40 bg-card p-4"
        >
          <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonBlock className="h-4 w-1/3 max-w-[12rem]" />
            <SkeletonBlock className="h-3 w-1/2 max-w-[16rem]" />
          </div>
          <SkeletonBlock className="hidden h-6 w-16 rounded-full sm:block" />
        </div>
      ))}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4 border-b border-border/40 pb-8">
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-9 w-2/3 max-w-md" />
        <SkeletonBlock className="h-4 w-full max-w-lg" />
        <div className="flex gap-2 pt-2">
          <SkeletonBlock className="h-6 w-16 rounded-full" />
          <SkeletonBlock className="h-6 w-20 rounded-full" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <SkeletonBlock className="h-48 rounded-2xl" />
        <SkeletonBlock className="h-48 rounded-2xl" />
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/40 bg-card p-6">
      <div className="flex items-start gap-4">
        <SkeletonBlock className="h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-3">
          <SkeletonBlock className="h-5 w-1/2" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
}

export function EngagementLoadingSkeleton({
  variant = "list",
  rows = 4,
  className = "",
}: EngagementLoadingSkeletonProps) {
  const dictionary = useClientDictionary();
  const loadingLabel = dictionary.engagements.loading;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={loadingLabel}
      className={className}
    >
      <span className="sr-only">{loadingLabel}</span>
      {variant === "list" ? <ListSkeleton rows={rows} /> : null}
      {variant === "detail" ? <DetailSkeleton /> : null}
      {variant === "card" ? <CardSkeleton /> : null}
    </div>
  );
}
