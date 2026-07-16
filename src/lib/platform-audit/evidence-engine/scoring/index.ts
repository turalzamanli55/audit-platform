/**
 * Evidence confidence scoring.
 */
import {
  CONFIDENCE_WEIGHT,
  confidenceFromWeight,
  type ConfidenceLevel,
  type EvidenceItem,
  type EvidenceKind,
  type ResolvedDimensionEvidence,
} from "@/lib/platform-audit/evidence-engine/types";

export function scoreItem(input: {
  kind: EvidenceKind;
  path: string;
  symbol?: string;
  reasons: string[];
  /** Direct AST/export hit */
  verified?: boolean;
  /** Strong structural signal (class Repository, use server, page.tsx) */
  strong?: boolean;
  /** Via import graph / cross-module use */
  indirect?: boolean;
  /** Weak heuristic only */
  weak?: boolean;
  moduleIds?: string[];
  capabilityIds?: string[];
}): EvidenceItem {
  let weight = 0;
  if (input.verified) weight = Math.max(weight, 100);
  if (input.strong) weight = Math.max(weight, 90);
  if (input.indirect) weight = Math.max(weight, 75);
  if (input.weak) weight = Math.max(weight, 50);
  const confidence = confidenceFromWeight(weight);
  return {
    kind: input.kind,
    path: input.path,
    symbol: input.symbol,
    confidence,
    confidencePct: CONFIDENCE_WEIGHT[confidence],
    reason: input.reasons.join("; ") || confidence,
    moduleIds: input.moduleIds ?? [],
    capabilityIds: input.capabilityIds ?? [],
  };
}

export function collapseDimension(
  dimension: EvidenceKind,
  items: EvidenceItem[],
): ResolvedDimensionEvidence {
  if (items.length === 0) {
    return {
      dimension,
      present: false,
      confidence: "missing",
      confidencePct: 0,
      items: [],
    };
  }
  const best = items.reduce((a, b) => (a.confidencePct >= b.confidencePct ? a : b));
  return {
    dimension,
    present: best.confidence !== "missing",
    confidence: best.confidence,
    confidencePct: best.confidencePct,
    items: items.slice(0, 40),
  };
}

/** Completeness counts only verified (100) and strong (90) evidence. */
export function verifiedCompleteness(dimensions: ResolvedDimensionEvidence[]): number {
  if (dimensions.length === 0) return 0;
  const verified = dimensions.filter(
    (d) => d.present && (d.confidence === "verified" || d.confidence === "strong"),
  ).length;
  return Number(((verified / dimensions.length) * 100).toFixed(2));
}

export function dimensionConfidenceAverage(dimensions: ResolvedDimensionEvidence[]): number {
  if (dimensions.length === 0) return 0;
  return Number(
    (
      dimensions.reduce((sum, d) => sum + d.confidencePct, 0) / dimensions.length
    ).toFixed(2),
  );
}

export function isTrusted(level: ConfidenceLevel): boolean {
  return level === "verified" || level === "strong";
}
