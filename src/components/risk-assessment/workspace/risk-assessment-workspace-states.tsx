import type { ReactNode } from "react";
import { WorkspaceEmptyPanel, WorkspaceError } from "@/components/workspace";

export function RiskAssessmentWorkspaceError({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
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
  creatingLabel,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  isPending?: boolean;
  canCreate?: boolean;
  gateDescription?: string;
  forbiddenDescription?: string;
  creatingLabel: string;
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
