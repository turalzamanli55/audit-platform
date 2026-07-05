import type { ReactNode } from "react";
import { WorkspaceSummaryGrid } from "@/components/workspace";

export type CompanyWorkspaceSummaryCard = {
  id: string;
  label: string;
  value: ReactNode;
  hint?: string;
};

type CompanyWorkspaceSummaryCardsProps = {
  cards: CompanyWorkspaceSummaryCard[];
  className?: string;
  ariaLabel?: string;
};

export function CompanyWorkspaceSummaryCards({
  cards,
  className = "",
  ariaLabel,
}: CompanyWorkspaceSummaryCardsProps) {
  return (
    <WorkspaceSummaryGrid items={cards} className={className} ariaLabel={ariaLabel} />
  );
}
