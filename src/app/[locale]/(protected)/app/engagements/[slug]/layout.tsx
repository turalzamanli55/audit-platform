import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { EngagementWorkspaceError } from "@/components/engagement/workspace";
import { EngagementWorkspaceShell } from "@/components/engagement/workspace/engagement-workspace-shell";
import { getDictionary, type Locale } from "@/i18n";
import { readEngagementSlugCookie } from "@/lib/auth/tenant-cookies";
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
  const [result, preferredEngagementSlug] = await Promise.all([
    loadEngagementWorkspacePage(slug),
    readEngagementSlugCookie(),
  ]);

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
    <EngagementWorkspaceShell
      locale={locale}
      initialEngagement={engagement}
      preferredEngagementSlug={preferredEngagementSlug}
      heroLabels={buildWorkspaceHeroLabels(labels, dictionary.engagements)}
      engagementsLabels={dictionary.engagements}
      navItems={buildEngagementWorkspaceNavItems(locale, engagement.slug, labels)}
      navAriaLabel={labels.navAriaLabel}
    >
      {children}
    </EngagementWorkspaceShell>
  );
}
