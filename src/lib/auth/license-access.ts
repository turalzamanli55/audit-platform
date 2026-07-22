import "server-only";

import { createServiceClient } from "@/lib/supabase/service";
import {
  PLATFORM_OWNER_METADATA_KEY,
  PLATFORM_OWNER_METADATA_VALUE,
} from "@/lib/platform-bootstrap";
import { isLicenseAccessAllowed, daysUntil } from "@/lib/platform-console/tenant-lifecycle";

export type TenantLicenseAccess = {
  allowed: boolean;
  /** True when the user has at least one company membership. */
  hasCompany: boolean;
  organizationId: string | null;
  companyName: string | null;
  endsAt: string | null;
  daysExpired: number;
  licenseStatus: string | null;
};

/**
 * Evaluates whether a signed-in tenant user may access the product.
 * Expired licenses block access but never delete data.
 * Platform Owner always allowed. Users with no membership allowed (onboarding).
 */
export async function resolveTenantLicenseAccess(userId: string): Promise<TenantLicenseAccess> {
  const service = createServiceClient();

  const { data: userData } = await service.auth.admin.getUserById(userId);
  const metadata = userData.user?.app_metadata as Record<string, unknown> | undefined;
  if (metadata?.[PLATFORM_OWNER_METADATA_KEY] === PLATFORM_OWNER_METADATA_VALUE) {
    return {
      allowed: true,
      hasCompany: false,
      organizationId: null,
      companyName: null,
      endsAt: null,
      daysExpired: 0,
      licenseStatus: null,
    };
  }

  const { data: memberships } = await service
    .from("memberships")
    .select("organization_id, organizations!inner(id, name, status, deleted_at)")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .eq("status", "active");

  if (!memberships || memberships.length === 0) {
    return {
      allowed: true,
      hasCompany: false,
      organizationId: null,
      companyName: null,
      endsAt: null,
      daysExpired: 0,
      licenseStatus: null,
    };
  }

  const orgIds = [
    ...new Set(
      memberships
        .map((row) => {
          const org = (row as { organizations?: { id?: string; deleted_at?: string | null; status?: string } })
            .organizations;
          if (!org || org.deleted_at || org.status !== "active") return null;
          return org.id ?? row.organization_id;
        })
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  if (orgIds.length === 0) {
    // Org suspended/archived — existing login-guard handles message; allow layout through.
    return {
      allowed: true,
      hasCompany: true,
      organizationId: null,
      companyName: null,
      endsAt: null,
      daysExpired: 0,
      licenseStatus: null,
    };
  }

  const { data: subscriptions } = await service
    .from("subscription_and_licensing_plans")
    .select("organization_id, subscription_status, ends_at")
    .in("organization_id", orgIds)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  // Pick latest subscription per org.
  const latestByOrg = new Map<string, { status: string; endsAt: string | null }>();
  for (const row of subscriptions ?? []) {
    if (latestByOrg.has(row.organization_id)) continue;
    latestByOrg.set(row.organization_id, {
      status: row.subscription_status,
      endsAt: row.ends_at,
    });
  }

  // Access granted if ANY active org still has a valid license (or no license yet).
  for (const orgId of orgIds) {
    const sub = latestByOrg.get(orgId);
    if (!sub) {
      return {
        allowed: true,
        hasCompany: true,
        organizationId: orgId,
        companyName: null,
        endsAt: null,
        daysExpired: 0,
        licenseStatus: null,
      };
    }
    if (isLicenseAccessAllowed(sub.status, sub.endsAt)) {
      return {
        allowed: true,
        hasCompany: true,
        organizationId: orgId,
        companyName: null,
        endsAt: sub.endsAt,
        daysExpired: 0,
        licenseStatus: sub.status,
      };
    }
  }

  // All companies blocked — surface the first expired org for the landing page.
  const firstOrgId = orgIds[0]!;
  const blocked = latestByOrg.get(firstOrgId);
  const orgRow = memberships.find((m) => m.organization_id === firstOrgId) as {
    organizations?: { name?: string };
  } | undefined;
  const days = daysUntil(blocked?.endsAt ?? null);
  const daysExpired = days !== null && days < 0 ? Math.abs(days) : 0;

  return {
    allowed: false,
    hasCompany: true,
    organizationId: firstOrgId,
    companyName: orgRow?.organizations?.name ?? null,
    endsAt: blocked?.endsAt ?? null,
    daysExpired,
    licenseStatus: blocked?.status ?? "expired",
  };
}
