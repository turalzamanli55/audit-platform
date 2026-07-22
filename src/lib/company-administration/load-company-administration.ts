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
import {
  COMPANY_ROLE_BUSINESS_LABELS,
  resolveModuleAccess,
  type ModuleAccessRow,
} from "@/lib/company-administration/modules";
import { COMPANY_ADMIN_ASSIGNABLE_ROLES } from "@/constants/membership";
import { AuthorizationError, AuthenticationError } from "@/lib/errors";
import type { RepositoryContext } from "@/types/context";
import type { TenantType } from "@/constants/saas";
import type { Json } from "@/types/supabase";

export type CompanyAdminUserRow = {
  membershipId: string;
  membershipVersion: number;
  userId: string;
  email: string;
  fullName: string;
  roleSlug: string;
  roleName: string;
  roleDescription: string;
  scope: string;
  workspaceId: string | null;
  workspaceName: string | null;
  workspaces: Array<{ id: string; name: string; roleSlug: string; membershipId: string; version: number }>;
  status: string;
  suspended: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  permissionCodes: string[];
  modules: ModuleAccessRow[];
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
  memberCount: number;
};

export type CompanyAdminActivityRow = {
  id: string;
  action: string;
  resourceType: string;
  createdAt: string;
  actorEmail: string;
  actorUserId: string | null;
};

export type CompanyAdminLoginRow = {
  id: string;
  action: string;
  createdAt: string;
  actorEmail: string;
  actorUserId: string | null;
  ipAddress: string;
  userAgent: string;
  browser: string;
  device: string;
  result: "success" | "failure" | "info";
};

export type CompanyAdminRoleCatalogItem = {
  slug: string;
  label: string;
  description: string;
  permissions: Array<{ code: string; name: string }>;
  workspaceScope: "company" | "workspace" | "either";
};

export type CompanyAdminSecurityEvent = {
  id: string;
  eventCode: string;
  severity: string;
  createdAt: string;
  actorEmail: string;
};

export type CompanyAdminLicenseSummary = {
  planCode: string;
  planName: string;
  status: string;
  startsAt: string | null;
  endsAt: string | null;
  moduleEntitlements: Record<string, boolean>;
};

export type CompanyHealthStatus = "healthy" | "attention" | "critical";

export type CompanyAdministrationData = {
  organizationId: string;
  organizationName: string;
  organizationStatus: string;
  tenantType: TenantType;
  seats: SeatUsage;
  license: CompanyAdminLicenseSummary | null;
  companyAdministrators: Array<{ userId: string; email: string; fullName: string }>;
  activeUserCount: number;
  activeEngagementCount: number;
  workspaceCount: number;
  health: CompanyHealthStatus;
  healthReasons: string[];
  users: CompanyAdminUserRow[];
  seatHolders: CompanyAdminUserRow[];
  invitations: CompanyAdminInvitationRow[];
  workspaces: CompanyAdminWorkspaceOption[];
  roles: CompanyAdminRoleCatalogItem[];
  activity: CompanyAdminActivityRow[];
  loginHistory: CompanyAdminLoginRow[];
  securityEvents: CompanyAdminSecurityEvent[];
  passwordResetCount: number;
  disabledUserCount: number;
  failedLoginCount: number;
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

function asEntitlements(value: Json | null | undefined): Record<string, boolean> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, boolean> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (typeof raw === "boolean") out[key] = raw;
  }
  return out;
}

function parseUserAgent(ua: string): { browser: string; device: string } {
  if (!ua || ua === "—") return { browser: "—", device: "—" };
  const device = /Mobile|Android|iPhone|iPad/i.test(ua) ? "Mobile" : "Desktop";
  let browser = "Browser";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/Chrome\//i.test(ua)) browser = "Chrome";
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = "Safari";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  return { browser, device };
}

