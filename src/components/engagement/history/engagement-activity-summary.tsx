import type { EngagementActivitySummary } from "@/lib/engagement/load-engagement-activity";
import { WorkspaceMetricCard, WorkspaceSectionShell } from "@/components/workspace";

type EngagementActivitySummaryProps = {
  summary: EngagementActivitySummary;
  labels: {
    title: string;
    description: string;
    total: string;
    created: string;
    updated: string;
    statusChanged: string;
    archived: string;
    restored: string;
  };
};

export function EngagementActivitySummaryCard({ summary, labels }: EngagementActivitySummaryProps) {
  const cards = [
    { id: "total", label: labels.total, value: String(summary.total) },
    { id: "created", label: labels.created, value: String(summary.created) },
    { id: "updated", label: labels.updated, value: String(summary.updated) },
    { id: "status", label: labels.statusChanged, value: String(summary.statusChanged) },
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
