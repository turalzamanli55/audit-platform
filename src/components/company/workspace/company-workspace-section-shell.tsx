import type { ReactNode } from "react";
import { CompanySection } from "@/components/company";

type CompanyWorkspaceSectionShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  headingId?: string;
  className?: string;
};

/**
 * Section wrapper for workspace content regions.
 */
export function CompanyWorkspaceSectionShell({
  title,
  description,
  children,
  headingId,
  className = "",
}: CompanyWorkspaceSectionShellProps) {
  return (
    <CompanySection
      title={title}
      description={description}
      headingId={headingId}
      className={className}
    >
      {children}
    </CompanySection>
  );
}
