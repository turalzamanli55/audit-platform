import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import {
  IfrsNotesWorkspaceError,
  IfrsNotesWorkspaceShell,
} from "@/components/ifrs-notes";
import type { Locale } from "@/i18n";
import {
  buildIfrsNotesNavGroups,
  buildIfrsNotesNavItems,
  type IfrsNotesWorkspaceLabels,
} from "@/lib/ifrs-notes/display";
import { loadIfrsNotesWorkspaceCached } from "@/lib/ifrs-notes/workspace";

const LABELS: IfrsNotesWorkspaceLabels = {
  navAriaLabel: "IFRS Notes navigation",
  navOverview: "Overview",
  navExplorer: "Notes Explorer",
  navDisclosures: "Disclosure Center",
  navCrossReferences: "Cross References",
  navValidation: "Validation",
  navVersions: "Versions",
  navHistory: "History",
  navSearch: "Search",
  navGroups: {
    overview: "Overview",
    notes: "Notes",
    controls: "Controls",
    governance: "Governance",
  },
  heroEyebrow: "Enterprise IFRS Notes",
  title: "IFRS Notes Engine",
  description:
    "Structured, editable, versioned IFRS notes from the normalized financial statement dataset — no PDF, Word, or AI.",
  backToEngagement: "Back to engagement",
};

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string; slug: string }>;
};

export default async function IfrsNotesLayout({ children, params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const result = await loadIfrsNotesWorkspaceCached(slug);

  if (!result.ok) {
    if (result.reason === "unauthenticated") redirect(`/${locale}/login`);
    if (result.reason === "not_found") notFound();
    if (result.reason === "forbidden") {
      return (
        <IfrsNotesWorkspaceError
          title="Access denied"
          description="You do not have permission to view IFRS notes."
        />
      );
    }
    if (result.reason === "no_workspace") {
      return (
        <IfrsNotesWorkspaceError
          title="Workspace required"
          description="Select a workspace before opening the IFRS Notes engine."
        />
      );
    }
    return (
      <IfrsNotesWorkspaceError
        title="Unable to load IFRS notes"
        description="The IFRS Notes workspace could not be loaded."
      />
    );
  }

  return (
    <IfrsNotesWorkspaceShell
      locale={locale}
      engagementSlug={slug}
      navItems={buildIfrsNotesNavItems(locale, slug, LABELS)}
      navGroups={buildIfrsNotesNavGroups(locale, slug, LABELS)}
      navAriaLabel={LABELS.navAriaLabel}
      labels={LABELS}
      notePackage={result.notePackage}
      metrics={result.metrics}
    >
      {children}
    </IfrsNotesWorkspaceShell>
  );
}
