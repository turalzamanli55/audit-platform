/**
 * Scoring helpers for EPIRE dashboards (aggregations only — no new evidence scans).
 */
import type { CapabilityInventoryItem, FeatureInventoryItem } from "@/lib/platform-inventory/types";

export function scoreFeatureBuckets(features: FeatureInventoryItem[]) {
  return {
    featuresImplemented: features.filter((f) => f.status === "implemented").length,
    featuresPartial: features.filter((f) => f.status === "partial").length,
    featuresMissing: features.filter((f) => f.status === "missing").length,
    featuresBlocked: features.filter((f) => f.status === "blocked").length,
    featuresFuture: features.filter((f) => f.status === "future").length,
  };
}

export function scoreCapabilityBuckets(capabilities: CapabilityInventoryItem[]) {
  return {
    capabilitiesRequired: capabilities.filter((c) => c.required).length,
    capabilitiesCertified: capabilities.filter((c) => c.certified).length,
    capabilitiesBlocked: capabilities.filter((c) => c.blocked).length,
  };
}
