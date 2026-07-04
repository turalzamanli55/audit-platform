"use client";

import type { PlanningWorkspaceSection } from "@/lib/planning/planning-workspace-view";
import {
  WorkspaceSidebar,
  type WorkspaceNavGroup,
  type WorkspaceNavItem,
} from "@/components/workspace";

export type PlanningWorkspaceNavItem = WorkspaceNavItem<PlanningWorkspaceSection>;
export type PlanningWorkspaceNavGroup = WorkspaceNavGroup<PlanningWorkspaceSection>;

type PlanningWorkspaceSidebarProps = {
  items: PlanningWorkspaceNavItem[];
  groups?: PlanningWorkspaceNavGroup[];
  ariaLabel: string;
  isArchived?: boolean;
  className?: string;
};

export function PlanningWorkspaceSidebar({
  items,
  groups,
  ariaLabel,
  isArchived = false,
  className,
}: PlanningWorkspaceSidebarProps) {
  return (
    <WorkspaceSidebar
      items={items}
      groups={groups}
      ariaLabel={ariaLabel}
      isReadOnly={isArchived}
      readOnlyExcept={["history", "settings"]}
      overviewId="overview"
      className={className}
    />
  );
}
