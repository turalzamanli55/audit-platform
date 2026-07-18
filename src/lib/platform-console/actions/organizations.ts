"use server";

import { createPlatformAction } from "../platform-action";
import { recordPlatformEvent } from "../events";
import { ValidationError, NotFoundError } from "@/lib/errors";
import type { Database } from "@/types/supabase";

type OrganizationUpdate = Database["public"]["Tables"]["organizations"]["Update"];

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TENANT_TYPES = new Set(["solo", "business", "enterprise"]);

function normalizeSlug(value: string): string {
  return value.trim().toLowerCase();
}

export type CreateTenantInput = {
  name: string;
  slug: string;
  tenantType: string;
  legalName?: string;
};

export type TenantMutationResult = { id: string };

export const createTenantAction = createPlatformAction<CreateTenantInput, TenantMutationResult>(
  { module: "platform.tenants.create" },
  async (input, ctx) => {
    const name = input.name.trim();
    const slug = normalizeSlug(input.slug);

    if (name.length < 2) throw new ValidationError("Name must be at least 2 characters");
    if (!SLUG_PATTERN.test(slug)) {
      throw new ValidationError("Slug must be lowercase letters, numbers, and hyphens");
    }
    if (!TENANT_TYPES.has(input.tenantType)) {
      throw new ValidationError("Tenant type must be solo, business, or enterprise");
    }

    const existing = await ctx.service
      .from("organizations")
      .select("id")
      .eq("slug", slug)
      .is("deleted_at", null)
      .maybeSingle();
    if (existing.data) throw new ValidationError("Slug is already in use");

    const { data, error } = await ctx.service
      .from("organizations")
      .insert({
        name,
        slug,
        legal_name: input.legalName?.trim() || null,
        tenant_type: input.tenantType,
        platform_owner_managed: true,
        created_by: ctx.ownerUserId,
        updated_by: ctx.ownerUserId,
      })
      .select("id")
      .single();

    if (error || !data) throw new ValidationError(error?.message ?? "Failed to create tenant");

    await recordPlatformEvent(ctx.service, {
      eventCode: "tenant.created",
      actorUserId: ctx.ownerUserId,
      organizationId: data.id,
      details: { slug, tenantType: input.tenantType },
    });

    return { id: data.id };
  },
);

export type UpdateTenantInput = {
  id: string;
  name?: string;
  legalName?: string;
  tenantType?: string;
};

export const updateTenantAction = createPlatformAction<UpdateTenantInput, TenantMutationResult>(
  { module: "platform.tenants.update" },
  async (input, ctx) => {
    const patch: OrganizationUpdate = { updated_by: ctx.ownerUserId };

    if (input.name !== undefined) {
      const name = input.name.trim();
      if (name.length < 2) throw new ValidationError("Name must be at least 2 characters");
      patch.name = name;
    }
    if (input.legalName !== undefined) patch.legal_name = input.legalName.trim() || null;
    if (input.tenantType !== undefined) {
      if (!TENANT_TYPES.has(input.tenantType)) {
        throw new ValidationError("Tenant type must be solo, business, or enterprise");
      }
      patch.tenant_type = input.tenantType;
    }

    const { data, error } = await ctx.service
      .from("organizations")
      .update(patch)
      .eq("id", input.id)
      .is("deleted_at", null)
      .select("id")
      .maybeSingle();

    if (error) throw new ValidationError(error.message);
    if (!data) throw new NotFoundError("Tenant not found");

    await recordPlatformEvent(ctx.service, {
      eventCode: "tenant.updated",
      actorUserId: ctx.ownerUserId,
      organizationId: input.id,
    });

    return { id: input.id };
  },
);

type StatusChange = { id: string };

function statusAction(module: string, status: "active" | "archived" | "suspended", eventCode: string) {
  return createPlatformAction<StatusChange, TenantMutationResult>(
    { module },
    async (input, ctx) => {
      const { data, error } = await ctx.service
        .from("organizations")
        .update({ status, updated_by: ctx.ownerUserId })
        .eq("id", input.id)
        .is("deleted_at", null)
        .select("id")
        .maybeSingle();

      if (error) throw new ValidationError(error.message);
      if (!data) throw new NotFoundError("Tenant not found");

      await recordPlatformEvent(ctx.service, {
        eventCode,
        actorUserId: ctx.ownerUserId,
        organizationId: input.id,
        severity: status === "suspended" ? "warning" : "info",
      });

      return { id: input.id };
    },
  );
}

export const suspendTenantAction = statusAction("platform.tenants.suspend", "suspended", "tenant.suspended");
export const activateTenantAction = statusAction("platform.tenants.activate", "active", "tenant.activated");
export const archiveTenantAction = statusAction("platform.tenants.archive", "archived", "tenant.archived");
export const restoreTenantAction = statusAction("platform.tenants.restore", "active", "tenant.restored");

export const deleteTenantAction = createPlatformAction<StatusChange, TenantMutationResult>(
  { module: "platform.tenants.delete" },
  async (input, ctx) => {
    const { data, error } = await ctx.service
      .from("organizations")
      .update({ deleted_at: new Date().toISOString(), deleted_by: ctx.ownerUserId, status: "archived" })
      .eq("id", input.id)
      .is("deleted_at", null)
      .select("id")
      .maybeSingle();

    if (error) throw new ValidationError(error.message);
    if (!data) throw new NotFoundError("Tenant not found");

    await recordPlatformEvent(ctx.service, {
      eventCode: "tenant.deleted",
      actorUserId: ctx.ownerUserId,
      organizationId: input.id,
      severity: "warning",
    });

    return { id: input.id };
  },
);
