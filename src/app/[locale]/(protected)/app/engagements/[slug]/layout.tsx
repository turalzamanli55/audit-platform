import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { EngagementWorkspaceError, EngagementWorkspaceLayout } from "@/components/engagement/workspace";
import { getDictionary, type Locale } from "@/i18n";
import {
  buildEngagementWorkspaceNavItems,
  buildWorkspaceHeroLabels,
} from "@/lib/engagement/engagement-workspace-display";
import { loadEngagementWorkspacePage } from "@/lib/engagement/engagement-workspace-page";

type EngagementWorkspaceLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string; slug: string }>;
};

export default async function EngagementWorkspaceRouteLayout({
  children,
  params,
}: EngagementWorkspaceLayoutProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.engagements.workspace;
  const result = await loadEngagementWorkspacePage(slug);

  if (!result.ok) {
    if (result.reason === "not_found") {
      notFound();
    }

    const engagementsLabels = dictionary.engagements;

    if (result.reason === "forbidden") {
      return (
        <EngagementWorkspaceError
          title={engagementsLabels.forbiddenTitle}
          description={engagementsLabels.forbiddenDescription}
        />
      );
    }

    if (result.reason === "no_workspace") {
      return (
        <EngagementWorkspaceError
          title={engagementsLabels.noWorkspaceTitle}
          description={engagementsLabels.noWorkspaceDescription}
        />
      );
    }

    return (
      <EngagementWorkspaceError
        title={labels.errorTitle}
        description={labels.errorDescription}
      />
    );
  }

  const { engagement } = result;

  return (
    <EngagementWorkspaceLayout
      locale={locale}
      engagement={engagement}
      heroLabels={buildWorkspaceHeroLabels(labels, dictionary.engagements)}
      navItems={buildEngagementWorkspaceNavItems(locale, engagement.slug, labels)}
      navAriaLabel={labels.navAriaLabel}
    >
      {children}
    </EngagementWorkspaceLayout>
  );
}
