"use client";

import type { ReactNode } from "react";
import {
  WorkspaceChrome,
  WorkspaceHero,
  WorkspaceBackLink,
  WorkspaceStatusBadge,
} from "@/components/workspace";
import type {
  UaieIntelligenceNavGroup,
  UaieIntelligenceNavItem,
} from "@/lib/uaie/intelligence/intelligence-workspace-display";

export function UaieIntelligenceShell(props: {
  locale: string;
  navItems: UaieIntelligenceNavItem[];
  navGroups: UaieIntelligenceNavGroup[];
  navAriaLabel: string;
  labels: {
    heroEyebrow: string;
    title: string;
    description: string;
    backToDashboard: string;
  };
  pendingApprovals: number;
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
            props.pendingApprovals > 0 ? (
              <WorkspaceStatusBadge
                label={`${props.pendingApprovals} pending`}
                variant="warning"
              />
            ) : null
          }
          action={
            <WorkspaceBackLink
              href={`/${props.locale}/app/dashboard`}
              label={props.labels.backToDashboard}
            />
          }
        />
      }
    >
      {props.children}
    </WorkspaceChrome>
  );
}

export function UaieIntelligenceError(props: {
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
