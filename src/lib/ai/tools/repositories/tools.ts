import type { AiModuleId } from "@/lib/ai/constants";
import { defineAiTool } from "@/lib/ai/tools/utils";
import { readPermission } from "@/lib/ai/tools/permissions";
import { COMPANY_PERMISSIONS } from "@/constants/company";
import { ENGAGEMENT_PERMISSIONS } from "@/constants/engagement";
import { PLANNING_PERMISSIONS } from "@/constants/planning";
import { MATERIALITY_PERMISSIONS } from "@/constants/materiality";
import { RISK_ASSESSMENT_PERMISSIONS } from "@/constants/risk-assessment";
import { FIELDWORK_PERMISSIONS } from "@/constants/fieldwork";
import { REVIEW_PERMISSIONS } from "@/constants/review";
import { COMPLETION_PERMISSIONS } from "@/constants/completion";
import { REPORTING_PERMISSIONS } from "@/constants/reporting";
import { OPINION_PERMISSIONS } from "@/constants/opinion";
import { TRIAL_BALANCE_PERMISSIONS } from "@/constants/trial-balance";
import { FINANCIAL_STATEMENTS_PERMISSIONS } from "@/constants/financial-statements";
import { UAIE_PERMISSIONS } from "@/constants/uaie";
import type { AiToolRegistration } from "@/lib/ai/tools/types";

/**
 * Repository tools — contracts only.
 * Never import or call repositories / server actions.
 */
function repositoryContractTool(input: {
  moduleId: AiModuleId;
  name: string;
  permission: string;
  repositoryPort: string;
}): AiToolRegistration {
  const slug = input.moduleId.replace(/-/g, "_");
  return defineAiTool({
    id: `tool.repository.${slug}`,
    name: `${input.name} Repository Contract`,
    moduleId: input.moduleId,
    description: `Contract wrapper for ${input.name} repository access — never executes repository methods.`,
    category: "repository",
    accessMode: "READ",
    permissions: readPermission([input.permission]),
    estimatedLatencyMs: 10,
    estimatedCost: "free",
    riskLevel: "low",
    sideEffects: ["read"],
    requiresConfirmation: false,
    intentHints: [`${input.name.toLowerCase()} repository`, `${input.moduleId} data`],
    plannerIntents: ["answer"],
    execute: ({ executionMode, args }) => ({
      status: executionMode === "dry_run" ? "dry_run" : "success",
      success: true,
      summary:
        executionMode === "dry_run"
          ? `Dry run: would invoke ${input.repositoryPort} through an authorized adapter.`
          : `Repository contract envelope for ${input.repositoryPort}.`,
      details: {
        repositoryPort: input.repositoryPort,
        operation: typeof args.operation === "string" ? args.operation : "read",
        bound: false,
        directExecution: false,
        note: "Adapters may later bind this port. Tool Runtime never calls repositories.",
      },
      affectedObjects: [],
      warnings: ["Repository tools are contracts only."],
      errors: [],
      references: [{ type: "repository", id: input.repositoryPort, label: input.name }],
      nextActions: [],
    }),
  });
}

export const REPOSITORY_AI_TOOLS: readonly AiToolRegistration[] = [
  repositoryContractTool({
    moduleId: "companies",
    name: "Companies",
    permission: COMPANY_PERMISSIONS.READ,
    repositoryPort: "CompaniesRepository",
  }),
  repositoryContractTool({
    moduleId: "engagements",
    name: "Engagements",
    permission: ENGAGEMENT_PERMISSIONS.READ,
    repositoryPort: "EngagementsRepository",
  }),
  repositoryContractTool({
    moduleId: "planning",
    name: "Planning",
    permission: PLANNING_PERMISSIONS.READ,
    repositoryPort: "PlanningRepository",
  }),
  repositoryContractTool({
    moduleId: "materiality",
    name: "Materiality",
    permission: MATERIALITY_PERMISSIONS.READ,
    repositoryPort: "MaterialityRepository",
  }),
  repositoryContractTool({
    moduleId: "risk-assessment",
    name: "Risk",
    permission: RISK_ASSESSMENT_PERMISSIONS.READ,
    repositoryPort: "RiskAssessmentRepository",
  }),
  repositoryContractTool({
    moduleId: "fieldwork",
    name: "Fieldwork",
    permission: FIELDWORK_PERMISSIONS.READ,
    repositoryPort: "FieldworkRepository",
  }),
  repositoryContractTool({
    moduleId: "review",
    name: "Review",
    permission: REVIEW_PERMISSIONS.READ,
    repositoryPort: "ReviewRepository",
  }),
  repositoryContractTool({
    moduleId: "completion",
    name: "Completion",
    permission: COMPLETION_PERMISSIONS.READ,
    repositoryPort: "CompletionRepository",
  }),
  repositoryContractTool({
    moduleId: "reporting",
    name: "Reporting",
    permission: REPORTING_PERMISSIONS.READ,
    repositoryPort: "ReportingRepository",
  }),
  repositoryContractTool({
    moduleId: "opinion",
    name: "Opinion",
    permission: OPINION_PERMISSIONS.READ,
    repositoryPort: "OpinionRepository",
  }),
  repositoryContractTool({
    moduleId: "trial-balance",
    name: "Trial Balance",
    permission: TRIAL_BALANCE_PERMISSIONS.READ,
    repositoryPort: "TrialBalanceRepository",
  }),
  repositoryContractTool({
    moduleId: "financial-statements",
    name: "Financial Statements",
    permission: FINANCIAL_STATEMENTS_PERMISSIONS.READ,
    repositoryPort: "FinancialStatementsRepository",
  }),
  repositoryContractTool({
    moduleId: "uaie",
    name: "UAIE",
    permission: UAIE_PERMISSIONS.READ,
    repositoryPort: "UaieRepository",
  }),
  repositoryContractTool({
    moduleId: "import-intelligence",
    name: "Import Intelligence",
    permission: UAIE_PERMISSIONS.READ,
    repositoryPort: "ImportIntelligenceRepository",
  }),
];
