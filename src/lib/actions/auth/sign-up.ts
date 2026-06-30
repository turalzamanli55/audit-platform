"use server";

import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";
import { createPublicAction } from "@/lib/actions/public-action";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { ValidationError } from "@/lib/errors";
import { isValidEmail, isValidPassword } from "@/utils/auth-validation";

export type SignUpInput = {
  email: string;
  password: string;
  fullName: string;
  locale: string;
};

export type SignUpResult = {
  email: string;
  requiresVerification: boolean;
};

function resolveSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  return "http://localhost:3000";
}

export const signUpAction = createPublicAction<SignUpInput, SignUpResult>(
  { module: "auth.sign-up" },
  async (input) => {
    const email = input.email.trim().toLowerCase();
    const fullName = input.fullName.trim();

    if (!fullName) {
      throw new ValidationError("Full name is required");
    }
    if (!isValidEmail(email)) {
      throw new ValidationError("Enter a valid email address");
    }
    if (!isValidPassword(input.password)) {
      throw new ValidationError("Password must be at least 8 characters");
    }

    const origin = resolveSiteOrigin();
    const supabase = await createServerClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password: input.password,
      options: {
        data: {
          full_name: fullName,
          locale: input.locale,
        },
        emailRedirectTo: `${origin}/${input.locale}/auth/callback`,
      },
    });

    if (error) {
      throw new ValidationError(error.message);
    }

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.REGISTER,
      resourceType: "user",
      resourceId: data.user?.id ?? null,
      userId: data.user?.id ?? null,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { email },
    });

    return {
      email,
      requiresVerification: !data.session,
    };
  },
);
