import "server-only";

import { cache } from "react";
import { createServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { MembershipRepository } from "@/repositories/membership/membership-repository";
import { RoleRepository } from "@/repositories/role/role-repository";
import { UserProvisioningRepository } from "@/repositories/user-provisioning/user-provisioning-repository";
import { resolveUserProfiles } from "@/lib/user/resolve-user-profiles";
import { getSeatUsage, type SeatUsage } from "@/lib/platform-console/seats";
import { requireCompanyAdministrationReader } from "@/lib/company-administration/guards";
import { AuthorizationError, AuthenticationError } from "@/lib/errors";
import type { RepositoryContext } from "@/types/context";
import type { TenantType } from "@/constants/saas";

export type CompanyAdminUserRow = {
  membershipId: string;
  membershipVersion: number;
  userId: string;
  email: string;
  fullName: string;
  roleSlug: string;
  roleName: string;
  scope: string;
  workspaceId: string | null;
  workspaceName: string | null;
  status: string;
  suspended: boolean;
  createdAt: string;
};

export type CompanyAdminInvitationRow = {
  id: string;
  email: string;
  roleSlug: string;
  status: string;
  expiresAt: string;
  createdAt: string;
};

export type CompanyAdminWorkspaceOption = {
  id: string;
  name: string;
};

export type CompanyAdminActivityRow = {
  id: string;
  action: string;
  resourceType: string;
  createdAt: string;
  actorEmail: string;
};

export type CompanyAdminLoginRow = {
  id: string;
  action: string;
  createdAt: string;
  actorEmail: string;
  ipAddress: string;
  userAgent: string;
};

export type CompanyAdministrationData = {
  organizationId: string;
  organizationName: string;
  tenantType: TenantType;
  seats: SeatUsage;
  users: CompanyAdminUserRow[];
  invitations: CompanyAdminInvitationRow[];
  workspaces: CompanyAdminWorkspaceOption[];
  activity: CompanyAdminActivityRow[];
  loginHistory: CompanyAdminLoginRow[];
  canAdminister: boolean;
};

function repoContext(userId: string, organizationId: string): RepositoryContext {
  return {
    userId,
    tenant: {
      organization: { organizationId, isResolved: true },
      workspace: { workspaceId: null, isResolved: false },
      company: { companyId: null, isResolved: false },
      permissions: { permissions: [], isResolved: false },
      roles: { roles: [], isResolved: false },
    },
  };
}

export const loadCompanyAdministration = cache(
  async function loadCompanyAdministration(): Promise<
    | { ok: true; data: CompanyAdministrationData }
    | { ok: false; reason: "unauthenticated" | "forbidden" | "error" }
  > {
    try {
      const user = await requireCompanyAdministrationReader();
      const organizationId = user.organizationId;
      const canAdminister = user.permissionCodes.includes("membership.administer");

      const supabase = await createServerClient();
      const service = createServiceClient();
      const ctx = repoContext(user.id, organizationId);

      const membershipRepo = new MembershipRepository(supabase, ctx);
      const roleRepo = new RoleRepository(supabase, ctx);
      const inviteRepo = new UserProvisioningRepository(supabase, ctx);

      const [orgResult, memberships, seats, invitations, workspacesResult, auditResult] =
        await Promise.all([
          supabase
            .from("organizations")
            .select("id, name, tenant_type")
            .eq("id", organizationId)
            .is("deleted_at", null)
            .maybeSingle(),
          membershipRepo.listByOrganization(organizationId),
          getSeatUsage(service, organizationId),
          inviteRepo.listByOrganization(organizationId),
          supabase
            .from("workspaces")
            .select("id, name")
            .eq("organization_id", organizationId)
            .is("deleted_at", null)
            .order("name", { ascending: true }),
          service
            .from("audit_logs")
            .select("id, action, resource_type, created_at, user_id, ip_address, user_agent")
            .eq("organization_id", organizationId)
            .order("created_at", { ascending: false })
            .limit(100),
        ]);

      const org = orgResult.data;
      if (!org) {
        return { ok: false, reason: "forbidden" };
      }

      const roleIds = [...new Set(memberships.map((m) => m.role_id))];
      const roles = await Promise.all(roleIds.map((id) => roleRepo.findById(id)));
      const roleById = new Map(roles.filter(Boolean).map((r) => [r!.id, r!]));

      const workspaceIds = [
        ...new Set(memberships.map((m) => m.workspace_id).filter((id): id is string => Boolean(id))),
      ];
      const workspaceNameById = new Map(
        (workspacesResult.data ?? []).map((w) => [w.id, w.name] as const),
      );

      const userIds = [...new Set(memberships.map((m) => m.user_id))];
      const profiles = await resolveUserProfiles(userIds);

      const authUsers = await Promise.all(
        userIds.map(async (userId) => {
          const { data } = await service.auth.admin.getUserById(userId);
          const bannedUntil = (data.user as { banned_until?: string | null } | undefined)?.banned_until;
          const suspended = Boolean(bannedUntil && new Date(bannedUntil).getTime() > Date.now());
          return { userId, suspended };
        }),
      );
      const suspendedById = new Map(authUsers.map((u) => [u.userId, u.suspended]));

      const users: CompanyAdminUserRow[] = memberships.map((m) => {
        const role = roleById.get(m.role_id);
        const profile = profiles.get(m.user_id);
        return {
          membershipId: m.id,
          membershipVersion: m.version,
          userId: m.user_id,
          email: profile?.email ?? "",
          fullName: profile?.displayName ?? "",
          roleSlug: role?.slug ?? "member",
          roleName: role?.name ?? "Member",
          scope: m.membership_scope,
          workspaceId: m.workspace_id,
          workspaceName: m.workspace_id ? (workspaceNameById.get(m.workspace_id) ?? null) : null,
          status: m.status,
          suspended: suspendedById.get(m.user_id) ?? false,
          createdAt: m.created_at,
        };
      });

      users.sort((a, b) => a.email.localeCompare(b.email));

      const pendingInvites: CompanyAdminInvitationRow[] = (invitations ?? [])
        .filter((i) => i.invitation_status === "pending")
        .map((i) => ({
          id: i.id,
          email: i.email,
          roleSlug: i.role_slug,
          status: i.invitation_status,
          expiresAt: i.expires_at,
          createdAt: i.created_at,
        }));

      const auditRows = auditResult.data ?? [];
      const actorIds = [...new Set(auditRows.map((r) => r.user_id).filter((id): id is string => Boolean(id)))];
      const actorProfiles = await resolveUserProfiles(actorIds);

      const activity: CompanyAdminActivityRow[] = auditRows.slice(0, 50).map((row) => ({
        id: row.id,
        action: row.action,
        resourceType: row.resource_type,
        createdAt: row.created_at,
        actorEmail: row.user_id ? (actorProfiles.get(row.user_id)?.email ?? "—") : "—",
      }));

      const loginHistory: CompanyAdminLoginRow[] = auditRows
        .filter((row) => row.action.startsWith("auth."))
        .slice(0, 50)
        .map((row) => ({
          id: row.id,
          action: row.action,
          createdAt: row.created_at,
          actorEmail: row.user_id ? (actorProfiles.get(row.user_id)?.email ?? "—") : "—",
          ipAddress: typeof row.ip_address === "string" ? row.ip_address : "—",
          userAgent: typeof row.user_agent === "string" ? row.user_agent : "—",
        }));

      return {
        ok: true,
        data: {
          organizationId,
          organizationName: org.name,
          tenantType: (org.tenant_type as TenantType) || "business",
          seats,
          users,
          invitations: pendingInvites,
          workspaces: (workspacesResult.data ?? []).map((w) => ({ id: w.id, name: w.name })),
          activity,
          loginHistory,
          canAdminister,
        },
      };
    } catch (error) {
      if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
      if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
      return { ok: false, reason: "error" };
    }
  },
);
