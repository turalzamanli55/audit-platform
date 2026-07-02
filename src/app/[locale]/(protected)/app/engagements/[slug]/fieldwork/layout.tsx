import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { FieldworkWorkspaceError, FieldworkWorkspaceShell } from "@/components/fieldwork";
import { getDictionary, type Locale } from "@/i18n";
import { loadEngagementWorkspacePage } from "@/lib/engagement/engagement-workspace-page";
import { buildFieldworkWorkspaceNavItems } from "@/lib/fieldwork/fieldwork-workspace-display";
import { loadFieldworkWorkspacePage } from "@/lib/fieldwork/fieldwork-workspace-page";

type Props = { children: ReactNode; params: Promise<{ locale: string; slug: string }> };

export default async function FieldworkLayout({ children, params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.fieldwork.workspace;
  const fieldworkLabels = dictionary.fieldwork;

  const [engagementResult, fieldworkResult] = await Promise.all([
    loadEngagementWorkspacePage(slug),
    loadFieldworkWorkspacePage(slug),
  ]);

  if (!engagementResult.ok) notFound();

  if (!fieldworkResult.ok) {
    if (fieldworkResult.reason === "not_found") notFound();
    if (fieldworkResult.reason === "forbidden") {
      return (
        <FieldworkWorkspaceError
          title={fieldworkLabels.forbiddenTitle}
          description={fieldworkLabels.forbiddenDescription}
        />
      );
    }
    if (fieldworkResult.reason === "no_workspace") {
      return (
        <FieldworkWorkspaceError
          title={fieldworkLabels.noWorkspaceTitle}
          description={fieldworkLabels.noWorkspaceDescription}
        />
      );
    }
    return (
      <FieldworkWorkspaceError
        title={labels.errorTitle}
        description={labels.errorDescription}
      />
    );
  }

  return (
    <FieldworkWorkspaceShell
      locale={locale}
      engagementSlug={slug}
      engagementName={engagementResult.engagement.name}
      initialFieldwork={fieldworkResult.fieldwork}
      planningApproved={fieldworkResult.planningApproved}
      engagementId={engagementResult.engagement.id}
      navItems={buildFieldworkWorkspaceNavItems(locale, slug, labels)}
      navAriaLabel={labels.navAriaLabel}
      labels={labels}
      fieldworkLabels={fieldworkLabels}
      engagementsLabels={dictionary.engagements}
    >
      {children}
    </FieldworkWorkspaceShell>
  );
}
