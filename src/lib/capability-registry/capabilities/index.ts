/**
 * Enterprise Capability Registry — capability model and evidence catalog.
 * Completion is derived only from evidence flags. Never hardcode percentages.
 */

export const CAPABILITY_STATUSES = [
  "planned",
  "foundation",
  "partial",
  "production",
  "enterprise",
  "completed",
  "deprecated",
] as const;

export type CapabilityStatus = (typeof CAPABILITY_STATUSES)[number];

export const CAPABILITY_PRIORITIES = ["critical", "high", "medium", "low"] as const;
export type CapabilityPriority = (typeof CAPABILITY_PRIORITIES)[number];

/** Evidence dimensions — each contributes equally to capability completion. */
export const CAPABILITY_EVIDENCE_DIMENSIONS = [
  "database",
  "backend",
  "repository",
  "serverActions",
  "permissions",
  "validation",
  "rules",
  "ui",
  "workspace",
  "tests",
  "localization",
  "documentation",
  "integration",
  "performance",
  "security",
] as const;

export type CapabilityEvidenceDimension = (typeof CAPABILITY_EVIDENCE_DIMENSIONS)[number];
export type CapabilityEvidence = Record<CapabilityEvidenceDimension, boolean>;

export type CapabilityDefinition = {
  id: string;
  domain: string;
  module: string;
  feature: string;
  name: string;
  description: string;
  priority: CapabilityPriority;
  deprecated?: boolean;
  dependencies: string[];
  parent: string | null;
  children: string[];
  evidence: CapabilityEvidence;
  createdAt: string;
  updatedAt: string;
};

export type Capability = {
  id: string;
  domain: string;
  module: string;
  feature: string;
  name: string;
  description: string;
  priority: CapabilityPriority;
  status: CapabilityStatus;
  planned: boolean;
  foundation: boolean;
  partial: boolean;
  production: boolean;
  enterprise: boolean;
  completed: boolean;
  deprecated: boolean;
  dependencies: string[];
  parent: string | null;
  children: string[];
  evidence: CapabilityEvidence;
  createdAt: string;
  updatedAt: string;
  /** Automatically calculated from evidence flags. */
  completionPct: number;
  satisfiedEvidence: number;
  totalEvidence: number;
  missingEvidence: CapabilityEvidenceDimension[];
};

export function emptyCapabilityEvidence(
  overrides: Partial<CapabilityEvidence> = {},
): CapabilityEvidence {
  return {
    database: false,
    backend: false,
    repository: false,
    serverActions: false,
    permissions: false,
    validation: false,
    rules: false,
    ui: false,
    workspace: false,
    tests: false,
    localization: false,
    documentation: false,
    integration: false,
    performance: false,
    security: false,
    ...overrides,
  };
}

/** Common full-stack shipped capability evidence. */
export function shippedEvidence(
  overrides: Partial<CapabilityEvidence> = {},
): CapabilityEvidence {
  return emptyCapabilityEvidence({
    database: true,
    backend: true,
    repository: true,
    serverActions: true,
    permissions: true,
    validation: true,
    rules: true,
    ui: true,
    workspace: true,
    tests: true,
    localization: true,
    documentation: true,
    integration: true,
    performance: false,
    security: true,
    ...overrides,
  });
}
