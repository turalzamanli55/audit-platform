"use client";

import type { CompanyWorkspaceSection } from "@/lib/company/company-workspace-view";
import { WorkspaceSidebar, type WorkspaceNavItem } from "@/components/workspace";

export type CompanyWorkspaceNavItem = WorkspaceNavItem<CompanyWorkspaceSection>;

type CompanyWorkspaceSidebarProps = {
  items: CompanyWorkspaceNavItem[];
  ariaLabel: string;
  className?: string;
};

export function CompanyWorkspaceSidebar({
  items,
  ariaLabel,
  className,
}: CompanyWorkspaceSidebarProps) {
  return (
    <WorkspaceSidebar
      items={items}
      ariaLabel={ariaLabel}
      overviewId="overview"
      className={className}
    />
  );
}
