"use client";

import type { FinancialStatementsWorkspaceSection } from "@/lib/financial-statements/financial-statements-workspace-view";
import {
  WorkspaceSidebar,
  type WorkspaceNavGroup,
  type WorkspaceNavItem,
} from "@/components/workspace";

export type FinancialStatementsWorkspaceNavItem = WorkspaceNavItem<FinancialStatementsWorkspaceSection>;
export type FinancialStatementsWorkspaceNavGroup = WorkspaceNavGroup<FinancialStatementsWorkspaceSection>;

type FinancialStatementsWorkspaceSidebarProps = {
  items: FinancialStatementsWorkspaceNavItem[];
  groups?: FinancialStatementsWorkspaceNavGroup[];
  ariaLabel: string;
  isArchived?: boolean;
  className?: string;
};

export function FinancialStatementsWorkspaceSidebar({
  items,
  groups,
  ariaLabel,
  isArchived = false,
  className,
}: FinancialStatementsWorkspaceSidebarProps) {
  return (
    <WorkspaceSidebar
      items={items}
      groups={groups}
      ariaLabel={ariaLabel}
      isReadOnly={isArchived}
      readOnlyExcept={["overview", "history", "settings"]}
      overviewId="overview"
      className={className}
    />
  );
}
