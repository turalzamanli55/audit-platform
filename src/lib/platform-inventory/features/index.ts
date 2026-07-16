/**
 * Feature inventory — status from ECIE capability lifecycles under each feature.
 */
import type { EpireInputs } from "@/lib/platform-inventory/resolver";
import type { FeatureInventoryItem, FeatureStatus } from "@/lib/platform-inventory/types";
import { averagePct } from "@/lib/platform-inventory/types";

export function buildFeatureInventory(inputs: EpireInputs): FeatureInventoryItem[] {
  const caps = inputs.ecie.capabilities;
  const contracts = new Map(inputs.eiie.contracts.map((c) => [c.capabilityId, c]));

  return inputs.epbse.snapshot.features.map((feature) => {
    const featureCaps = caps.filter(
      (c) => c.featureId === feature.id || feature.capabilityIds.includes(c.id),
    );
    const ids = featureCaps.map((c) => c.id);
    const certifiedCount = featureCaps.filter((c) => {
      const contract = contracts.get(c.id);
      return contract?.certified || c.lifecycle === "certified" || c.lifecycle === "verified";
    }).length;
    const blockedCount = featureCaps.filter(
      (c) => c.lifecycle === "blocked" || contracts.get(c.id)?.blocked,
    ).length;
    const futureCount = featureCaps.filter(
      (c) => c.phase === "future" || c.lifecycle === "future",
    ).length;
    const deprecatedCount = featureCaps.filter((c) => c.lifecycle === "deprecated").length;
    const completionPct =
      featureCaps.length === 0
        ? 0
        : averagePct(featureCaps.map((c) => c.requiredCompletionPct));

    const status = deriveFeatureStatus({
      total: featureCaps.length,
      certifiedCount,
      blockedCount,
      futureCount,
      deprecatedCount,
      completionPct,
    });

    return {
      id: feature.id,
      name: feature.name,
      moduleId: feature.moduleId,
      domainId: feature.domainId,
      capabilityIds: ids.length > 0 ? ids : feature.capabilityIds,
      status,
      completionPct,
      certifiedCount,
      remainingCount: Math.max(0, featureCaps.length - certifiedCount),
    };
  });
}

function deriveFeatureStatus(input: {
  total: number;
  certifiedCount: number;
  blockedCount: number;
  futureCount: number;
  deprecatedCount: number;
  completionPct: number;
}): FeatureStatus {
  if (input.deprecatedCount > 0 && input.deprecatedCount === input.total) return "deprecated";
  if (input.total === 0) return "missing";
  if (input.futureCount === input.total) return "future";
  if (input.blockedCount > 0 && input.certifiedCount === 0) return "blocked";
  if (input.certifiedCount === input.total) return "implemented";
  if (input.completionPct <= 0 && input.certifiedCount === 0) return "missing";
  return "partial";
}
