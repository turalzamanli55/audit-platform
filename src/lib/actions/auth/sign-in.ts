"use server";

import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createPublicAction } from "@/lib/actions/public-action";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { ValidationError } from "@/lib/errors";
import { assertTenantLoginAllowed } from "@/lib/auth/login-guard";
import { isValidEmail, isValidPassword } from "@/utils/auth-validation";

export type SignInInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type SignInResult = {
  email: string;
};

export const signInAction = createPublicAction<SignInInput, SignInResult>(
  { module: "auth.sign-in" },
  async (input) => {
    const email = input.email.trim().toLowerCase();
    if (!isValidEmail(email)) {
      throw new ValidationError("Enter a valid email address");
    }
    if (!isValidPassword(input.password)) {
      throw new ValidationError("Enter a valid password");
    }

    const supabase = await createServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: input.password,
    });

    if (error) {
      throw new ValidationError(error.message);
    }

    // Enforce tenant-level suspension: a suspended organization must block its
    // users from establishing a session, not merely change a status flag.
    if (data.user) {
      try {
        await assertTenantLoginAllowed(createServiceClient(), data.user.id);
      } catch (guardError) {
        await supabase.auth.signOut();
        throw guardError;
      }
    }

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.LOGIN,
      resourceType: "user",
      resourceId: data.user?.id ?? null,
      userId: data.user?.id ?? null,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { rememberMe: Boolean(input.rememberMe) },
    });

    return { email };
  },
);
