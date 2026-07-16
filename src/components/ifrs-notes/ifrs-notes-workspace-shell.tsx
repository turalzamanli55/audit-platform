"use client";

import type { ReactNode } from "react";
import {
  WorkspaceBackLink,
  WorkspaceChrome,
  WorkspaceHero,
  WorkspaceStatusBadge,
} from "@/components/workspace";
import type { IfrsNotesNavGroup, IfrsNotesNavItem } from "@/lib/ifrs-notes/display";
import { IfrsNotesWorkspaceProvider } from "@/lib/ifrs-notes/provider";
import type { IfrsNotePackage, IfrsNotesDashboardMetrics } from "@/types/ifrs-notes";

export function IfrsNotesWorkspaceShell(props: {
  locale: string;
  engagementSlug: string;
  navItems: IfrsNotesNavItem[];
  navGroups: IfrsNotesNavGroup[];
  navAriaLabel: string;
  labels: {
    heroEyebrow: string;
    title: string;
    description: string;
    backToEngagement: string;
  };
  notePackage: IfrsNotePackage | null;
  metrics: IfrsNotesDashboardMetrics | null;
  children: ReactNode;
}) {
  return (
    <IfrsNotesWorkspaceProvider
      value={{
        notePackage: props.notePackage,
        metrics: props.metrics,
        engagementSlug: props.engagementSlug,
        locale: props.locale,
      }}
    >
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
                {props.notePackage ? (
                  <WorkspaceStatusBadge
                    label={props.notePackage.packageStatus.replaceAll("_", " ")}
                    variant="outline"
                  />
                ) : null}
                {props.metrics ? (
                  <WorkspaceStatusBadge
                    label={`Coverage ${props.metrics.coveragePct.toFixed(0)}%`}
                    variant={props.metrics.coveragePct >= 80 ? "success" : "warning"}
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
    </IfrsNotesWorkspaceProvider>
  );
}

export function IfrsNotesWorkspaceError(props: {
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
