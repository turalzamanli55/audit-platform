import type { ReactNode } from "react";
import { WorkspaceError } from "@/components/workspace";

type EngagementErrorStateProps = {
  title: ReactNode;
  description: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EngagementErrorState({
  title,
  description,
  action,
  className,
}: EngagementErrorStateProps) {
  return (
    <WorkspaceError
      title={String(title)}
      description={String(description)}
      action={action}
      className={className}
    />
  );
}
