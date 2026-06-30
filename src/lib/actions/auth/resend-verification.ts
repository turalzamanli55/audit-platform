"use server";

import { createServerClient } from "@/lib/supabase/server";
import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { ValidationError } from "@/lib/errors";

export type ResendVerificationInput = {
  email: string;
  locale: string;
};

function resolveSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  return "http://localhost:3000";
}

export const resendVerificationAction = createAuthenticatedAction<
  ResendVerificationInput,
  { email: string }
>({ module: "auth.resend-verification" }, async (input) => {
  const email = input.email.trim().toLowerCase();
  const origin = resolveSiteOrigin();
  const supabase = await createServerClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${origin}/${input.locale}/auth/callback`,
    },
  });

  if (error) {
    throw new ValidationError(error.message);
  }

  return { email };
});
