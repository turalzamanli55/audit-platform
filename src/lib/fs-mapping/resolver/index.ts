import type { FsMappingLine, FsMappingRule, FsMappingSet } from "@/types/fs-mapping";
import { classifyFsAccount } from "@/lib/fs-mapping/classification";

/**
 * Resolver — resolve target lines / classifications for accounts and search queries.
 */
export function resolveTargetForAccount(input: {
  accountCode: string;
  accountName: string;
  rules: FsMappingRule[];
}): { rule: FsMappingRule | null; classification: ReturnType<typeof classifyFsAccount> } {
  const classification = classifyFsAccount(input.accountCode, input.accountName);
  const rule =
    input.rules
      .filter((entry) => entry.isActive)
      .find((entry) =>
        entry.sourceAccountCodes.some((source) =>
          source.endsWith("*")
            ? input.accountCode.startsWith(source.slice(0, -1))
            : source === input.accountCode,
        ),
      ) ?? null;
  return { rule, classification };
}

export function searchMappingEntities(input: {
  query: string;
  set: FsMappingSet | null;
  rules: FsMappingRule[];
  lines: FsMappingLine[];
}): Array<{ kind: "rule" | "line"; id: string; label: string; meta: string }> {
  const q = input.query.trim().toLowerCase();
  if (!q) return [];
  const results: Array<{ kind: "rule" | "line"; id: string; label: string; meta: string }> = [];

  for (const rule of input.rules) {
    const hay = `${rule.ruleCode} ${rule.ruleName} ${rule.targetLineCode}`.toLowerCase();
    if (hay.includes(q)) {
      results.push({
        kind: "rule",
        id: rule.id,
        label: rule.ruleName,
        meta: `${rule.ruleCode} → ${rule.targetLineCode}`,
      });
    }
  }
  for (const line of input.lines) {
    const hay = `${line.accountCode} ${line.accountName} ${line.targetLineCode ?? ""}`.toLowerCase();
    if (hay.includes(q)) {
      results.push({
        kind: "line",
        id: line.id,
        label: `${line.accountCode} ${line.accountName}`,
        meta: line.isMapped ? `Mapped → ${line.targetLineCode}` : "Unmapped",
      });
    }
  }
  return results.slice(0, 50);
}
