"use client";

import type { ReactNode } from "react";
import { PlanningWorkspaceSidebar, type PlanningWorkspaceNavItem } from "./planning-workspace-sidebar";
import {
  PlanningWorkspaceProvider,
  usePlanningWorkspace,
} from "@/lib/planning/use-planning-workspace";
import type { PlanningWorkspaceView } from "@/lib/planning/planning-workspace-view";
import { Alert } from "@/components/ui";
import type { Dictionary } from "@/i18n/get-dictionary";

type PlanningWorkspaceShellProps = {
  initialPlan: PlanningWorkspaceView | null;
  engagementId: string;
  navItems: PlanningWorkspaceNavItem[];
  navAriaLabel: string;
  labels: Dictionary["planning"]["workspace"];
  children: ReactNode;
};

function PlanningWorkspaceShellContent({
  navItems,
  navAriaLabel,
  labels,
  children,
}: Omit<PlanningWorkspaceShellProps, "initialPlan" | "engagementId">) {
  const { plan } = usePlanningWorkspace();

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {labels.heroEyebrow}
        </p>
        {plan?.isArchived ? (
          <Alert variant="warning" title={labels.archivedTitle}>
            {labels.archivedDescription}
          </Alert>
        ) : null}
      </div>

      <div className="grid gap-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <PlanningWorkspaceSidebar
            items={navItems}
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
  initialPlan,
  engagementId,
  navItems,
  navAriaLabel,
  labels,
  children,
}: PlanningWorkspaceShellProps) {
  return (
    <PlanningWorkspaceProvider initialPlan={initialPlan} engagementId={engagementId}>
      <PlanningWorkspaceShellContent
        navItems={navItems}
        navAriaLabel={navAriaLabel}
        labels={labels}
      >
        {children}
      </PlanningWorkspaceShellContent>
    </PlanningWorkspaceProvider>
  );
}
