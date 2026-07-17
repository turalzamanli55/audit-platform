/**
 * Authentication route configuration.
 * Supabase integration deferred — architecture and guards only.
 */

export const AUTH_ROUTES = {
  login: "/login",
  invite: "/invite",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  callback: "/auth/callback",
} as const;

export const PROTECTED_PREFIX = "/app";

export const ONBOARDING_PATH = "/app/onboarding";
export const DASHBOARD_PATH = "/app/dashboard";

export const PUBLIC_PATHS = [
  "/",
  "/about",
  "/privacy",
  "/terms",
  "/pricing",
  "/features",
  "/documentation",
  "/contact",
] as const;

export const GUEST_PATHS = [
  AUTH_ROUTES.login,
  AUTH_ROUTES.invite,
  AUTH_ROUTES.forgotPassword,
  AUTH_ROUTES.resetPassword,
  AUTH_ROUTES.verifyEmail,
] as const;

export type RouteAccess = "public" | "guest" | "protected";

export function classifyRoute(pathname: string): RouteAccess {
  const normalized = stripLocalePrefix(pathname);

  if (GUEST_PATHS.some((p) => normalized === p || normalized.startsWith(`${p}/`))) {
    return "guest";
  }

  if (PUBLIC_PATHS.some((p) => normalized === p)) {
    return "public";
  }

  if (normalized.startsWith(PROTECTED_PREFIX)) {
    return "protected";
  }

  return "public";
}

export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const locales = ["az", "en", "ru", "tr"];

  if (segments.length > 0 && locales.includes(segments[0])) {
    return `/${segments.slice(1).join("/")}` || "/";
  }

  return pathname || "/";
}

export function isAuthRoute(pathname: string): boolean {
  return classifyRoute(pathname) === "guest";
}

export function isProtectedRoute(pathname: string): boolean {
  return classifyRoute(pathname) === "protected";
}
