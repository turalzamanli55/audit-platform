"use client";

import type { ReactNode } from "react";
import { RiskAssessmentWorkspaceChrome } from "./risk-assessment-workspace-chrome";
import type { RiskAssessmentWorkspaceView } from "@/lib/risk-assessment/risk-assessment-workspace-view";
import {
  RiskAssessmentWorkspaceProvider,
} from "@/lib/risk-assessment/use-risk-assessment-workspace";
import type { RiskAssessmentWorkspaceNavGroup, RiskAssessmentWorkspaceNavItem } from "./risk-assessment-workspace-sidebar";

type RiskAssessmentWorkspaceShellProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  initialRiskAssessment: RiskAssessmentWorkspaceView | null;
  planningApproved: boolean;
  materialityApproved: boolean;
  engagementId: string;
  navItems: RiskAssessmentWorkspaceNavItem[];
  navGroups: RiskAssessmentWorkspaceNavGroup[];
  navAriaLabel: string;
  labels: {
    breadcrumbRiskAssessment: string;
    heroEyebrow: string;
    summaryProgress: string;
    summaryVersion: string;
    summarySignificant: string;
    backToEngagement: string;
    planningGateTitle: string;
    planningGateDescription: string;
    materialityGateTitle: string;
    materialityGateDescription: string;
    archivedTitle: string;
    archivedDescription: string;
    progress: string;
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
  navGroups,
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
        navGroups={navGroups}
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
