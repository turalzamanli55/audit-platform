/**
 * Detect mutation suggestions that must open the Host Execution Drawer
 * instead of executing.
 */

export const HOST_MUTATION_OPERATIONS = [
  "create",
  "update",
  "delete",
  "import",
  "approve",
  "archive",
] as const;

export type HostMutationOperation = (typeof HOST_MUTATION_OPERATIONS)[number];

const OPERATION_PATTERNS: Array<{ operation: HostMutationOperation; pattern: RegExp }> = [
  { operation: "create", pattern: /\b(create|add|new)\b/i },
  { operation: "update", pattern: /\b(update|edit|modify|change)\b/i },
  { operation: "delete", pattern: /\b(delete|remove|destroy)\b/i },
  { operation: "import", pattern: /\b(import|upload|ingest)\b/i },
  { operation: "approve", pattern: /\b(approve|sign.?off|authorize)\b/i },
  { operation: "archive", pattern: /\b(archive|retire|deactivate)\b/i },
];

export function detectHostMutationOperation(
  utterance: string,
): HostMutationOperation | null {
  for (const entry of OPERATION_PATTERNS) {
    if (entry.pattern.test(utterance)) return entry.operation;
  }
  return null;
}

/** Map UI delete → host archive where catalog uses archive. */
export function normalizeHostOperation(
  operation: HostMutationOperation,
): string {
  if (operation === "delete") return "archive";
  return operation;
}

const MODULE_ENTITY: Record<string, string> = {
  companies: "company",
  engagements: "engagement",
  planning: "planning_package",
  materiality: "materiality_package",
  "risk-assessment": "risk",
  fieldwork: "fieldwork_package",
  review: "review_package",
  completion: "completion_package",
  reporting: "reporting_package",
  opinion: "opinion_package",
  "trial-balance": "trial_balance",
  "financial-statements": "financial_statement_package",
  uaie: "uaie_session",
  "import-intelligence": "uaie_session",
};

const MODULE_ACTION_PREFIX: Record<string, string> = {
  companies: "company",
  engagements: "engagement",
  planning: "planning",
  materiality: "materiality",
  "risk-assessment": "risk",
  fieldwork: "fieldwork",
  review: "review",
  completion: "completion",
  reporting: "reporting",
  opinion: "opinion",
  "trial-balance": "trial_balance",
  "financial-statements": "financial_statements",
  uaie: "uaie",
  "import-intelligence": "uaie",
};

export function resolveSuggestedServerActionId(input: {
  moduleId?: string | null;
  operation: HostMutationOperation;
  entityType?: string | null;
}): string | null {
  const op = normalizeHostOperation(input.operation);
  if (input.entityType) {
    return `${input.entityType}.${op}`;
  }
  if (!input.moduleId) return null;
  const prefix = MODULE_ACTION_PREFIX[input.moduleId];
  if (!prefix) return null;
  if (op === "import" && (prefix === "uaie" || input.moduleId === "import-intelligence")) {
    return "uaie.import";
  }
  return `${prefix}.${op}`;
}

export function resolveEntityTypeForModule(moduleId?: string | null): string | null {
  if (!moduleId) return null;
  return MODULE_ENTITY[moduleId] ?? null;
}

export function isHostMutationSuggestion(input: {
  utterance: string;
  plannerIntent?: string | null;
}): boolean {
  if (input.plannerIntent === "call_registered_action") return true;
  return detectHostMutationOperation(input.utterance) !== null;
}
