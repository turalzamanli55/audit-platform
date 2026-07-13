import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import {
  FsRenderingWorkspaceError,
  FsRenderingWorkspaceShell,
} from "@/components/fs-rendering";
import type { Locale } from "@/i18n";
import {
  buildFsRenderingNavGroups,
  buildFsRenderingNavItems,
  type FsRenderingWorkspaceLabels,
} from "@/lib/fs-rendering/display";
import { loadFsRenderingWorkspaceCached } from "@/lib/fs-rendering/workspace";

const LABELS: FsRenderingWorkspaceLabels = {
  navAriaLabel: "Financial statement rendering navigation",
  navOverview: "Overview",
  navExplorer: "Statement Explorer",
  navPresentation: "Presentation",
  navLayout: "Layout",
  navValidation: "Validation",
  navVersions: "Versions",
  navHistory: "History",
  navSearch: "Search",
  navGroups: {
    overview: "Overview",
    render: "Rendering",
    controls: "Controls",
    governance: "Governance",
  },
  heroEyebrow: "Financial Statement Rendering",
  title: "FS Rendering Engine",
  description:
    "Render the normalized FSME dataset into enterprise financial statement presentations — UI only, no exports.",
  backToEngagement: "Back to engagement",
};

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string; slug: string }>;
};

export default async function FsRenderingLayout({ children, params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const result = await loadFsRenderingWorkspaceCached(slug);

  if (!result.ok) {
    if (result.reason === "unauthenticated") redirect(`/${locale}/login`);
    if (result.reason === "not_found") notFound();
    if (result.reason === "forbidden") {
      return (
        <FsRenderingWorkspaceError
          title="Access denied"
          description="You do not have permission to view financial statement rendering."
        />
      );
    }
    if (result.reason === "no_workspace") {
      return (
        <FsRenderingWorkspaceError
          title="Workspace required"
          description="Select a workspace before opening the rendering engine."
        />
      );
    }
    return (
      <FsRenderingWorkspaceError
        title="Unable to load rendering"
        description="The rendering workspace could not be loaded."
      />
    );
  }

  return (
    <FsRenderingWorkspaceShell
      locale={locale}
      engagementSlug={slug}
      navItems={buildFsRenderingNavItems(locale, slug, LABELS)}
      navGroups={buildFsRenderingNavGroups(locale, slug, LABELS)}
      navAriaLabel={LABELS.navAriaLabel}
      labels={LABELS}
      presentation={result.presentation}
      metrics={result.metrics}
    >
      {children}
    </FsRenderingWorkspaceShell>
  );
}
