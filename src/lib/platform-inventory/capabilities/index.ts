/**
 * Capability inventory — ECIE intent + EIIE certification (no re-scoring).
 */
import type { EpireInputs } from "@/lib/platform-inventory/resolver";
import type { CapabilityInventoryItem } from "@/lib/platform-inventory/types";

export function buildCapabilityInventory(inputs: EpireInputs): CapabilityInventoryItem[] {
  const contracts = new Map(inputs.eiie.contracts.map((c) => [c.capabilityId, c]));

  return inputs.ecie.capabilities.map((cap) => {
    const contract = contracts.get(cap.id);
    const certified = contract ? Boolean(contract.certified) : cap.lifecycle === "certified";
    const blocked = contract ? Boolean(contract.blocked) : cap.lifecycle === "blocked";
    const remaining =
      contract?.agentPayload.missingClauses.map(String) ??
      cap.evidence.filter((e) => e.required && !e.verified).map((e) => e.kind);

    return {
      id: cap.id,
      name: cap.name,
      moduleId: cap.moduleId,
      domainId: cap.domainId,
      featureId: cap.featureId,
      required: cap.countsTowardCompletion,
      implemented:
        certified ||
        cap.lifecycle === "implemented" ||
        cap.lifecycle === "verified" ||
        (contract ? contract.coveragePct >= 100 : false),
      certified,
      remaining,
      blocked,
      blockedBy: contract?.blockedBy ?? cap.blockedBy,
      lifecycle: cap.lifecycle,
      completionPct: contract?.coveragePct ?? cap.requiredCompletionPct,
      weight: cap.weight,
      bibleSection: contract?.bibleSection ?? "",
    };
  });
}
