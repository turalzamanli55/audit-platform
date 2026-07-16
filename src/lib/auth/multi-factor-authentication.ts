import { ValidationError } from "@/lib/errors";

/**
 * Multi-factor authentication rules (PROJECT_BIBLE §13.7 Security).
 * Pure validation used by the MFA server actions.
 */

export const MFA_FACTOR_TYPE = "totp" as const;
export const MFA_CODE_LENGTH = 6;
export const MFA_FRIENDLY_NAME_MAX_LENGTH = 60;

export function isValidTotpCode(code: string): boolean {
  return new RegExp(`^\\d{${MFA_CODE_LENGTH}}$`).test(code.trim());
}

export function assertValidTotpCode(code: string): string {
  const normalized = code.trim();
  if (!isValidTotpCode(normalized)) {
    throw new ValidationError(`Enter the ${MFA_CODE_LENGTH}-digit authenticator code`);
  }
  return normalized;
}

export function normalizeFactorFriendlyName(name: string | null | undefined): string {
  const normalized = (name ?? "").trim().replace(/\s+/g, " ");
  if (!normalized) {
    return "Authenticator app";
  }
  if (normalized.length > MFA_FRIENDLY_NAME_MAX_LENGTH) {
    throw new ValidationError(
      `Factor name must be at most ${MFA_FRIENDLY_NAME_MAX_LENGTH} characters`,
    );
  }
  return normalized;
}

export function assertFactorId(factorId: string | null | undefined): string {
  const normalized = (factorId ?? "").trim();
  if (!normalized) {
    throw new ValidationError("MFA factor is required");
  }
  return normalized;
}
