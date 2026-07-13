import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import {
  FsMappingWorkspaceError,
  FsMappingWorkspaceShell,
} from "@/components/fs-mapping";
import type { Locale } from "@/i18n";
import {
  buildFsMappingNavGroups,
  buildFsMappingNavItems,
  type FsMappingWorkspaceLabels,
} from "@/lib/fs-mapping/display";
import { loadFsMappingWorkspaceCached } from "@/lib/fs-mapping/load-fs-mapping-workspace";

const LABELS: FsMappingWorkspaceLabels = {
  navAriaLabel: "Financial statement mapping navigation",
  navOverview: "Overview",
  navExplorer: "Mapping Explorer",
  navHierarchy: "Hierarchy",
  navStatementTree: "Statement Tree",
  navValidation: "Validation",
  navVersions: "Versions",
  navHistory: "History",
  navSearch: "Search",
  navGroups: {
    overview: "Overview",
    structure: "Structure",
    controls: "Controls",
    governance: "Governance",
  },
  heroEyebrow: "Financial Statement Mapping",
  title: "FS Mapping Engine",
  description:
    "Classify accounts, apply mapping rules, aggregate lines, and validate the statement structure — without generating reports.",
  backToEngagement: "Back to engagement",
};

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string; slug: string }>;
};

export default async function FsMappingLayout({ children, params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const result = await loadFsMappingWorkspaceCached(slug);

  if (!result.ok) {
    if (result.reason === "unauthenticated") redirect(`/${locale}/login`);
    if (result.reason === "not_found") notFound();
    if (result.reason === "forbidden") {
      return (
        <FsMappingWorkspaceError
          title="Access denied"
          description="You do not have permission to view financial statement mapping."
        />
      );
    }
    if (result.reason === "no_workspace") {
      return (
        <FsMappingWorkspaceError
          title="Workspace required"
          description="Select a workspace before opening the mapping engine."
        />
      );
    }
    return (
      <FsMappingWorkspaceError
        title="Unable to load mapping"
        description="The mapping workspace could not be loaded."
      />
    );
  }

  return (
    <FsMappingWorkspaceShell
      locale={locale}
      engagementSlug={slug}
      navItems={buildFsMappingNavItems(locale, slug, LABELS)}
      navGroups={buildFsMappingNavGroups(locale, slug, LABELS)}
      navAriaLabel={LABELS.navAriaLabel}
      labels={LABELS}
      mappingSet={result.mappingSet}
      metrics={result.metrics}
    >
      {children}
    </FsMappingWorkspaceShell>
  );
}
