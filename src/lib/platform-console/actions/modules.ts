"use server";

import { createPlatformAction } from "../platform-action";
import { recordPlatformEvent } from "../events";
import { ValidationError } from "@/lib/errors";

export type SetModuleAccessInput = {
  moduleCode: string;
  enabled: boolean;
  organizationId?: string | null;
  workspaceId?: string | null;
  userId?: string | null;
};

/**
 * Enables or disables a module for a given scope (platform / organization /
 * workspace / user) by upserting a scoped feature flag. Module flags are keyed
 * as `module:<code>` so they do not collide with product feature flags.
 */
export const setModuleAccessAction = createPlatformAction<SetModuleAccessInput, { flagCode: string }>(
  { module: "platform.modules.set-access" },
  async (input, ctx) => {
    const code = input.moduleCode.trim();
    if (!code) throw new ValidationError("Module code is required");

    const flagCode = `module:${code}`;
    const flagState = input.enabled ? "enabled" : "disabled";
    const organizationId = input.organizationId ?? null;
    const workspaceId = input.workspaceId ?? null;
    const userId = input.userId ?? null;

    let query = ctx.service
      .from("saas_feature_flags")
      .select("id")
      .eq("flag_code", flagCode)
      .is("deleted_at", null);
    query = organizationId === null ? query.is("organization_id", null) : query.eq("organization_id", organizationId);
    query = workspaceId === null ? query.is("workspace_id", null) : query.eq("workspace_id", workspaceId);
    query = userId === null ? query.is("user_id", null) : query.eq("user_id", userId);
    const existing = await query.maybeSingle();

    if (existing.data) {
      const { error } = await ctx.service
        .from("saas_feature_flags")
        .update({ flag_state: flagState, updated_by: ctx.ownerUserId })
        .eq("id", existing.data.id);
      if (error) throw new ValidationError(error.message);
    } else {
      const { error } = await ctx.service.from("saas_feature_flags").insert({
        flag_code: flagCode,
        flag_state: flagState,
        organization_id: organizationId,
        workspace_id: workspaceId,
        user_id: userId,
        created_by: ctx.ownerUserId,
        updated_by: ctx.ownerUserId,
      });
      if (error) throw new ValidationError(error.message);
    }

    await recordPlatformEvent(ctx.service, {
      eventCode: "module.access.changed",
      actorUserId: ctx.ownerUserId,
      organizationId,
      details: { moduleCode: code, enabled: input.enabled, scope: userId ? "user" : workspaceId ? "workspace" : organizationId ? "tenant" : "platform" },
    });

    return { flagCode };
  },
);
