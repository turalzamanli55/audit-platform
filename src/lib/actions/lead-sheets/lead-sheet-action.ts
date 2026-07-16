import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";
import { createAction } from "../base";
import type { ActionContext, ActionOptions, ActionResult } from "../types";

export type LeadSheetActionContext = ActionContext & {
  userId: string;
  organizationId: string;
  workspaceId: string;
  permissionCodes: string[];
};

type LeadSheetHandler<TInput, TOutput> = (
  input: TInput,
  context: LeadSheetActionContext,
) => Promise<TOutput>;

export function createLeadSheetAction<TInput, TOutput>(
  options: ActionOptions,
  requiredPermissions: string | string[],
  handler: LeadSheetHandler<TInput, TOutput>,
) {
  const wrapped = createAction<TInput, TOutput>(options, async (input, context) => {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError();
    }

    requirePermissionCodes(user, requiredPermissions);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId) {
      throw new AuthorizationError("Workspace context is required");
    }

    if (!user.organizationId) {
      throw new AuthorizationError("Organization context is required");
    }

    if (user.workspaceId && user.workspaceId !== workspace.workspaceId) {
      throw new AuthorizationError("Workspace context mismatch");
    }

    return handler(input, {
      ...context,
      userId: user.id,
      organizationId: user.organizationId,
      workspaceId: workspace.workspaceId,
      permissionCodes: user.permissionCodes,
    });
  });

  return wrapped as (input: TInput) => Promise<ActionResult<TOutput>>;
}
