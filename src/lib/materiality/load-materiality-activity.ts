import "server-only";

import { cache } from "react";
import type { MaterialityActivityView } from "@/lib/materiality/materiality-workspace-view";
import { loadMaterialityWorkspaceCached } from "@/lib/materiality/load-materiality-workspace";

export type MaterialityActivityLoadResult =
  | { ok: true; activity: MaterialityActivityView }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

async function loadMaterialityActivity(engagementSlug: string): Promise<MaterialityActivityLoadResult> {
  const workspaceResult = await loadMaterialityWorkspaceCached(engagementSlug);
  if (!workspaceResult.ok) {
    return { ok: false, reason: workspaceResult.reason };
  }
  return { ok: true, activity: { entries: [] } };
}

export const loadMaterialityActivityCached = cache(loadMaterialityActivity);
