import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/i18n";
import { loadCompanyWorkspacePage } from "@/lib/company/company-workspace-page";

export async function generateCompanyWorkspaceMetadata(
  slug: string,
  locale: Locale,
): Promise<Metadata> {
  const dictionary = await getDictionary(locale);
  const result = await loadCompanyWorkspacePage(slug);

  if (!result.ok) {
    return {
      title: `${dictionary.companies.notFoundTitle} | ${dictionary.common.appName}`,
    };
  }

  return {
    title: `${result.company.name} | ${dictionary.common.appName}`,
    description: dictionary.companies.workspace.heroEyebrow,
  };
}
