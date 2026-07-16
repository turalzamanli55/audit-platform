/**
 * Score required evidence only.
 */
import type {
  EvidenceSatisfaction,
  ImplementationPhase,
  CapabilityClass,
} from "@/lib/capability-intelligence/types";

export function scoreRequiredCompletion(evidence: EvidenceSatisfaction[]): number {
  const required = evidence.filter((item) => item.required);
  if (required.length === 0) return 0;
  const verified = required.filter((item) => item.verified).length;
  return Number(((verified / required.length) * 100).toFixed(2));
}

export function countsTowardCompletion(input: {
  classes: CapabilityClass[];
  phase: ImplementationPhase;
  blocked: boolean;
}): boolean {
  if (input.phase === "future") return false;
  if (input.classes.includes("future")) return false;
  if (input.classes.includes("experimental")) return false;
  if (input.classes.includes("optional")) return false;
  if (input.classes.includes("planned")) return false;
  if (input.blocked) return false;
  return input.classes.includes("required") || input.classes.includes("security") || input.classes.includes("database") || input.classes.includes("infrastructure") || input.classes.includes("compliance") || input.classes.includes("workflow") || input.classes.includes("internal");
}

export function blocksCertification(input: {
  classes: CapabilityClass[];
  phase: ImplementationPhase;
  countsTowardCompletion: boolean;
}): boolean {
  if (!input.countsTowardCompletion) return false;
  if (input.classes.includes("optional")) return false;
  if (input.classes.includes("future")) return false;
  if (input.classes.includes("experimental")) return false;
  if (input.phase === "future" || input.phase === "enterprise") {
    // enterprise_only does not block base certification
    if (input.classes.includes("enterprise_only")) return false;
  }
  return input.classes.includes("required") || input.classes.includes("security") || input.classes.includes("database");
}
