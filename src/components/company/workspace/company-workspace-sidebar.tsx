"use client";

import type { CompanyWorkspaceNavItem } from "@/lib/company/company-workspace-display";
import { WorkspaceSidebar } from "@/components/workspace";

export type { CompanyWorkspaceNavItem };

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
