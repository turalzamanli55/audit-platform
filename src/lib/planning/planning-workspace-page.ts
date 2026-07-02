import "server-only";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, type Locale } from "@/i18n";
import { loadPlanningWorkspaceCached } from "@/lib/planning/load-planning-workspace";
import type { PlanningWorkspaceView } from "@/lib/planning/planning-workspace-view";

export type PlanningWorkspacePageResult =
  | { ok: true; plan: PlanningWorkspaceView | null; engagementSlug: string }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

export async function loadPlanningWorkspacePage(
  engagementSlug: string,
): Promise<PlanningWorkspacePageResult> {
  return loadPlanningWorkspaceCached(engagementSlug);
}

export async function requirePlanningWorkspace(
  engagementSlug: string,
): Promise<{ plan: PlanningWorkspaceView | null; engagementSlug: string }> {
  const result = await loadPlanningWorkspaceCached(engagementSlug);

  if (!result.ok) {
    notFound();
  }

  return { plan: result.plan, engagementSlug: result.engagementSlug };
}

export async function generatePlanningWorkspaceMetadata(
  engagementSlug: string,
  locale: Locale,
): Promise<Metadata> {
  const dictionary = await getDictionary(locale);
  const result = await loadPlanningWorkspacePage(engagementSlug);

  if (!result.ok) {
    return {
      title: `${dictionary.planning.notFoundTitle} | ${dictionary.common.appName}`,
    };
  }

  return {
    title: `${dictionary.planning.workspace.heroEyebrow} | ${dictionary.common.appName}`,
    description: dictionary.planning.workspace.sections.overview.description,
  };
}
