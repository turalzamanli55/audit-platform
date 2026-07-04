"use client";

import type { FieldworkWorkspaceSection } from "@/lib/fieldwork/fieldwork-workspace-view";
import {
  WorkspaceSidebar,
  type WorkspaceNavGroup,
  type WorkspaceNavItem,
} from "@/components/workspace";

export type FieldworkWorkspaceNavItem = WorkspaceNavItem<FieldworkWorkspaceSection>;
export type FieldworkWorkspaceNavGroup = WorkspaceNavGroup<FieldworkWorkspaceSection>;

type FieldworkWorkspaceSidebarProps = {
  items: FieldworkWorkspaceNavItem[];
  groups?: FieldworkWorkspaceNavGroup[];
  ariaLabel: string;
  isArchived?: boolean;
  className?: string;
};

export function FieldworkWorkspaceSidebar({
  items,
  groups,
  ariaLabel,
  isArchived = false,
  className,
}: FieldworkWorkspaceSidebarProps) {
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
