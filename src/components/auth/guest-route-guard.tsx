"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers";
import { isAuthRoute, stripLocalePrefix } from "@/config/auth";
import { isSessionAuthenticated } from "@/lib/auth/session";

type GuestRouteGuardProps = {
  children: ReactNode;
  redirectPath?: string;
};

/**
 * Redirects authenticated users away from guest-only routes (login, register).
 */
export function GuestRouteGuard({ children, redirectPath = "/app" }: GuestRouteGuardProps) {
  const { session } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (session.status === "loading") return;

    const normalized = stripLocalePrefix(pathname);
    if (isAuthRoute(normalized) && isSessionAuthenticated(session)) {
      router.replace(redirectPath);
    }
  }, [session, pathname, router, redirectPath]);

  return <>{children}</>;
}
