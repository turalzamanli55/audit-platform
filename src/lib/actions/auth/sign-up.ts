"use server";

import { createPublicAction } from "@/lib/actions/public-action";
import { ValidationError } from "@/lib/errors";

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

/** Public self-registration is permanently disabled for Enterprise SaaS. */
export const signUpAction = createPublicAction<SignUpInput, SignUpResult>(
  { module: "auth.sign-up" },
  async () => {
    throw new ValidationError(
      "Public registration is disabled. Access requires a Platform Owner or Tenant Admin invitation.",
    );
  },
);
