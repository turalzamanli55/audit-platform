/**
 * Completion — authoritative overall % from EIIE verified implementation contracts.
 */
import type { EpireInputs } from "@/lib/platform-inventory/resolver";

export function overallPlatformCompletionFromVerifiedImplementation(
  inputs: EpireInputs,
): number {
  // PROJECT_BIBLE rule: completion calculated only from verified implementation.
  return inputs.eiie.platformCompletionPct;
}
