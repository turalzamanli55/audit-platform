"use client";

import type { ReactNode } from "react";
import { MaterialityWorkspaceChrome } from "./materiality-workspace-chrome";
import type { MaterialityWorkspaceView } from "@/lib/materiality/materiality-workspace-view";
import { MaterialityWorkspaceProvider } from "@/lib/materiality/use-materiality-workspace";
import type { MaterialityWorkspaceNavGroup, MaterialityWorkspaceNavItem } from "./materiality-workspace-sidebar";

type MaterialityWorkspaceShellProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  initialMateriality: MaterialityWorkspaceView | null;
  planningApproved: boolean;
  engagementId: string;
  navItems: MaterialityWorkspaceNavItem[];
  navGroups: MaterialityWorkspaceNavGroup[];
  navAriaLabel: string;
  labels: {
    breadcrumbMateriality: string;
    heroEyebrow: string;
    summaryProgress: string;
    summaryVersion: string;
    summaryOverall: string;
    backToEngagement: string;
    planningGateTitle: string;
    planningGateDescription: string;
    archivedTitle: string;
    archivedDescription: string;
    progress: string;
  };
  materialityLabels?: unknown;
  statusLabels: Record<string, string>;
  engagementsLabels: { breadcrumbRoot: string };
  children: ReactNode;
};

export function MaterialityWorkspaceShell({
  locale,
  engagementSlug,
  engagementName,
  initialMateriality,
  planningApproved,
  engagementId,
  navItems,
  navGroups,
  navAriaLabel,
  labels,
  statusLabels,
  engagementsLabels,
  children,
}: MaterialityWorkspaceShellProps) {
  return (
    <MaterialityWorkspaceProvider
      initialMateriality={initialMateriality}
      engagementId={engagementId}
      planningApproved={planningApproved}
    >
      <MaterialityWorkspaceChrome
        locale={locale}
        engagementSlug={engagementSlug}
        engagementName={engagementName}
        navItems={navItems}
        navGroups={navGroups}
        navAriaLabel={navAriaLabel}
        labels={labels}
        statusLabels={statusLabels}
        engagementsLabels={engagementsLabels}
      >
        {children}
      </MaterialityWorkspaceChrome>
    </MaterialityWorkspaceProvider>
  );
}
