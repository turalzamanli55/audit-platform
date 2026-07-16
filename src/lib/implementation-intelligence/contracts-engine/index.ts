/**
 * Contracts engine — generate + verify Implementation Contracts.
 */
import { buildContractExpectations } from "@/lib/implementation-intelligence/contracts";
import type { ImplementationIntent } from "@/lib/implementation-intelligence/parser";
import {
  createVerificationContext,
  verifyClause,
} from "@/lib/implementation-intelligence/verification";
import type {
  AgentImplementationPayload,
  AgentRepairStep,
  ImplementationContract,
} from "@/lib/implementation-intelligence/types";
import type { EvidenceEngineReport } from "@/lib/platform-audit/evidence-engine/types";
import { loadEvidenceReport } from "@/lib/capability-intelligence/evidence";

export function generateImplementationContract(
  intent: ImplementationIntent,
  cwd: string,
  blockedBy: string[] = [],
  evidence?: EvidenceEngineReport,
): ImplementationContract {
  const expectations = buildContractExpectations(intent);
  const ctx = createVerificationContext(cwd, intent, evidence);
  const blocked = blockedBy.length > 0;
  const clauses = expectations.map((expectation) => verifyClause(ctx, expectation, blocked));

  const required = clauses.filter((c) => c.required);
  const verifiedRequired = required.filter((c) => c.verified);
  const coveragePct =
    required.length === 0
      ? 100
      : Number(((verifiedRequired.length / required.length) * 100).toFixed(2));
  const contractSatisfied = required.every((c) => c.verified) && !blocked;
  const certified = contractSatisfied;

  const missingClauses = required.filter((c) => !c.verified).map((c) => c.id);
  const repairSteps: AgentRepairStep[] = missingClauses.map((clauseId, index) => {
    const expectation = expectations.find((e) => e.id === clauseId)!;
    return {
      order: index + 1,
      clause: clauseId,
      action: `Implement ${clauseId} for ${intent.id}: ${expectation.reason}`,
      acceptance: expectation.acceptance,
      dependsOn: index === 0 ? [] : [missingClauses[index - 1]!],
      priority: intent.weight === "informational" ? "low" : intent.weight,
    };
  });

  const agentPayload: AgentImplementationPayload = {
    schema: "eiie.implementation-contract.v1",
    capabilityId: intent.id,
    moduleId: intent.moduleId,
    requiredClauses: expectations
      .filter((e) => e.required)
      .map((e) => ({
        clause: e.id,
        reason: e.reason,
        bibleTrace: `docs/PROJECT_BIBLE.md#${intent.sourceSection}`,
        acceptance: e.acceptance,
      })),
    satisfiedClauses: verifiedRequired.map((c) => c.id),
    missingClauses,
    repairSteps,
  };

  return {
    contractId: `contract:${intent.id}`,
    capabilityId: intent.id,
    capabilityName: intent.name,
    moduleId: intent.moduleId,
    domainId: intent.domainId,
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    bibleSection: intent.sourceSection,
    purpose: intent.purpose,
    clauses,
    contractSatisfied,
    coveragePct,
    certified,
    blocked,
    blockedBy,
    weight: intent.weight,
    agentPayload,
  };
}

export function generateAllContracts(
  intents: ImplementationIntent[],
  cwd: string,
  blockedMap: Record<string, string[]> = {},
  evidence?: EvidenceEngineReport,
): ImplementationContract[] {
  const shared = evidence ?? loadEvidenceReport(cwd);
  return intents.map((intent) =>
    generateImplementationContract(intent, cwd, blockedMap[intent.id] ?? [], shared),
  );
}
