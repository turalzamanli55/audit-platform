"use client";

import type { CompletionWorkspaceSection } from "@/lib/completion/completion-workspace-view";
import {
  WorkspaceSidebar,
  type WorkspaceNavGroup,
  type WorkspaceNavItem,
} from "@/components/workspace";

export type CompletionWorkspaceNavItem = WorkspaceNavItem<CompletionWorkspaceSection>;
export type CompletionWorkspaceNavGroup = WorkspaceNavGroup<CompletionWorkspaceSection>;

type CompletionWorkspaceSidebarProps = {
  items: CompletionWorkspaceNavItem[];
  groups?: CompletionWorkspaceNavGroup[];
  ariaLabel: string;
  isArchived?: boolean;
  className?: string;
};

export function CompletionWorkspaceSidebar({
  items,
  groups,
  ariaLabel,
  isArchived = false,
  className,
}: CompletionWorkspaceSidebarProps) {
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
