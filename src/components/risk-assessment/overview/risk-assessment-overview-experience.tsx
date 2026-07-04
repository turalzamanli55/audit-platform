"use client";

import type { RiskAssessmentCommandCenterData } from "@/types/risk-assessment-command-center";
import type { Dictionary } from "@/i18n/get-dictionary";
import { RiskAssessmentCommandCenter } from "../command-center/risk-assessment-command-center";
import { RiskAssessmentCreateExperience } from "@/components/risk-assessment/create/risk-assessment-create-experience";
import { useRiskAssessmentWorkspace } from "@/lib/risk-assessment/use-risk-assessment-workspace";

type RiskAssessmentOverviewExperienceProps = {
  locale: string;
  slug: string;
  canCreate: boolean;
  canSubmit: boolean;
  canReview: boolean;
  canApprove: boolean;
  planningApproved: boolean;
  hasRiskAssessment: boolean;
  commandCenter: RiskAssessmentCommandCenterData | null;
  labels: Dictionary["riskAssessment"]["workspace"];
  riskLabels: Dictionary["riskAssessment"];
};

export function RiskAssessmentOverviewExperience({
  locale,
  slug,
  canCreate,
  canSubmit,
  canReview,
  canApprove,
  planningApproved,
  hasRiskAssessment,
  commandCenter,
  labels,
  riskLabels,
}: RiskAssessmentOverviewExperienceProps) {
  const { materialityApproved } = useRiskAssessmentWorkspace();

  if (!hasRiskAssessment || !commandCenter) {
    return (
      <RiskAssessmentCreateExperience
        canCreate={canCreate}
        planningApproved={planningApproved}
        materialityApproved={materialityApproved}
        labels={riskLabels.empty}
        gateLabels={{
          planningGateDescription: labels.planningGateDescription,
          materialityGateDescription: labels.materialityGateDescription,
        }}
      />
    );
  }

  return (
    <RiskAssessmentCommandCenter
      locale={locale}
      slug={slug}
      commandCenter={commandCenter}
      canSubmit={canSubmit}
      canReview={canReview}
      canApprove={canApprove}
      labels={labels}
      riskLabels={riskLabels}
    />
  );
}
