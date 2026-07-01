import type { ReactNode } from "react";
import { EngagementErrorState, EngagementPageShell } from "@/components/engagement";

type EngagementWorkspaceErrorProps = {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EngagementWorkspaceError({
  title = "Unable to load engagement workspace",
  description = "Something went wrong while loading this engagement. Try again in a moment.",
  action,
  className = "",
}: EngagementWorkspaceErrorProps) {
  return (
    <EngagementPageShell className={`max-w-[90rem] ${className}`}>
      <EngagementErrorState title={title} description={description} action={action} />
    </EngagementPageShell>
  );
}
