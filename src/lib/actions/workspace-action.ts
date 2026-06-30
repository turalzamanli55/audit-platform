import { getWorkspaceContext } from "@/lib/auth/server";
import { getCurrentUser } from "@/lib/auth/server";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";
import { createAction } from "./base";
import type { ActionHandler, ActionOptions, ActionResult } from "./types";

type WorkspaceActionContext = Parameters<ActionHandler<unknown, unknown>>[0] & {
  userId: string;
  workspaceId: string;
};

type WorkspaceHandler<TInput, TOutput> = (
  input: TInput,
  context: WorkspaceActionContext,
) => Promise<TOutput>;

export function createWorkspaceAction<TInput, TOutput>(
  options: ActionOptions,
  handler: WorkspaceHandler<TInput, TOutput>,
) {
  const wrapped = createAction<TInput, TOutput>(options, async (input, context) => {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError();
    }

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId) {
      throw new AuthorizationError("Workspace context is required");
    }

    return handler(input, {
      ...context,
      userId: user.id,
      workspaceId: workspace.workspaceId,
    });
  });

  return wrapped as (input: TInput) => Promise<ActionResult<TOutput>>;
}
