import type { ReactNode } from "react";
import { WorkspaceSummaryGrid } from "@/components/workspace";

export type EngagementWorkspaceSummaryCard = {
  id: string;
  label: string;
  value: ReactNode;
  hint?: string;
};

type EngagementWorkspaceSummaryCardsProps = {
  cards: EngagementWorkspaceSummaryCard[];
  className?: string;
};

export function EngagementWorkspaceSummaryCards({
  cards,
  className = "",
}: EngagementWorkspaceSummaryCardsProps) {
  return (
    <WorkspaceSummaryGrid
      items={cards}
      className={className}
      ariaLabel="Engagement summary"
    />
  );
}
