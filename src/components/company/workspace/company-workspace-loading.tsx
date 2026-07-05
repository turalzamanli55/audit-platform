"use client";

import { CompanyPageShell } from "@/components/company";
import { useClientDictionary } from "@/i18n/use-client-dictionary";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-xl bg-muted/80 ${className}`}
    />
  );
}

type CompanyWorkspaceLoadingProps = {
  className?: string;
};

/**
 * Layout-stable skeleton matching the company workspace structure.
 */
export function CompanyWorkspaceLoading({ className = "" }: CompanyWorkspaceLoadingProps) {
  const dictionary = useClientDictionary();
  const ariaLabel = dictionary.companies.workspace.loading;

  return (
    <CompanyPageShell className={`max-w-[90rem] ${className}`}>
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label={ariaLabel}
        className="space-y-10"
      >
        <span className="sr-only">{ariaLabel}</span>

        <div className="space-y-6">
          <SkeletonBlock className="h-3 w-32" />
          <div className="flex items-start gap-5 border-b border-border/40 pb-10">
            <SkeletonBlock className="h-16 w-16 shrink-0 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="h-9 w-2/3 max-w-md" />
              <SkeletonBlock className="h-4 w-full max-w-lg" />
              <SkeletonBlock className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)]">
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-10 w-full rounded-xl" />
            ))}
          </div>
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-28 rounded-2xl" />
              ))}
            </div>
            <SkeletonBlock className="h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    </CompanyPageShell>
  );
}
