"use client";

import Link from "next/link";
import {
  WorkspaceEmpty,
  WorkspacePanel,
  WorkspaceProgressBar,
  WorkspaceStatusBadge,
  workspaceTokens,
} from "@/components/workspace";
import type { EngagementPhaseCard } from "@/lib/engagement/engagement-phase-display";

export type { EngagementPhaseCard };

type EngagementPhaseDashboardProps = {
  cards: EngagementPhaseCard[];
  attentionTitle: string;
  attentionDescription: string;
  attentionItems: Array<{ id: string; label: string; href: string }>;
};

export function EngagementPhaseDashboard({
  cards,
  attentionTitle,
  attentionDescription,
  attentionItems,
}: EngagementPhaseDashboardProps) {
  return (
    <div className="space-y-6">
      {attentionItems.length > 0 ? (
        <div className="rounded-2xl border border-warning/30 bg-warning/5 px-5 py-4 sm:px-6">
          <p className="text-sm font-semibold text-foreground">{attentionTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">{attentionDescription}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {attentionItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="inline-flex items-center rounded-full border border-warning/40 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/60"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <WorkspacePanel key={card.id} padding="md" className="flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold tracking-tight text-foreground">{card.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
              </div>
              <WorkspaceStatusBadge label={card.statusLabel} variant={card.statusVariant} />
            </div>

            {card.isEmpty ? (
              <div className="mt-5 flex flex-1 flex-col justify-center">
                <WorkspaceEmpty title={card.emptyTitle} description={card.emptyDescription} />
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{card.kpiPrimary.label}</span>
                  <span className="font-medium text-foreground">{card.kpiPrimary.value}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{card.kpiSecondary.label}</span>
                  <span className="font-medium text-foreground">{card.kpiSecondary.value}</span>
                </div>
                <WorkspaceProgressBar label={card.kpiPrimary.label} value={card.progressPct} />
              </div>
            )}

            <div className="mt-5">
              <Link href={card.href} className={`${workspaceTokens.backButton} w-full justify-center sm:w-auto`}>
                {card.ctaLabel}
              </Link>
            </div>
          </WorkspacePanel>
        ))}
      </div>
    </div>
  );
}
