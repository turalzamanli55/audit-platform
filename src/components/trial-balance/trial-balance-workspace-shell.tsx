"use client";

import type { ReactNode } from "react";
import {
  WorkspaceBackLink,
  WorkspaceChrome,
  WorkspaceHero,
  WorkspaceStatusBadge,
} from "@/components/workspace";
import type {
  TrialBalanceNavGroup,
  TrialBalanceNavItem,
} from "@/lib/trial-balance/trial-balance-workspace-display";

export function TrialBalanceWorkspaceShell(props: {
  locale: string;
  engagementSlug: string;
  navItems: TrialBalanceNavItem[];
  navGroups: TrialBalanceNavGroup[];
  navAriaLabel: string;
  labels: {
    heroEyebrow: string;
    title: string;
    description: string;
    backToEngagement: string;
  };
  statusLabel?: string | null;
  isBalanced?: boolean | null;
  children: ReactNode;
}) {
  return (
    <WorkspaceChrome
      overviewId="overview"
      navItems={props.navItems}
      navGroups={props.navGroups}
      navAriaLabel={props.navAriaLabel}
      hero={
        <WorkspaceHero
          eyebrow={props.labels.heroEyebrow}
          title={props.labels.title}
          description={props.labels.description}
          badges={
            <>
              {props.statusLabel ? (
                <WorkspaceStatusBadge label={props.statusLabel} variant="outline" />
              ) : null}
              {props.isBalanced != null ? (
                <WorkspaceStatusBadge
                  label={props.isBalanced ? "Balanced" : "Out of balance"}
                  variant={props.isBalanced ? "success" : "warning"}
                />
              ) : null}
            </>
          }
          action={
            <WorkspaceBackLink
              href={`/${props.locale}/app/engagements/${props.engagementSlug}`}
              label={props.labels.backToEngagement}
            />
          }
        />
      }
    >
      {props.children}
    </WorkspaceChrome>
  );
}

export function TrialBalanceWorkspaceError(props: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{props.title}</h1>
      <p className="text-sm text-muted-foreground">{props.description}</p>
      {props.action}
    </div>
  );
}
