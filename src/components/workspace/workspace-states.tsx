import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import { cn } from "@/lib/ui/cn";

export function WorkspaceError({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-lg px-4 py-16 text-center", className)}>
      <ErrorState title={title} description={description} />
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function WorkspaceEmptyPanel({
  title,
  description,
  actionLabel,
  onAction,
  isPending = false,
  pendingLabel,
  secondaryDescription,
  gateDescription,
  canCreate = true,
  className,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  isPending?: boolean;
  pendingLabel?: string;
  secondaryDescription?: string;
  gateDescription?: string;
  canCreate?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-dashed border-border/60 bg-card/40 px-6 py-12 text-center sm:px-10",
        className,
      )}
    >
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {gateDescription ? (
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">{gateDescription}</p>
      ) : null}
      {!canCreate && secondaryDescription ? (
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">{secondaryDescription}</p>
      ) : null}
      {canCreate && actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          disabled={isPending}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending && pendingLabel ? pendingLabel : actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export function WorkspaceLoading({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function WorkspaceInlineLoading() {
  return (
    <div className="space-y-3 p-4" aria-busy="true">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export { EmptyState as WorkspaceEmptyState, ErrorState as WorkspaceErrorState };

export function WorkspaceRetryButton({
  label,
  onRetry,
}: {
  label: string;
  onRetry: () => void;
}) {
  return (
    <Button variant="secondary" onClick={onRetry}>
      {label}
    </Button>
  );
}
