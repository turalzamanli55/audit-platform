import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import {
  objectLegalHoldPolicyCode,
  type LegalHoldState,
  type LifecycleObjectType,
} from "./types";

type Service = SupabaseClient<Database>;

/**
 * Legal hold via existing legal_hold_and_retention_policies.
 * policy_code = object:{type}:{id} — no new table.
 */
export async function getObjectLegalHold(
  client: Service,
  objectType: LifecycleObjectType,
  objectId: string,
  organizationId: string,
): Promise<LegalHoldState> {
  const code = objectLegalHoldPolicyCode(objectType, objectId);
  const { data } = await client
    .from("legal_hold_and_retention_policies")
    .select("id, legal_hold_enabled, created_by, created_at, policy_code")
    .eq("organization_id", organizationId)
    .eq("policy_code", code)
    .is("deleted_at", null)
    .maybeSingle();

  if (!data || !data.legal_hold_enabled) {
    return {
      enabled: false,
      policyId: data?.id ?? null,
      reason: null,
      enabledBy: null,
      enabledAt: null,
    };
  }

  return {
    enabled: true,
    policyId: data.id,
    reason: null,
    enabledBy: data.created_by,
    enabledAt: data.created_at,
  };
}

export async function getOrganizationRetentionDays(
  client: Service,
  organizationId: string,
): Promise<number | null> {
  const { data } = await client
    .from("legal_hold_and_retention_policies")
    .select("retention_days, policy_code")
    .eq("organization_id", organizationId)
    .is("deleted_at", null)
    .eq("legal_hold_enabled", false)
    .order("created_at", { ascending: false })
    .limit(20);

  const orgDefault = (data ?? []).find(
    (row) => row.policy_code === "organization_default" || !row.policy_code.startsWith("object:"),
  );
  return orgDefault?.retention_days ?? data?.[0]?.retention_days ?? null;
}

export async function setObjectLegalHold(
  client: Service,
  input: {
    objectType: LifecycleObjectType;
    objectId: string;
    organizationId: string;
    workspaceId?: string | null;
    enabled: boolean;
    actorUserId: string;
    reason?: string | null;
  },
): Promise<LegalHoldState> {
  const code = objectLegalHoldPolicyCode(input.objectType, input.objectId);
  const existing = await client
    .from("legal_hold_and_retention_policies")
    .select("id, version")
    .eq("organization_id", input.organizationId)
    .eq("policy_code", code)
    .is("deleted_at", null)
    .maybeSingle();

  if (existing.data) {
    await client
      .from("legal_hold_and_retention_policies")
      .update({
        legal_hold_enabled: input.enabled,
        updated_by: input.actorUserId,
      } as never)
      .eq("id", existing.data.id);
    return getObjectLegalHold(client, input.objectType, input.objectId, input.organizationId);
  }

  if (!input.enabled) {
    return {
      enabled: false,
      policyId: null,
      reason: input.reason ?? null,
      enabledBy: null,
      enabledAt: null,
    };
  }

  const { data, error } = await client
    .from("legal_hold_and_retention_policies")
    .insert({
      organization_id: input.organizationId,
      workspace_id: input.workspaceId ?? null,
      policy_code: code,
      legal_hold_enabled: true,
      retention_days: 1825,
      created_by: input.actorUserId,
      updated_by: input.actorUserId,
    })
    .select("id, created_by, created_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to enable legal hold");
  }

  return {
    enabled: true,
    policyId: data.id,
    reason: input.reason ?? null,
    enabledBy: data.created_by,
    enabledAt: data.created_at,
  };
}
