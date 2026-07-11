"use client";

import type { ReactNode } from "react";
import { FinancialStatementsWorkspaceChrome } from "./financial-statements-workspace-chrome";
import type { FinancialStatementsWorkspaceView } from "@/lib/financial-statements/financial-statements-workspace-view";
import { FinancialStatementsWorkspaceProvider } from "@/lib/financial-statements/use-financial-statements-workspace";
import type {
  FinancialStatementsWorkspaceNavGroup,
  FinancialStatementsWorkspaceNavItem,
} from "./financial-statements-workspace-sidebar";

type FinancialStatementsWorkspaceShellProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  initialFinancialStatements: FinancialStatementsWorkspaceView | null;
  prerequisitesMet: boolean;
  opinionApproved: boolean;
  engagementId: string;
  navItems: FinancialStatementsWorkspaceNavItem[];
  navGroups: FinancialStatementsWorkspaceNavGroup[];
  navAriaLabel: string;
  labels: {
    breadcrumbFinancialStatements: string;
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

export function FinancialStatementsWorkspaceShell({
  locale,
  engagementSlug,
  engagementName,
  initialFinancialStatements,
  prerequisitesMet,
  opinionApproved,
  engagementId,
  navItems,
  navGroups,
  navAriaLabel,
  labels,
  statusLabels,
  engagementsLabels,
  children,
}: FinancialStatementsWorkspaceShellProps) {
  return (
    <FinancialStatementsWorkspaceProvider
      initialReview={initialFinancialStatements}
      engagementId={engagementId}
      fieldworkStarted={prerequisitesMet}
      fieldworkSubstantiallyComplete={opinionApproved}
    >
      <FinancialStatementsWorkspaceChrome
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
      </FinancialStatementsWorkspaceChrome>
    </FinancialStatementsWorkspaceProvider>
  );
}
