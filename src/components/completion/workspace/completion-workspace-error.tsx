import type { ReactNode } from "react";
import { EngagementErrorState, EngagementPageShell } from "@/components/engagement";

type CompletionWorkspaceErrorProps = {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function CompletionWorkspaceError({
  title,
  description,
  action,
  className = "",
}: CompletionWorkspaceErrorProps) {
  return (
    <EngagementPageShell className={`max-w-[90rem] ${className}`}>
      <EngagementErrorState title={title} description={description} action={action} />
    </EngagementPageShell>
  );
}
