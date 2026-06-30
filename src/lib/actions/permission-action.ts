import { getCurrentUser } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError } from "@/lib/errors";
import { createAction } from "./base";
import type { ActionHandler, ActionOptions, ActionResult } from "./types";

type PermissionActionContext = Parameters<ActionHandler<unknown, unknown>>[0] & {
  userId: string;
  permissionCodes: string[];
};

type PermissionHandler<TInput, TOutput> = (
  input: TInput,
  context: PermissionActionContext,
) => Promise<TOutput>;

export function createPermissionAction<TInput, TOutput>(
  options: ActionOptions,
  requiredPermissions: string | string[],
  handler: PermissionHandler<TInput, TOutput>,
) {
  const wrapped = createAction<TInput, TOutput>(options, async (input, context) => {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError();
    }

    requirePermissionCodes(user, requiredPermissions);

    return handler(input, {
      ...context,
      userId: user.id,
      permissionCodes: user.permissionCodes,
    });
  });

  return wrapped as (input: TInput) => Promise<ActionResult<TOutput>>;
}
