"use client";

import type { EngagementWorkspaceNavItem } from "@/lib/engagement/engagement-workspace-display";
import { WorkspaceSidebar } from "@/components/workspace";

export type { EngagementWorkspaceNavItem };

type EngagementWorkspaceSidebarProps = {
  items: EngagementWorkspaceNavItem[];
  ariaLabel: string;
  isArchived?: boolean;
  archivedNotice?: string;
  className?: string;
};

export function EngagementWorkspaceSidebar({
  items,
  ariaLabel,
  isArchived = false,
  archivedNotice,
  className,
}: EngagementWorkspaceSidebarProps) {
  return (
    <div className={className}>
      {isArchived && archivedNotice ? (
        <p className="mb-3 hidden rounded-xl border border-border/50 bg-muted/20 px-3 py-2 text-xs text-muted-foreground lg:block">
          {archivedNotice}
        </p>
      ) : null}
      <WorkspaceSidebar items={items} ariaLabel={ariaLabel} overviewId="overview" />
    </div>
  );
}
