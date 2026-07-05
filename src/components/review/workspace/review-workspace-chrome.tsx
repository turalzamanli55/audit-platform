"use client";

import type { ReactNode } from "react";
import { ReviewWorkspaceHero } from "./review-workspace-hero";
import {
  ReviewWorkspaceSidebar,
  type ReviewWorkspaceNavGroup,
  type ReviewWorkspaceNavItem,
} from "./review-workspace-sidebar";
import { useReviewWorkspace } from "@/lib/review/use-review-workspace";

type ReviewWorkspaceChromeProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  navItems: ReviewWorkspaceNavItem[];
  navGroups: ReviewWorkspaceNavGroup[];
  navAriaLabel: string;
  labels: {
    breadcrumbReview: string;
    heroEyebrow: string;
    summaryProgress: string;
    summaryVersion: string;
    summaryPending: string;
    summaryOpenFindings: string;
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

export function ReviewWorkspaceChrome({
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
}: ReviewWorkspaceChromeProps) {
  const { review, fieldworkStarted } = useReviewWorkspace();

  return (
    <div className="space-y-8">
      <ReviewWorkspaceHero
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
          <ReviewWorkspaceSidebar
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
