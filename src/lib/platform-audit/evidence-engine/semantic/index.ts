/**
 * Semantic matching helpers — capability ↔ implementation.
 */
import { normalizeIdentity, expandAliases } from "@/lib/platform-audit/evidence-engine/aliases";
import type { AstSymbol } from "@/lib/platform-audit/evidence-engine/types";

export function capabilityAliases(capability: {
  id: string;
  name: string;
  moduleId: string;
  featureId?: string;
}): string[] {
  return expandAliases(capability.id, capability.name, capability.moduleId, capability.featureId);
}

export function symbolMatchesAliases(symbol: AstSymbol, aliases: string[]): boolean {
  const nameNorm = normalizeIdentity(symbol.name);
  const pathNorm = normalizeIdentity(symbol.filePath);
  for (const alias of aliases) {
    const a = normalizeIdentity(alias);
    if (a.length < 4) continue;
    if (nameNorm.includes(a) || a.includes(nameNorm)) return true;
    if (pathNorm.includes(a)) return true;
  }
  return false;
}

export function pathMatchesAliases(path: string, aliases: string[]): boolean {
  const pathNorm = path.toLowerCase();
  for (const alias of aliases) {
    const raw = alias.toLowerCase();
    if (raw.length < 3) continue;
    if (pathNorm.includes(raw) || pathNorm.includes(raw.replace(/_/g, "-"))) return true;
    if (normalizeIdentity(path).includes(normalizeIdentity(alias))) return true;
  }
  return false;
}
