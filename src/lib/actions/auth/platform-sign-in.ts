"use server";

import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";
import { isPlatformOwner } from "@/lib/auth/platform-owner";
import { createPublicAction } from "@/lib/actions/public-action";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { ValidationError } from "@/lib/errors";
import { isValidEmail, isValidPassword } from "@/utils/auth-validation";

export type PlatformSignInInput = {
  email: string;
  password: string;
};

export type PlatformSignInResult = {
  email: string;
};

/**
 * Platform Owner login. Authenticates, then verifies the account is the single
 * Platform Owner. Any non-owner account is immediately signed out — normal
 * users must never use this login.
 */
export const platformSignInAction = createPublicAction<PlatformSignInInput, PlatformSignInResult>(
  { module: "auth.platform-sign-in" },
  async (input) => {
    const email = input.email.trim().toLowerCase();
    if (!isValidEmail(email)) {
      throw new ValidationError("Enter a valid email address");
    }
    if (!isValidPassword(input.password)) {
      throw new ValidationError("Enter a valid password");
    }

    const supabase = await createServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: input.password });

    if (error) {
      throw new ValidationError(error.message);
    }

    const owner = await isPlatformOwner();
    if (!owner) {
      await supabase.auth.signOut();
      throw new ValidationError("This login is reserved for the Platform Owner.");
    }

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.LOGIN,
      resourceType: "user",
      resourceId: data.user?.id ?? null,
      userId: data.user?.id ?? null,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { platformOwner: true },
    });

    return { email };
  },
);
