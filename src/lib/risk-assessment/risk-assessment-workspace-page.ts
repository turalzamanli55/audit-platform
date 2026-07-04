import "server-only";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, type Locale } from "@/i18n";
import { loadRiskAssessmentWorkspaceCached } from "@/lib/risk-assessment/load-risk-assessment-workspace";

export type RiskAssessmentWorkspacePageResult =
  | {
      ok: true;
      riskAssessment: import("@/lib/risk-assessment/risk-assessment-workspace-view").RiskAssessmentWorkspaceView | null;
      engagementSlug: string;
      planningApproved: boolean;
      materialityApproved: boolean;
      riskAssessmentApproved: boolean;
    }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

export async function loadRiskAssessmentWorkspacePage(
  engagementSlug: string,
): Promise<RiskAssessmentWorkspacePageResult> {
  return loadRiskAssessmentWorkspaceCached(engagementSlug);
}

export async function generateRiskAssessmentWorkspaceMetadata(
  engagementSlug: string,
  locale: Locale,
): Promise<Metadata> {
  const dictionary = await getDictionary(locale);
  const result = await loadRiskAssessmentWorkspacePage(engagementSlug);

  if (!result.ok) {
    return { title: `Risk assessment | ${dictionary.common.appName}` };
  }

  return {
    title: `Risk assessment | ${dictionary.common.appName}`,
    description: "Assess, review, and approve engagement risks before fieldwork.",
  };
}

export async function requireRiskAssessmentWorkspace(engagementSlug: string) {
  const result = await loadRiskAssessmentWorkspaceCached(engagementSlug);
  if (!result.ok) notFound();
  return result;
}
