import type { ReactNode } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { WorkspaceEmptyPanel, WorkspaceError } from "@/components/workspace";

export function FieldworkWorkspaceError({
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

export function FieldworkWorkspaceEmpty({
  title,
  description,
  actionLabel,
  onAction,
  isPending = false,
  canCreate = false,
  gateDescription,
  labels,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  isPending?: boolean;
  canCreate?: boolean;
  gateDescription?: string;
  labels: Dictionary["fieldwork"]["empty"];
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
      gateDescription={gateDescription}
      secondaryDescription={labels.forbiddenDescription}
    />
  );
}
