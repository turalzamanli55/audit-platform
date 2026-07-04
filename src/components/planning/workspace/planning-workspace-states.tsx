import type { ReactNode } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { WorkspaceEmptyPanel, WorkspaceError } from "@/components/workspace";

export function PlanningWorkspaceError({
  title = "Unable to load planning workspace",
  description = "Something went wrong while loading audit planning.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return <WorkspaceError title={title} description={description} action={action} />;
}

export function PlanningWorkspaceEmpty({
  title,
  description,
  actionLabel,
  onAction,
  isPending = false,
  canCreate = false,
  labels,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  isPending?: boolean;
  canCreate?: boolean;
  labels: Dictionary["planning"]["empty"];
}) {
  return (
    <WorkspaceEmptyPanel
      title={title}
      description={description}
      actionLabel={actionLabel}
      onAction={onAction}
      isPending={isPending}
      pendingLabel={labels.creating}
      canCreate={canCreate}
      secondaryDescription={labels.forbiddenDescription}
    />
  );
}
