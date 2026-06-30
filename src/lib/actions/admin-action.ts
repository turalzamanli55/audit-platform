"use server";

import { ROLES } from "@/types/auth";
import { hasRole } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/server";
import { AuthorizationError, AuthenticationError } from "@/lib/errors";
import { createAction } from "./base";
import type { ActionHandler, ActionOptions, ActionResult } from "./types";

type AdminActionContext = Parameters<ActionHandler<unknown, unknown>>[0] & {
  userId: string;
};

type AdminHandler<TInput, TOutput> = (
  input: TInput,
  context: AdminActionContext,
) => Promise<TOutput>;

export function createAdminAction<TInput, TOutput>(
  options: ActionOptions,
  handler: AdminHandler<TInput, TOutput>,
) {
  const wrapped = createAction<TInput, TOutput>(options, async (input, context) => {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError();
    }

    const isAdmin = hasRole(user.roles, [
      ROLES.ORGANIZATION_OWNER,
      ROLES.WORKSPACE_ADMINISTRATOR,
      ROLES.PLATFORM_OPERATOR,
    ]);

    if (!isAdmin) {
      throw new AuthorizationError();
    }

    return handler(input, { ...context, userId: user.id });
  });

  return wrapped as (input: TInput) => Promise<ActionResult<TOutput>>;
}
