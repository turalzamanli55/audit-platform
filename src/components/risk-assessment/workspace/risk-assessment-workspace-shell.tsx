"use client";

import type { ReactNode } from "react";
import { RiskAssessmentWorkspaceChrome } from "./risk-assessment-workspace-chrome";
import type { RiskAssessmentWorkspaceView } from "@/lib/risk-assessment/risk-assessment-workspace-view";
import {
  RiskAssessmentWorkspaceProvider,
} from "@/lib/risk-assessment/use-risk-assessment-workspace";
import type { RiskAssessmentWorkspaceNavItem } from "./risk-assessment-workspace-sidebar";

type RiskAssessmentWorkspaceShellProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  initialRiskAssessment: RiskAssessmentWorkspaceView | null;
  planningApproved: boolean;
  materialityApproved: boolean;
  engagementId: string;
  navItems: RiskAssessmentWorkspaceNavItem[];
  navAriaLabel: string;
  labels: {
    breadcrumbRiskAssessment: string;
    heroEyebrow: string;
    summaryProgress: string;
    backToEngagement: string;
    planningGateTitle: string;
    planningGateDescription: string;
    archivedTitle: string;
    archivedDescription: string;
  };
  riskLabels?: unknown;
  statusLabels: Record<string, string>;
  engagementsLabels: { breadcrumbRoot: string };
  children: ReactNode;
};

export function RiskAssessmentWorkspaceShell({
  locale,
  engagementSlug,
  engagementName,
  initialRiskAssessment,
  planningApproved,
  materialityApproved,
  engagementId,
  navItems,
  navAriaLabel,
  labels,
  statusLabels,
  engagementsLabels,
  children,
}: RiskAssessmentWorkspaceShellProps) {
  return (
    <RiskAssessmentWorkspaceProvider
      initialRiskAssessment={initialRiskAssessment}
      engagementId={engagementId}
      planningApproved={planningApproved}
      materialityApproved={materialityApproved}
    >
      <RiskAssessmentWorkspaceChrome
        locale={locale}
        engagementSlug={engagementSlug}
        engagementName={engagementName}
        navItems={navItems}
        navAriaLabel={navAriaLabel}
        labels={labels}
        statusLabels={statusLabels}
        engagementsLabels={engagementsLabels}
      >
        {children}
      </RiskAssessmentWorkspaceChrome>
    </RiskAssessmentWorkspaceProvider>
  );
}
