import {
  PLATFORM_COMPLETION_DIMENSIONS,
  type PlatformCompletionDimension,
  type PlatformEvidence,
  type PlatformModule,
  type PlatformModuleDefinition,
  type PlatformModuleStatus,
} from "@/lib/platform-registry/modules";

/**
 * Progress engine — converts evidence flags into completion % and status.
 * No hardcoded module or platform percentages.
 */
export function countSatisfiedDimensions(evidence: PlatformEvidence): number {
  return PLATFORM_COMPLETION_DIMENSIONS.reduce(
    (count, dimension) => count + (evidence[dimension] ? 1 : 0),
    0,
  );
}

export function calculateModuleCompletionPct(evidence: PlatformEvidence): number {
  const total = PLATFORM_COMPLETION_DIMENSIONS.length;
  const satisfied = countSatisfiedDimensions(evidence);
  return Number(((satisfied / total) * 100).toFixed(2));
}

export function deriveModuleStatus(
  evidence: PlatformEvidence,
  completionPct: number,
  deprecated?: boolean,
): PlatformModuleStatus {
  if (deprecated) return "deprecated";
  if (completionPct >= 100) return "completed";
  if (evidence.enterprise && completionPct >= 75) return "enterprise";
  if (evidence.production && completionPct >= 55) return "production";
  if (completionPct >= 36.36) return "partial";
  if (evidence.foundation || evidence.database || completionPct > 0) return "foundation";
  return "planned";
}

export function deriveMilestones(
  evidence: PlatformEvidence,
  completionPct: number,
): Pick<
  PlatformModule,
  "planned" | "foundation" | "partial" | "production" | "enterprise" | "completed"
> {
  return {
    planned: true,
    foundation: evidence.foundation || evidence.database,
    partial: completionPct >= 36.36,
    production: evidence.production && completionPct >= 55,
    enterprise: evidence.enterprise && completionPct >= 75,
    completed: completionPct >= 100,
  };
}

export function materializeModule(definition: PlatformModuleDefinition): PlatformModule {
  const completionPct = calculateModuleCompletionPct(definition.evidence);
  const satisfiedDimensions = countSatisfiedDimensions(definition.evidence);
  const status = deriveModuleStatus(definition.evidence, completionPct, definition.deprecated);
  const milestones = deriveMilestones(definition.evidence, completionPct);

  return {
    id: definition.id,
    name: definition.name,
    domain: definition.domain,
    status,
    ...milestones,
    dependencies: [...definition.dependencies],
    children: [...definition.children],
    parent: definition.parent,
    owner: definition.owner,
    createdAt: definition.createdAt,
    updatedAt: definition.updatedAt,
    evidence: { ...definition.evidence },
    completionPct,
    satisfiedDimensions,
    totalDimensions: PLATFORM_COMPLETION_DIMENSIONS.length,
  };
}

export function calculatePlatformCompletionPct(modules: PlatformModule[]): number {
  if (modules.length === 0) return 0;
  const active = modules.filter((module) => module.status !== "deprecated");
  if (active.length === 0) return 0;
  const sum = active.reduce((total, module) => total + module.completionPct, 0);
  return Number((sum / active.length).toFixed(2));
}

export function dimensionLabel(dimension: PlatformCompletionDimension): string {
  switch (dimension) {
    case "planning":
      return "Planning";
    case "foundation":
      return "Foundation";
    case "production":
      return "Production";
    case "enterprise":
      return "Enterprise";
    case "localization":
      return "Localization";
    case "ui":
      return "UI";
    case "workflow":
      return "Workflow";
    case "tests":
      return "Tests";
    case "permissions":
      return "Permissions";
    case "database":
      return "Database";
    case "integration":
      return "Integration";
    default:
      return dimension;
  }
}
