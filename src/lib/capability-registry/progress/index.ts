import {
  CAPABILITY_EVIDENCE_DIMENSIONS,
  type Capability,
  type CapabilityDefinition,
  type CapabilityEvidence,
  type CapabilityStatus,
} from "@/lib/capability-registry/capabilities";

/**
 * Progress engine — evidence → capability → feature → module → domain → platform.
 * No hardcoded completion percentages.
 */
export function countSatisfiedEvidence(evidence: CapabilityEvidence): number {
  return CAPABILITY_EVIDENCE_DIMENSIONS.reduce(
    (count, dimension) => count + (evidence[dimension] ? 1 : 0),
    0,
  );
}

export function listMissingEvidence(evidence: CapabilityEvidence) {
  return CAPABILITY_EVIDENCE_DIMENSIONS.filter((dimension) => !evidence[dimension]);
}

export function calculateCapabilityCompletionPct(evidence: CapabilityEvidence): number {
  const total = CAPABILITY_EVIDENCE_DIMENSIONS.length;
  const satisfied = countSatisfiedEvidence(evidence);
  return Number(((satisfied / total) * 100).toFixed(2));
}

export function deriveCapabilityStatus(
  evidence: CapabilityEvidence,
  completionPct: number,
  deprecated?: boolean,
): CapabilityStatus {
  if (deprecated) return "deprecated";
  if (completionPct >= 100) return "completed";
  if (evidence.security && evidence.integration && completionPct >= 80) return "enterprise";
  if (evidence.database && evidence.serverActions && completionPct >= 60) return "production";
  if (completionPct >= 33.33) return "partial";
  if (evidence.database || evidence.backend || completionPct > 0) return "foundation";
  return "planned";
}

export function deriveMilestones(
  evidence: CapabilityEvidence,
  completionPct: number,
  deprecated?: boolean,
): Pick<
  Capability,
  "planned" | "foundation" | "partial" | "production" | "enterprise" | "completed" | "deprecated"
> {
  return {
    planned: true,
    foundation: evidence.database || evidence.backend || evidence.repository,
    partial: completionPct >= 33.33,
    production: evidence.database && evidence.serverActions && completionPct >= 60,
    enterprise: evidence.security && evidence.integration && completionPct >= 80,
    completed: completionPct >= 100,
    deprecated: Boolean(deprecated),
  };
}

export function materializeCapability(definition: CapabilityDefinition): Capability {
  const completionPct = calculateCapabilityCompletionPct(definition.evidence);
  const satisfiedEvidence = countSatisfiedEvidence(definition.evidence);
  const status = deriveCapabilityStatus(
    definition.evidence,
    completionPct,
    definition.deprecated,
  );
  const milestones = deriveMilestones(
    definition.evidence,
    completionPct,
    definition.deprecated,
  );

  return {
    id: definition.id,
    domain: definition.domain,
    module: definition.module,
    feature: definition.feature,
    name: definition.name,
    description: definition.description,
    priority: definition.priority,
    status,
    ...milestones,
    dependencies: [...definition.dependencies],
    parent: definition.parent,
    children: [...definition.children],
    evidence: { ...definition.evidence },
    createdAt: definition.createdAt,
    updatedAt: definition.updatedAt,
    completionPct,
    satisfiedEvidence,
    totalEvidence: CAPABILITY_EVIDENCE_DIMENSIONS.length,
    missingEvidence: listMissingEvidence(definition.evidence),
  };
}

export function averageCompletion(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((total, value) => total + value, 0);
  return Number((sum / values.length).toFixed(2));
}

export function deriveAggregateStatus(
  completionPct: number,
  hasDeprecatedOnly = false,
): CapabilityStatus {
  if (hasDeprecatedOnly) return "deprecated";
  if (completionPct >= 100) return "completed";
  if (completionPct >= 80) return "enterprise";
  if (completionPct >= 60) return "production";
  if (completionPct >= 33.33) return "partial";
  if (completionPct > 0) return "foundation";
  return "planned";
}
