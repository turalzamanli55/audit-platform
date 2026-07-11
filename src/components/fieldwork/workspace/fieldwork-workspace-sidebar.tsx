"use client";

import type {
  FieldworkWorkspaceNavGroup,
  FieldworkWorkspaceNavItem,
} from "@/lib/fieldwork/fieldwork-workspace-display";
import { WorkspaceSidebar } from "@/components/workspace";

export type { FieldworkWorkspaceNavItem, FieldworkWorkspaceNavGroup };

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
