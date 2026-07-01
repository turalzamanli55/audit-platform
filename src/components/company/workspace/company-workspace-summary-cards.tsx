import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export type CompanyWorkspaceSummaryCard = {
  id: string;
  label: string;
  value: ReactNode;
  hint?: string;
};

type CompanyWorkspaceSummaryCardsProps = {
  cards: CompanyWorkspaceSummaryCard[];
  className?: string;
};

/**
 * High-level workspace metrics — calm, scannable summary surfaces.
 */
export function CompanyWorkspaceSummaryCards({
  cards,
  className = "",
}: CompanyWorkspaceSummaryCardsProps) {
  return (
    <div
      className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-4 ${className}`}
      role="list"
      aria-label="Company summary"
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          role="listitem"
          className="border-border/50 bg-card/80 p-5 shadow-xs transition-shadow duration-200 hover:shadow-sm"
        >
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
              {card.label}
            </p>
            <p className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {card.value}
            </p>
            {card.hint ? (
              <p className="text-xs leading-relaxed text-muted-foreground">{card.hint}</p>
            ) : null}
          </div>
        </Card>
      ))}
    </div>
  );
}
