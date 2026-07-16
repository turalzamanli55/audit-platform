/**
 * Implementation repair plan — ordered by dependencies, critical path, business value.
 */
import type {
  ImplementationContract,
  ImplementationGap,
  RepairPlan,
  RepairPlanItem,
} from "@/lib/implementation-intelligence/types";

const WEIGHT: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
  informational: 0,
};

export function buildRepairPlan(
  contracts: ImplementationContract[],
  gaps: ImplementationGap[],
): RepairPlan {
  const items: RepairPlanItem[] = [];
  const criticalPath: string[] = [];

  const ordered = [...gaps].sort((a, b) => {
    const ca = contracts.find((c) => c.capabilityId === a.capabilityId);
    const cb = contracts.find((c) => c.capabilityId === b.capabilityId);
    const wa = WEIGHT[ca?.weight ?? "medium"] ?? 2;
    const wb = WEIGHT[cb?.weight ?? "medium"] ?? 2;
    if (wb !== wa) return wb - wa;
    // Prefer foundation clauses first
    const clauseOrder = ["migration", "database", "repository", "permission", "serverAction", "workflow", "tests"];
    return clauseOrder.indexOf(a.clause) - clauseOrder.indexOf(b.clause);
  });

  let order = 1;
  for (const gap of ordered) {
    const contract = contracts.find((c) => c.capabilityId === gap.capabilityId);
    const isCritical = gap.severity === "critical" || gap.severity === "high";
    if (isCritical) criticalPath.push(`${gap.capabilityId}:${gap.clause}`);

    const dependsOn: string[] = [];
    if (gap.clause === "repository") dependsOn.push(`${gap.capabilityId}:migration`);
    if (gap.clause === "serverAction") dependsOn.push(`${gap.capabilityId}:repository`);
    if (gap.clause === "tests") dependsOn.push(`${gap.capabilityId}:serverAction`);
    if (gap.clause === "workflow") dependsOn.push(`${gap.capabilityId}:serverAction`);

    items.push({
      order: order++,
      capabilityId: gap.capabilityId,
      moduleId: gap.moduleId,
      clause: gap.clause,
      action: `Satisfy contract clause ${gap.clause} for ${gap.capabilityId} — ${gap.expected}`,
      acceptance: `Clause ${gap.clause} verified with implementation evidence (status=verified)`,
      dependsOn,
      businessValue:
        contract?.weight === "informational"
          ? "low"
          : (contract?.weight as RepairPlanItem["businessValue"]) ?? "medium",
      criticalPath: isCritical,
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    items,
    criticalPath: [...new Set(criticalPath)].slice(0, 40),
  };
}
