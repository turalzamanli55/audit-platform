import { getCurrentUser } from "@/lib/auth/server";
import { AuthenticationError } from "@/lib/errors";
import { createAction } from "./base";
import type { ActionHandler, ActionOptions, ActionResult } from "./types";

type AuthenticatedActionContext = Parameters<ActionHandler<unknown, unknown>>[0] & {
  userId: string;
};

type AuthenticatedHandler<TInput, TOutput> = (
  input: TInput,
  context: AuthenticatedActionContext,
) => Promise<TOutput>;

export function createAuthenticatedAction<TInput, TOutput>(
  options: ActionOptions,
  handler: AuthenticatedHandler<TInput, TOutput>,
) {
  const wrapped = createAction<TInput, TOutput>(options, async (input, context) => {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError();
    }

    return handler(input, { ...context, userId: user.id });
  });

  return wrapped as (input: TInput) => Promise<ActionResult<TOutput>>;
}
