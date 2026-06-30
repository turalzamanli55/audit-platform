"use server";

import { getOrganizationContext } from "@/lib/auth/server";
import { getCurrentUser } from "@/lib/auth/server";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";
import { createAction } from "./base";
import type { ActionHandler, ActionOptions, ActionResult } from "./types";

type OrganizationActionContext = Parameters<ActionHandler<unknown, unknown>>[0] & {
  userId: string;
  organizationId: string;
};

type OrganizationHandler<TInput, TOutput> = (
  input: TInput,
  context: OrganizationActionContext,
) => Promise<TOutput>;

export function createOrganizationAction<TInput, TOutput>(
  options: ActionOptions,
  handler: OrganizationHandler<TInput, TOutput>,
) {
  const wrapped = createAction<TInput, TOutput>(options, async (input, context) => {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError();
    }

    const organization = await getOrganizationContext();
    if (!organization.isResolved || !organization.organizationId) {
      throw new AuthorizationError("Organization context is required");
    }

    return handler(input, {
      ...context,
      userId: user.id,
      organizationId: organization.organizationId,
    });
  });

  return wrapped as (input: TInput) => Promise<ActionResult<TOutput>>;
}
