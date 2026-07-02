import "server-only";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, type Locale } from "@/i18n";
import { loadEngagementWorkspaceCached } from "@/lib/engagement/load-engagement-workspace";
import type { EngagementWorkspaceView } from "@/lib/engagement/engagement-workspace-view";

export type EngagementWorkspacePageResult =
  | { ok: true; engagement: EngagementWorkspaceView }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

export async function loadEngagementWorkspacePage(
  slug: string,
): Promise<EngagementWorkspacePageResult> {
  return loadEngagementWorkspaceCached(slug);
}

export async function requireEngagementWorkspace(slug: string): Promise<EngagementWorkspaceView> {
  const result = await loadEngagementWorkspaceCached(slug);

  if (!result.ok) {
    notFound();
  }

  return result.engagement;
}

export async function generateEngagementWorkspaceMetadata(
  slug: string,
  locale: Locale,
): Promise<Metadata> {
  const dictionary = await getDictionary(locale);
  const result = await loadEngagementWorkspacePage(slug);

  if (!result.ok) {
    return {
      title: `${dictionary.engagements.notFoundTitle} | ${dictionary.common.appName}`,
    };
  }

  return {
    title: `${result.engagement.name} | ${dictionary.common.appName}`,
    description: dictionary.engagements.workspace.heroEyebrow,
  };
}
