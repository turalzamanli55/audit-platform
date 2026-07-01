import type { HTMLAttributes } from "react";
import { cn } from "@/lib/ui/cn";

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
};

const roundedClasses = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  xl: "rounded-2xl",
  full: "rounded-full",
};

export function Skeleton({ className, rounded = "lg", ...props }: SkeletonProps) {
  return (
    <div
      className={cn("ds-skeleton-shimmer", roundedClasses[rounded], className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-3.5"
          style={{ width: index === lines - 1 ? "70%" : "100%" }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4 rounded-2xl border border-border/50 bg-card p-6", className)}>
      <Skeleton className="h-4 w-1/3" />
      <SkeletonText lines={3} />
      <Skeleton className="h-10 w-28" />
    </div>
  );
}
