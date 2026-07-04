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
  ariaLabel?: string;
};

export function EngagementWorkspaceSummaryCards({
  cards,
  className = "",
  ariaLabel,
}: EngagementWorkspaceSummaryCardsProps) {
  return (
    <WorkspaceSummaryGrid
      items={cards}
      className={className}
      ariaLabel={ariaLabel}
    />
  );
}
