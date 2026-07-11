"use client";

import type { ReactNode } from "react";
import { ReportingWorkspaceChrome } from "./reporting-workspace-chrome";
import type { ReportingWorkspaceView } from "@/lib/reporting/reporting-workspace-view";
import { ReportingWorkspaceProvider } from "@/lib/reporting/use-reporting-workspace";
import type {
  ReportingWorkspaceNavGroup,
  ReportingWorkspaceNavItem,
} from "./reporting-workspace-sidebar";

type ReportingWorkspaceShellProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  initialReporting: ReportingWorkspaceView | null;
  prerequisitesMet: boolean;
  completionApproved: boolean;
  engagementId: string;
  navItems: ReportingWorkspaceNavItem[];
  navGroups: ReportingWorkspaceNavGroup[];
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

export function ReportingWorkspaceShell({
  locale,
  engagementSlug,
  engagementName,
  initialReporting,
  prerequisitesMet,
  completionApproved,
  engagementId,
  navItems,
  navGroups,
  navAriaLabel,
  labels,
  statusLabels,
  engagementsLabels,
  children,
}: ReportingWorkspaceShellProps) {
  return (
    <ReportingWorkspaceProvider
      initialReview={initialReporting}
      engagementId={engagementId}
      fieldworkStarted={prerequisitesMet}
      fieldworkSubstantiallyComplete={completionApproved}
    >
      <ReportingWorkspaceChrome
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
      </ReportingWorkspaceChrome>
    </ReportingWorkspaceProvider>
  );
}
