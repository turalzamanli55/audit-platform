import "server-only";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, type Locale } from "@/i18n";
import { loadOpinionWorkspaceCached } from "@/lib/opinion/load-opinion-workspace";
import type { OpinionWorkspaceLoadResult } from "@/lib/opinion/opinion-workspace-view";

export type OpinionWorkspacePageResult = OpinionWorkspaceLoadResult;

export async function loadOpinionWorkspacePage(
  engagementSlug: string,
): Promise<OpinionWorkspacePageResult> {
  return loadOpinionWorkspaceCached(engagementSlug);
}

export async function generateOpinionWorkspaceMetadata(
  engagementSlug: string,
  locale: Locale,
): Promise<Metadata> {
  const dictionary = await getDictionary(locale);
  const result = await loadOpinionWorkspacePage(engagementSlug);

  if (!result.ok) {
    return {
      title: `${dictionary.opinion.workspace.breadcrumbReview} | ${dictionary.common.appName}`,
    };
  }

  return {
    title: `${dictionary.opinion.workspace.breadcrumbReview} | ${dictionary.common.appName}`,
    description: dictionary.opinion.workspace.description,
  };
}

export async function requireOpinionWorkspace(engagementSlug: string) {
  const result = await loadOpinionWorkspaceCached(engagementSlug);
  if (!result.ok) notFound();
  return result;
}
