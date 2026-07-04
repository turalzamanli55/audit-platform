"use client";

import type { ReactNode } from "react";
import { FieldworkWorkspaceHero } from "./fieldwork-workspace-hero";
import { FieldworkWorkspaceSidebar, type FieldworkWorkspaceNavGroup, type FieldworkWorkspaceNavItem } from "./fieldwork-workspace-sidebar";
import { useFieldworkWorkspace } from "@/lib/fieldwork/use-fieldwork-workspace";
import type { Dictionary } from "@/i18n/get-dictionary";

type FieldworkWorkspaceChromeProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  navItems: FieldworkWorkspaceNavItem[];
  navGroups?: FieldworkWorkspaceNavGroup[];
  navAriaLabel: string;
  labels: Dictionary["fieldwork"]["workspace"];
  fieldworkLabels: Dictionary["fieldwork"];
  engagementsLabels: Dictionary["engagements"];
  children: ReactNode;
};

export function FieldworkWorkspaceChrome({
  locale,
  engagementSlug,
  engagementName,
  navItems,
  navGroups,
  navAriaLabel,
  labels,
  fieldworkLabels,
  engagementsLabels,
  children,
}: FieldworkWorkspaceChromeProps) {
  const { fieldwork, planningApproved } = useFieldworkWorkspace();

  return (
    <div className="space-y-8">
      <FieldworkWorkspaceHero
        locale={locale}
        engagementSlug={engagementSlug}
        engagementName={engagementName}
        fieldwork={fieldwork}
        planningApproved={planningApproved}
        labels={labels}
        engagementsLabels={engagementsLabels}
        fieldworkLabels={fieldworkLabels}
      />

      <div className="grid gap-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <FieldworkWorkspaceSidebar
            items={navItems}
            groups={navGroups}
            ariaLabel={navAriaLabel}
            isArchived={fieldwork?.isArchived}
          />
        </aside>
        <main className="min-w-0 space-y-10">{children}</main>
      </div>
    </div>
  );
}
