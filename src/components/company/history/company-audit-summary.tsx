import type { CompanyActivitySummary } from "@/lib/company/load-company-activity";
import { WorkspaceMetricCard, WorkspaceSectionShell } from "@/components/workspace";

type CompanyAuditSummaryProps = {
  summary: CompanyActivitySummary;
  labels: {
    title: string;
    description: string;
    total: string;
    created: string;
    updated: string;
    settingsUpdated: string;
    archived: string;
    restored: string;
  };
};

export function CompanyAuditSummary({ summary, labels }: CompanyAuditSummaryProps) {
  const cards = [
    { id: "total", label: labels.total, value: String(summary.total) },
    { id: "created", label: labels.created, value: String(summary.created) },
    { id: "updated", label: labels.updated, value: String(summary.updated) },
    { id: "settings", label: labels.settingsUpdated, value: String(summary.settingsUpdated) },
    { id: "archived", label: labels.archived, value: String(summary.archived) },
    { id: "restored", label: labels.restored, value: String(summary.restored) },
  ];

  return (
    <WorkspaceSectionShell title={labels.title} description={labels.description}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <WorkspaceMetricCard key={card.id} label={card.label} value={card.value} />
        ))}
      </div>
    </WorkspaceSectionShell>
  );
}
