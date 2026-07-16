/**
 * Module readiness — dimensions from EIIE contracts; completion/readiness from ECIE modules.
 */
import type { EpireInputs } from "@/lib/platform-inventory/resolver";
import type { ImplementationContract } from "@/lib/implementation-intelligence/types";
import {
  DIMENSION_TO_CLAUSES,
  MODULE_DIMENSIONS,
  deriveReadinessLevel,
  type DimensionScore,
  type ModuleDimension,
  type ModuleInventoryItem,
  type ReadinessLevel,
} from "@/lib/platform-inventory/types";

export function buildModuleInventory(inputs: EpireInputs): ModuleInventoryItem[] {
  const { epbse, ecie, eiie } = inputs;
  const contractsByModule = groupContracts(eiie.contracts);
  const ecieById = new Map(ecie.modules.map((m) => [m.id, m]));
  const capsByModule = groupCaps(ecie.capabilities);
  const deps = epbse.snapshot.modules;

  const blockedEdges = eiie.contracts
    .filter((c) => c.blocked)
    .map((c) => ({ id: c.capabilityId, blockedBy: c.blockedBy, moduleId: c.moduleId }));

  return deps.map((mod) => {
    const contracts = contractsByModule.get(mod.id) ?? [];
    const ecieMod = ecieById.get(mod.id);
    const caps = capsByModule.get(mod.id) ?? [];
    const dimensions = scoreDimensions(contracts);
    const certifiedCapabilityIds = contracts.filter((c) => c.certified).map((c) => c.capabilityId);
    const remainingCapabilityIds = contracts
      .filter((c) => !c.certified && !c.blocked)
      .map((c) => c.capabilityId);
    const blockedCapabilityIds =
      ecieMod?.blockedCapabilityIds ??
      contracts.filter((c) => c.blocked).map((c) => c.capabilityId);

    const completionPct =
      ecieMod?.completionPct ??
      (contracts.length === 0
        ? 0
        : Number(
            (
              contracts.reduce((s, c) => s + c.coveragePct, 0) / Math.max(1, contracts.length)
            ).toFixed(2),
          ));

    const countable = contracts.filter((c) => !c.blocked);
    const allCertified =
      countable.length > 0 && countable.every((c) => c.certified);
    const readiness: ReadinessLevel =
      ecieMod?.readiness ?? deriveReadinessLevel(completionPct, allCertified);

    const implemented = dimensions
      .filter((d) => d.required > 0 && d.completionPct >= 100)
      .map((d) => d.dimension);
    const remaining = dimensions
      .filter((d) => d.required > 0 && d.completionPct < 100)
      .map((d) => `${d.dimension} (${d.verified}/${d.required})`);

    const nextRequiredWork = eiie.repairPlan.items
      .filter((i) => i.moduleId === mod.id)
      .slice(0, 5)
      .map((i) => `${i.capabilityId}.${i.clause}`);

    const dependsOn = mod.dependencies;
    const blocks = deps
      .filter((m) => m.dependencies.includes(mod.id))
      .map((m) => m.id);
    const blockedBy = [
      ...new Set(
        blockedEdges.filter((e) => e.moduleId === mod.id).flatMap((e) => e.blockedBy),
      ),
    ];

    const featureIds = epbse.snapshot.features
      .filter((f) => f.moduleId === mod.id)
      .map((f) => f.id);

    return {
      id: mod.id,
      name: mod.name,
      domainId: mod.domainId,
      description: mod.description,
      featureIds,
      capabilityIds: caps.map((c) => c.id),
      dimensions,
      completionPct,
      readiness,
      certifiedCapabilityIds,
      remainingCapabilityIds,
      blockedCapabilityIds,
      implemented,
      remaining,
      nextRequiredWork,
      dependsOn,
      blocks,
      blockedBy,
    };
  });
}

function scoreDimensions(contracts: ImplementationContract[]): DimensionScore[] {
  return MODULE_DIMENSIONS.map((dimension) => scoreDimension(dimension, contracts));
}

function scoreDimension(
  dimension: ModuleDimension,
  contracts: ImplementationContract[],
): DimensionScore {
  const clauseIds = DIMENSION_TO_CLAUSES[dimension];
  let required = 0;
  let verified = 0;
  let missing = 0;
  let blocked = 0;

  for (const contract of contracts) {
    for (const clause of contract.clauses) {
      if (!clause.required) continue;
      if (!clauseIds.includes(clause.id)) continue;
      required += 1;
      if (clause.status === "blocked") blocked += 1;
      else if (clause.verified || clause.status === "verified") verified += 1;
      else missing += 1;
    }
  }

  const completionPct =
    required === 0 ? 100 : Number(((verified / required) * 100).toFixed(2));

  return { dimension, required, verified, missing, blocked, completionPct };
}

function groupContracts(contracts: ImplementationContract[]) {
  const map = new Map<string, ImplementationContract[]>();
  for (const c of contracts) {
    const list = map.get(c.moduleId) ?? [];
    list.push(c);
    map.set(c.moduleId, list);
  }
  return map;
}

function groupCaps(caps: Array<{ id: string; moduleId: string }>) {
  const map = new Map<string, Array<{ id: string; moduleId: string }>>();
  for (const c of caps) {
    const list = map.get(c.moduleId) ?? [];
    list.push(c);
    map.set(c.moduleId, list);
  }
  return map;
}
