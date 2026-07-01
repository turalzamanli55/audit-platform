"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers";
import { DASHBOARD_PATH, ONBOARDING_PATH, stripLocalePrefix } from "@/config/auth";
import { isSessionAuthenticated } from "@/lib/auth/session-state";
import { LoadingShell } from "@/components/layout/shells/loading-shell";
import { defaultLocale, isValidLocale } from "@/i18n";

function withLocale(pathname: string, path: string): string {
  const segment = pathname.split("/").filter(Boolean)[0];
  const locale = segment && isValidLocale(segment) ? segment : defaultLocale;
  return `/${locale}${path}`;
}

type OnboardingGuardProps = {
  children: ReactNode;
  hasOrganization: boolean;
  hasWorkspace: boolean;
};

export function OnboardingGuard({
  children,
  hasOrganization,
  hasWorkspace,
}: OnboardingGuardProps) {
  const { session } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const onboardingComplete = hasOrganization && hasWorkspace;

  useEffect(() => {
    if (session.status === "loading") return;
    if (!isSessionAuthenticated(session)) return;

    const normalized = stripLocalePrefix(pathname);
    const onboardingPath = ONBOARDING_PATH;
    const dashboardPath = DASHBOARD_PATH;

    if (!onboardingComplete && normalized !== onboardingPath && normalized.startsWith("/app")) {
      router.replace(withLocale(pathname, onboardingPath));
      return;
    }

    if (onboardingComplete && normalized === onboardingPath) {
      router.replace(withLocale(pathname, dashboardPath));
    }
  }, [session, pathname, router, onboardingComplete]);

  if (session.status === "loading") {
    return <LoadingShell />;
  }

  return <>{children}</>;
}
