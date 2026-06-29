"use client";

import type { ReactNode } from "react";
import type { Capability, Scope } from "@/types/auth";
import { useAuth } from "@/providers";
import { hasPermission } from "@/lib/auth/permissions";
import { EmptyStateShell } from "@/components/layout/shells/empty-state-shell";

type PermissionGuardProps = {
  children: ReactNode;
  capability: Capability;
  scope: Scope;
  resourceId?: string;
  fallback?: ReactNode;
};

export function PermissionGuard({
  children,
  capability,
  scope,
  resourceId,
  fallback,
}: PermissionGuardProps) {
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

  const allowed = hasPermission(session.user.permissions, capability, scope, resourceId);

  if (!allowed) {
    return (
      fallback ?? (
        <EmptyStateShell
          title="Permission denied"
          description="You do not have permission to perform this action."
        />
      )
    );
  }

  return <>{children}</>;
}
