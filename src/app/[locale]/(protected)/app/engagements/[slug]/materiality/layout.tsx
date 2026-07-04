import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { MaterialityWorkspaceError, MaterialityWorkspaceShell } from "@/components/materiality";
import { getDictionary, type Locale } from "@/i18n";
import { loadEngagementWorkspacePage } from "@/lib/engagement/engagement-workspace-page";
import { buildMaterialityWorkspaceNavGroups, buildMaterialityWorkspaceNavItems } from "@/lib/materiality/materiality-workspace-display";
import { loadMaterialityWorkspacePage } from "@/lib/materiality/materiality-workspace-page";

type Props = { children: ReactNode; params: Promise<{ locale: string; slug: string }> };

export default async function MaterialityLayout({ children, params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.materiality.workspace;
  const materialityLabels = dictionary.materiality;

  const [engagementResult, materialityResult] = await Promise.all([
    loadEngagementWorkspacePage(slug),
    loadMaterialityWorkspacePage(slug),
  ]);

  if (!engagementResult.ok) notFound();

  if (!materialityResult.ok) {
    if (materialityResult.reason === "not_found") notFound();
    if (materialityResult.reason === "forbidden") {
      return (
        <MaterialityWorkspaceError
          title={materialityLabels.forbiddenTitle}
          description={materialityLabels.forbiddenDescription}
        />
      );
    }
    if (materialityResult.reason === "no_workspace") {
      return (
        <MaterialityWorkspaceError
          title={materialityLabels.noWorkspaceTitle}
          description={materialityLabels.noWorkspaceDescription}
        />
      );
    }
    return (
      <MaterialityWorkspaceError
        title={labels.errorTitle}
        description={labels.errorDescription}
      />
    );
  }

  return (
    <MaterialityWorkspaceShell
      locale={locale}
      engagementSlug={slug}
      engagementName={engagementResult.engagement.name}
      initialMateriality={materialityResult.materiality}
      planningApproved={materialityResult.planningApproved}
      engagementId={engagementResult.engagement.id}
      navItems={buildMaterialityWorkspaceNavItems(locale, slug, labels)}
      navGroups={buildMaterialityWorkspaceNavGroups(locale, slug, labels)}
      navAriaLabel={labels.navAriaLabel}
      labels={labels}
      materialityLabels={materialityLabels}
      statusLabels={materialityLabels.statuses}
      engagementsLabels={dictionary.engagements}
    >
      {children}
    </MaterialityWorkspaceShell>
  );
}
