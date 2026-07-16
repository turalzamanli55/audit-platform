/**
 * Lifecycle detection from evidence + blocking.
 */
import type {
  ImplementationPhase,
  LifecycleState,
  EvidenceSatisfaction,
} from "@/lib/capability-intelligence/types";

export function deriveLifecycle(input: {
  phase: ImplementationPhase;
  requiredEvidence: EvidenceSatisfaction[];
  blocked: boolean;
  deprecated?: boolean;
}): LifecycleState {
  if (input.deprecated) return "deprecated";
  if (input.phase === "future") return "future";
  if (input.blocked) return "blocked";

  const required = input.requiredEvidence.filter((item) => item.required);
  if (required.length === 0) return "not_started";

  const verified = required.filter((item) => item.verified).length;
  const present = required.filter((item) => item.present).length;
  const ratio = verified / required.length;

  if (ratio >= 1) return "certified";
  if (ratio >= 0.85) return "verified";
  if (ratio >= 0.6) return "implemented";
  if (present > 0 || verified > 0) return "in_progress";
  return "not_started";
}
