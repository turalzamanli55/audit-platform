import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export function DashboardWorkspaceSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-[90rem] space-y-6 pb-10 sm:space-y-7"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="rounded-[1.75rem] border border-border/40 p-8">
        <Skeleton className="mb-3 h-3 w-32" />
        <Skeleton className="mb-3 h-9 w-2/3" />
        <Skeleton className="mb-4 h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-36 rounded-full" />
          <Skeleton className="h-7 w-32 rounded-full" />
        </div>
      </div>

      {Array.from({ length: 3 }).map((_, row) => (
        <div key={row} className="space-y-3">
          <Skeleton className="h-3 w-28" />
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3">
            {Array.from({ length: 4 }).map((__, col) => (
              <SkeletonCard key={col} />
            ))}
          </div>
        </div>
      ))}

      <SkeletonCard />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] xl:gap-6">
        <div className="space-y-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="space-y-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}
