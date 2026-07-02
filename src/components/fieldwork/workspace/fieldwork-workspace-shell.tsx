"use client";

import type { ReactNode } from "react";
import { FieldworkWorkspaceChrome } from "./fieldwork-workspace-chrome";
import { FieldworkWorkspaceProvider } from "@/lib/fieldwork/use-fieldwork-workspace";
import type { FieldworkWorkspaceView } from "@/lib/fieldwork/fieldwork-workspace-view";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { FieldworkWorkspaceNavItem } from "./fieldwork-workspace-sidebar";

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
      <FieldworkWorkspaceChrome
        locale={locale}
        engagementSlug={engagementSlug}
        engagementName={engagementName}
        navItems={navItems}
        navAriaLabel={navAriaLabel}
        labels={labels}
        fieldworkLabels={fieldworkLabels}
        engagementsLabels={engagementsLabels}
      >
        {children}
      </FieldworkWorkspaceChrome>
    </FieldworkWorkspaceProvider>
  );
}
