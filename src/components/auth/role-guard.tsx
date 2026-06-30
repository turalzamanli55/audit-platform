"use client";

import type { ReactNode } from "react";
import type { Role } from "@/types/auth";
import { useAuth } from "@/providers";
import { hasRole, hasRoleSlug } from "@/lib/auth/permissions";
import { EmptyStateShell } from "@/components/layout/shells/empty-state-shell";

type RoleGuardProps = {
  children: ReactNode;
  roles: Role | Role[];
  fallback?: ReactNode;
};

export function RoleGuard({ children, roles, fallback }: RoleGuardProps) {
  const { session } = useAuth();

  if (session.status !== "authenticated" || !session.user) {
    return (
      fallback ?? (
        <EmptyStateShell
          title="Access restricted"
          description="You must be signed in to view this content."
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
          title="Insufficient role"
          description="Your account does not have the required role for this action."
        />
      )
    );
  }

  return <>{children}</>;
}
