import type { CompanyActivitySummary } from "@/lib/company/load-company-activity";
import { Card } from "@/components/ui/card";

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
    { id: "total", label: labels.total, value: summary.total },
    { id: "created", label: labels.created, value: summary.created },
    { id: "updated", label: labels.updated, value: summary.updated },
    { id: "settings", label: labels.settingsUpdated, value: summary.settingsUpdated },
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
          <Card
            key={card.id}
            className="border-border/50 bg-card/80 p-4 shadow-xs"
          >
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {card.value}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
