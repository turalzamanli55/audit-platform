import type { FsAggregatedLine, FsMappingLine, FsStatementSection } from "@/types/fs-mapping";

export type FsHierarchyNode = {
  code: string;
  label: string;
  level: number;
  section: FsStatementSection;
  amount: number;
  children: FsHierarchyNode[];
  accountCodes: string[];
};

/**
 * Hierarchy Builder — statement tree from mapped lines / aggregated lines.
 */
export function buildMappingHierarchy(lines: FsMappingLine[]): FsHierarchyNode[] {
  const roots = new Map<string, FsHierarchyNode>();

  for (const line of lines.filter((entry) => entry.isMapped && entry.targetLineCode)) {
    const code = line.targetLineCode!;
    const existing = roots.get(code);
    if (!existing) {
      roots.set(code, {
        code,
        label: line.targetLineLabel ?? code,
        level: line.hierarchyLevel,
        section: line.statementSection,
        amount: line.currentYearAmount,
        children: [],
        accountCodes: [line.accountCode],
      });
    } else {
      existing.amount += line.currentYearAmount;
      existing.accountCodes.push(line.accountCode);
    }
  }

  const nodes = [...roots.values()];
  for (const line of lines) {
    if (!line.parentLineCode || !line.targetLineCode) continue;
    const parent = roots.get(line.parentLineCode);
    const child = roots.get(line.targetLineCode);
    if (parent && child && parent.code !== child.code) {
      if (!parent.children.some((entry) => entry.code === child.code)) {
        parent.children.push(child);
      }
    }
  }

  const childCodes = new Set(
    nodes.flatMap((node) => node.children.map((child) => child.code)),
  );
  return nodes
    .filter((node) => !childCodes.has(node.code))
    .sort((a, b) => a.code.localeCompare(b.code));
}

export function buildStatementTree(aggregated: FsAggregatedLine[]): FsHierarchyNode[] {
  const bySection = new Map<FsStatementSection, FsHierarchyNode>();
  for (const line of aggregated) {
    const sectionNode = bySection.get(line.section) ?? {
      code: line.section,
      label: sectionLabel(line.section),
      level: 0,
      section: line.section,
      amount: 0,
      children: [],
      accountCodes: [],
    };
    sectionNode.children.push({
      code: line.lineCode,
      label: line.lineLabel,
      level: 1,
      section: line.section,
      amount: line.amount,
      children: [],
      accountCodes: line.sourceAccountCodes,
    });
    sectionNode.amount += line.amount;
    bySection.set(line.section, sectionNode);
  }
  return [...bySection.values()];
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
