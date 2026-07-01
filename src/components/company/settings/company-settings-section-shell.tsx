import type { ReactNode } from "react";
import { CompanyWorkspaceSectionShell } from "@/components/company/workspace";

type CompanySettingsSectionShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  headingId?: string;
};

export function CompanySettingsSectionShell({
  title,
  description,
  children,
  headingId,
}: CompanySettingsSectionShellProps) {
  return (
    <CompanyWorkspaceSectionShell title={title} description={description} headingId={headingId}>
      {children}
    </CompanyWorkspaceSectionShell>
  );
}
