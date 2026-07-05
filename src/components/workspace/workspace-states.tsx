"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useCommonLabels } from "@/i18n/use-common-labels";
import { workspaceTokens } from "./workspace-tokens";
import { cn } from "@/lib/ui/cn";

function WorkspaceSkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-xl bg-muted/80", className)}
    />
  );
}

function WorkspaceErrorPanel({
  title,
  description,
}: {
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className="flex min-h-[12rem] flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/15 bg-destructive/[0.03] px-8 py-10 text-center">
      <div
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 7v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="11" cy="15" r="0.75" fill="currentColor" />
        </svg>
      </div>
      <div className="max-w-md space-y-2">
        <p className="text-base font-medium tracking-tight text-foreground">{title}</p>
        {description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

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
      <WorkspaceErrorPanel title={title} description={description} />
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
  const { loading } = useCommonLabels();

  return (
    <div className="space-y-4" aria-busy="true" aria-label={loading}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={cn(workspaceTokens.card, "p-5")}>
          <WorkspaceSkeletonBlock className="mb-3 h-4 w-1/3" />
          <WorkspaceSkeletonBlock className="h-3 w-full" />
          <WorkspaceSkeletonBlock className="mt-2 h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function WorkspaceInlineLoading() {
  const { loading } = useCommonLabels();

  return (
    <div className="space-y-3 p-4" aria-busy="true" aria-label={loading}>
      <WorkspaceSkeletonBlock className="h-4 w-1/3" />
      <WorkspaceSkeletonBlock className="h-3 w-full" />
      <WorkspaceSkeletonBlock className="h-3 w-2/3" />
    </div>
  );
}

export function WorkspaceEmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className={workspaceTokens.emptyInline}>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export function WorkspaceErrorState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return <WorkspaceErrorPanel title={title} description={description} />;
}

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
