"use client";

import type {
  PlanningWorkspaceNavGroup,
  PlanningWorkspaceNavItem,
} from "@/lib/planning/planning-workspace-display";
import { WorkspaceSidebar } from "@/components/workspace";

export type { PlanningWorkspaceNavItem, PlanningWorkspaceNavGroup };

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
