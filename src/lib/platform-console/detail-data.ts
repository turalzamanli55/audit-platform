import "server-only";

import { createServiceClient } from "@/lib/supabase/service";
import { getSeatUsage } from "./seats";
import { parseUserAgent } from "./user-agent";

type Service = ReturnType<typeof createServiceClient>;

type UserIdentity = {
  id: string;
  email: string;
  fullName: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  suspended: boolean;
  isPlatformOwner: boolean;
};

/** Loads all auth users once into a lookup map (bounded to 2000 users). */
async function loadUserMap(client: Service): Promise<Map<string, UserIdentity>> {
  const map = new Map<string, UserIdentity>();
  const perPage = 200;
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage });
    if (error) break;
    for (const user of data.users) {
      const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
      const appMeta = (user.app_metadata ?? {}) as Record<string, unknown>;
      const bannedUntil = (user as { banned_until?: string | null }).banned_until ?? null;
      map.set(user.id, {
        id: user.id,
        email: user.email ?? "—",
        fullName: typeof meta.full_name === "string" ? meta.full_name : null,
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at ?? null,
        suspended: Boolean(bannedUntil && new Date(bannedUntil).getTime() > Date.now()),
        isPlatformOwner: appMeta.platform_role === "platform_owner",
      });
    }
    if (data.users.length < perPage) break;
  }
  return map;
}

// ---------------------------------------------------------------------------
// Shared row shapes
// ---------------------------------------------------------------------------

export type TimelineEvent = {
  id: string;
  timestamp: string;
  title: string;
  detail: string;
  category: string;
  severity: "info" | "warning" | "critical";
};

export type CompanyMember = {
  membershipId: string;
  userId: string;
  email: string;
  fullName: string | null;
  roleName: string;
  roleSlug: string;
  scope: string;
  workspaceName: string | null;
  lastSignInAt: string | null;
  suspended: boolean;
  isPlatformOwner: boolean;
};

export type CompanyWorkspace = {
  id: string;
  name: string;
  slug: string;
  status: string;
  members: number;
  createdAt: string;
};

export type CompanyClient = {
  id: string;
  name: string;
  slug: string;
  status: string;
  workspaceName: string | null;
};

