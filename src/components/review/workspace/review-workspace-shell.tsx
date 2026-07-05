"use client";

import type { ReactNode } from "react";
import { ReviewWorkspaceChrome } from "./review-workspace-chrome";
import type { ReviewWorkspaceView } from "@/lib/review/review-workspace-view";
import { ReviewWorkspaceProvider } from "@/lib/review/use-review-workspace";
import type { ReviewWorkspaceNavGroup, ReviewWorkspaceNavItem } from "./review-workspace-sidebar";

type ReviewWorkspaceShellProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  initialReview: ReviewWorkspaceView | null;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  engagementId: string;
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

export function ReviewWorkspaceShell({
  locale,
  engagementSlug,
  engagementName,
  initialReview,
  fieldworkStarted,
  fieldworkSubstantiallyComplete,
  engagementId,
  navItems,
  navGroups,
  navAriaLabel,
  labels,
  statusLabels,
  engagementsLabels,
  children,
}: ReviewWorkspaceShellProps) {
  return (
    <ReviewWorkspaceProvider
      initialReview={initialReview}
      engagementId={engagementId}
      fieldworkStarted={fieldworkStarted}
      fieldworkSubstantiallyComplete={fieldworkSubstantiallyComplete}
    >
      <ReviewWorkspaceChrome
        locale={locale}
        engagementSlug={engagementSlug}
        engagementName={engagementName}
        navItems={navItems}
        navGroups={navGroups}
        navAriaLabel={navAriaLabel}
        labels={labels}
        statusLabels={statusLabels}
        engagementsLabels={engagementsLabels}
      >
        {children}
      </ReviewWorkspaceChrome>
    </ReviewWorkspaceProvider>
  );
}
