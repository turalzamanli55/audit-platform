"use client";

type AuditCommitteeDashboardsPanelProps = {
  openFindings: number;
  overdueRecommendations: number;
  unclearedReviews: number;
  riskScore: number;
  opinionStatus: string;
};

export function AuditCommitteeDashboardsPanel({
  openFindings,
  overdueRecommendations,
  unclearedReviews,
  riskScore,
  opinionStatus,
}: AuditCommitteeDashboardsPanelProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Metric label="Open findings" value={String(openFindings)} />
      <Metric label="Overdue recommendations" value={String(overdueRecommendations)} />
      <Metric label="Uncleared reviews" value={String(unclearedReviews)} />
      <Metric label="Risk score" value={String(riskScore)} hint={opinionStatus} />
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {hint ? <p className="mt-1 text-sm capitalize text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
