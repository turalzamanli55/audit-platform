import {
  AuditCommitteeDashboardsPanel,
  AuditCommitteeDashboardsWorkspaceProvider,
} from "@/components/audit-engine";
import { auditCommitteeRiskScore } from "@/lib/audit-engine/audit-committee-dashboards";

export default function AuditCommitteeDashboardsPage() {
  const kpis = {
    openFindings: 0,
    overdueRecommendations: 0,
    unclearedReviews: 0,
    opinionStatus: "pending" as const,
  };

  return (
    <AuditCommitteeDashboardsWorkspaceProvider
      title="Audit committee dashboards"
      subtitle="Executive visibility across findings, reviews, and opinion readiness."
    >
      <AuditCommitteeDashboardsPanel
        {...kpis}
        riskScore={auditCommitteeRiskScore(kpis)}
      />
    </AuditCommitteeDashboardsWorkspaceProvider>
  );
}
