import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export function DashboardWorkspaceSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-[90rem] space-y-8 pb-10 sm:space-y-10 lg:space-y-12"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="rounded-[2rem] border border-border/40 p-10">
        <Skeleton className="mb-4 h-4 w-56" />
        <Skeleton className="mb-3 h-10 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <div className="space-y-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}
