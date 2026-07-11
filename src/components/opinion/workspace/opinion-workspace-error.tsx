import type { ReactNode } from "react";
import { EngagementErrorState, EngagementPageShell } from "@/components/engagement";

type OpinionWorkspaceErrorProps = {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function OpinionWorkspaceError({
  title,
  description,
  action,
  className = "",
}: OpinionWorkspaceErrorProps) {
  return (
    <EngagementPageShell className={`max-w-[90rem] ${className}`}>
      <EngagementErrorState title={title} description={description} action={action} />
    </EngagementPageShell>
  );
}
