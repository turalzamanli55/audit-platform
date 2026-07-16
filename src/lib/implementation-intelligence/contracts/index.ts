/**
 * Implementation Contract definition — what HOW looks like for each capability.
 */
import type { ContractClauseId } from "@/lib/implementation-intelligence/types";
import type { ImplementationIntent } from "@/lib/implementation-intelligence/parser";

export type ContractExpectation = {
  id: ContractClauseId;
  required: boolean;
  reason: string;
  expected: string[];
  acceptance: string;
};

function clause(
  id: ContractClauseId,
  reason: string,
  expected: string[],
  acceptance: string,
  required = true,
): ContractExpectation {
  return { id, required, reason, expected, acceptance };
}

/**
 * Build expected implementation clauses from PROJECT_BIBLE intent.
 * Only relevant clauses are required — irrelevant ones are omitted (not forced).
 */
export function buildContractExpectations(intent: ImplementationIntent): ContractExpectation[] {
  if (intent.phase === "future" || intent.classes.includes("future") || intent.classes.includes("experimental")) {
    return [
      clause(
        "documentation",
        "Future/experimental capability — documentation contract only",
        ["PROJECT_BIBLE definition"],
        "Capability documented in PROJECT_BIBLE",
      ),
    ];
  }

  const text = `${intent.name} ${intent.description} ${intent.moduleId}`.toLowerCase();
  const expectations: ContractExpectation[] = [
    clause(
      "documentation",
      "PROJECT_BIBLE executable specification",
      [`docs/PROJECT_BIBLE.md#${intent.sourceSection}`],
      "Capability present in PROJECT_BIBLE with module ownership",
    ),
  ];

  const needsData =
    intent.classes.includes("database") ||
    intent.classes.includes("infrastructure") ||
    intent.classes.includes("compliance") ||
    /repository|migration|schema|table|ledger|balance|mapping|note|engagement|company|organization/.test(
      text,
    );

  if (needsData) {
    expectations.push(
      clause("migration", "Schema change via migration", ["supabase/migrations/*.sql"], "Migration creates/alters required tables"),
      clause("database", "Generated types / schema objects", ["src/types/supabase.ts"], "Tables visible in supabase types"),
      clause("repository", "Typed repository access", ["src/repositories/**"], "Repository class/methods for capability entities"),
    );
  }

  const needsActions =
    intent.classes.includes("workflow") ||
    intent.classes.includes("required") ||
    /action|create|update|submit|approve|execute|manage/.test(text);

  if (needsActions) {
    expectations.push(
      clause(
        "serverAction",
        "Server actions / host actions for mutations",
        ["src/lib/actions/**", '"use server"'],
        "Exported server actions bound to capability operations",
      ),
    );
  }

  if (intent.classes.includes("workflow") || /workflow|lifecycle|approval|pipeline|state/.test(text)) {
    expectations.push(
      clause("workflow", "State machine / engine / transitions", ["src/lib/**/engine/**", "workflow"], "Workflow engine with transitions"),
      clause("history", "Audit trail / history", ["history"], "History records for state changes"),
    );
  }

  if (intent.classes.includes("security") || /permission|auth|role|rls|rbac|isolation/.test(text)) {
    expectations.push(
      clause("permission", "Permission definitions and enforcement", ["permission", "role", "auth"], "Permission codes + role mappings"),
    );
  }

  if (intent.classes.includes("ui") || /workspace|dashboard|page|route|drawer|dialog|table|form/.test(text)) {
    expectations.push(
      clause("route", "App Router pages", ["src/app/**/page.tsx"], "Route page exists"),
      clause("workspace", "Workspace shell/layout", ["workspace"], "Workspace integration"),
      clause("component", "UI components", ["src/components/**"], "Components for capability UI"),
      clause("localization", "AZ/EN/RU/TR messages", ["messages/*.json"], "Locale keys for capability"),
    );
  }

  if (intent.classes.includes("ai") || /\bai\b|llm|prompt|orchestrat|knowledge/.test(text)) {
    expectations.push(
      clause("ai", "AI implementation surface", ["src/lib/ai/**"], "AI module exports for capability"),
      clause("workflow", "AI pipeline/orchestrator", ["src/lib/ai/pipeline", "orchestrator"], "Pipeline/orchestrator wiring"),
    );
  }

  if (intent.classes.includes("compliance") || /ifrs|isa|report|disclosure/.test(text)) {
    expectations.push(
      clause("tests", "Compliance verification tests", ["*.test.ts"], "Tests cover compliance rules"),
      clause("localization", "Multi-locale compliance UI", ["messages"], "Locale coverage"),
    );
  }

  if (/version|immutable|revision/.test(text)) {
    expectations.push(
      clause("versioning", "Versioning support", ["version"], "Version fields/APIs present"),
    );
  }

  if (/notif|alert|email/.test(text)) {
    expectations.push(
      clause("notification", "Notification hooks", ["notif"], "Notification pathway exists"),
    );
  }

  if (/export|download|pdf|xlsx/.test(text)) {
    expectations.push(clause("export", "Export pathway", ["export"], "Export implementation present"));
  }

  if (/import|ingest|upload/.test(text)) {
    expectations.push(clause("import", "Import pathway", ["import", "uaie", "trial-balance"], "Import implementation present"));
  }

  if (/validat|schema|zod|rule/.test(text) || needsActions) {
    expectations.push(
      clause("validation", "Input/domain validation", ["validation", "rules"], "Validation rules present"),
    );
  }

  // Default required capability minimum
  if (intent.classes.includes("required") && expectations.length <= 1) {
    expectations.push(
      clause("repository", "Default repository", ["src/repositories/**"], "Repository exists"),
      clause("serverAction", "Default server action", ["src/lib/actions/**"], "Server action exists"),
      clause("tests", "Default tests", ["*.test.ts"], "Tests exist"),
    );
  }

  // Always require tests for non-future required/security/database
  if (
    (intent.classes.includes("required") ||
      intent.classes.includes("security") ||
      intent.classes.includes("database")) &&
    !expectations.some((e) => e.id === "tests")
  ) {
    expectations.push(
      clause("tests", "Automated verification", ["*.test.ts"], "Unit/integration tests for capability"),
    );
  }

  if (
    intent.classes.includes("infrastructure") ||
    intent.classes.includes("internal") ||
    /devops|governance|registry|sync|audit/.test(text)
  ) {
    expectations.push(
      clause("devops", "Governance/DevOps wiring", ["src/lib/devops", "platform-audit", "capability"], "DevOps/governance modules present"),
    );
  }

  const map = new Map<ContractClauseId, ContractExpectation>();
  for (const item of expectations) {
    if (!map.has(item.id)) map.set(item.id, item);
  }
  return [...map.values()];
}
