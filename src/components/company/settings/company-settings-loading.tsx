function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-xl bg-muted/80 ${className}`}
    />
  );
}

type CompanySettingsLoadingProps = {
  ariaLabel?: string;
};

export function CompanySettingsLoading({
  ariaLabel = "Loading company settings",
}: CompanySettingsLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={ariaLabel}
      className="space-y-8"
    >
      <span className="sr-only">{ariaLabel}</span>
      <div className="space-y-3">
        <SkeletonBlock className="h-8 w-48" />
        <SkeletonBlock className="h-4 w-full max-w-lg" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[11rem_minmax(0,1fr)]">
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-10 w-full rounded-xl" />
          ))}
        </div>
        <div className="space-y-4">
          <SkeletonBlock className="h-56 rounded-2xl" />
          <SkeletonBlock className="h-56 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
