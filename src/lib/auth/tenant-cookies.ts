import "server-only";

import { cookies } from "next/headers";
import { siteConfig } from "@/config/site";

const TENANT_COOKIE_OPTIONS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax" as const,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

export async function setTenantCookies(organizationId: string, workspaceId?: string | null) {
  const cookieStore = await cookies();
  cookieStore.set(siteConfig.organizationCookieName, organizationId, TENANT_COOKIE_OPTIONS);

  if (workspaceId) {
    cookieStore.set(siteConfig.workspaceCookieName, workspaceId, TENANT_COOKIE_OPTIONS);
  }
}

export async function setOrganizationCookie(organizationId: string) {
  const cookieStore = await cookies();
  cookieStore.set(siteConfig.organizationCookieName, organizationId, TENANT_COOKIE_OPTIONS);
}

export async function setWorkspaceCookie(workspaceId: string) {
  const cookieStore = await cookies();
  cookieStore.set(siteConfig.workspaceCookieName, workspaceId, TENANT_COOKIE_OPTIONS);
}

export async function clearWorkspaceCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(siteConfig.workspaceCookieName);
}

export async function setCompanySlugCookie(slug: string) {
  const cookieStore = await cookies();
  cookieStore.set(siteConfig.companyCookieName, slug, TENANT_COOKIE_OPTIONS);
}

export async function clearCompanySlugCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(siteConfig.companyCookieName);
}

export async function readCompanySlugCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(siteConfig.companyCookieName)?.value ?? null;
}

export async function setEngagementSlugCookie(slug: string) {
  const cookieStore = await cookies();
  cookieStore.set(siteConfig.engagementCookieName, slug, TENANT_COOKIE_OPTIONS);
}

export async function clearEngagementSlugCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(siteConfig.engagementCookieName);
}

export async function readEngagementSlugCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(siteConfig.engagementCookieName)?.value ?? null;
}
