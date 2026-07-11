import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import {
  UaieIntelligenceError,
  UaieIntelligenceShell,
} from "@/components/uaie/intelligence/uaie-intelligence-shell";
import { getDictionary, type Locale } from "@/i18n";
import {
  buildUaieIntelligenceNavGroups,
  buildUaieIntelligenceNavItems,
} from "@/lib/uaie/intelligence/intelligence-workspace-display";
import { loadUaieIntelligenceCenterCached } from "@/lib/uaie/intelligence/load-intelligence-center";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function ImportIntelligenceLayout({ children, params }: Props) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.uaie.intelligence;
  const result = await loadUaieIntelligenceCenterCached();

  if (!result.ok) {
    if (result.reason === "unauthenticated") redirect(`/${locale}/login`);
    if (result.reason === "forbidden") {
      return (
        <UaieIntelligenceError
          title={dictionary.uaie.forbiddenTitle}
          description={dictionary.uaie.forbiddenDescription}
        />
      );
    }
    if (result.reason === "no_workspace") {
      return (
        <UaieIntelligenceError
          title={dictionary.uaie.noWorkspaceTitle}
          description={dictionary.uaie.noWorkspaceDescription}
        />
      );
    }
    return (
      <UaieIntelligenceError
        title={dictionary.uaie.errorTitle}
        description={dictionary.uaie.errorDescription}
      />
    );
  }

  return (
    <UaieIntelligenceShell
      locale={locale}
      navItems={buildUaieIntelligenceNavItems(locale, labels.workspace)}
      navGroups={buildUaieIntelligenceNavGroups(locale, labels.workspace)}
      navAriaLabel={labels.workspace.navAriaLabel}
      labels={{
        heroEyebrow: labels.workspace.heroEyebrow,
        title: labels.workspace.title,
        description: labels.workspace.description,
        backToDashboard: labels.workspace.backToDashboard,
      }}
      pendingApprovals={result.analytics.pendingApprovals}
    >
      {children}
    </UaieIntelligenceShell>
  );
}
