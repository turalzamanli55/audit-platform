"use client";

import type { ReactNode } from "react";
import { RiskAssessmentWorkspaceHero } from "./risk-assessment-workspace-hero";
import {
  RiskAssessmentWorkspaceSidebar,
  type RiskAssessmentWorkspaceNavGroup,
  type RiskAssessmentWorkspaceNavItem,
} from "./risk-assessment-workspace-sidebar";
import { useRiskAssessmentWorkspace } from "@/lib/risk-assessment/use-risk-assessment-workspace";

type RiskAssessmentWorkspaceChromeProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  navItems: RiskAssessmentWorkspaceNavItem[];
  navGroups: RiskAssessmentWorkspaceNavGroup[];
  navAriaLabel: string;
  labels: {
    breadcrumbRiskAssessment: string;
    heroEyebrow: string;
    summaryProgress: string;
    summaryVersion: string;
    summarySignificant: string;
    summaryPendingReviewBadge: string;
    backToEngagement: string;
    planningGateTitle: string;
    planningGateDescription: string;
    materialityGateTitle: string;
    materialityGateDescription: string;
    archivedTitle: string;
    archivedDescription: string;
    progress: string;
  };
  statusLabels: Record<string, string>;
  engagementsLabels: { breadcrumbRoot: string };
  children: ReactNode;
};

export function RiskAssessmentWorkspaceChrome({
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
}: RiskAssessmentWorkspaceChromeProps) {
  const { riskAssessment, planningApproved, materialityApproved } = useRiskAssessmentWorkspace();

  return (
    <div className="space-y-8">
      <RiskAssessmentWorkspaceHero
        locale={locale}
        engagementSlug={engagementSlug}
        engagementName={engagementName}
        riskAssessment={riskAssessment}
        planningApproved={planningApproved}
        materialityApproved={materialityApproved}
        labels={labels}
        statusLabels={statusLabels}
        engagementsLabels={engagementsLabels}
      />

      <div className="grid gap-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <RiskAssessmentWorkspaceSidebar
            items={navItems}
            groups={navGroups}
            ariaLabel={navAriaLabel}
            isArchived={riskAssessment?.isArchived}
          />
        </aside>
        <main className="min-w-0 space-y-10">{children}</main>
      </div>
    </div>
  );
}
