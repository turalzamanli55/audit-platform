"use client";

import type { ReactNode } from "react";
import type { Capability, Scope } from "@/types/auth";
import { useAuth } from "@/providers";
import { useTenantOptional } from "@/providers/tenant-provider";
import { hasPermission } from "@/lib/auth/permissions";
import { hasMergedPermissionCode } from "@/lib/auth/session-safety";
import { EmptyStateShell } from "@/components/layout/shells/empty-state-shell";
import { useCommonLabels } from "@/i18n/use-common-labels";

type PermissionGuardProps = {
  children: ReactNode;
  capability?: Capability;
  scope?: Scope;
  resourceId?: string;
  permissionCode?: string | string[];
  permissionCodes?: string[];
  fallback?: ReactNode;
};

export function PermissionGuard({
  children,
  capability,
  scope,
  resourceId,
  permissionCode,
  permissionCodes,
  fallback,
}: PermissionGuardProps) {
  const { session } = useAuth();
  const tenant = useTenantOptional();
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

  const allowedByCode = permissionCode
    ? hasMergedPermissionCode(
        [
          permissionCodes,
          tenant?.permissionCodes,
          session.user.permissionCodes,
        ],
        permissionCode,
      )
    : false;

  const allowedByLegacy =
    capability && scope
      ? hasPermission(session.user.permissions, capability, scope, resourceId)
      : false;

  const allowed = permissionCode ? allowedByCode : allowedByLegacy;

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
