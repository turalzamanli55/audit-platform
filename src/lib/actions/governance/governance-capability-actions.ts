"use server";

import { FINANCIAL_REPORTING_PERMISSIONS } from "@/constants/financial-reporting";
import { createFinancialReportingAction } from "@/lib/actions/financial-reporting/financial-reporting-action";
import { ValidationError } from "@/lib/errors";

async function runGovernanceAction(
  capability: string,
  engagementId: string,
  summary: string,
): Promise<{ engagementId: string; capability: string; summary: string }> {
  if (!engagementId) throw new ValidationError("Engagement is required");
  if (!summary.trim()) throw new ValidationError("Summary is required");
  return { engagementId, capability, summary: summary.trim() };
}

export const trackManagementRepresentationAction = createFinancialReportingAction<
  { engagementId: string; summary: string },
  { engagementId: string; capability: string; summary: string }
>(
  { module: "financial-reporting.management-representation-tracking.track" },
  FINANCIAL_REPORTING_PERMISSIONS.GOVERNANCE_MANAGE,
  async (input) =>
    runGovernanceAction("management-representation-tracking", input.engagementId, input.summary),
);

export const documentInternalControlAction = createFinancialReportingAction<
  { engagementId: string; summary: string },
  { engagementId: string; capability: string; summary: string }
>(
  { module: "financial-reporting.internal-control-documentation.document" },
  FINANCIAL_REPORTING_PERMISSIONS.GOVERNANCE_MANAGE,
  async (input) =>
    runGovernanceAction("internal-control-documentation", input.engagementId, input.summary),
);

export const trackRemediationAction = createFinancialReportingAction<
  { engagementId: string; summary: string },
  { engagementId: string; capability: string; summary: string }
>(
  { module: "financial-reporting.remediation-tracking.track" },
  FINANCIAL_REPORTING_PERMISSIONS.GOVERNANCE_MANAGE,
  async (input) => runGovernanceAction("remediation-tracking", input.engagementId, input.summary),
);

export const documentGovernanceMeetingAction = createFinancialReportingAction<
  { engagementId: string; summary: string },
  { engagementId: string; capability: string; summary: string }
>(
  { module: "financial-reporting.governance-meeting-documentation.document" },
  FINANCIAL_REPORTING_PERMISSIONS.GOVERNANCE_MANAGE,
  async (input) =>
    runGovernanceAction("governance-meeting-documentation", input.engagementId, input.summary),
);

export const manageIndependenceAction = createFinancialReportingAction<
  { engagementId: string; summary: string },
  { engagementId: string; capability: string; summary: string }
>(
  { module: "financial-reporting.independence-management.manage" },
  FINANCIAL_REPORTING_PERMISSIONS.GOVERNANCE_MANAGE,
  async (input) =>
    runGovernanceAction("independence-management", input.engagementId, input.summary),
);

export const governDistributionAction = createFinancialReportingAction<
  { engagementId: string; summary: string },
  { engagementId: string; capability: string; summary: string }
>(
  { module: "financial-reporting.distribution-governance.govern" },
  FINANCIAL_REPORTING_PERMISSIONS.GOVERNANCE_MANAGE,
  async (input) =>
    runGovernanceAction("distribution-governance", input.engagementId, input.summary),
);
