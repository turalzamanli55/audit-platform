import type { ReactNode } from "react";
import { CompanyErrorState, CompanyPageShell } from "@/components/company";

type CompanyWorkspaceErrorProps = {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

/**
 * Calm error surface for company workspace load failures.
 */
export function CompanyWorkspaceError({
  title,
  description,
  action,
  className = "",
}: CompanyWorkspaceErrorProps) {
  return (
    <CompanyPageShell className={`max-w-[90rem] ${className}`}>
      <CompanyErrorState title={title} description={description} action={action} />
    </CompanyPageShell>
  );
}
