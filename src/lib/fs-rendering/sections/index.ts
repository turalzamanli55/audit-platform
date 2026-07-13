import type { FsNormalizedDataset, FsStatementSection } from "@/types/fs-mapping";
import type {
  FsRenderComparativeMode,
  FsRenderFormattingOptions,
  FsRenderLayoutMode,
  FsRenderStatementType,
  FsRenderedSection,
} from "@/types/fs-rendering";
import { FS_RENDER_STATEMENT_TYPES } from "@/constants/fs-rendering";
import { renderLinesFromDatasetSection } from "@/lib/fs-rendering/lines";
import { formatAmount } from "@/lib/fs-rendering/formatting";

/**
 * Section Renderer — maps dataset sections into statement presentations.
 */
export function renderSections(input: {
  dataset: FsNormalizedDataset | null;
  layoutMode: FsRenderLayoutMode;
  comparativeMode: FsRenderComparativeMode;
  formatting: FsRenderFormattingOptions;
}): FsRenderedSection[] {
  if (!input.dataset) return [];

  const sections: FsRenderedSection[] = [];
  for (const statementType of FS_RENDER_STATEMENT_TYPES) {
    const node = input.dataset.sections.find((section) => section.section === statementType);
    if (!node) continue;
    const lines = renderLinesFromDatasetSection({
      lines: node.lines,
      layoutMode: input.layoutMode,
      comparativeMode: input.comparativeMode,
      formatting: input.formatting,
    });
    sections.push({
      statementType,
      title: node.label,
      lines,
      totalFormatted: formatAmount(node.total, input.formatting),
      previousTotalFormatted:
        node.previousTotal == null ? null : formatAmount(node.previousTotal, input.formatting),
    });
  }
  return sections;
}

export function statementTitle(type: FsRenderStatementType): string {
  switch (type) {
    case "statement_of_financial_position":
      return "Statement of Financial Position";
    case "statement_of_profit_or_loss":
      return "Statement of Profit or Loss";
    case "statement_of_comprehensive_income":
      return "Statement of Comprehensive Income";
    case "statement_of_changes_in_equity":
      return "Statement of Changes in Equity";
    case "statement_of_cash_flows":
      return "Statement of Cash Flows";
    default:
      return type;
  }
}

export function isSupportedStatementSection(section: FsStatementSection): section is FsRenderStatementType {
  return (FS_RENDER_STATEMENT_TYPES as readonly string[]).includes(section);
}
