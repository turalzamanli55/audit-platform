"use server";

import { createPlatformAction } from "../platform-action";
import { recordPlatformEvent } from "../events";
import { ValidationError, NotFoundError } from "@/lib/errors";

const FLAG_STATES = new Set(["enabled", "disabled", "preview", "experimental", "deprecated"]);

function normalizeCode(code: string): string {
  return code.trim().toLowerCase().replace(/\s+/g, "_");
}

export type CreateFeatureFlagInput = {
  flagCode: string;
  flagState?: string;
  organizationId?: string | null;
};

export const createFeatureFlagAction = createPlatformAction<CreateFeatureFlagInput, { id: string }>(
  { module: "platform.feature-flags.create" },
  async (input, ctx) => {
    const flagCode = normalizeCode(input.flagCode);
    if (!flagCode) throw new ValidationError("Flag code is required");
    if (flagCode.startsWith("module:")) {
      throw new ValidationError("Module flags are managed from the Modules page");
    }
    const flagState = input.flagState ?? "enabled";
    if (!FLAG_STATES.has(flagState)) throw new ValidationError("Invalid flag state");

    const organizationId = input.organizationId ?? null;

    // Prevent duplicate (code, scope) collisions for the platform/tenant scope.
    let existingQuery = ctx.service
      .from("saas_feature_flags")
      .select("id")
      .eq("flag_code", flagCode)
      .is("deleted_at", null)
      .is("workspace_id", null)
      .is("user_id", null);
    existingQuery =
      organizationId === null
        ? existingQuery.is("organization_id", null)
        : existingQuery.eq("organization_id", organizationId);
    const existing = await existingQuery.maybeSingle();
    if (existing.data) throw new ValidationError("A flag with this code and scope already exists");

    const { data, error } = await ctx.service
      .from("saas_feature_flags")
      .insert({
        flag_code: flagCode,
        flag_state: flagState,
        organization_id: organizationId,
        created_by: ctx.ownerUserId,
        updated_by: ctx.ownerUserId,
      })
      .select("id")
      .single();

    if (error || !data) throw new ValidationError(error?.message ?? "Failed to create feature flag");

    await recordPlatformEvent(ctx.service, {
      eventCode: "feature_flag.created",
      actorUserId: ctx.ownerUserId,
      organizationId,
      details: { flagCode, flagState },
    });

    return { id: data.id };
  },
);

export type UpdateFeatureFlagInput = {
  id: string;
  flagState: string;
};

export const updateFeatureFlagAction = createPlatformAction<UpdateFeatureFlagInput, { id: string }>(
  { module: "platform.feature-flags.update" },
  async (input, ctx) => {
    if (!input.id) throw new ValidationError("Missing flag id");
    if (!FLAG_STATES.has(input.flagState)) throw new ValidationError("Invalid flag state");

    const { data, error } = await ctx.service
      .from("saas_feature_flags")
      .update({ flag_state: input.flagState, updated_by: ctx.ownerUserId })
      .eq("id", input.id)
      .is("deleted_at", null)
      .select("id")
      .maybeSingle();

    if (error) throw new ValidationError(error.message);
    if (!data) throw new NotFoundError("Feature flag not found");

    await recordPlatformEvent(ctx.service, {
      eventCode: "feature_flag.updated",
      actorUserId: ctx.ownerUserId,
      details: { flagId: input.id, flagState: input.flagState },
    });

    return { id: input.id };
  },
);

function toggleAction(module: string, state: "enabled" | "disabled", eventCode: string) {
  return createPlatformAction<{ id: string }, { id: string }>({ module }, async (input, ctx) => {
    if (!input.id) throw new ValidationError("Missing flag id");
    const { data, error } = await ctx.service
      .from("saas_feature_flags")
      .update({ flag_state: state, updated_by: ctx.ownerUserId })
      .eq("id", input.id)
      .is("deleted_at", null)
      .select("id")
      .maybeSingle();

    if (error) throw new ValidationError(error.message);
    if (!data) throw new NotFoundError("Feature flag not found");

    await recordPlatformEvent(ctx.service, {
      eventCode,
      actorUserId: ctx.ownerUserId,
      details: { flagId: input.id },
    });

    return { id: input.id };
  });
}

export const enableFeatureFlagAction = toggleAction(
  "platform.feature-flags.enable",
  "enabled",
  "feature_flag.enabled",
);
export const disableFeatureFlagAction = toggleAction(
  "platform.feature-flags.disable",
  "disabled",
  "feature_flag.disabled",
);

export const deleteFeatureFlagAction = createPlatformAction<{ id: string }, { id: string }>(
  { module: "platform.feature-flags.delete" },
  async (input, ctx) => {
    if (!input.id) throw new ValidationError("Missing flag id");
    const { data, error } = await ctx.service
      .from("saas_feature_flags")
      .update({ deleted_at: new Date().toISOString(), deleted_by: ctx.ownerUserId })
      .eq("id", input.id)
      .is("deleted_at", null)
      .select("id")
      .maybeSingle();

    if (error) throw new ValidationError(error.message);
    if (!data) throw new NotFoundError("Feature flag not found");

    await recordPlatformEvent(ctx.service, {
      eventCode: "feature_flag.deleted",
      actorUserId: ctx.ownerUserId,
      severity: "warning",
      details: { flagId: input.id },
    });

    return { id: input.id };
  },
);
