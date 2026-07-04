import type { ReactNode } from "react";
import { WorkspaceEmptyPanel } from "@/components/workspace";

type CompanyWorkspaceEmptySectionProps = {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
};

/**
 * Placeholder for workspace sections awaiting future module data.
 */
export function CompanyWorkspaceEmptySection({
  title,
  description,
  className = "",
}: CompanyWorkspaceEmptySectionProps) {
  return (
    <WorkspaceEmptyPanel
      title={String(title)}
      description={description != null ? String(description) : ""}
      className={className}
    />
  );
}
