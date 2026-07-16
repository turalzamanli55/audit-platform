/**
 * Implementation graph: Module → Capability → Contract → Implementation → Gap → Repair.
 */
import type {
  ImplementationContract,
  ImplementationGap,
  ImplementationGraph,
  RepairPlan,
} from "@/lib/implementation-intelligence/types";

export function buildImplementationGraph(input: {
  contracts: ImplementationContract[];
  gaps: ImplementationGap[];
  repairPlan: RepairPlan;
}): ImplementationGraph {
  const nodes: ImplementationGraph["nodes"] = [];
  const edges: ImplementationGraph["edges"] = [];
  const seen = new Set<string>();

  const add = (node: ImplementationGraph["nodes"][number]) => {
    if (seen.has(node.id)) return;
    seen.add(node.id);
    nodes.push(node);
  };

  for (const contract of input.contracts) {
    add({
      id: `module:${contract.moduleId}`,
      kind: "module",
      label: contract.moduleId,
    });
    add({
      id: `capability:${contract.capabilityId}`,
      kind: "capability",
      label: contract.capabilityName,
      meta: { coveragePct: contract.coveragePct, certified: contract.certified },
    });
    add({
      id: contract.contractId,
      kind: "contract",
      label: contract.contractId,
      meta: { satisfied: contract.contractSatisfied },
    });
    edges.push({
      from: `module:${contract.moduleId}`,
      to: `capability:${contract.capabilityId}`,
      relation: "owns",
    });
    edges.push({
      from: `capability:${contract.capabilityId}`,
      to: contract.contractId,
      relation: "has_contract",
    });

    for (const clause of contract.clauses.filter((c) => c.required)) {
      const implId = `impl:${contract.capabilityId}:${clause.id}`;
      add({
        id: implId,
        kind: "implementation",
        label: `${clause.id}:${clause.status}`,
        meta: { verified: clause.verified },
      });
      edges.push({
        from: contract.contractId,
        to: implId,
        relation: "requires",
      });
    }
  }

  for (const gap of input.gaps.slice(0, 200)) {
    const gapId = `gap:${gap.capabilityId}:${gap.clause}`;
    add({
      id: gapId,
      kind: "gap",
      label: gap.clause,
      meta: { severity: gap.severity },
    });
    edges.push({
      from: `capability:${gap.capabilityId}`,
      to: gapId,
      relation: "has_gap",
    });
  }

  for (const item of input.repairPlan.items.slice(0, 200)) {
    const repairId = `repair:${item.order}:${item.capabilityId}:${item.clause}`;
    add({
      id: repairId,
      kind: "repair",
      label: item.action.slice(0, 80),
      meta: { order: item.order, criticalPath: item.criticalPath },
    });
    edges.push({
      from: `gap:${item.capabilityId}:${item.clause}`,
      to: repairId,
      relation: "repaired_by",
    });
  }

  return {
    nodes: nodes.slice(0, 4000),
    edges: edges.slice(0, 8000),
  };
}
