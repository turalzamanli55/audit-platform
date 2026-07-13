import type { Capability } from "@/lib/capability-registry/capabilities";
import type { DomainReadiness } from "@/lib/capability-registry/domains";
import type { ModuleReadiness } from "@/lib/capability-registry/modules";
import type { FeatureReadiness } from "@/lib/capability-registry/features";
import type { CapabilityRoadmapEntry } from "@/lib/capability-registry/roadmap";
import type { CapabilityRegistryValidation } from "@/lib/capability-registry/validation";
import { listBlockedCapabilities } from "@/lib/capability-registry/dependencies";
import { CAPABILITY_EVIDENCE_DIMENSIONS } from "@/lib/capability-registry/capabilities";

export type CapabilityPlatformReport = {
  calculatedAt: string;
  source: "capability-registry";
  platformCompletionPct: number;
  counts: {
    domains: number;
    modules: number;
    features: number;
    capabilities: number;
    evidenceDimensions: number;
  };
  domains: DomainReadiness[];
  modules: ModuleReadiness[];
  features: FeatureReadiness[];
  capabilities: Capability[];
  evidence: {
    dimension: string;
    satisfiedCapabilities: number;
    totalCapabilities: number;
    coveragePct: number;
  }[];
  missingCapabilities: Array<{
    id: string;
    name: string;
    module: string;
    missingEvidence: string[];
    completionPct: number;
  }>;
  blockedCapabilities: Array<{
    id: string;
    name: string;
    module: string;
    dependencies: string[];
    completionPct: number;
  }>;
  deprecatedCapabilities: Array<{
    id: string;
    name: string;
    module: string;
  }>;
  upcomingRoadmap: CapabilityRoadmapEntry[];
  validation: CapabilityRegistryValidation;
};

/**
 * Reporting — assemble the enterprise platform capability report.
 */
export function buildCapabilityPlatformReport(input: {
  platformCompletionPct: number;
  domains: DomainReadiness[];
  modules: ModuleReadiness[];
  features: FeatureReadiness[];
  capabilities: Capability[];
  roadmap: CapabilityRoadmapEntry[];
  validation: CapabilityRegistryValidation;
}): CapabilityPlatformReport {
  const active = input.capabilities.filter((capability) => !capability.deprecated);
  const missingCapabilities = active
    .filter((capability) => capability.missingEvidence.length > 0)
    .map((capability) => ({
      id: capability.id,
      name: capability.name,
      module: capability.module,
      missingEvidence: [...capability.missingEvidence],
      completionPct: capability.completionPct,
    }))
    .sort((a, b) => a.completionPct - b.completionPct);

  const blocked = listBlockedCapabilities(active).map((capability) => ({
    id: capability.id,
    name: capability.name,
    module: capability.module,
    dependencies: [...capability.dependencies],
    completionPct: capability.completionPct,
  }));

  const deprecatedCapabilities = input.capabilities
    .filter((capability) => capability.deprecated)
    .map((capability) => ({
      id: capability.id,
      name: capability.name,
      module: capability.module,
    }));

  const evidence = CAPABILITY_EVIDENCE_DIMENSIONS.map((dimension) => {
    const satisfiedCapabilities = active.filter((capability) => capability.evidence[dimension])
      .length;
    const totalCapabilities = active.length;
    return {
      dimension,
      satisfiedCapabilities,
      totalCapabilities,
      coveragePct:
        totalCapabilities === 0
          ? 0
          : Number(((satisfiedCapabilities / totalCapabilities) * 100).toFixed(2)),
    };
  });

  return {
    calculatedAt: new Date().toISOString(),
    source: "capability-registry",
    platformCompletionPct: input.platformCompletionPct,
    counts: {
      domains: input.domains.length,
      modules: input.modules.length,
      features: input.features.length,
      capabilities: input.capabilities.length,
      evidenceDimensions: CAPABILITY_EVIDENCE_DIMENSIONS.length,
    },
    domains: input.domains,
    modules: input.modules,
    features: input.features,
    capabilities: input.capabilities,
    evidence,
    missingCapabilities,
    blockedCapabilities: blocked,
    deprecatedCapabilities,
    upcomingRoadmap: input.roadmap.filter((entry) => entry.lane !== "completed"),
    validation: input.validation,
  };
}