export type CompanyEngagement = {
  id: string;
  name: string;
  clientName: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type CompanyModule = {
  code: string;
  state: string;
  scope: "tenant" | "platform";
  updatedAt: string;
};

export type CompanyDetail = {
  id: string;
  name: string;
  slug: string;
  legalName: string | null;
  description: string | null;
  tenantType: string;
  status: string;
  platformManaged: boolean;
  createdAt: string;
  createdByEmail: string | null;
  lastActivityAt: string | null;
  license: {
    subscriptionId: string | null;
    planCode: string | null;
    status: string | null;
    endsAt: string | null;
    seatLimit: number;
    seatsUsed: number;
    seatsAvailable: number;
  };
  members: CompanyMember[];
  workspaces: CompanyWorkspace[];
  clients: CompanyClient[];
  engagements: CompanyEngagement[];
  modules: CompanyModule[];
  activity: TimelineEvent[];
  auditLogs: { id: string; action: string; resource: string; actorEmail: string; createdAt: string }[];
  loginHistory: LoginHistoryEntry[];
  timeline: TimelineEvent[];
  security: {
    suspensions: number;
    reactivations: number;
    passwordResets: number;
    forceLogouts: number;
    securityEvents: number;
    riskEvents: number;
  };
  activeUsers: number;
};

export type LoginHistoryEntry = {
  id: string;
  email: string;
  ip: string;
  device: string;
  browser: string;
  result: string;
  createdAt: string;
};

const SEVERITIES = new Set(["info", "warning", "critical"]);
function normalizeSeverity(value: string): "info" | "warning" | "critical" {
  return SEVERITIES.has(value) ? (value as "info" | "warning" | "critical") : "info";
}

/** Complete Company (tenant) administration bundle. */
export async function loadCompanyDetail(organizationId: string): Promise<CompanyDetail | null> {
  const client = createServiceClient();

  const orgResult = await client
    .from("organizations")
    .select("id, name, slug, legal_name, description, tenant_type, status, platform_owner_managed, created_at, created_by")
    .eq("id", organizationId)
    .is("deleted_at", null)
    .maybeSingle();

  if (!orgResult.data) return null;
  const org = orgResult.data;

  const [subscription, workspaces, clients, engagements, memberships, roles, moduleFlags, securityEvents, auditRows, seatUsage, userMap] =
    await Promise.all([
      client
        .from("subscription_and_licensing_plans")
        .select("id, plan_code, subscription_status, seat_limit, seats_used, ends_at, created_at")
        .eq("organization_id", organizationId)
        .is("deleted_at", null)
        .in("subscription_status", ["active", "trial", "expired", "suspended"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      client
        .from("workspaces")
        .select("id, name, slug, status, created_at")
        .eq("organization_id", organizationId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(200),
      client
        .from("companies")
        .select("id, name, slug, status, workspace_id")
        .eq("organization_id", organizationId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(200),
      client
        .from("engagements")
        .select("id, name, company_id, engagement_type, lifecycle_status, created_at, updated_at")
        .eq("organization_id", organizationId)
        .is("deleted_at", null)
        .order("updated_at", { ascending: false })
        .limit(200),
      client
        .from("memberships")
        .select("id, user_id, role_id, membership_scope, workspace_id")
        .eq("organization_id", organizationId)
        .is("deleted_at", null)
        .limit(500),
      client.from("roles").select("id, name, slug").limit(500),
      client
        .from("saas_feature_flags")
        .select("flag_code, flag_state, organization_id, updated_at")
        .like("flag_code", "module:%")
        .is("deleted_at", null)
        .or(`organization_id.eq.${organizationId},organization_id.is.null`)
        .limit(200),
      client
        .from("security_event_monitoring_events")
        .select("id, event_code, severity, actor_user_id, created_at, details")
        .eq("organization_id", organizationId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(500),
      client
        .from("audit_logs")
        .select("id, action, resource_type, resource_id, user_id, ip_address, user_agent, created_at")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false })
        .limit(500),
      getSeatUsage(client, organizationId),
      loadUserMap(client),
    ]);

  const workspaceNameById = new Map((workspaces.data ?? []).map((w) => [w.id, w.name]));
  const roleById = new Map((roles.data ?? []).map((r) => [r.id, { name: r.name, slug: r.slug }]));
  const clientNameById = new Map((clients.data ?? []).map((c) => [c.id, c.name]));

  // Members (organization-scoped are seats; include workspace-scoped for completeness).
  const members: CompanyMember[] = (memberships.data ?? []).map((m) => {
    const identity = userMap.get(m.user_id);
    const role = roleById.get(m.role_id);
    return {
      membershipId: m.id,
      userId: m.user_id,
      email: identity?.email ?? "—",
      fullName: identity?.fullName ?? null,
      roleName: role?.name ?? "—",
      roleSlug: role?.slug ?? "—",
      scope: m.membership_scope,
      workspaceName: m.workspace_id ? workspaceNameById.get(m.workspace_id) ?? null : null,
      lastSignInAt: identity?.lastSignInAt ?? null,
      suspended: identity?.suspended ?? false,
      isPlatformOwner: identity?.isPlatformOwner ?? false,
    };
  });

  const workspaceMemberCounts = new Map<string, number>();
  for (const m of memberships.data ?? []) {
    if (m.workspace_id) workspaceMemberCounts.set(m.workspace_id, (workspaceMemberCounts.get(m.workspace_id) ?? 0) + 1);
  }

  const workspaceRows: CompanyWorkspace[] = (workspaces.data ?? []).map((w) => ({
    id: w.id,
    name: w.name,
    slug: String(w.slug),
    status: w.status,
    members: workspaceMemberCounts.get(w.id) ?? 0,
    createdAt: w.created_at,
  }));

  const clientRows: CompanyClient[] = (clients.data ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    slug: String(c.slug),
    status: c.status,
    workspaceName: c.workspace_id ? workspaceNameById.get(c.workspace_id) ?? null : null,
  }));

  const engagementRows: CompanyEngagement[] = (engagements.data ?? []).map((e) => ({
    id: e.id,
    name: e.name,
    clientName: clientNameById.get(e.company_id) ?? "—",
    type: String(e.engagement_type),
    status: String(e.lifecycle_status),
    createdAt: e.created_at,
    updatedAt: e.updated_at,
  }));

  const moduleRows: CompanyModule[] = (moduleFlags.data ?? []).map((f) => ({
    code: f.flag_code.replace("module:", ""),
    state: f.flag_state,
    scope: f.organization_id ? "tenant" : "platform",
    updatedAt: f.updated_at,
  }));

  const activity: TimelineEvent[] = (securityEvents.data ?? []).map((ev) => ({
    id: ev.id,
    timestamp: ev.created_at,
    title: ev.event_code,
    detail: userMap.get(ev.actor_user_id ?? "")?.email ?? "System",
    category: ev.event_code.split(".")[0] ?? "event",
    severity: normalizeSeverity(ev.severity),
  }));

  const auditLogs = (auditRows.data ?? []).map((a) => ({
    id: a.id,
    action: a.action,
    resource: a.resource_id ? `${a.resource_type}:${a.resource_id.slice(0, 8)}` : a.resource_type,
    actorEmail: userMap.get(a.user_id ?? "")?.email ?? "System",
    createdAt: a.created_at,
  }));

  const loginHistory: LoginHistoryEntry[] = (auditRows.data ?? [])
    .filter((a) => a.action.startsWith("auth."))
    .map((a) => {
      const { device, browser } = parseUserAgent(a.user_agent);
      return {
        id: a.id,
        email: userMap.get(a.user_id ?? "")?.email ?? "—",
        ip: a.ip_address ? String(a.ip_address) : "—",
        device,
        browser,
        result: a.action === "auth.login" ? "Success" : a.action === "auth.logout" ? "Sign-out" : "Registered",
        createdAt: a.created_at,
      };
    });

  // Security summary from event codes.
  const countCode = (predicate: (code: string) => boolean) =>
    (securityEvents.data ?? []).filter((e) => predicate(e.event_code)).length;
  const security = {
    suspensions: countCode((c) => c === "user.suspended" || c === "tenant.suspended"),
    reactivations: countCode((c) => c === "user.activated" || c === "tenant.activated"),
    passwordResets: countCode((c) => c === "user.password.reset_sent"),
    forceLogouts: countCode((c) => c === "user.sessions.revoked" || c === "user.session.revoked"),
    securityEvents: (securityEvents.data ?? []).length,
    riskEvents: (securityEvents.data ?? []).filter((e) => e.severity !== "info").length,
  };

  // Combined company timeline (audit + security), newest first, bounded.
  const timeline: TimelineEvent[] = [
    ...activity,
    ...auditLogs.map((a) => ({
      id: `audit-${a.id}`,
      timestamp: a.createdAt,
      title: a.action,
      detail: `${a.actorEmail} · ${a.resource}`,
      category: "audit",
      severity: "info" as const,
    })),
  ]
    .sort((x, y) => new Date(y.timestamp).getTime() - new Date(x.timestamp).getTime())
    .slice(0, 200);

  const lastActivityAt = timeline[0]?.timestamp ?? null;
  const orgMembers = members.filter((m) => m.scope === "organization");

  return {
    id: org.id,
    name: org.name,
    slug: String(org.slug),
    legalName: org.legal_name,
    description: org.description,
    tenantType: org.tenant_type,
    status: org.status,
    platformManaged: org.platform_owner_managed,
    createdAt: org.created_at,
    createdByEmail: userMap.get(org.created_by ?? "")?.email ?? null,
    lastActivityAt,
    license: {
      subscriptionId: subscription.data?.id ?? null,
      planCode: subscription.data?.plan_code ?? null,
      status: subscription.data?.subscription_status ?? null,
      endsAt: subscription.data?.ends_at ?? null,
      seatLimit: seatUsage.seatLimit,
      seatsUsed: seatUsage.seatsUsed,
      seatsAvailable: seatUsage.seatsAvailable,
    },
    members,
    workspaces: workspaceRows,
    clients: clientRows,
    engagements: engagementRows,
    modules: moduleRows,
    activity,
    auditLogs,
    loginHistory,
    timeline,
    security,
    activeUsers: orgMembers.filter((m) => !m.suspended).length,
  };
}

// ---------------------------------------------------------------------------
// User detail
// ---------------------------------------------------------------------------

export type UserMembership = {
  membershipId: string;
  organizationId: string;
  organizationName: string;
  workspaceName: string | null;
  roleName: string;
  roleSlug: string;
  scope: string;
};

export type UserPermission = {
  code: string;
  name: string;
  source: string;
};

export type UserSession = {
  sessionId: string;
  createdAt: string | null;
  updatedAt: string | null;
  notAfter: string | null;
  ageMinutes: number | null;
};

export type UserDetail = {
  id: string;
  email: string;
  fullName: string | null;
  status: string;
  isPlatformOwner: boolean;
  createdAt: string;
  lastSignInAt: string | null;
  memberships: UserMembership[];
  permissions: UserPermission[];
  sessions: UserSession[];
  sessionsAvailable: boolean;
  loginHistory: LoginHistoryEntry[];
  activity: TimelineEvent[];
  auditHistory: { id: string; action: string; resource: string; createdAt: string }[];
  modules: { code: string; state: string; scope: string }[];
  license: {
    organizationName: string | null;
    planCode: string | null;
    seatLimit: number;
    seatsUsed: number;
    endsAt: string | null;
    status: string | null;
  } | null;
  security: {
    failedLogins: number;
    suspensions: number;
    passwordChanges: number;
    forceLogouts: number;
  };
  timeline: TimelineEvent[];
};

type SessionRpcRow = {
  session_id: string;
  created_at: string | null;
  updated_at: string | null;
  not_after: string | null;
};

/** Complete User administration bundle. */
export async function loadUserDetail(userId: string): Promise<UserDetail | null> {
  const client = createServiceClient();

  const authResult = await client.auth.admin.getUserById(userId);
  if (!authResult.data.user) return null;
  const authUser = authResult.data.user;
  const meta = (authUser.user_metadata ?? {}) as Record<string, unknown>;
  const appMeta = (authUser.app_metadata ?? {}) as Record<string, unknown>;
  const bannedUntil = (authUser as { banned_until?: string | null }).banned_until ?? null;
  const suspended = Boolean(bannedUntil && new Date(bannedUntil).getTime() > Date.now());

  const [memberships, roles, securityEvents, auditRows, userFlags] = await Promise.all([
    client
      .from("memberships")
      .select("id, organization_id, workspace_id, role_id, membership_scope")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .limit(200),
    client.from("roles").select("id, name, slug").limit(500),
    client
      .from("security_event_monitoring_events")
      .select("id, event_code, severity, created_at, details")
      .or(`actor_user_id.eq.${userId},details->>targetUserId.eq.${userId}`)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(300),
    client
      .from("audit_logs")
      .select("id, action, resource_type, resource_id, ip_address, user_agent, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(300),
    client
      .from("saas_feature_flags")
      .select("flag_code, flag_state")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .limit(200),
  ]);

  const roleById = new Map((roles.data ?? []).map((r) => [r.id, { name: r.name, slug: r.slug }]));

  // Resolve org + workspace names for memberships.
  const orgIds = Array.from(new Set((memberships.data ?? []).map((m) => m.organization_id)));
  const workspaceIds = Array.from(
    new Set((memberships.data ?? []).map((m) => m.workspace_id).filter((v): v is string => Boolean(v))),
  );
  const orgNameById = new Map<string, string>();
  if (orgIds.length > 0) {
    const { data } = await client.from("organizations").select("id, name").in("id", orgIds);
    for (const o of data ?? []) orgNameById.set(o.id, o.name);
  }
  const workspaceNameById = new Map<string, string>();
  if (workspaceIds.length > 0) {
    const { data } = await client.from("workspaces").select("id, name").in("id", workspaceIds);
    for (const w of data ?? []) workspaceNameById.set(w.id, w.name);
  }

  const membershipRows: UserMembership[] = (memberships.data ?? []).map((m) => {
    const role = roleById.get(m.role_id);
    return {
      membershipId: m.id,
      organizationId: m.organization_id,
      organizationName: orgNameById.get(m.organization_id) ?? "—",
      workspaceName: m.workspace_id ? workspaceNameById.get(m.workspace_id) ?? null : null,
      roleName: role?.name ?? "—",
      roleSlug: role?.slug ?? "—",
      scope: m.membership_scope,
    };
  });

  // Resolve permissions from the union of the user's roles.
  const roleIds = Array.from(new Set((memberships.data ?? []).map((m) => m.role_id)));
  const permissionMap = new Map<string, UserPermission>();
  if (roleIds.length > 0) {
    const { data } = await client
      .from("role_permissions")
      .select("role_id, permissions(code, name)")
      .in("role_id", roleIds);
    for (const row of data ?? []) {
      const rel = row.permissions as unknown;
      const permission = (Array.isArray(rel) ? rel[0] : rel) as { code: string; name: string } | null;
      if (!permission) continue;
      const roleName = roleById.get(row.role_id)?.name ?? "role";
      const existing = permissionMap.get(permission.code);
      if (existing) {
        existing.source = `${existing.source}, ${roleName}`;
      } else {
        permissionMap.set(permission.code, { code: permission.code, name: permission.name, source: roleName });
      }
    }
  }
  const permissions = Array.from(permissionMap.values()).sort((a, b) => a.code.localeCompare(b.code));

  // Sessions via SECURITY DEFINER RPC (resilient if migration not yet applied).
  let sessions: UserSession[] = [];
  let sessionsAvailable = true;
  try {
    const rpc = client as unknown as {
      rpc: (fn: string, args: Record<string, string>) => Promise<{ data: SessionRpcRow[] | null; error: unknown }>;
    };
    const { data, error } = await rpc.rpc("platform_user_sessions", { target_user: userId });
    if (error) {
      sessionsAvailable = false;
    } else {
      const now = Date.now();
      sessions = (data ?? []).map((s) => ({
        sessionId: s.session_id,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
        notAfter: s.not_after,
        ageMinutes: s.created_at ? Math.round((now - new Date(s.created_at).getTime()) / 60000) : null,
      }));
    }
  } catch {
    sessionsAvailable = false;
  }

  const loginHistory: LoginHistoryEntry[] = (auditRows.data ?? [])
    .filter((a) => a.action.startsWith("auth."))
    .map((a) => {
      const { device, browser } = parseUserAgent(a.user_agent);
      return {
        id: a.id,
        email: authUser.email ?? "—",
        ip: a.ip_address ? String(a.ip_address) : "—",
        device,
        browser,
        result: a.action === "auth.login" ? "Success" : a.action === "auth.logout" ? "Sign-out" : "Registered",
        createdAt: a.created_at,
      };
    });

  const activity: TimelineEvent[] = (securityEvents.data ?? []).map((ev) => ({
    id: ev.id,
    timestamp: ev.created_at,
    title: ev.event_code,
    detail: ev.event_code.split(".").slice(1).join(" ") || ev.event_code,
    category: ev.event_code.split(".")[0] ?? "event",
    severity: normalizeSeverity(ev.severity),
  }));

  const auditHistory = (auditRows.data ?? []).map((a) => ({
    id: a.id,
    action: a.action,
    resource: a.resource_id ? `${a.resource_type}:${a.resource_id.slice(0, 8)}` : a.resource_type,
    createdAt: a.created_at,
  }));

  // Modules: direct user flags + inherited tenant/platform module flags for the primary org.
  const primaryOrgId = membershipRows[0]?.organizationId ?? null;
  const moduleRows: { code: string; state: string; scope: string }[] = (userFlags.data ?? [])
    .filter((f) => f.flag_code.startsWith("module:"))
    .map((f) => ({ code: f.flag_code.replace("module:", ""), state: f.flag_state, scope: "direct" }));
  if (primaryOrgId) {
    const { data } = await client
      .from("saas_feature_flags")
      .select("flag_code, flag_state, organization_id")
      .like("flag_code", "module:%")
      .is("deleted_at", null)
      .or(`organization_id.eq.${primaryOrgId},organization_id.is.null`)
      .is("user_id", null)
      .limit(200);
    for (const f of data ?? []) {
      moduleRows.push({
        code: f.flag_code.replace("module:", ""),
        state: f.flag_state,
        scope: f.organization_id ? "inherited (tenant)" : "inherited (platform)",
      });
    }
  }

  // License = primary org subscription.
  let license: UserDetail["license"] = null;
  if (primaryOrgId) {
    const { data } = await client
      .from("subscription_and_licensing_plans")
      .select("plan_code, seat_limit, seats_used, ends_at, subscription_status")
      .eq("organization_id", primaryOrgId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) {
      license = {
        organizationName: orgNameById.get(primaryOrgId) ?? null,
        planCode: data.plan_code,
        seatLimit: data.seat_limit,
        seatsUsed: data.seats_used,
        endsAt: data.ends_at,
        status: data.subscription_status,
      };
    }
  }

  const countCode = (predicate: (code: string) => boolean) =>
    (securityEvents.data ?? []).filter((e) => predicate(e.event_code)).length;
  const security = {
    failedLogins: 0,
    suspensions: countCode((c) => c === "user.suspended"),
    passwordChanges: countCode((c) => c === "user.password.reset_sent"),
    forceLogouts: countCode((c) => c === "user.sessions.revoked" || c === "user.session.revoked"),
  };

  const timeline: TimelineEvent[] = [
    ...activity,
    ...auditHistory.map((a) => ({
      id: `audit-${a.id}`,
      timestamp: a.createdAt,
      title: a.action,
      detail: a.resource,
      category: "audit",
      severity: "info" as const,
    })),
  ]
    .sort((x, y) => new Date(y.timestamp).getTime() - new Date(x.timestamp).getTime())
    .slice(0, 200);

  return {
    id: authUser.id,
    email: authUser.email ?? "—",
    fullName: typeof meta.full_name === "string" ? meta.full_name : null,
    status: appMeta.platform_role === "platform_owner" ? "Platform Owner" : suspended ? "Suspended" : "Active",
    isPlatformOwner: appMeta.platform_role === "platform_owner",
    createdAt: authUser.created_at,
    lastSignInAt: authUser.last_sign_in_at ?? null,
    memberships: membershipRows,
    permissions,
    sessions,
    sessionsAvailable,
    loginHistory,
    activity,
    auditHistory,
    modules: moduleRows,
    license,
    security,
    timeline,
  };
}

// ---------------------------------------------------------------------------
// Global search index (bounded, resolved server-side for instant filtering)
// ---------------------------------------------------------------------------

export type SearchItem = {
  type: string;
  id: string;
  title: string;
  subtitle: string;
  href: string | null;
  keywords: string;
};

export async function loadGlobalSearchIndex(): Promise<SearchItem[]> {
  const client = createServiceClient();
  const items: SearchItem[] = [];

  const [orgs, workspaces, companies, engagements, invitations, subscriptions, security, audit, userMap] =
    await Promise.all([
      client.from("organizations").select("id, name, slug, tenant_type, status").is("deleted_at", null).limit(500),
      client.from("workspaces").select("id, name, slug, organization_id").is("deleted_at", null).limit(500),
      client.from("companies").select("id, name, slug, organization_id").is("deleted_at", null).limit(500),
      client.from("engagements").select("id, name, lifecycle_status, organization_id").is("deleted_at", null).limit(500),
      client
        .from("user_provisioning_invitations")
        .select("id, email, role_slug, invitation_status, organization_id")
        .is("deleted_at", null)
        .limit(500),
      client
        .from("subscription_and_licensing_plans")
        .select("id, plan_code, subscription_status, organization_id")
        .is("deleted_at", null)
        .limit(500),
      client
        .from("security_event_monitoring_events")
        .select("id, event_code, severity, created_at")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(200),
      client
        .from("audit_logs")
        .select("id, action, resource_type, created_at")
        .order("created_at", { ascending: false })
        .limit(200),
      loadUserMap(client),
    ]);

  const orgNameById = new Map((orgs.data ?? []).map((o) => [o.id, o.name]));

  for (const o of orgs.data ?? []) {
    items.push({
      type: "Company",
      id: o.id,
      title: o.name,
      subtitle: `${o.tenant_type} · ${o.status}`,
      href: `/app/platform/companies/${o.id}`,
      keywords: `${o.name} ${o.slug} ${o.tenant_type}`.toLowerCase(),
    });
  }
  for (const [id, user] of userMap) {
    items.push({
      type: "User",
      id,
      title: user.email,
      subtitle: user.fullName ?? (user.isPlatformOwner ? "Platform Owner" : "User"),
      href: `/app/platform/users/${id}`,
      keywords: `${user.email} ${user.fullName ?? ""}`.toLowerCase(),
    });
  }
  for (const w of workspaces.data ?? []) {
    items.push({
      type: "Workspace",
      id: w.id,
      title: w.name,
      subtitle: orgNameById.get(w.organization_id) ?? "",
      href: w.organization_id ? `/app/platform/companies/${w.organization_id}` : null,
      keywords: `${w.name} ${w.slug}`.toLowerCase(),
    });
  }
  for (const c of companies.data ?? []) {
    items.push({
      type: "Organization",
      id: c.id,
      title: c.name,
      subtitle: orgNameById.get(c.organization_id) ?? "",
      href: c.organization_id ? `/app/platform/companies/${c.organization_id}` : null,
      keywords: `${c.name} ${c.slug}`.toLowerCase(),
    });
  }
  for (const e of engagements.data ?? []) {
    items.push({
      type: "Engagement",
      id: e.id,
      title: e.name,
      subtitle: `${String(e.lifecycle_status)} · ${orgNameById.get(e.organization_id) ?? ""}`,
      href: e.organization_id ? `/app/platform/companies/${e.organization_id}` : null,
      keywords: `${e.name} ${String(e.lifecycle_status)}`.toLowerCase(),
    });
  }
  for (const inv of invitations.data ?? []) {
    items.push({
      type: "Invitation",
      id: inv.id,
      title: String(inv.email),
      subtitle: `${inv.role_slug} · ${inv.invitation_status}`,
      href: inv.organization_id ? `/app/platform/companies/${inv.organization_id}` : null,
      keywords: `${String(inv.email)} ${inv.role_slug} ${inv.invitation_status}`.toLowerCase(),
    });
  }
  for (const s of subscriptions.data ?? []) {
    items.push({
      type: "License",
      id: s.id,
      title: `${s.plan_code} · ${orgNameById.get(s.organization_id) ?? ""}`,
      subtitle: s.subscription_status,
      href: s.organization_id ? `/app/platform/companies/${s.organization_id}` : null,
      keywords: `${s.plan_code} ${s.subscription_status}`.toLowerCase(),
    });
  }
  for (const ev of security.data ?? []) {
    items.push({
      type: "Security Event",
      id: ev.id,
      title: ev.event_code,
      subtitle: `${ev.severity} · ${new Date(ev.created_at).toLocaleString()}`,
      href: "/app/platform/monitoring",
      keywords: `${ev.event_code} ${ev.severity}`.toLowerCase(),
    });
  }
  for (const a of audit.data ?? []) {
    items.push({
      type: "Audit Event",
      id: a.id,
      title: a.action,
      subtitle: `${a.resource_type} · ${new Date(a.created_at).toLocaleString()}`,
      href: "/app/platform/audit-logs",
      keywords: `${a.action} ${a.resource_type}`.toLowerCase(),
    });
  }

  return items;
}
