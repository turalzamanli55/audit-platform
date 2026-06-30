"use server";

import { createServerClient } from "@/lib/supabase/server";
import { createPublicAction } from "@/lib/actions/public-action";
import { ValidationError } from "@/lib/errors";
import { isValidEmail } from "@/utils/auth-validation";

export type ForgotPasswordInput = {
  email: string;
  locale: string;
};

function resolveSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  return "http://localhost:3000";
}

export const forgotPasswordAction = createPublicAction<ForgotPasswordInput, { email: string }>(
  { module: "auth.forgot-password" },
  async (input) => {
    const email = input.email.trim().toLowerCase();
    if (!isValidEmail(email)) {
      throw new ValidationError("Enter a valid email address");
    }

    const origin = resolveSiteOrigin();
    const supabase = await createServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/${input.locale}/auth/callback?next=/${input.locale}/reset-password`,
    });

    if (error) {
      throw new ValidationError(error.message);
    }

    return { email };
  },
);
