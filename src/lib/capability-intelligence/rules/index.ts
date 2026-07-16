/**
 * Governance rules for ECIE decisions.
 */
export const ECIE_RULES = {
  sourceOfTruth: "PROJECT_BIBLE.md",
  completionScope: "required_verified_only",
  futureDoesNotPenalize: true,
  optionalDoesNotBlockCertification: true,
  blockedMarkedNotPenalized: true,
  evidenceMustBeVerifiedOrStrong: true,
} as const;

export function explainRule(code: keyof typeof ECIE_RULES): string {
  switch (code) {
    case "sourceOfTruth":
      return "PROJECT_BIBLE.md is the only executable specification";
    case "completionScope":
      return "Platform completion uses required verified capabilities only";
    case "futureDoesNotPenalize":
      return "Future capabilities are excluded from completion math";
    case "optionalDoesNotBlockCertification":
      return "Optional capabilities never block certification";
    case "blockedMarkedNotPenalized":
      return "Blocked capabilities are marked blocked instead of reducing completion";
    case "evidenceMustBeVerifiedOrStrong":
      return "Only verified/strong EPAC evidence satisfies required evidence";
    default:
      return String(code);
  }
}
