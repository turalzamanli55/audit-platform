import "server-only";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, type Locale } from "@/i18n";
import { loadCompletionWorkspaceCached } from "@/lib/completion/load-completion-workspace";
import type { CompletionWorkspaceLoadResult } from "@/lib/completion/completion-workspace-view";

export type CompletionWorkspacePageResult = CompletionWorkspaceLoadResult;

export async function loadCompletionWorkspacePage(
  engagementSlug: string,
): Promise<CompletionWorkspacePageResult> {
  return loadCompletionWorkspaceCached(engagementSlug);
}

export async function generateCompletionWorkspaceMetadata(
  engagementSlug: string,
  locale: Locale,
): Promise<Metadata> {
  const dictionary = await getDictionary(locale);
  const result = await loadCompletionWorkspacePage(engagementSlug);

  if (!result.ok) {
    return {
      title: `${dictionary.completion.workspace.breadcrumbReview} | ${dictionary.common.appName}`,
    };
  }

  return {
    title: `${dictionary.completion.workspace.breadcrumbReview} | ${dictionary.common.appName}`,
    description: dictionary.completion.workspace.description,
  };
}

export async function requireCompletionWorkspace(engagementSlug: string) {
  const result = await loadCompletionWorkspaceCached(engagementSlug);
  if (!result.ok) notFound();
  return result;
}
