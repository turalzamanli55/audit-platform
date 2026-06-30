"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers";
import { DASHBOARD_PATH, isAuthRoute, stripLocalePrefix } from "@/config/auth";
import { isSessionAuthenticated } from "@/lib/auth/session-state";
import { defaultLocale, isValidLocale } from "@/i18n";

function resolveDashboardPath(pathname: string, redirectPath?: string): string {
  const segment = pathname.split("/").filter(Boolean)[0];
  const locale = segment && isValidLocale(segment) ? segment : defaultLocale;
  const target = redirectPath ?? DASHBOARD_PATH;
  return `/${locale}${target}`;
}

type GuestRouteGuardProps = {
  children: ReactNode;
  redirectPath?: string;
};

/**
 * Redirects authenticated users away from guest-only routes (login, register).
 */
export function GuestRouteGuard({ children, redirectPath }: GuestRouteGuardProps) {
  const { session } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (session.status === "loading") return;

    const normalized = stripLocalePrefix(pathname);
    if (isAuthRoute(normalized) && isSessionAuthenticated(session)) {
      router.replace(resolveDashboardPath(pathname, redirectPath));
    }
  }, [session, pathname, router, redirectPath]);

  return <>{children}</>;
}
