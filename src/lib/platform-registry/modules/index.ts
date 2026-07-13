/**
 * Enterprise Platform Registry — types and dimension catalog.
 * Completion is derived only from registered evidence flags. Never hardcode platform %.
 */

export const PLATFORM_MODULE_STATUSES = [
  "planned",
  "foundation",
  "partial",
  "production",
  "enterprise",
  "completed",
  "deprecated",
] as const;

export type PlatformModuleStatus = (typeof PLATFORM_MODULE_STATUSES)[number];

/** Each dimension contributes equally to module completion. */
export const PLATFORM_COMPLETION_DIMENSIONS = [
  "planning",
  "foundation",
  "production",
  "enterprise",
  "localization",
  "ui",
  "workflow",
  "tests",
  "permissions",
  "database",
  "integration",
] as const;

export type PlatformCompletionDimension = (typeof PLATFORM_COMPLETION_DIMENSIONS)[number];

export type PlatformEvidence = Record<PlatformCompletionDimension, boolean>;

export type PlatformModuleDefinition = {
  id: string;
  name: string;
  domain: string;
  /** When true, status is forced to deprecated regardless of score. */
  deprecated?: boolean;
  dependencies: string[];
  children: string[];
  parent: string | null;
  owner: string;
  createdAt: string;
  updatedAt: string;
  /**
   * Evidence flags only. Engine converts these into completion % and status.
   * true = dimension satisfied by shipped artifacts; false = not yet satisfied.
   */
  evidence: PlatformEvidence;
};

export type PlatformModule = {
  id: string;
  name: string;
  domain: string;
  status: PlatformModuleStatus;
  planned: boolean;
  foundation: boolean;
  partial: boolean;
  production: boolean;
  enterprise: boolean;
  completed: boolean;
  dependencies: string[];
  children: string[];
  parent: string | null;
  owner: string;
  createdAt: string;
  updatedAt: string;
  evidence: PlatformEvidence;
  /** Automatically calculated: (satisfied dimensions / total dimensions) * 100 */
  completionPct: number;
  satisfiedDimensions: number;
  totalDimensions: number;
};

export type PlatformCompletionReport = {
  calculatedAt: string;
  moduleCount: number;
  /** Automatically calculated from all registered modules. */
  platformCompletionPct: number;
  modules: PlatformModule[];
  byStatus: Record<PlatformModuleStatus, number>;
  roadmap: Array<{ id: string; name: string; status: PlatformModuleStatus; completionPct: number }>;
  validation: {
    ok: boolean;
    errors: string[];
    warnings: string[];
  };
};

export function emptyEvidence(overrides: Partial<PlatformEvidence> = {}): PlatformEvidence {
  return {
    planning: false,
    foundation: false,
    production: false,
    enterprise: false,
    localization: false,
    ui: false,
    workflow: false,
    tests: false,
    permissions: false,
    database: false,
    integration: false,
    ...overrides,
  };
}
