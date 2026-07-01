import type { ReactNode } from "react";
import { CompanyEmptyState } from "@/components/company";

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
    <CompanyEmptyState
      title={title}
      description={description}
      className={`min-h-[14rem] bg-muted/10 sm:min-h-[16rem] ${className}`}
    />
  );
}
