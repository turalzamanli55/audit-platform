"use client";

import type { ReactNode } from "react";
import { PlanningWorkspaceHero } from "./planning-workspace-hero";
import { PlanningWorkspaceSidebar, type PlanningWorkspaceNavGroup, type PlanningWorkspaceNavItem } from "./planning-workspace-sidebar";
import {
  PlanningWorkspaceProvider,
  usePlanningWorkspace,
} from "@/lib/planning/use-planning-workspace";
import type { PlanningWorkspaceView } from "@/lib/planning/planning-workspace-view";
import type { Dictionary } from "@/i18n/get-dictionary";

type PlanningWorkspaceShellProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  initialPlan: PlanningWorkspaceView | null;
  engagementId: string;
  navItems: PlanningWorkspaceNavItem[];
  navGroups: PlanningWorkspaceNavGroup[];
  navAriaLabel: string;
  labels: Dictionary["planning"]["workspace"];
  planningLabels: Dictionary["planning"];
  engagementsLabels: Dictionary["engagements"];
  children: ReactNode;
};

function PlanningWorkspaceShellContent({
  locale,
  engagementSlug,
  engagementName,
  navItems,
  navGroups,
  navAriaLabel,
  labels,
  planningLabels,
  engagementsLabels,
  children,
}: Omit<PlanningWorkspaceShellProps, "initialPlan" | "engagementId">) {
  const { plan } = usePlanningWorkspace();

  return (
    <div className="space-y-8">
      <PlanningWorkspaceHero
        locale={locale}
        engagementSlug={engagementSlug}
        engagementName={engagementName}
        plan={plan}
        labels={labels}
        engagementsLabels={engagementsLabels}
        planningLabels={planningLabels}
      />

      <div className="grid gap-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <PlanningWorkspaceSidebar
            items={navItems}
            groups={navGroups}
            ariaLabel={navAriaLabel}
            isArchived={plan?.isArchived}
          />
        </aside>
        <main className="min-w-0 space-y-10">{children}</main>
      </div>
    </div>
  );
}

export function PlanningWorkspaceShell({
  locale,
  engagementSlug,
  engagementName,
  initialPlan,
  engagementId,
  navItems,
  navGroups,
  navAriaLabel,
  labels,
  planningLabels,
  engagementsLabels,
  children,
}: PlanningWorkspaceShellProps) {
  return (
    <PlanningWorkspaceProvider initialPlan={initialPlan} engagementId={engagementId}>
      <PlanningWorkspaceShellContent
        locale={locale}
        engagementSlug={engagementSlug}
        engagementName={engagementName}
        navItems={navItems}
        navGroups={navGroups}
        navAriaLabel={navAriaLabel}
        labels={labels}
        planningLabels={planningLabels}
        engagementsLabels={engagementsLabels}
      >
        {children}
      </PlanningWorkspaceShellContent>
    </PlanningWorkspaceProvider>
  );
}
