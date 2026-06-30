"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers";
import { AUTH_ROUTES, isProtectedRoute, stripLocalePrefix } from "@/config/auth";
import { isSessionAuthenticated } from "@/lib/auth/session-state";
import { LoadingShell } from "@/components/layout/shells/loading-shell";
import { defaultLocale, isValidLocale } from "@/i18n";

function resolveLoginPath(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean)[0];
  const locale = segment && isValidLocale(segment) ? segment : defaultLocale;
  return `/${locale}${AUTH_ROUTES.login}`;
}

type ProtectedRouteGuardProps = {
  children: ReactNode;
  fallbackPath?: string;
};

export function ProtectedRouteGuard({ children, fallbackPath }: ProtectedRouteGuardProps) {
  const { session } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (session.status === "loading") return;

    const normalized = stripLocalePrefix(pathname);
    if (isProtectedRoute(normalized) && !isSessionAuthenticated(session)) {
      router.replace(fallbackPath ?? resolveLoginPath(pathname));
    }
  }, [session, pathname, router, fallbackPath]);

  if (session.status === "loading") {
    return <LoadingShell />;
  }

  const normalized = stripLocalePrefix(pathname);
  if (isProtectedRoute(normalized) && !isSessionAuthenticated(session)) {
    return <LoadingShell />;
  }

  return <>{children}</>;
}
