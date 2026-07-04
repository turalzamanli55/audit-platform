"use client";

import type { ReactNode } from "react";
import { workspaceTokens } from "./workspace-tokens";
import { WorkspaceHero } from "./workspace-hero";
import { WorkspaceSidebar, type WorkspaceNavGroup, type WorkspaceNavItem } from "./workspace-sidebar";

type WorkspaceChromeProps<T extends string = string> = {
  hero: ReactNode;
  navItems: WorkspaceNavItem<T>[];
  navGroups?: WorkspaceNavGroup<T>[];
  navAriaLabel: string;
  isReadOnly?: boolean;
  readOnlyExcept?: T[];
  overviewId?: T;
  children: ReactNode;
};

export function WorkspaceChrome<T extends string = string>({
  hero,
  navItems,
  navGroups,
  navAriaLabel,
  isReadOnly,
  readOnlyExcept,
  overviewId,
  children,
}: WorkspaceChromeProps<T>) {
  return (
    <div className={workspaceTokens.chromeGap}>
      {hero}
      <div className={workspaceTokens.layoutGrid}>
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <WorkspaceSidebar
            items={navItems}
            groups={navGroups}
            ariaLabel={navAriaLabel}
            isReadOnly={isReadOnly}
            readOnlyExcept={readOnlyExcept}
            overviewId={overviewId}
          />
        </aside>
        <main className="min-w-0 space-y-10">{children}</main>
      </div>
    </div>
  );
}

export { WorkspaceHero };
