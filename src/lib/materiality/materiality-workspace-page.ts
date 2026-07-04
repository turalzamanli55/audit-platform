import "server-only";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, type Locale } from "@/i18n";
import { loadMaterialityWorkspaceCached } from "@/lib/materiality/load-materiality-workspace";

import type { MaterialityWorkspaceLoadResult } from "@/lib/materiality/materiality-workspace-view";

export type MaterialityWorkspacePageResult = MaterialityWorkspaceLoadResult;

export async function loadMaterialityWorkspacePage(
  engagementSlug: string,
): Promise<MaterialityWorkspacePageResult> {
  return loadMaterialityWorkspaceCached(engagementSlug);
}

export async function generateMaterialityWorkspaceMetadata(
  engagementSlug: string,
  locale: Locale,
): Promise<Metadata> {
  const dictionary = await getDictionary(locale);
  const result = await loadMaterialityWorkspacePage(engagementSlug);

  if (!result.ok) {
    return {
      title: `${dictionary.materiality.workspace.breadcrumbMateriality} | ${dictionary.common.appName}`,
    };
  }

  return {
    title: `${dictionary.materiality.workspace.breadcrumbMateriality} | ${dictionary.common.appName}`,
    description: dictionary.materiality.workspace.description,
  };
}

export async function requireMaterialityWorkspace(engagementSlug: string) {
  const result = await loadMaterialityWorkspaceCached(engagementSlug);
  if (!result.ok) notFound();
  return result;
}
