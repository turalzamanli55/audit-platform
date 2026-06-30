"use server";

import { headers } from "next/headers";
import { createServiceClient } from "@/lib/supabase/service";
import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { OrganizationRepository } from "@/repositories/organization/organization-repository";
import { MembershipRepository } from "@/repositories/membership/membership-repository";
import { RoleRepository } from "@/repositories/role/role-repository";
import { PLATFORM_ROLE_SLUGS } from "@/types/auth";
import type { RepositoryContext } from "@/types/context";
import { setOrganizationCookie } from "@/lib/auth/tenant-cookies";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { ValidationError } from "@/lib/errors";
import { toSlug } from "@/utils/auth-validation";

export type CreateOrganizationInput = {
  name: string;
  legalName?: string;
  description?: string;
};

export type CreateOrganizationResult = {
  organizationId: string;
  slug: string;
};

function createServiceContext(userId: string): RepositoryContext {
  return {
    userId,
    tenant: {
      organization: { organizationId: null, isResolved: false },
      workspace: { workspaceId: null, isResolved: false },
      company: { companyId: null, isResolved: false },
      permissions: { permissions: [], isResolved: false },
      roles: { roles: [], isResolved: false },
    },
  };
}

export const createOrganizationAction = createAuthenticatedAction<
  CreateOrganizationInput,
  CreateOrganizationResult
>({ module: "onboarding.create-organization" }, async (input, context) => {
  const name = input.name.trim();
  if (!name) {
    throw new ValidationError("Organization name is required");
  }

  const slug = toSlug(name);
  if (!slug) {
    throw new ValidationError("Organization name must contain valid characters");
  }

  const serviceClient = createServiceClient();
  const repositoryContext = createServiceContext(context.userId);
  const organizationRepository = new OrganizationRepository(serviceClient, repositoryContext);
  const membershipRepository = new MembershipRepository(serviceClient, repositoryContext);
  const roleRepository = new RoleRepository(serviceClient, repositoryContext);

  const ownerRole = await roleRepository.findBySlug(PLATFORM_ROLE_SLUGS.ORGANIZATION_OWNER);
  if (!ownerRole) {
    throw new ValidationError("Organization owner role is not configured");
  }

  const organization = await organizationRepository.create({
    name,
    slug,
    legal_name: input.legalName?.trim() || null,
    description: input.description?.trim() || null,
  });

  const membership = await membershipRepository.create({
    user_id: context.userId,
    organization_id: organization.id,
    workspace_id: null,
    company_id: null,
    role_id: ownerRole.id,
    membership_scope: "organization",
  });

  await setOrganizationCookie(organization.id);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.ORGANIZATION_CREATED,
    resourceType: "organization",
    resourceId: organization.id,
    organizationId: organization.id,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { slug: organization.slug },
  });

  await emitAuditEvent({
    action: AUDIT_ACTIONS.MEMBERSHIP_CREATED,
    resourceType: "membership",
    resourceId: membership.id,
    organizationId: organization.id,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { roleSlug: PLATFORM_ROLE_SLUGS.ORGANIZATION_OWNER },
  });

  return {
    organizationId: organization.id,
    slug: organization.slug,
  };
});
