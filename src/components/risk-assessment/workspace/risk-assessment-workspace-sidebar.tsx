"use client";

import type { RiskAssessmentWorkspaceSection } from "@/lib/risk-assessment/risk-assessment-workspace-view";
import {
  WorkspaceSidebar,
  type WorkspaceNavGroup,
  type WorkspaceNavItem,
} from "@/components/workspace";

export type RiskAssessmentWorkspaceNavItem = WorkspaceNavItem<RiskAssessmentWorkspaceSection>;
export type RiskAssessmentWorkspaceNavGroup = WorkspaceNavGroup<RiskAssessmentWorkspaceSection>;

type RiskAssessmentWorkspaceSidebarProps = {
  items: RiskAssessmentWorkspaceNavItem[];
  groups?: RiskAssessmentWorkspaceNavGroup[];
  ariaLabel: string;
  isArchived?: boolean;
  className?: string;
};

export function RiskAssessmentWorkspaceSidebar({
  items,
  groups,
  ariaLabel,
  isArchived = false,
  className,
}: RiskAssessmentWorkspaceSidebarProps) {
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
