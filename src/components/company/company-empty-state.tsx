import type { ReactNode } from "react";
import { WorkspaceEmptyPanel } from "@/components/workspace";

type CompanyEmptyStateProps = {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function CompanyEmptyState({
  title,
  description,
  action,
  className = "",
}: CompanyEmptyStateProps) {
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
