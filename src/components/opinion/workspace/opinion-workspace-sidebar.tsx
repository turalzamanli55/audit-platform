"use client";

import type { OpinionWorkspaceSection } from "@/lib/opinion/opinion-workspace-view";
import {
  WorkspaceSidebar,
  type WorkspaceNavGroup,
  type WorkspaceNavItem,
} from "@/components/workspace";

export type OpinionWorkspaceNavItem = WorkspaceNavItem<OpinionWorkspaceSection>;
export type OpinionWorkspaceNavGroup = WorkspaceNavGroup<OpinionWorkspaceSection>;

type OpinionWorkspaceSidebarProps = {
  items: OpinionWorkspaceNavItem[];
  groups?: OpinionWorkspaceNavGroup[];
  ariaLabel: string;
  isArchived?: boolean;
  className?: string;
};

export function OpinionWorkspaceSidebar({
  items,
  groups,
  ariaLabel,
  isArchived = false,
  className,
}: OpinionWorkspaceSidebarProps) {
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
