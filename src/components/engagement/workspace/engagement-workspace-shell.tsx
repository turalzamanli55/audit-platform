"use client";

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
import { EngagementWorkspaceCookieSync } from "./engagement-workspace-cookie-sync";
import {
  EngagementWorkspaceProvider,
  useEngagementWorkspace,
} from "@/lib/engagement/use-engagement-workspace";
import type { EngagementWorkspaceView } from "@/lib/engagement/engagement-workspace-view";
import type { Dictionary } from "@/i18n/get-dictionary";

type EngagementWorkspaceShellProps = {
  locale: string;
  initialEngagement: EngagementWorkspaceView;
  preferredEngagementSlug?: string | null;
  heroLabels: EngagementWorkspaceHeroLabels;
  engagementsLabels: Dictionary["engagements"];
  navItems: EngagementWorkspaceNavItem[];
  navAriaLabel: string;
  children: ReactNode;
  className?: string;
};

function EngagementWorkspaceShellContent({
  locale,
  heroLabels,
  engagementsLabels,
  navItems,
  navAriaLabel,
  children,
  className = "",
}: Omit<EngagementWorkspaceShellProps, "initialEngagement" | "preferredEngagementSlug">) {
  const { engagement } = useEngagementWorkspace();

  return (
    <EngagementPageShell className={`max-w-[90rem] ${className}`}>
      <EngagementWorkspaceHero
        locale={locale}
        engagement={engagement}
        labels={heroLabels}
        engagementsLabels={engagementsLabels}
      />

      <div className="grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[14rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <EngagementWorkspaceSidebar
            items={navItems}
            ariaLabel={navAriaLabel}
            isArchived={engagement.isArchived}
          />
        </aside>
        <main className="min-w-0 space-y-10">{children}</main>
      </div>
    </EngagementPageShell>
  );
}

export function EngagementWorkspaceShell({
  locale,
  initialEngagement,
  preferredEngagementSlug,
  heroLabels,
  engagementsLabels,
  navItems,
  navAriaLabel,
  children,
  className = "",
}: EngagementWorkspaceShellProps) {
  return (
    <EngagementWorkspaceProvider initialEngagement={initialEngagement}>
      <EngagementWorkspaceCookieSync
        engagementSlug={initialEngagement.slug}
        preferredEngagementSlug={preferredEngagementSlug}
      />
      <EngagementWorkspaceShellContent
        locale={locale}
        heroLabels={heroLabels}
        engagementsLabels={engagementsLabels}
        navItems={navItems}
        navAriaLabel={navAriaLabel}
        className={className}
      >
        {children}
      </EngagementWorkspaceShellContent>
    </EngagementWorkspaceProvider>
  );
}
