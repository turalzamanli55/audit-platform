import type { ReactNode } from "react";
import { Button } from "@/components/ui";
import { EngagementLoadingSkeleton } from "@/components/engagement";

type MaterialityWorkspaceErrorProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
};

export function MaterialityWorkspaceError({
  title = "Unable to load materiality workspace",
  description = "Something went wrong while loading materiality.",
  action,
}: MaterialityWorkspaceErrorProps) {
  return (
    <div className="mx-auto max-w-lg space-y-3 px-4 py-16 text-center">
      <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}

type MaterialityWorkspaceEmptyProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  isPending?: boolean;
  canCreate?: boolean;
  gateDescription?: string;
  forbiddenDescription?: string;
  creatingLabel?: string;
};

export function MaterialityWorkspaceEmpty({
  title,
  description,
  actionLabel,
  onAction,
  isPending = false,
  canCreate = false,
  gateDescription,
  forbiddenDescription,
  creatingLabel = "Creating...",
}: MaterialityWorkspaceEmptyProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-dashed border-border/60 bg-card/40 px-6 py-12 text-center sm:px-10">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {gateDescription ? (
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">{gateDescription}</p>
      ) : null}
      {!canCreate && forbiddenDescription ? (
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">{forbiddenDescription}</p>
      ) : null}
      {canCreate && actionLabel && onAction ? (
        <Button type="button" onClick={onAction} disabled={isPending} className="mt-6 rounded-xl">
          {isPending ? creatingLabel : actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export function MaterialityWorkspaceLoading() {
  return <EngagementLoadingSkeleton />;
}

type MaterialityWorkspaceArchiveNoticeProps = {
  title: string;
  description: string;
};

export function MaterialityWorkspaceArchiveNotice({
  title,
  description,
}: MaterialityWorkspaceArchiveNoticeProps) {
  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 py-4">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

type MaterialityWorkspaceReadonlyNoticeProps = {
  message: string;
};

export function MaterialityWorkspaceReadonlyNotice({ message }: MaterialityWorkspaceReadonlyNoticeProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-muted/30 px-5 py-4">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

type MaterialityWorkspacePermissionDeniedProps = {
  title: string;
  description: string;
};

export function MaterialityWorkspacePermissionDenied({
  title,
  description,
}: MaterialityWorkspacePermissionDeniedProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-dashed border-border/60 bg-card/40 px-6 py-12 text-center sm:px-10">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
