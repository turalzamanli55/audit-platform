import type { ReactNode } from "react";
import { WorkspaceEmptyPanel, WorkspaceError } from "@/components/workspace";

export function RiskAssessmentWorkspaceError({
  title = "Unable to load risk assessment workspace",
  description = "Something went wrong while loading the risk assessment.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return <WorkspaceError title={title} description={description} action={action} />;
}

export function RiskAssessmentWorkspaceEmpty({
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
