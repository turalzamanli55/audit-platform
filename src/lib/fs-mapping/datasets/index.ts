import { aggregateMany } from "@/lib/fs-mapping/aggregation";
import type {
  FsAggregatedLine,
  FsComparativePeriod,
  FsMappingLine,
  FsMappingRule,
  FsMappingStandard,
  FsNormalizedDataset,
  FsStatementSection,
  FsStatementSectionNode,
} from "@/types/fs-mapping";

/**
 * Normalized Financial Statement Dataset builder.
 * Produces structured mapping output — never generates reports/PDFs/notes.
 */
export function buildNormalizedDataset(input: {
  standard: FsMappingStandard;
  comparativeMode: FsComparativePeriod;
  lines: FsMappingLine[];
  rules: FsMappingRule[];
}): FsNormalizedDataset {
  const mapped = input.lines.filter((line) => line.isMapped && line.targetLineCode);
  const byTarget = new Map<string, FsMappingLine[]>();
  for (const line of mapped) {
    const key = line.targetLineCode!;
    const list = byTarget.get(key) ?? [];
    list.push(line);
    byTarget.set(key, list);
  }

  const aggregated: FsAggregatedLine[] = [];
  for (const [lineCode, group] of byTarget) {
    const rule = input.rules.find((entry) => entry.targetLineCode === lineCode && entry.isActive);
    const method = rule?.aggregationMethod ?? group[0]?.aggregationMethod ?? "sum";
    aggregated.push(
      ...aggregateMany([
        {
          lineCode,
          lineLabel: rule?.ruleName ?? group[0]?.targetLineLabel ?? lineCode,
          section: rule?.targetSection ?? group[0]!.statementSection,
          classification: rule?.classification ?? group[0]!.classification,
          method,
          amounts: group.map((line) => line.currentYearAmount),
          previousAmounts: group.map((line) => line.previousYearAmount),
          weights: rule?.weight != null ? group.map(() => rule.weight!) : undefined,
          sourceAccountCodes: group.map((line) => line.accountCode),
          formulaResult: null,
          isCalculated: Boolean(rule && (rule.ruleType === "formula" || rule.ruleType === "calculated")),
        },
      ]),
    );
  }

  const sections = buildSections(aggregated);
  const mappedCount = mapped.length;
  const unmappedCount = input.lines.length - mappedCount;
  const coveragePct =
    input.lines.length === 0 ? 0 : Number(((mappedCount / input.lines.length) * 100).toFixed(2));

  return {
    standard: input.standard,
    comparativeMode: input.comparativeMode,
    sections,
    coveragePct,
    mappedAccountCount: mappedCount,
    unmappedAccountCount: unmappedCount,
    builtAt: new Date().toISOString(),
  };
}

function buildSections(lines: FsAggregatedLine[]): FsStatementSectionNode[] {
  const order: FsStatementSection[] = [
    "statement_of_financial_position",
    "statement_of_profit_or_loss",
    "statement_of_comprehensive_income",
    "statement_of_changes_in_equity",
    "statement_of_cash_flows",
    "other",
  ];
  return order
    .map((section) => {
      const sectionLines = lines.filter((line) => line.section === section);
      if (sectionLines.length === 0) return null;
      return {
        section,
        label: sectionLabel(section),
        lines: sectionLines,
        total: sectionLines.reduce((sum, line) => sum + line.amount, 0),
        previousTotal: sectionLines.every((line) => line.previousYearAmount == null)
          ? null
          : sectionLines.reduce((sum, line) => sum + (line.previousYearAmount ?? 0), 0),
      } satisfies FsStatementSectionNode;
    })
    .filter((entry): entry is FsStatementSectionNode => entry != null);
}

function sectionLabel(section: FsStatementSection): string {
  switch (section) {
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
      return "Other";
  }
}
