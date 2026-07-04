"use client";

import type { MaterialityWorkspaceSection } from "@/lib/materiality/materiality-workspace-view";
import {
  WorkspaceSidebar,
  type WorkspaceNavGroup,
  type WorkspaceNavItem,
} from "@/components/workspace";

export type MaterialityWorkspaceNavItem = WorkspaceNavItem<MaterialityWorkspaceSection>;
export type MaterialityWorkspaceNavGroup = WorkspaceNavGroup<MaterialityWorkspaceSection>;

type MaterialityWorkspaceSidebarProps = {
  items: MaterialityWorkspaceNavItem[];
  groups?: MaterialityWorkspaceNavGroup[];
  ariaLabel: string;
  isArchived?: boolean;
  className?: string;
};

export function MaterialityWorkspaceSidebar({
  items,
  groups,
  ariaLabel,
  isArchived = false,
  className,
}: MaterialityWorkspaceSidebarProps) {
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
