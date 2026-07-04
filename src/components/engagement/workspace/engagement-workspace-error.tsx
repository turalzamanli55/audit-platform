import type { ReactNode } from "react";
import { EngagementErrorState, EngagementPageShell } from "@/components/engagement";

type EngagementWorkspaceErrorProps = {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EngagementWorkspaceError({
  title,
  description,
  action,
  className = "",
}: EngagementWorkspaceErrorProps) {
  return (
    <EngagementPageShell className={`max-w-[90rem] ${className}`}>
      <EngagementErrorState title={title} description={description} action={action} />
    </EngagementPageShell>
  );
}
