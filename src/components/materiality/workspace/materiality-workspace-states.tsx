import type { ReactNode } from "react";
import { EngagementLoadingSkeleton } from "@/components/engagement";
import { WorkspaceEmptyPanel, WorkspaceError, WorkspacePanel } from "@/components/workspace";

export function MaterialityWorkspaceError({
  title = "Unable to load materiality workspace",
  description = "Something went wrong while loading materiality.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return <WorkspaceError title={title} description={description} action={action} />;
}

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
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  isPending?: boolean;
  canCreate?: boolean;
  gateDescription?: string;
  forbiddenDescription?: string;
  creatingLabel?: string;
}) {
  return (
    <WorkspaceEmptyPanel
      title={title}
      description={description}
      actionLabel={actionLabel}
      onAction={onAction}
      isPending={isPending}
      pendingLabel={creatingLabel}
      canCreate={canCreate}
      gateDescription={gateDescription}
      secondaryDescription={forbiddenDescription}
    />
  );
}

export function MaterialityWorkspaceLoading() {
  return <EngagementLoadingSkeleton />;
}

export function MaterialityWorkspaceArchiveNotice({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-warning/30 bg-warning/5 px-5 py-4">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function MaterialityWorkspaceReadonlyNotice({ message }: { message: string }) {
  return (
    <WorkspacePanel variant="muted" padding="md">
      <p className="text-sm text-muted-foreground">{message}</p>
    </WorkspacePanel>
  );
}

export function MaterialityWorkspacePermissionDenied({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return <WorkspaceEmptyPanel title={title} description={description} canCreate={false} />;
}
