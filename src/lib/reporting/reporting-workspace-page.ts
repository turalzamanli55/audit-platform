import "server-only";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, type Locale } from "@/i18n";
import { loadReportingWorkspaceCached } from "@/lib/reporting/load-reporting-workspace";
import type { ReportingWorkspaceLoadResult } from "@/lib/reporting/reporting-workspace-view";

export type ReportingWorkspacePageResult = ReportingWorkspaceLoadResult;

export async function loadReportingWorkspacePage(
  engagementSlug: string,
): Promise<ReportingWorkspacePageResult> {
  return loadReportingWorkspaceCached(engagementSlug);
}

export async function generateReportingWorkspaceMetadata(
  engagementSlug: string,
  locale: Locale,
): Promise<Metadata> {
  const dictionary = await getDictionary(locale);
  const result = await loadReportingWorkspacePage(engagementSlug);

  if (!result.ok) {
    return {
      title: `${dictionary.reporting.workspace.breadcrumbReview} | ${dictionary.common.appName}`,
    };
  }

  return {
    title: `${dictionary.reporting.workspace.breadcrumbReview} | ${dictionary.common.appName}`,
    description: dictionary.reporting.workspace.description,
  };
}

export async function requireReportingWorkspace(engagementSlug: string) {
  const result = await loadReportingWorkspaceCached(engagementSlug);
  if (!result.ok) notFound();
  return result;
}
