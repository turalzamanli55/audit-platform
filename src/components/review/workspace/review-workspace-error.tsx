import type { ReactNode } from "react";
import { EngagementErrorState, EngagementPageShell } from "@/components/engagement";

type ReviewWorkspaceErrorProps = {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function ReviewWorkspaceError({
  title,
  description,
  action,
  className = "",
}: ReviewWorkspaceErrorProps) {
  return (
    <EngagementPageShell className={`max-w-[90rem] ${className}`}>
      <EngagementErrorState title={title} description={description} action={action} />
    </EngagementPageShell>
  );
}
