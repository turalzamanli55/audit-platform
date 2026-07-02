"use client";

import type { ReactNode } from "react";
import { FieldworkWorkspaceHero } from "./fieldwork-workspace-hero";
import { FieldworkWorkspaceSidebar, type FieldworkWorkspaceNavItem } from "./fieldwork-workspace-sidebar";
import {
  FieldworkWorkspaceProvider,
} from "@/lib/fieldwork/use-fieldwork-workspace";
import type { FieldworkWorkspaceView } from "@/lib/fieldwork/fieldwork-workspace-view";
import type { Dictionary } from "@/i18n/get-dictionary";

type FieldworkWorkspaceShellProps = {
  locale: string;
  engagementSlug: string;
  engagementName: string;
  initialFieldwork: FieldworkWorkspaceView | null;
  planningApproved: boolean;
  engagementId: string;
  navItems: FieldworkWorkspaceNavItem[];
  navAriaLabel: string;
  labels: Dictionary["fieldwork"]["workspace"];
  fieldworkLabels: Dictionary["fieldwork"];
  engagementsLabels: Dictionary["engagements"];
  children: ReactNode;
};

export function FieldworkWorkspaceShell({
  locale,
  engagementSlug,
  engagementName,
  initialFieldwork,
  planningApproved,
  engagementId,
  navItems,
  navAriaLabel,
  labels,
  fieldworkLabels,
  engagementsLabels,
  children,
}: FieldworkWorkspaceShellProps) {
  return (
    <FieldworkWorkspaceProvider
      initialFieldwork={initialFieldwork}
      engagementId={engagementId}
      planningApproved={planningApproved}
    >
      <div className="space-y-8">
        <FieldworkWorkspaceHero
          locale={locale}
          engagementSlug={engagementSlug}
          engagementName={engagementName}
          fieldwork={initialFieldwork}
          planningApproved={planningApproved}
          labels={labels}
          engagementsLabels={engagementsLabels}
          fieldworkLabels={fieldworkLabels}
        />

        <div className="grid gap-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[13rem_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <FieldworkWorkspaceSidebar
              items={navItems}
              ariaLabel={navAriaLabel}
              isArchived={initialFieldwork?.isArchived}
            />
          </aside>
          <main className="min-w-0 space-y-10">{children}</main>
        </div>
      </div>
    </FieldworkWorkspaceProvider>
  );
}
