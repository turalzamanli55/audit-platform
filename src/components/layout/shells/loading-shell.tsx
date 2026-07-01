import type { ReactNode } from "react";
import { Skeleton, SkeletonText, Spinner } from "@/components/ui";

type ShellProps = {
  children?: ReactNode;
  title?: string;
  description?: string;
};

export function LoadingShell({ title, description }: ShellProps) {
  return (
    <div
      className="flex min-h-[16rem] flex-col items-center justify-center gap-5 p-10"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Spinner size="lg" />
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium text-foreground">{title ?? "Loading"}</p>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <div className="w-full max-w-md space-y-3" aria-hidden="true">
        <Skeleton className="h-4 w-2/3" />
        <SkeletonText lines={2} />
      </div>
    </div>
  );
}
