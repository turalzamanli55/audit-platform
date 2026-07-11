import "server-only";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, type Locale } from "@/i18n";
import { loadFinancialStatementsWorkspaceCached } from "@/lib/financial-statements/load-financial-statements-workspace";
import type { FinancialStatementsWorkspaceLoadResult } from "@/lib/financial-statements/financial-statements-workspace-view";

export type FinancialStatementsWorkspacePageResult = FinancialStatementsWorkspaceLoadResult;

export async function loadFinancialStatementsWorkspacePage(
  engagementSlug: string,
): Promise<FinancialStatementsWorkspacePageResult> {
  return loadFinancialStatementsWorkspaceCached(engagementSlug);
}

export async function generateFinancialStatementsWorkspaceMetadata(
  engagementSlug: string,
  locale: Locale,
): Promise<Metadata> {
  const dictionary = await getDictionary(locale);
  const result = await loadFinancialStatementsWorkspacePage(engagementSlug);

  if (!result.ok) {
    return {
      title: `${dictionary.financialStatements.workspace.breadcrumbFinancialStatements} | ${dictionary.common.appName}`,
    };
  }

  return {
    title: `${dictionary.financialStatements.workspace.breadcrumbFinancialStatements} | ${dictionary.common.appName}`,
    description: dictionary.financialStatements.workspace.description,
  };
}

export async function requireFinancialStatementsWorkspace(engagementSlug: string) {
  const result = await loadFinancialStatementsWorkspaceCached(engagementSlug);
  if (!result.ok) notFound();
  return result;
}
