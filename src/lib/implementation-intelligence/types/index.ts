/**
 * EIIE — Enterprise Implementation Intelligence Engine types.
 * Completion is calculated only from verified Implementation Contracts.
 */

export const CONTRACT_CLAUSES = [
  "migration",
  "database",
  "repository",
  "serverAction",
  "route",
  "workspace",
  "component",
  "workflow",
  "permission",
  "history",
  "versioning",
  "notification",
  "export",
  "import",
  "validation",
  "tests",
  "localization",
  "ai",
  "devops",
  "documentation",
] as const;

export type ContractClauseId = (typeof CONTRACT_CLAUSES)[number];

export type ClauseStatus =
  | "expected"
  | "implemented"
  | "verified"
  | "missing"
  | "deprecated"
  | "blocked"
  | "not_applicable";

export type ContractClause = {
  id: ContractClauseId;
  required: boolean;
  reason: string;
  bibleTrace: string;
  status: ClauseStatus;
  expected: string[];
  implemented: string[];
  missing: string[];
  deprecated: string[];
  evidencePaths: string[];
  confidencePct: number;
  verified: boolean;
};

export type ImplementationContract = {
  contractId: string;
  capabilityId: string;
  capabilityName: string;
  moduleId: string;
  domainId: string;
  version: string;
  generatedAt: string;
  bibleSection: string;
  purpose: string;
  clauses: ContractClause[];
  /** True only when every required clause is verified. */
  contractSatisfied: boolean;
  /** Required clauses verified / required clauses. */
  coveragePct: number;
  certified: boolean;
  blocked: boolean;
  blockedBy: string[];
  weight: "critical" | "high" | "medium" | "low" | "informational";
  agentPayload: AgentImplementationPayload;
};

/** Machine-readable contract for Enterprise Multi-Agent consumption. */
export type AgentImplementationPayload = {
  schema: "eiie.implementation-contract.v1";
  capabilityId: string;
  moduleId: string;
  requiredClauses: Array<{
    clause: ContractClauseId;
    reason: string;
    bibleTrace: string;
    acceptance: string;
  }>;
  satisfiedClauses: ContractClauseId[];
  missingClauses: ContractClauseId[];
  repairSteps: AgentRepairStep[];
};

export type AgentRepairStep = {
  order: number;
  clause: ContractClauseId;
  action: string;
  acceptance: string;
  dependsOn: string[];
  priority: "critical" | "high" | "medium" | "low";
};

export type ImplementationGap = {
  capabilityId: string;
  moduleId: string;
  clause: ContractClauseId;
  expected: string;
  implemented: string[];
  missing: string[];
  status: ClauseStatus;
  severity: "critical" | "high" | "medium" | "low";
  bibleTrace: string;
};

export type RepairPlanItem = {
  order: number;
  capabilityId: string;
  moduleId: string;
  clause: ContractClauseId;
  action: string;
  acceptance: string;
  dependsOn: string[];
  businessValue: "critical" | "high" | "medium" | "low";
  criticalPath: boolean;
};

export type RepairPlan = {
  generatedAt: string;
  items: RepairPlanItem[];
  criticalPath: string[];
};

export type RepositoryIntelligence = {
  files: number;
  classes: number;
  expectedMethods: string[];
  existingMethods: string[];
  missingMethods: string[];
  deprecatedMethods: string[];
  unusedMethods: string[];
};

export type ServerActionIntelligence = {
  useServerFiles: number;
  exportedActions: number;
  registryHits: number;
  missingActions: string[];
  existingActions: string[];
};

export type WorkflowIntelligence = {
  engines: number;
  stateSignals: number;
  historySignals: number;
  notificationSignals: number;
  missing: string[];
};

export type PermissionIntelligence = {
  definitions: number;
  roleMappings: number;
  isolationSignals: number;
  missing: string[];
};

export type DatabaseIntelligence = {
  migrations: number;
  tablesReferenced: number;
  policySignals: number;
  missing: string[];
};

export type TestingIntelligence = {
  unitTests: number;
  integrationTests: number;
  repositoryTests: number;
  workflowTests: number;
  permissionTests: number;
  missing: string[];
};

export type ImplementationGraph = {
  nodes: Array<{
    id: string;
    kind: "module" | "capability" | "contract" | "implementation" | "gap" | "repair";
    label: string;
    meta?: Record<string, string | number | boolean>;
  }>;
  edges: Array<{ from: string; to: string; relation: string }>;
};

export type ImplementationCertification = {
  level:
    | "prototype"
    | "alpha"
    | "beta"
    | "release_candidate"
    | "production_ready"
    | "enterprise_certified";
  enterpriseCertified: boolean;
  contractsTotal: number;
  contractsSatisfied: number;
  contractsCertified: number;
  coveragePct: number;
  explainability: string[];
};

export type AiReadinessPackage = {
  schema: "eiie.ai-readiness.v1";
  generatedAt: string;
  contracts: AgentImplementationPayload[];
  repairPlan: RepairPlan;
  notes: string[];
};

export type ImplementationIntelligenceReport = {
  generatedAt: string;
  contracts: ImplementationContract[];
  gaps: ImplementationGap[];
  repairPlan: RepairPlan;
  repository: RepositoryIntelligence;
  serverActions: ServerActionIntelligence;
  workflow: WorkflowIntelligence;
  permissions: PermissionIntelligence;
  database: DatabaseIntelligence;
  testing: TestingIntelligence;
  certification: ImplementationCertification;
  aiReadiness: AiReadinessPackage;
  graph: ImplementationGraph;
  /** Platform completion from verified implementation contracts only. */
  platformCompletionPct: number;
  metrics: {
    contracts: number;
    satisfied: number;
    certified: number;
    gaps: number;
    repairItems: number;
    blocked: number;
  };
};

export function averagePct(values: number[]): number {
  if (values.length === 0) return 0;
  return Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2));
}

export function weightedAverage(items: Array<{ value: number; weight: number }>): number {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  if (total <= 0) return 0;
  return Number(
    (items.reduce((sum, item) => sum + item.value * item.weight, 0) / total).toFixed(2),
  );
}
