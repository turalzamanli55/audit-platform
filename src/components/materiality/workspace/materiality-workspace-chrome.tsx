"use client";

import type { ReactNode } from "react";
import { MaterialityWorkspaceHero } from "./materiality-workspace-hero";
import {
  MaterialityWorkspaceSidebar,
  type MaterialityWorkspaceNavItem,
} from "./materiality-workspace-sidebar";
import { useMaterialityWorkspace } from "@/lib/materiality/use-materiality-workspace";

type MaterialityWorkspaceChromeProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  navItems: MaterialityWorkspaceNavItem[];
  navAriaLabel: string;
  labels: {
    breadcrumbMateriality: string;
    heroEyebrow: string;
    summaryProgress: string;
    backToEngagement: string;
    planningGateTitle: string;
    planningGateDescription: string;
    archivedTitle: string;
    archivedDescription: string;
  };
  statusLabels: Record<string, string>;
  engagementsLabels: { breadcrumbRoot: string };
  children: ReactNode;
};

export function MaterialityWorkspaceChrome({
  locale,
  engagementSlug,
  engagementName,
  navItems,
  navAriaLabel,
  labels,
  statusLabels,
  engagementsLabels,
  children,
}: MaterialityWorkspaceChromeProps) {
  const { materiality, planningApproved } = useMaterialityWorkspace();

  return (
    <div className="space-y-8">
      <MaterialityWorkspaceHero
        locale={locale}
        engagementSlug={engagementSlug}
        engagementName={engagementName}
        materiality={materiality}
        planningApproved={planningApproved}
        labels={labels}
        statusLabels={statusLabels}
        engagementsLabels={engagementsLabels}
      />

      <div className="grid gap-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <MaterialityWorkspaceSidebar
            items={navItems}
            ariaLabel={navAriaLabel}
            isArchived={materiality?.isArchived}
          />
        </aside>
        <main className="min-w-0 space-y-10">{children}</main>
      </div>
    </div>
  );
}
