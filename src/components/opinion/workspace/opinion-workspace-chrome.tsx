"use client";

import type { ReactNode } from "react";
import { OpinionWorkspaceHero } from "./opinion-workspace-hero";
import {
  OpinionWorkspaceSidebar,
  type OpinionWorkspaceNavGroup,
  type OpinionWorkspaceNavItem,
} from "./opinion-workspace-sidebar";
import { useOpinionWorkspace } from "@/lib/opinion/use-opinion-workspace";

type OpinionWorkspaceChromeProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  navItems: OpinionWorkspaceNavItem[];
  navGroups: OpinionWorkspaceNavGroup[];
  navAriaLabel: string;
  labels: {
    breadcrumbReview: string;
    heroEyebrow: string;
    summaryProgress: string;
    summaryVersion: string;
    summaryPending: string;
    summaryOutstandingItems: string;
    summaryPendingReviewBadge: string;
    backToEngagement: string;
    fieldworkGateTitle: string;
    fieldworkGateDescription: string;
    archivedTitle: string;
    archivedDescription: string;
    progress: string;
  };
  statusLabels: Record<string, string>;
  engagementsLabels: { breadcrumbRoot: string };
  children: ReactNode;
};

export function OpinionWorkspaceChrome({
  locale,
  engagementSlug,
  engagementName,
  navItems,
  navGroups,
  navAriaLabel,
  labels,
  statusLabels,
  engagementsLabels,
  children,
}: OpinionWorkspaceChromeProps) {
  const { review, fieldworkStarted } = useOpinionWorkspace();

  return (
    <div className="space-y-8">
      <OpinionWorkspaceHero
        locale={locale}
        engagementSlug={engagementSlug}
        engagementName={engagementName}
        review={review}
        fieldworkStarted={fieldworkStarted}
        labels={labels}
        statusLabels={statusLabels}
        engagementsLabels={engagementsLabels}
      />

      <div className="grid gap-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <OpinionWorkspaceSidebar
            items={navItems}
            groups={navGroups}
            ariaLabel={navAriaLabel}
            isArchived={review?.isArchived}
          />
        </aside>
        <main className="min-w-0 space-y-10">{children}</main>
      </div>
    </div>
  );
}
