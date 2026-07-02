import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { PlanningWorkspaceError, PlanningWorkspaceShell } from "@/components/planning";
import { getDictionary, type Locale } from "@/i18n";
import { loadEngagementWorkspacePage } from "@/lib/engagement/engagement-workspace-page";
import { buildPlanningWorkspaceNavItems } from "@/lib/planning/planning-workspace-display";
import { loadPlanningWorkspacePage } from "@/lib/planning/planning-workspace-page";

type PlanningWorkspaceLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string; slug: string }>;
};

export default async function PlanningWorkspaceLayout({
  children,
  params,
}: PlanningWorkspaceLayoutProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.planning.workspace;
  const planningLabels = dictionary.planning;

  const [engagementResult, planningResult] = await Promise.all([
    loadEngagementWorkspacePage(slug),
    loadPlanningWorkspacePage(slug),
  ]);

  if (!engagementResult.ok) {
    notFound();
  }

  if (!planningResult.ok) {
    if (planningResult.reason === "not_found") {
      notFound();
    }

    if (planningResult.reason === "forbidden") {
      return (
        <PlanningWorkspaceError
          title={planningLabels.forbiddenTitle}
          description={planningLabels.forbiddenDescription}
        />
      );
    }

    if (planningResult.reason === "no_workspace") {
      return (
        <PlanningWorkspaceError
          title={planningLabels.noWorkspaceTitle}
          description={planningLabels.noWorkspaceDescription}
        />
      );
    }

    return (
      <PlanningWorkspaceError
        title={labels.errorTitle}
        description={labels.errorDescription}
      />
    );
  }

  return (
    <PlanningWorkspaceShell
      locale={locale}
      engagementSlug={slug}
      engagementName={engagementResult.engagement.name}
      initialPlan={planningResult.plan}
      engagementId={engagementResult.engagement.id}
      navItems={buildPlanningWorkspaceNavItems(locale, slug, labels)}
      navAriaLabel={labels.navAriaLabel}
      labels={labels}
      planningLabels={planningLabels}
      engagementsLabels={dictionary.engagements}
    >
      {children}
    </PlanningWorkspaceShell>
  );
}
