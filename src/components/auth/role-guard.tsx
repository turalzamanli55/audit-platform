"use client";

import type { ReactNode } from "react";
import type { Role } from "@/types/auth";
import { useAuth } from "@/providers";
import { hasRole, hasRoleSlug } from "@/lib/auth/permissions";
import { EmptyStateShell } from "@/components/layout/shells/empty-state-shell";
import { useCommonLabels } from "@/i18n/use-common-labels";

type RoleGuardProps = {
  children: ReactNode;
  roles: Role | Role[];
  fallback?: ReactNode;
};

export function RoleGuard({ children, roles, fallback }: RoleGuardProps) {
  const { session } = useAuth();
  const common = useCommonLabels();

  if (session.status !== "authenticated" || !session.user) {
    return (
      fallback ?? (
        <EmptyStateShell
          title={common.accessRestricted}
          description={common.signInRequired}
        />
      )
    );
  }

  const allowed =
    hasRole(session.user.roles, roles) || hasRoleSlug(session.user.roleSlugs, roles);

  if (!allowed) {
    return (
      fallback ?? (
        <EmptyStateShell
          title={common.permissionDenied}
          description={common.permissionDeniedDescription}
        />
      )
    );
  }

  return <>{children}</>;
}
