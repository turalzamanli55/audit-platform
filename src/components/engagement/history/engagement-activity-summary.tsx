import { Card } from "@/components/ui/card";
import type { EngagementActivitySummary } from "@/lib/engagement/load-engagement-activity";

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
    { id: "total", label: labels.total, value: summary.total },
    { id: "created", label: labels.created, value: summary.created },
    { id: "updated", label: labels.updated, value: summary.updated },
    { id: "status", label: labels.statusChanged, value: summary.statusChanged },
    { id: "archived", label: labels.archived, value: summary.archived },
    { id: "restored", label: labels.restored, value: summary.restored },
  ];

  return (
    <section className="space-y-4" aria-label={labels.title}>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">{labels.title}</h3>
        <p className="text-sm text-muted-foreground">{labels.description}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.id} className="border-border/50 bg-card/80 p-4 shadow-xs">
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{card.value}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
