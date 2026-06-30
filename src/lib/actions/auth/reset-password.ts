"use server";

import { createServerClient } from "@/lib/supabase/server";
import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { ValidationError } from "@/lib/errors";
import { isValidPassword } from "@/utils/auth-validation";

export type ResetPasswordInput = {
  password: string;
  confirmPassword: string;
};

export const resetPasswordAction = createAuthenticatedAction<ResetPasswordInput, { success: true }>(
  { module: "auth.reset-password" },
  async (input) => {
    if (!isValidPassword(input.password)) {
      throw new ValidationError("Password must be at least 8 characters");
    }
    if (input.password !== input.confirmPassword) {
      throw new ValidationError("Passwords do not match");
    }

    const supabase = await createServerClient();
    const { error } = await supabase.auth.updateUser({ password: input.password });

    if (error) {
      throw new ValidationError(error.message);
    }

    return { success: true };
  },
);
