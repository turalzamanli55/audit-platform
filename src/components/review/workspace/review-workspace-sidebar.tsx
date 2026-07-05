"use client";

import type { ReviewWorkspaceSection } from "@/lib/review/review-workspace-view";
import {
  WorkspaceSidebar,
  type WorkspaceNavGroup,
  type WorkspaceNavItem,
} from "@/components/workspace";

export type ReviewWorkspaceNavItem = WorkspaceNavItem<ReviewWorkspaceSection>;
export type ReviewWorkspaceNavGroup = WorkspaceNavGroup<ReviewWorkspaceSection>;

type ReviewWorkspaceSidebarProps = {
  items: ReviewWorkspaceNavItem[];
  groups?: ReviewWorkspaceNavGroup[];
  ariaLabel: string;
  isArchived?: boolean;
  className?: string;
};

export function ReviewWorkspaceSidebar({
  items,
  groups,
  ariaLabel,
  isArchived = false,
  className,
}: ReviewWorkspaceSidebarProps) {
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
