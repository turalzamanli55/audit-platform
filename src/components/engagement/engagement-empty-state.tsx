import type { ReactNode } from "react";
import { WorkspaceEmptyPanel } from "@/components/workspace";

type EngagementEmptyStateProps = {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EngagementEmptyState({
  title,
  description,
  action,
  className = "",
}: EngagementEmptyStateProps) {
  return (
    <div className={className}>
      <WorkspaceEmptyPanel
        title={String(title)}
        description={description ? String(description) : ""}
      />
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
