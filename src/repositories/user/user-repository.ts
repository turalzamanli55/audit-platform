import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import type { Database, Tables } from "@/types/supabase";
import type { SessionUser } from "@/types/auth";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { RoleRepository } from "../role/role-repository";
import {
  unwrapSupabaseList,
  unwrapSupabaseMaybeSingle,
} from "@/utils/supabase-result";
import { mapSupabaseUserToSessionUser } from "@/lib/auth/mapper";

export type MembershipRecord = Tables<"memberships">;
export type OrganizationRecord = Tables<"organizations">;
export type WorkspaceRecord = Tables<"workspaces">;

export type TenantPreferences = {
  organizationId?: string | null;
  workspaceId?: string | null;
  locale?: string;
};

export type ResolvedTenantContext = {
  organization: OrganizationRecord | null;
  workspace: WorkspaceRecord | null;
  memberships: MembershipRecord[];
  roleSlugs: string[];
  permissionCodes: string[];
};

export class UserRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listMemberships(userId: string): Promise<MembershipRecord[]> {
    const result = await applyActiveFilter(
      this.client
        .from("memberships")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active"),
    );

    return unwrapSupabaseList(result);
  }

  async getMembershipById(membershipId: string): Promise<MembershipRecord | null> {
    const result = await applyActiveFilter(
      this.client.from("memberships").select("*").eq("id", membershipId),
    ).maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async resolveTenantContext(
    userId: string,
    preferences: TenantPreferences = {},
  ): Promise<ResolvedTenantContext> {
    const memberships = await this.listMemberships(userId);
    const organization = await this.resolveOrganization(memberships, preferences.organizationId);
    const workspace = organization
      ? await this.resolveWorkspace(organization.id, memberships, preferences.workspaceId)
      : null;

    const scopedMemberships = memberships.filter((membership) => {
      if (!organization) return false;
      if (membership.organization_id !== organization.id) return false;
      if (workspace && membership.membership_scope === "workspace") {
        return membership.workspace_id === workspace.id;
      }
      return membership.membership_scope === "organization";
    });

    const roleIds = [...new Set(scopedMemberships.map((membership) => membership.role_id))];
    const roleRepository = new RoleRepository(this.client, this.context);

    const roleSlugs: string[] = [];
    const permissionCodeSet = new Set<string>();

    for (const roleId of roleIds) {
      try {
        const role = await roleRepository.findById(roleId);
        if (role?.slug) {
          roleSlugs.push(role.slug);
        }
        const permissions = await roleRepository.listPermissionsForRole(roleId);
        for (const permission of permissions) {
          if (permission?.code) {
            permissionCodeSet.add(permission.code);
          }
        }
      } catch {
        continue;
      }
    }

    return {
      organization,
      workspace,
      memberships,
      roleSlugs,
      permissionCodes: [...permissionCodeSet].sort(),
    };
  }

  async resolveSessionUser(
    authUser: User,
    preferences: TenantPreferences = {},
  ): Promise<SessionUser> {
    const tenant = await this.resolveTenantContext(authUser.id, preferences);
    return mapSupabaseUserToSessionUser(authUser, {
      locale: preferences.locale,
      organizationId: tenant.organization?.id ?? "",
      workspaceId: tenant.workspace?.id ?? "",
      roleSlugs: tenant.roleSlugs,
      permissionCodes: tenant.permissionCodes,
      hasOrganization: tenant.organization !== null,
    });
  }

  async resolvePermissionCodes(
    userId: string,
    organizationId: string,
    workspaceId?: string | null,
  ): Promise<string[]> {
    const tenant = await this.resolveTenantContext(userId, { organizationId, workspaceId });
    return tenant.permissionCodes;
  }

  private async resolveOrganization(
    memberships: MembershipRecord[],
    preferredOrganizationId?: string | null,
  ): Promise<OrganizationRecord | null> {
    const organizationIds = [...new Set(memberships.map((membership) => membership.organization_id))];
    if (organizationIds.length === 0) return null;

    const targetId =
      preferredOrganizationId && organizationIds.includes(preferredOrganizationId)
        ? preferredOrganizationId
        : organizationIds[0];

    const result = await applyActiveFilter(
      this.client.from("organizations").select("*").eq("id", targetId),
    ).maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  private async resolveWorkspace(
    organizationId: string,
    memberships: MembershipRecord[],
    preferredWorkspaceId?: string | null,
  ): Promise<WorkspaceRecord | null> {
    const workspaceMembershipIds = memberships
      .filter(
        (membership) =>
          membership.organization_id === organizationId &&
          membership.membership_scope === "workspace" &&
          membership.workspace_id,
      )
      .map((membership) => membership.workspace_id as string);

    let query = applyActiveFilter(
      this.client.from("workspaces").select("*").eq("organization_id", organizationId),
    );

    if (preferredWorkspaceId) {
      query = query.eq("id", preferredWorkspaceId);
    } else if (workspaceMembershipIds.length > 0) {
      query = query.in("id", workspaceMembershipIds);
    }

    const result = await query.order("name", { ascending: true }).limit(1).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }
}
