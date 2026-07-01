import type { ReactNode } from "react";
import { EngagementPageShell } from "@/components/engagement";
import {
  EngagementWorkspaceHero,
  type EngagementWorkspaceHeroLabels,
} from "./engagement-workspace-hero";
import {
  EngagementWorkspaceSidebar,
  type EngagementWorkspaceNavItem,
} from "./engagement-workspace-sidebar";
import type { EngagementWorkspaceView } from "@/lib/engagement/engagement-workspace-view";

type EngagementWorkspaceLayoutProps = {
  locale: string;
  engagement: EngagementWorkspaceView;
  heroLabels: EngagementWorkspaceHeroLabels;
  navItems: EngagementWorkspaceNavItem[];
  navAriaLabel: string;
  children: ReactNode;
  className?: string;
};

export function EngagementWorkspaceLayout({
  locale,
  engagement,
  heroLabels,
  navItems,
  navAriaLabel,
  children,
  className = "",
}: EngagementWorkspaceLayoutProps) {
  return (
    <EngagementPageShell className={`max-w-[90rem] ${className}`}>
      <EngagementWorkspaceHero locale={locale} engagement={engagement} labels={heroLabels} />

      <div className="grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[14rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <EngagementWorkspaceSidebar items={navItems} ariaLabel={navAriaLabel} />
        </aside>
        <main className="min-w-0 space-y-10">{children}</main>
      </div>
    </EngagementPageShell>
  );
}
