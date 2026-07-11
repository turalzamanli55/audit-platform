"use client";

import type { ReactNode } from "react";
import { FinancialStatementsWorkspaceHero } from "./financial-statements-workspace-hero";
import {
  FinancialStatementsWorkspaceSidebar,
  type FinancialStatementsWorkspaceNavGroup,
  type FinancialStatementsWorkspaceNavItem,
} from "./financial-statements-workspace-sidebar";
import { useFinancialStatementsWorkspace } from "@/lib/financial-statements/use-financial-statements-workspace";

type FinancialStatementsWorkspaceChromeProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
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

export function FinancialStatementsWorkspaceChrome({
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
}: FinancialStatementsWorkspaceChromeProps) {
  const { review, fieldworkStarted } = useFinancialStatementsWorkspace();

  return (
    <div className="space-y-8">
      <FinancialStatementsWorkspaceHero
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
          <FinancialStatementsWorkspaceSidebar
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
