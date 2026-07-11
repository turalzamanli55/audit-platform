"use client";

import type { ReportingWorkspaceSection } from "@/lib/reporting/reporting-workspace-view";
import {
  WorkspaceSidebar,
  type WorkspaceNavGroup,
  type WorkspaceNavItem,
} from "@/components/workspace";

export type ReportingWorkspaceNavItem = WorkspaceNavItem<ReportingWorkspaceSection>;
export type ReportingWorkspaceNavGroup = WorkspaceNavGroup<ReportingWorkspaceSection>;

type ReportingWorkspaceSidebarProps = {
  items: ReportingWorkspaceNavItem[];
  groups?: ReportingWorkspaceNavGroup[];
  ariaLabel: string;
  isArchived?: boolean;
  className?: string;
};

export function ReportingWorkspaceSidebar({
  items,
  groups,
  ariaLabel,
  isArchived = false,
  className,
}: ReportingWorkspaceSidebarProps) {
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
