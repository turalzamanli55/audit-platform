"use client";

import type { ReactNode } from "react";
import { OpinionWorkspaceChrome } from "./opinion-workspace-chrome";
import type { OpinionWorkspaceView } from "@/lib/opinion/opinion-workspace-view";
import { OpinionWorkspaceProvider } from "@/lib/opinion/use-opinion-workspace";
import type {
  OpinionWorkspaceNavGroup,
  OpinionWorkspaceNavItem,
} from "./opinion-workspace-sidebar";

type OpinionWorkspaceShellProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  initialOpinion: OpinionWorkspaceView | null;
  prerequisitesMet: boolean;
  reportingApproved: boolean;
  engagementId: string;
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

export function OpinionWorkspaceShell({
  locale,
  engagementSlug,
  engagementName,
  initialOpinion,
  prerequisitesMet,
  reportingApproved,
  engagementId,
  navItems,
  navGroups,
  navAriaLabel,
  labels,
  statusLabels,
  engagementsLabels,
  children,
}: OpinionWorkspaceShellProps) {
  return (
    <OpinionWorkspaceProvider
      initialReview={initialOpinion}
      engagementId={engagementId}
      fieldworkStarted={prerequisitesMet}
      fieldworkSubstantiallyComplete={reportingApproved}
    >
      <OpinionWorkspaceChrome
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
      </OpinionWorkspaceChrome>
    </OpinionWorkspaceProvider>
  );
}
