"use server";

import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";
import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import {
  MFA_FACTOR_TYPE,
  assertFactorId,
  assertValidTotpCode,
  normalizeFactorFriendlyName,
} from "@/lib/auth/multi-factor-authentication";
import { ValidationError } from "@/lib/errors";

export type EnrollMfaInput = {
  friendlyName?: string | null;
};

export type EnrollMfaResult = {
  factorId: string;
  factorType: typeof MFA_FACTOR_TYPE;
  friendlyName: string;
  totpSecret: string;
  totpUri: string;
  qrCode: string;
};

export const enrollMultiFactorAuthenticationAction = createAuthenticatedAction<
  EnrollMfaInput | undefined,
  EnrollMfaResult
>({ module: "auth.mfa.enroll" }, async (input, context) => {
  const friendlyName = normalizeFactorFriendlyName(input?.friendlyName);

  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: MFA_FACTOR_TYPE,
    friendlyName,
  });

  if (error || !data) {
    throw new ValidationError(error?.message ?? "MFA enrollment failed");
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.MFA_ENROLLED,
    resourceType: "user",
    resourceId: context.userId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { factorId: data.id, factorType: MFA_FACTOR_TYPE, friendlyName },
  });

  return {
    factorId: data.id,
    factorType: MFA_FACTOR_TYPE,
    friendlyName,
    totpSecret: data.totp.secret,
    totpUri: data.totp.uri,
    qrCode: data.totp.qr_code,
  };
});

export type ChallengeMfaInput = {
  factorId: string;
};

export type ChallengeMfaResult = {
  challengeId: string;
  factorId: string;
  expiresAt: number;
};

export const challengeMultiFactorAuthenticationAction = createAuthenticatedAction<
  ChallengeMfaInput,
  ChallengeMfaResult
>({ module: "auth.mfa.challenge" }, async (input, context) => {
  const factorId = assertFactorId(input.factorId);

  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.mfa.challenge({ factorId });

  if (error || !data) {
    throw new ValidationError(error?.message ?? "MFA challenge failed");
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.MFA_CHALLENGED,
    resourceType: "user",
    resourceId: context.userId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { factorId },
  });

  return {
    challengeId: data.id,
    factorId,
    expiresAt: data.expires_at ?? 0,
  };
});

export type VerifyMfaInput = {
  factorId: string;
  challengeId: string;
  code: string;
};

export type VerifyMfaResult = {
  factorId: string;
  verified: boolean;
};

export const verifyMultiFactorAuthenticationAction = createAuthenticatedAction<
  VerifyMfaInput,
  VerifyMfaResult
>({ module: "auth.mfa.verify" }, async (input, context) => {
  const factorId = assertFactorId(input.factorId);
  if (!input.challengeId?.trim()) {
    throw new ValidationError("MFA challenge is required");
  }
  const code = assertValidTotpCode(input.code);

  const supabase = await createServerClient();
  const { error } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: input.challengeId.trim(),
    code,
  });

  if (error) {
    throw new ValidationError(error.message);
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.MFA_VERIFIED,
    resourceType: "user",
    resourceId: context.userId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { factorId },
  });

  return { factorId, verified: true };
});

export type MfaFactorSummary = {
  factorId: string;
  factorType: string;
  friendlyName: string | null;
  factorStatus: string;
  createdAt: string;
};

export type ListMfaFactorsResult = {
  factors: MfaFactorSummary[];
  verifiedCount: number;
};

export const listMultiFactorAuthenticationFactorsAction = createAuthenticatedAction<
  Record<string, never> | undefined,
  ListMfaFactorsResult
>({ module: "auth.mfa.list-factors" }, async () => {
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.mfa.listFactors();

  if (error || !data) {
    throw new ValidationError(error?.message ?? "Unable to list MFA factors");
  }

  const factors = data.all.map((factor) => ({
    factorId: factor.id,
    factorType: factor.factor_type,
    friendlyName: factor.friendly_name ?? null,
    factorStatus: factor.status,
    createdAt: factor.created_at,
  }));

  return {
    factors,
    verifiedCount: factors.filter((factor) => factor.factorStatus === "verified").length,
  };
});

export type UnenrollMfaInput = {
  factorId: string;
};

export type UnenrollMfaResult = {
  factorId: string;
  unenrolled: boolean;
};

export const unenrollMultiFactorAuthenticationAction = createAuthenticatedAction<
  UnenrollMfaInput,
  UnenrollMfaResult
>({ module: "auth.mfa.unenroll" }, async (input, context) => {
  const factorId = assertFactorId(input.factorId);

  const supabase = await createServerClient();
  const { error } = await supabase.auth.mfa.unenroll({ factorId });

  if (error) {
    throw new ValidationError(error.message);
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.MFA_UNENROLLED,
    resourceType: "user",
    resourceId: context.userId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { factorId },
  });

  return { factorId, unenrolled: true };
});
