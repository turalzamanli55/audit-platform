import "server-only";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, type Locale } from "@/i18n";
import { loadFieldworkWorkspaceCached } from "@/lib/fieldwork/load-fieldwork-workspace";

export type FieldworkWorkspacePageResult =
  | {
      ok: true;
      fieldwork: import("@/lib/fieldwork/fieldwork-workspace-view").FieldworkWorkspaceView | null;
      engagementSlug: string;
      planningApproved: boolean;
    }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

export async function loadFieldworkWorkspacePage(
  engagementSlug: string,
): Promise<FieldworkWorkspacePageResult> {
  return loadFieldworkWorkspaceCached(engagementSlug);
}

export async function generateFieldworkWorkspaceMetadata(
  engagementSlug: string,
  locale: Locale,
): Promise<Metadata> {
  const dictionary = await getDictionary(locale);
  const result = await loadFieldworkWorkspacePage(engagementSlug);

  if (!result.ok) {
    return {
      title: `${dictionary.fieldwork.notFoundTitle} | ${dictionary.common.appName}`,
    };
  }

  return {
    title: `${dictionary.fieldwork.workspace.heroEyebrow} | ${dictionary.common.appName}`,
    description: dictionary.fieldwork.workspace.sections.overview.description,
  };
}

export async function requireFieldworkWorkspace(engagementSlug: string) {
  const result = await loadFieldworkWorkspaceCached(engagementSlug);
  if (!result.ok) notFound();
  return result;
}
