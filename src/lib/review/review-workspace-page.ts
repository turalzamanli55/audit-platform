import "server-only";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, type Locale } from "@/i18n";
import { loadReviewWorkspaceCached } from "@/lib/review/load-review-workspace";
import type { ReviewWorkspaceLoadResult } from "@/lib/review/review-workspace-view";

export type ReviewWorkspacePageResult = ReviewWorkspaceLoadResult;

export async function loadReviewWorkspacePage(
  engagementSlug: string,
): Promise<ReviewWorkspacePageResult> {
  return loadReviewWorkspaceCached(engagementSlug);
}

export async function generateReviewWorkspaceMetadata(
  engagementSlug: string,
  locale: Locale,
): Promise<Metadata> {
  const dictionary = await getDictionary(locale);
  const result = await loadReviewWorkspacePage(engagementSlug);

  if (!result.ok) {
    return {
      title: `${dictionary.review.workspace.breadcrumbReview} | ${dictionary.common.appName}`,
    };
  }

  return {
    title: `${dictionary.review.workspace.breadcrumbReview} | ${dictionary.common.appName}`,
    description: dictionary.review.workspace.description,
  };
}

export async function requireReviewWorkspace(engagementSlug: string) {
  const result = await loadReviewWorkspaceCached(engagementSlug);
  if (!result.ok) notFound();
  return result;
}
