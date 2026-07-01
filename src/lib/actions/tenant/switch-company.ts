"use server";

import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { setCompanySlugCookie } from "@/lib/auth/tenant-cookies";
import { ValidationError } from "@/lib/errors";

export type SwitchCompanyInput = {
  slug: string;
};

export const switchCompanyAction = createAuthenticatedAction<
  SwitchCompanyInput,
  { slug: string }
>({ module: "tenant.switch-company" }, async (input) => {
  const slug = input.slug.trim();
  if (!slug) {
    throw new ValidationError("Company is required");
  }

  await setCompanySlugCookie(slug);
  return { slug };
});
