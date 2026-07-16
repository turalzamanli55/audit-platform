/**
 * Domain inventory — EPBSE domains + ECIE domain completion.
 */
import type { EpireInputs } from "@/lib/platform-inventory/resolver";
import {
  averagePct,
  deriveReadinessLevel,
  type DomainInventoryItem,
} from "@/lib/platform-inventory/types";
import type { ModuleInventoryItem } from "@/lib/platform-inventory/types";

export function buildDomainInventory(
  inputs: EpireInputs,
  modules: ModuleInventoryItem[],
): DomainInventoryItem[] {
  const ecieDomains = new Map(inputs.ecie.domains.map((d) => [d.id, d]));

  return inputs.epbse.snapshot.domains.map((domain) => {
    const domainModules = modules.filter((m) => m.domainId === domain.id);
    const ecie = ecieDomains.get(domain.id);
    const completionPct =
      ecie?.completionPct ?? averagePct(domainModules.map((m) => m.completionPct));
    const allCertified =
      domainModules.length > 0 &&
      domainModules.every((m) => m.readiness === "enterprise_certified");

    return {
      id: domain.id,
      name: domain.name,
      description: domain.description,
      moduleIds: domainModules.map((m) => m.id),
      capabilityCount: domainModules.reduce((n, m) => n + m.capabilityIds.length, 0),
      completionPct,
      readiness: deriveReadinessLevel(completionPct, allCertified),
      source: ecie ? "ECIE" : "EPBSE",
    };
  });
}
