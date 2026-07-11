import "server-only";

import { cache } from "react";
import { UAIE_PERMISSIONS } from "@/constants/uaie";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import { UaieIntelligenceRepository } from "@/repositories/uaie/uaie-intelligence-repository";
import type { RepositoryContext } from "@/types/context";

function createRepositoryContext(
  userId: string,
  organizationId: string,
  workspaceId: string,
): RepositoryContext {
  return {
    userId,
    tenant: {
      organization: { organizationId, isResolved: true },
      workspace: { workspaceId, isResolved: true },
      company: { companyId: null, isResolved: false },
      permissions: { permissions: [], isResolved: false },
      roles: { roles: [], isResolved: false },
    },
  };
}

export type UaieIntelligenceCapabilities = {
  canReview: boolean;
  canApprove: boolean;
  canAdmin: boolean;
};

export type UaieIntelligenceLoadResult =
  | {
      ok: true;
      workspaceId: string;
      organizationId: string;
      capabilities: UaieIntelligenceCapabilities;
      analytics: Awaited<ReturnType<UaieIntelligenceRepository["analyticsSnapshot"]>>;
      sessions: Awaited<ReturnType<UaieIntelligenceRepository["listSessions"]>>;
      unknowns: Awaited<ReturnType<UaieIntelligenceRepository["listUnknownHeaders"]>>;
      dictionary: Awaited<ReturnType<UaieIntelligenceRepository["listDictionary"]>>;
      fingerprints: Awaited<ReturnType<UaieIntelligenceRepository["listFingerprints"]>>;
      profiles: Awaited<ReturnType<UaieIntelligenceRepository["listMappingProfiles"]>>;
      mappings: Awaited<ReturnType<UaieIntelligenceRepository["listApprovedMappings"]>>;
      timeline: Awaited<ReturnType<UaieIntelligenceRepository["listLearningEvents"]>>;
      audit: Awaited<ReturnType<UaieIntelligenceRepository["listIntelligenceAudit"]>>;
    }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "error" };

export async function loadUaieIntelligenceCenter(): Promise<UaieIntelligenceLoadResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: "unauthenticated" };
    requirePermissionCodes(user, UAIE_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId || !user.organizationId) {
      return { ok: false, reason: "no_workspace" };
    }

    const supabase = await createServerClient();
    const intelligence = new UaieIntelligenceRepository(
      supabase,
      createRepositoryContext(user.id, user.organizationId, workspace.workspaceId),
    );

    const [
      analytics,
      sessions,
      unknowns,
      dictionary,
      fingerprints,
      profiles,
      mappings,
      timeline,
      audit,
    ] = await Promise.all([
      intelligence.analyticsSnapshot(workspace.workspaceId),
      intelligence.listSessions({ limit: 150 }),
      intelligence.listUnknownHeaders({ limit: 200 }),
      intelligence.listDictionary({ limit: 200 }),
      intelligence.listFingerprints(150),
      intelligence.listMappingProfiles(),
      intelligence.listApprovedMappings(150),
      intelligence.listLearningEvents(150),
      intelligence.listIntelligenceAudit(100),
    ]);

    return {
      ok: true,
      workspaceId: workspace.workspaceId,
      organizationId: user.organizationId,
      capabilities: {
        canReview: authorizePermissionCodes(user.permissionCodes, UAIE_PERMISSIONS.REVIEW),
        canApprove: authorizePermissionCodes(user.permissionCodes, UAIE_PERMISSIONS.APPROVE),
        canAdmin: authorizePermissionCodes(user.permissionCodes, UAIE_PERMISSIONS.ADMIN),
      },
      analytics,
      sessions,
      unknowns,
      dictionary,
      fingerprints,
      profiles,
      mappings,
      timeline,
      audit,
    };
  } catch (error) {
    if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
    if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
    return { ok: false, reason: "error" };
  }
}

export const loadUaieIntelligenceCenterCached = cache(loadUaieIntelligenceCenter);
