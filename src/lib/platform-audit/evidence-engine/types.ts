/**
 * EPAC Evidence Engine v2 — types.
 * Confidence and completion are derived from resolved implementation evidence only.
 */

export const CONFIDENCE_LEVELS = [
  "verified",
  "strong",
  "indirect",
  "weak",
  "missing",
] as const;

export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

/** Numeric confidence weights for scoring. */
export const CONFIDENCE_WEIGHT: Record<ConfidenceLevel, number> = {
  verified: 100,
  strong: 90,
  indirect: 75,
  weak: 50,
  missing: 0,
};

export type EvidenceKind =
  | "repository"
  | "serverAction"
  | "route"
  | "component"
  | "workspace"
  | "test"
  | "permission"
  | "migration"
  | "database"
  | "localization"
  | "ai"
  | "export"
  | "import"
  | "workflow"
  | "documentation";

export type SymbolKind =
  | "class"
  | "function"
  | "const"
  | "component"
  | "hook"
  | "provider"
  | "context"
  | "type"
  | "interface"
  | "serverAction"
  | "repository"
  | "unknown";

export type AstSymbol = {
  name: string;
  kind: SymbolKind;
  filePath: string;
  exported: boolean;
  line: number;
  isServerActionFile: boolean;
  isReactComponent: boolean;
  isRepository: boolean;
  isHook: boolean;
  isProvider: boolean;
  isContext: boolean;
};

export type ImportEdge = {
  fromFile: string;
  toModule: string;
  resolvedPath: string | null;
  names: string[];
};

export type ExportRecord = {
  filePath: string;
  name: string;
  kind: SymbolKind;
};

export type EvidenceItem = {
  kind: EvidenceKind;
  path: string;
  symbol?: string;
  confidence: ConfidenceLevel;
  confidencePct: number;
  reason: string;
  moduleIds: string[];
  capabilityIds: string[];
};

export type ModuleAliasResolution = {
  moduleId: string;
  canonicalName: string;
  aliases: string[];
  matchedRoots: string[];
  libPaths: string[];
  repositoryPaths: string[];
  componentPaths: string[];
};

export type ResolvedDimensionEvidence = {
  dimension: EvidenceKind;
  present: boolean;
  confidence: ConfidenceLevel;
  confidencePct: number;
  items: EvidenceItem[];
};

export type ModuleEvidenceResolution = {
  moduleId: string;
  name: string;
  aliases: string[];
  matchedRoots: string[];
  dimensions: ResolvedDimensionEvidence[];
  evidenceItems: EvidenceItem[];
  /** Average confidence across present dimensions only; 0 if none. */
  confidencePct: number;
  /** Completeness from verified/strong dimensions only. */
  verifiedCompletionPct: number;
  falsePositiveRisk: boolean;
};

export type CapabilityEvidenceResolution = {
  capabilityId: string;
  name: string;
  moduleId: string;
  featureId: string;
  dimensions: ResolvedDimensionEvidence[];
  evidenceItems: EvidenceItem[];
  confidencePct: number;
  verifiedCompletionPct: number;
  missingDimensions: EvidenceKind[];
  rootCause: string | null;
};

export type AiAreaResolution = {
  areaId: string;
  aliases: string[];
  present: boolean;
  confidence: ConfidenceLevel;
  confidencePct: number;
  evidencePaths: string[];
  exportNames: string[];
  reason: string;
};

export type FalsePositiveFinding = {
  code: string;
  severity: "critical" | "high" | "medium" | "low" | "informational";
  message: string;
  rootCause: string;
  entityId?: string;
  correctedBy?: string;
};

export type DebtSeverity = "critical" | "high" | "medium" | "low" | "informational";

export type ClassifiedDebtItem = {
  code: string;
  severity: DebtSeverity;
  message: string;
  rootCause: string;
  paths: string[];
  weight: number;
};

export type EvidenceGraphNode = {
  id: string;
  kind: "capability" | "module" | "implementation" | "evidence" | "confidence";
  label: string;
  meta?: Record<string, string | number | boolean>;
};

export type EvidenceGraphEdge = {
  from: string;
  to: string;
  relation: string;
};

export type EvidenceGraph = {
  nodes: EvidenceGraphNode[];
  edges: EvidenceGraphEdge[];
};

export type CrossReferenceReport = {
  bibleModules: number;
  registryModules: number;
  platformModules: number;
  syncModules: number;
  codebaseModules: number;
  matchedModules: number;
  unmatchedBibleModules: string[];
  unmatchedCodeModules: string[];
  capabilityRegistryCount: number;
  syncCapabilityCount: number;
  matchedCapabilities: number;
};

export type EvidenceEngineReport = {
  generatedAt: string;
  modules: ModuleEvidenceResolution[];
  capabilities: CapabilityEvidenceResolution[];
  aiAreas: AiAreaResolution[];
  falsePositives: FalsePositiveFinding[];
  debt: ClassifiedDebtItem[];
  crossReference: CrossReferenceReport;
  graph: EvidenceGraph;
  averages: {
    moduleConfidencePct: number;
    capabilityConfidencePct: number;
    verifiedCompletionPct: number;
    evidenceCoveragePct: number;
    falsePositiveCount: number;
  };
  symbolsScanned: number;
  filesScanned: number;
  importEdges: number;
};

export function confidenceFromWeight(weight: number): ConfidenceLevel {
  if (weight >= 100) return "verified";
  if (weight >= 90) return "strong";
  if (weight >= 75) return "indirect";
  if (weight >= 50) return "weak";
  return "missing";
}

export function averageConfidence(items: Array<{ confidencePct: number }>): number {
  if (items.length === 0) return 0;
  return Number(
    (items.reduce((sum, item) => sum + item.confidencePct, 0) / items.length).toFixed(2),
  );
}