function loginResult(action: string): "success" | "failure" | "info" {
  if (action.includes("fail") || action.includes("denied")) return "failure";
  if (action.includes("login") || action.includes("logout") || action.includes("verified")) return "success";
  return "info";
}

function computeHealth(input: {
  license: CompanyAdminLicenseSummary | null;
  seats: SeatUsage;
  failedLoginCount: number;
  criticalSecurity: number;
}): { health: CompanyHealthStatus; reasons: string[] } {
  const reasons: string[] = [];
  let health: CompanyHealthStatus = "healthy";

  if (input.license) {
    if (input.license.status === "expired" || input.license.status === "suspended" || input.license.status === "cancelled") {
      health = "critical";
      reasons.push("Plan is not active");
    } else if (input.license.endsAt) {
      const days = (new Date(input.license.endsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      if (days < 0) {
        health = "critical";
        reasons.push("Plan has expired");
      } else if (days <= 30) {
        health = "attention";
        reasons.push("Plan expires within 30 days");
      }
    }
  } else {
    health = "attention";
    reasons.push("No active plan attached");
  }

  if (input.seats.subscriptionId && input.seats.seatsAvailable <= 0) {
    health = health === "critical" ? "critical" : "attention";
    reasons.push("No seats remaining");
  } else if (input.seats.subscriptionId && input.seats.seatLimit > 0) {
    const ratio = input.seats.seatsUsed / input.seats.seatLimit;
    if (ratio >= 0.9) {
      health = health === "critical" ? "critical" : "attention";
      reasons.push("Seat usage is above 90%");
    }
  }

  if (input.criticalSecurity > 0) {
    health = "critical";
    reasons.push("Critical security alerts require review");
  } else if (input.failedLoginCount >= 5) {
    health = health === "critical" ? "critical" : "attention";
    reasons.push("Multiple failed login attempts recently");
  }

  if (reasons.length === 0) reasons.push("Team, seats, and plan look healthy");
  return { health, reasons };
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

      const [
        orgResult,
        memberships,
        seats,
        invitations,
        workspacesResult,
        auditResult,
        licenseResult,
        engagementCountResult,
        securityResult,
      ] = await Promise.all([
        supabase
          .from("organizations")
          .select("id, name, tenant_type, status")
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
          .limit(250),
        service
          .from("subscription_and_licensing_plans")
          .select(
            "id, plan_code, subscription_status, starts_at, ends_at, module_entitlements, seat_limit",
          )
          .eq("organization_id", organizationId)
          .is("deleted_at", null)
          .in("subscription_status", ["active", "trial"])
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        service
          .from("engagements")
          .select("id", { count: "exact", head: true })
          .eq("organization_id", organizationId)
          .is("deleted_at", null),
        service
          .from("security_event_monitoring_events")
          .select("id, event_code, severity, created_at, actor_user_id")
          .eq("organization_id", organizationId)
          .is("deleted_at", null)
          .order("created_at", { ascending: false })
          .limit(50),
      ]);

      const org = orgResult.data;
      if (!org) return { ok: false, reason: "forbidden" };

      const entitlements = asEntitlements(licenseResult.data?.module_entitlements);

      let planName = licenseResult.data?.plan_code ?? "";
      if (licenseResult.data?.plan_code) {
        const template = await service
          .from("platform_plan_templates")
          .select("plan_name")
          .eq("plan_code", licenseResult.data.plan_code)
          .maybeSingle();
        if (template.data?.plan_name) planName = template.data.plan_name;
      }

      const license: CompanyAdminLicenseSummary | null = licenseResult.data
        ? {
            planCode: licenseResult.data.plan_code,
            planName: planName || licenseResult.data.plan_code,
            status: licenseResult.data.subscription_status,
            startsAt: licenseResult.data.starts_at,
            endsAt: licenseResult.data.ends_at,
            moduleEntitlements: entitlements,
          }
        : null;

      const roleCatalog: Array<{
        slug: string;
        label: string;
        description: string;
        permissions: Array<{ code: string; name: string }>;
        workspaceScope: "company" | "workspace" | "either";
        permissionCodes: string[];
        roleId: string | null;
      }> = await Promise.all(
        COMPANY_ADMIN_ASSIGNABLE_ROLES.map(async (item) => {
          const role = await roleRepo.findBySlug(item.value);
          const permissions = role ? await roleRepo.listPermissionsForRole(role.id) : [];
          const meta = COMPANY_ROLE_BUSINESS_LABELS[item.value];
          return {
            slug: item.value,
            label: meta?.label ?? item.label,
            description: meta?.description ?? role?.description ?? "",
            permissions: permissions.map((p) => ({ code: p.code, name: p.name })),
            workspaceScope:
              item.value === "workspace_admin"
                ? ("workspace" as const)
                : item.value === "organization_admin"
                  ? ("company" as const)
                  : ("either" as const),
            permissionCodes: permissions.map((p) => p.code),
            roleId: role?.id ?? null,
          };
        }),
      );

      const permissionsBySlug = new Map<string, string[]>(
        roleCatalog.map((r) => [r.slug, r.permissionCodes]),
      );

      const roleIds = [...new Set(memberships.map((m) => m.role_id))];
      const roles = await Promise.all(roleIds.map((id) => roleRepo.findById(id)));
      const roleById = new Map(roles.filter(Boolean).map((r) => [r!.id, r!]));

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
          const lastSignIn = data.user?.last_sign_in_at ?? null;
          return { userId, suspended, lastSignIn };
        }),
      );
      const authById = new Map(authUsers.map((u) => [u.userId, u]));

      const membershipsByUser = new Map<string, typeof memberships>();
      for (const m of memberships) {
        const list = membershipsByUser.get(m.user_id) ?? [];
        list.push(m);
        membershipsByUser.set(m.user_id, list);
      }

      const orgScoped = memberships.filter((m) => m.membership_scope === "organization");

      const users: CompanyAdminUserRow[] = orgScoped.map((m) => {
        const role = roleById.get(m.role_id);
        const profile = profiles.get(m.user_id);
        const auth = authById.get(m.user_id);
        const slug = role?.slug ?? "member";
        const meta = COMPANY_ROLE_BUSINESS_LABELS[slug];
        const permissionCodes = permissionsBySlug.get(slug) ?? [];
        const userMemberships = membershipsByUser.get(m.user_id) ?? [];
        const workspaceMemberships = userMemberships
          .filter((row) => row.membership_scope === "workspace" && row.workspace_id)
          .map((row) => {
            const wsRole = roleById.get(row.role_id);
            return {
              id: row.workspace_id!,
              name: workspaceNameById.get(row.workspace_id!) ?? "Workspace",
              roleSlug: wsRole?.slug ?? "member",
              membershipId: row.id,
              version: row.version,
            };
          });

        return {
          membershipId: m.id,
          membershipVersion: m.version,
          userId: m.user_id,
          email: profile?.email ?? "",
          fullName: profile?.displayName ?? "",
          roleSlug: slug,
          roleName: meta?.label ?? role?.name ?? "Team Member",
          roleDescription: meta?.description ?? role?.description ?? "",
          scope: m.membership_scope,
          workspaceId: workspaceMemberships[0]?.id ?? null,
          workspaceName: workspaceMemberships[0]?.name ?? null,
          workspaces: workspaceMemberships,
          status: m.status,
          suspended: auth?.suspended ?? false,
          createdAt: m.created_at,
          lastLoginAt: auth?.lastSignIn ?? null,
          permissionCodes,
          modules: resolveModuleAccess(entitlements, permissionCodes),
        };
      });

      users.sort((a, b) => a.email.localeCompare(b.email));

      const memberCountByWorkspace = new Map<string, number>();
      for (const m of memberships) {
        if (m.workspace_id && m.membership_scope === "workspace") {
          memberCountByWorkspace.set(
            m.workspace_id,
            (memberCountByWorkspace.get(m.workspace_id) ?? 0) + 1,
          );
        }
      }

      const workspaces: CompanyAdminWorkspaceOption[] = (workspacesResult.data ?? []).map((w) => ({
        id: w.id,
        name: w.name,
        memberCount: memberCountByWorkspace.get(w.id) ?? 0,
      }));

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
      const actorIds = [
        ...new Set(
          [
            ...auditRows.map((r) => r.user_id),
            ...(securityResult.data ?? []).map((r) => r.actor_user_id),
          ].filter((id): id is string => Boolean(id)),
        ),
      ];
      const actorProfiles = await resolveUserProfiles(actorIds);

      const activity: CompanyAdminActivityRow[] = auditRows.slice(0, 100).map((row) => ({
        id: row.id,
        action: row.action,
        resourceType: row.resource_type,
        createdAt: row.created_at,
        actorEmail: row.user_id ? (actorProfiles.get(row.user_id)?.email ?? "—") : "—",
        actorUserId: row.user_id,
      }));

      const loginHistory: CompanyAdminLoginRow[] = auditRows
        .filter((row) => row.action.startsWith("auth."))
        .slice(0, 100)
        .map((row) => {
          const ua = typeof row.user_agent === "string" ? row.user_agent : "—";
          const parsed = parseUserAgent(ua);
          return {
            id: row.id,
            action: row.action,
            createdAt: row.created_at,
            actorEmail: row.user_id ? (actorProfiles.get(row.user_id)?.email ?? "—") : "—",
            actorUserId: row.user_id,
            ipAddress: typeof row.ip_address === "string" ? row.ip_address : "—",
            userAgent: ua,
            browser: parsed.browser,
            device: parsed.device,
            result: loginResult(row.action),
          };
        });

      const securityEvents: CompanyAdminSecurityEvent[] = (securityResult.data ?? []).map((row) => ({
        id: row.id,
        eventCode: row.event_code,
        severity: row.severity,
        createdAt: row.created_at,
        actorEmail: row.actor_user_id
          ? (actorProfiles.get(row.actor_user_id)?.email ?? "—")
          : "—",
      }));

      const companyAdministrators = users
        .filter((u) => u.roleSlug === "organization_admin" && !u.suspended)
        .map((u) => ({ userId: u.userId, email: u.email, fullName: u.fullName }));

      const passwordResetCount = auditRows.filter((r) =>
        r.action.includes("password_reset") || r.action.includes("password.reset"),
      ).length;
      const failedLoginCount = loginHistory.filter((r) => r.result === "failure").length;
      const disabledUserCount = users.filter((u) => u.suspended || u.status === "inactive").length;
      const criticalSecurity = securityEvents.filter((e) => e.severity === "critical").length;

      const { health, reasons } = computeHealth({
        license,
        seats,
        failedLoginCount,
        criticalSecurity,
      });

      return {
        ok: true,
        data: {
          organizationId,
          organizationName: org.name,
          organizationStatus: org.status,
          tenantType: (org.tenant_type as TenantType) || "business",
          seats,
          license,
          companyAdministrators,
          activeUserCount: users.filter((u) => !u.suspended && u.status !== "inactive").length,
          activeEngagementCount: engagementCountResult.count ?? 0,
          workspaceCount: workspaces.length,
          health,
          healthReasons: reasons,
          users,
          seatHolders: users,
          invitations: pendingInvites,
          workspaces,
          roles: roleCatalog.map((role) => ({
            slug: role.slug,
            label: role.label,
            description: role.description,
            permissions: role.permissions,
            workspaceScope: role.workspaceScope,
          })),
          activity,
          loginHistory,
          securityEvents,
          passwordResetCount,
          disabledUserCount,
          failedLoginCount,
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
