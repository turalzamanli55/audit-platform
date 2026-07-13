import type {
  FsMappingLine,
  FsMappingRule,
  FsValidationIssue,
  FsValidationReport,
} from "@/types/fs-mapping";

/**
 * Mapping Validation — missing, duplicate, orphan, formula, circular, negative, imbalance.
 */
export function validateFsMapping(input: {
  lines: FsMappingLine[];
  rules: FsMappingRule[];
}): FsValidationReport {
  const errors: FsValidationIssue[] = [];
  const warnings: FsValidationIssue[] = [];

  const mapped = input.lines.filter((line) => line.isMapped);
  const unmapped = input.lines.filter((line) => !line.isMapped);
  const coveragePct =
    input.lines.length === 0 ? 0 : Number(((mapped.length / input.lines.length) * 100).toFixed(2));

  for (const line of unmapped) {
    warnings.push({
      code: "missing_mapping",
      severity: "warning",
      message: `Account ${line.accountCode} is not mapped to a statement line.`,
      entityType: "line",
      entityId: line.id,
      accountCode: line.accountCode,
    });
  }

  const targetCounts = new Map<string, string[]>();
  for (const line of mapped) {
    if (!line.targetLineCode) continue;
    const list = targetCounts.get(line.targetLineCode) ?? [];
    list.push(line.accountCode);
    targetCounts.set(line.targetLineCode, list);
  }

  const accountTargets = new Map<string, string[]>();
  for (const line of mapped) {
    if (!line.targetLineCode) continue;
    const list = accountTargets.get(line.accountCode) ?? [];
    list.push(line.targetLineCode);
    accountTargets.set(line.accountCode, list);
  }
  for (const [accountCode, targets] of accountTargets) {
    const unique = [...new Set(targets)];
    if (unique.length > 1) {
      errors.push({
        code: "duplicate_mapping",
        severity: "error",
        message: `Account ${accountCode} maps to multiple targets: ${unique.join(", ")}.`,
        entityType: "line",
        accountCode,
      });
    }
  }

  const presentCodes = new Set(input.lines.map((line) => line.accountCode));
  for (const rule of input.rules.filter((entry) => entry.isActive)) {
    for (const source of rule.sourceAccountCodes) {
      if (source.endsWith("*")) continue;
      if (!presentCodes.has(source)) {
        warnings.push({
          code: "orphan_account",
          severity: "warning",
          message: `Rule ${rule.ruleCode} references account ${source} which is not present in the trial balance mapping lines.`,
          entityType: "rule",
          entityId: rule.id,
          accountCode: source,
          targetLineCode: rule.targetLineCode,
        });
      }
    }
  }

  for (const line of input.lines) {
    if (line.isOrphan || (line.isMapped && !line.mappingRuleId && !line.targetLineCode)) {
      errors.push({
        code: "orphan_account",
        severity: "error",
        message: `Account ${line.accountCode} is an orphan mapping entry.`,
        entityType: "line",
        entityId: line.id,
        accountCode: line.accountCode,
      });
    }
  }

  for (const rule of input.rules.filter((entry) => entry.isActive)) {
    if ((rule.ruleType === "formula" || rule.ruleType === "calculated") && !rule.formulaExpression?.trim()) {
      errors.push({
        code: "invalid_formula",
        severity: "error",
        message: `Rule ${rule.ruleCode} requires a formula expression.`,
        entityType: "rule",
        entityId: rule.id,
        targetLineCode: rule.targetLineCode,
      });
    }
    if (rule.ruleType === "conditional" && !rule.conditionExpression?.trim()) {
      errors.push({
        code: "invalid_formula",
        severity: "error",
        message: `Rule ${rule.ruleCode} requires a condition expression.`,
        entityType: "rule",
        entityId: rule.id,
        targetLineCode: rule.targetLineCode,
      });
    }
    if (rule.sourceAccountCodes.includes(rule.targetLineCode)) {
      errors.push({
        code: "circular_mapping",
        severity: "error",
        message: `Rule ${rule.ruleCode} creates a circular mapping on ${rule.targetLineCode}.`,
        entityType: "rule",
        entityId: rule.id,
        targetLineCode: rule.targetLineCode,
      });
    }
  }

  const graph = buildDependencyGraph(input.rules);
  const circular = detectCycles(graph);
  for (const node of circular) {
    errors.push({
      code: "circular_mapping",
      severity: "error",
      message: `Circular mapping dependency detected at ${node}.`,
      entityType: "rule",
      targetLineCode: node,
    });
  }

  for (const rule of input.rules.filter((entry) => entry.isActive && !entry.allowsNegative)) {
    const related = mapped.filter((line) => line.targetLineCode === rule.targetLineCode);
    for (const line of related) {
      if (line.currentYearAmount < 0) {
        errors.push({
          code: "negative_restriction",
          severity: "error",
          message: `Negative amount not allowed for ${line.accountCode} → ${rule.targetLineCode}.`,
          entityType: "line",
          entityId: line.id,
          accountCode: line.accountCode,
          targetLineCode: rule.targetLineCode,
        });
      }
    }
  }

  const sectionTotals = new Map<string, number>();
  for (const line of mapped) {
    const key = line.statementSection;
    sectionTotals.set(key, (sectionTotals.get(key) ?? 0) + line.currentYearAmount);
  }
  const assets =
    (sectionTotals.get("statement_of_financial_position") ?? 0);
  if (Math.abs(assets) > 0 && mapped.some((line) => line.classification.includes("asset"))) {
    // Soft imbalance warning only when both asset and liability families present.
    const hasAssets = mapped.some((line) =>
      line.classification === "assets" ||
      line.classification === "current_assets" ||
      line.classification === "non_current_assets",
    );
    const hasLiabilities = mapped.some((line) =>
      line.classification === "liabilities" ||
      line.classification === "current_liabilities" ||
      line.classification === "non_current_liabilities" ||
      line.classification === "equity",
    );
    if (hasAssets && hasLiabilities) {
      const assetSum = mapped
        .filter((line) =>
          line.classification === "assets" ||
          line.classification === "current_assets" ||
          line.classification === "non_current_assets",
        )
        .reduce((sum, line) => sum + line.currentYearAmount, 0);
      const equityLiabSum = mapped
        .filter((line) =>
          line.classification === "liabilities" ||
          line.classification === "current_liabilities" ||
          line.classification === "non_current_liabilities" ||
          line.classification === "equity",
        )
        .reduce((sum, line) => sum + line.currentYearAmount, 0);
      if (Math.abs(assetSum - equityLiabSum) > 0.01) {
        warnings.push({
          code: "section_imbalance",
          severity: "warning",
          message: `Statement of financial position imbalance: assets ${assetSum.toFixed(2)} vs equity+liabilities ${equityLiabSum.toFixed(2)}.`,
          entityType: "section",
        });
      }
    }
  }

  if (input.rules.filter((rule) => rule.isActive).length === 0) {
    errors.push({
      code: "missing_mapping",
      severity: "error",
      message: "Mapping set has no active rules.",
      entityType: "set",
    });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    coveragePct,
    mappedCount: mapped.length,
    unmappedCount: unmapped.length,
  };
}

function buildDependencyGraph(rules: FsMappingRule[]): Map<string, string[]> {
  const graph = new Map<string, string[]>();
  for (const rule of rules.filter((entry) => entry.isActive)) {
    const deps = rule.sourceAccountCodes.filter((code) =>
      rules.some((other) => other.targetLineCode === code),
    );
    graph.set(rule.targetLineCode, deps);
  }
  return graph;
}

function detectCycles(graph: Map<string, string[]>): string[] {
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const cycles: string[] = [];

  function dfs(node: string): boolean {
    if (visiting.has(node)) {
      cycles.push(node);
      return true;
    }
    if (visited.has(node)) return false;
    visiting.add(node);
    for (const next of graph.get(node) ?? []) {
      if (dfs(next)) return true;
    }
    visiting.delete(node);
    visited.add(node);
    return false;
  }

  for (const node of graph.keys()) dfs(node);
  return [...new Set(cycles)];
}
