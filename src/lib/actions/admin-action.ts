import { PLATFORM_ROLE_SLUGS } from "@/types/auth";
import { hasRoleSlug } from "@/lib/auth/permissions";
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

    const isAdmin = hasRoleSlug(user.roleSlugs, [
      PLATFORM_ROLE_SLUGS.ORGANIZATION_OWNER,
      PLATFORM_ROLE_SLUGS.ORGANIZATION_ADMIN,
      PLATFORM_ROLE_SLUGS.WORKSPACE_ADMIN,
      PLATFORM_ROLE_SLUGS.PLATFORM_OWNER,
    ]);

    if (!isAdmin) {
      throw new AuthorizationError();
    }

    return handler(input, { ...context, userId: user.id });
  });

  return wrapped as (input: TInput) => Promise<ActionResult<TOutput>>;
}
