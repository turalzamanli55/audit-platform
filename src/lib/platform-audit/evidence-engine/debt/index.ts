/**
 * Classified technical debt — severity-weighted, not equal TODO counting.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ClassifiedDebtItem } from "@/lib/platform-audit/evidence-engine/types";
import type { ModuleEvidenceResolution } from "@/lib/platform-audit/evidence-engine/types";
import { toRepoPath, walkFiles } from "@/lib/platform-audit/utils";

const WEIGHT: Record<ClassifiedDebtItem["severity"], number> = {
  critical: 25,
  high: 10,
  medium: 4,
  low: 1,
  informational: 0.25,
};

export function classifyTechnicalDebt(input: {
  cwd: string;
  modules: ModuleEvidenceResolution[];
}): { items: ClassifiedDebtItem[]; scorePct: number } {
  const items: ClassifiedDebtItem[] = [];

  for (const file of walkFiles(join(input.cwd, "src"), [".ts", ".tsx"]).slice(0, 2500)) {
    const source = readFileSync(file, "utf8");
    const relative = toRepoPath(input.cwd, file);

    if (/\bFIXME\b/.test(source)) {
      items.push({
        code: "fixme",
        severity: "high",
        message: `FIXME in ${relative}`,
        rootCause: "Known defect marker",
        paths: [relative],
        weight: WEIGHT.high,
      });
    }
    if (/\bXXX\b|\bHACK\b/.test(source)) {
      items.push({
        code: "hack_marker",
        severity: "medium",
        message: `HACK/XXX in ${relative}`,
        rootCause: "Temporary workaround marker",
        paths: [relative],
        weight: WEIGHT.medium,
      });
    }
    if (/\bnot implemented\b|\bthrow new Error\(["']Not implemented/i.test(source)) {
      items.push({
        code: "not_implemented",
        severity: "critical",
        message: `Not-implemented stub in ${relative}`,
        rootCause: "Stubbed implementation path",
        paths: [relative],
        weight: WEIGHT.critical,
      });
    }
    if (/\bTODO\b/.test(source)) {
      items.push({
        code: "todo",
        severity: "informational",
        message: `TODO in ${relative}`,
        rootCause: "Deferred work marker (informational)",
        paths: [relative],
        weight: WEIGHT.informational,
      });
    }
    if (/\bplaceholder\b|\bmock implementation\b/i.test(source)) {
      items.push({
        code: "placeholder",
        severity: "medium",
        message: `Placeholder/mock wording in ${relative}`,
        rootCause: "Possible incomplete implementation",
        paths: [relative],
        weight: WEIGHT.medium,
      });
    }
  }

  for (const module of input.modules) {
    if (module.matchedRoots.length === 0 && module.verifiedCompletionPct === 0) {
      items.push({
        code: "unimplemented_bible_module",
        severity: "high",
        message: `Bible module ${module.moduleId} has no resolved implementation roots`,
        rootCause: "No alias-matched lib/repository/component evidence",
        paths: [],
        weight: WEIGHT.high,
      });
    }
  }

  // Cap informational TODOs contribution
  const todos = items.filter((i) => i.code === "todo");
  const nonTodos = items.filter((i) => i.code !== "todo");
  const cappedTodos = todos.slice(0, 20);
  const finalItems = [...nonTodos, ...cappedTodos];

  const totalWeight = finalItems.reduce((sum, item) => sum + item.weight, 0);
  const scorePct = Math.max(0, Number((100 - Math.min(70, totalWeight)).toFixed(2)));

  return { items: finalItems.slice(0, 300), scorePct };
}
