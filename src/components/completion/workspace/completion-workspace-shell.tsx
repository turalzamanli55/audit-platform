"use client";

import type { ReactNode } from "react";
import { CompletionWorkspaceChrome } from "./completion-workspace-chrome";
import type { CompletionWorkspaceView } from "@/lib/completion/completion-workspace-view";
import { CompletionWorkspaceProvider } from "@/lib/completion/use-completion-workspace";
import type { CompletionWorkspaceNavGroup, CompletionWorkspaceNavItem } from "./completion-workspace-sidebar";

type CompletionWorkspaceShellProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  initialReview: CompletionWorkspaceView | null;
  fieldworkStarted: boolean;
  fieldworkSubstantiallyComplete: boolean;
  engagementId: string;
  navItems: CompletionWorkspaceNavItem[];
  navGroups: CompletionWorkspaceNavGroup[];
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

export function CompletionWorkspaceShell({
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
}: CompletionWorkspaceShellProps) {
  return (
    <CompletionWorkspaceProvider
      initialReview={initialReview}
      engagementId={engagementId}
      fieldworkStarted={fieldworkStarted}
      fieldworkSubstantiallyComplete={fieldworkSubstantiallyComplete}
    >
      <CompletionWorkspaceChrome
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
      </CompletionWorkspaceChrome>
    </CompletionWorkspaceProvider>
  );
}
