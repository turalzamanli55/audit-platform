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
};

export function CompanyWorkspaceSummaryCards({
  cards,
  className = "",
}: CompanyWorkspaceSummaryCardsProps) {
  return (
    <WorkspaceSummaryGrid items={cards} className={className} ariaLabel="Company summary" />
  );
}
