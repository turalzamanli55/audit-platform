import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import {
  TrialBalanceWorkspaceError,
  TrialBalanceWorkspaceShell,
} from "@/components/trial-balance";
import { getDictionary, type Locale } from "@/i18n";
import {
  buildTrialBalanceNavGroups,
  buildTrialBalanceNavItems,
} from "@/lib/trial-balance/trial-balance-workspace-display";
import { loadTrialBalanceWorkspaceCached } from "@/lib/trial-balance/load-trial-balance-workspace";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string; slug: string }>;
};

export default async function TrialBalanceLayout({ children, params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.trialBalance;
  const result = await loadTrialBalanceWorkspaceCached(slug);

  if (!result.ok) {
    if (result.reason === "unauthenticated") redirect(`/${locale}/login`);
    if (result.reason === "not_found") notFound();
    if (result.reason === "forbidden") {
      return (
        <TrialBalanceWorkspaceError
          title={labels.forbiddenTitle}
          description={labels.forbiddenDescription}
        />
      );
    }
    if (result.reason === "no_workspace") {
      return (
        <TrialBalanceWorkspaceError
          title={labels.noWorkspaceTitle}
          description={labels.noWorkspaceDescription}
        />
      );
    }
    return (
      <TrialBalanceWorkspaceError
        title={labels.errorTitle}
        description={labels.errorDescription}
      />
    );
  }

  return (
    <TrialBalanceWorkspaceShell
      locale={locale}
      engagementSlug={slug}
      navItems={buildTrialBalanceNavItems(locale, slug, labels.workspace)}
      navGroups={buildTrialBalanceNavGroups(locale, slug, labels.workspace)}
      navAriaLabel={labels.workspace.navAriaLabel}
      labels={{
        heroEyebrow: labels.workspace.heroEyebrow,
        title: labels.workspace.title,
        description: labels.workspace.description,
        backToEngagement: labels.workspace.backToEngagement,
      }}
      statusLabel={
        result.package
          ? labels.ui.statuses[result.package.package_status] ?? result.package.package_status
          : null
      }
      isBalanced={result.package?.is_balanced ?? null}
    >
      {children}
    </TrialBalanceWorkspaceShell>
  );
}
