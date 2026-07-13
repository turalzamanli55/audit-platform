"use client";

import type { ReactNode } from "react";
import {
  WorkspaceBackLink,
  WorkspaceChrome,
  WorkspaceHero,
  WorkspaceStatusBadge,
} from "@/components/workspace";
import type { FsRenderingNavGroup, FsRenderingNavItem } from "@/lib/fs-rendering/display";
import { FsRenderingWorkspaceProvider } from "@/lib/fs-rendering/provider";
import type { FsRenderDashboardMetrics, FsRenderPresentation } from "@/types/fs-rendering";

export function FsRenderingWorkspaceShell(props: {
  locale: string;
  engagementSlug: string;
  navItems: FsRenderingNavItem[];
  navGroups: FsRenderingNavGroup[];
  navAriaLabel: string;
  labels: {
    heroEyebrow: string;
    title: string;
    description: string;
    backToEngagement: string;
  };
  presentation: FsRenderPresentation | null;
  metrics: FsRenderDashboardMetrics | null;
  children: ReactNode;
}) {
  return (
    <FsRenderingWorkspaceProvider
      value={{
        presentation: props.presentation,
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
                {props.presentation ? (
                  <WorkspaceStatusBadge
                    label={props.presentation.presentationStatus.replaceAll("_", " ")}
                    variant="outline"
                  />
                ) : null}
                {props.metrics ? (
                  <WorkspaceStatusBadge
                    label={`Coverage ${props.metrics.presentationCoveragePct.toFixed(0)}%`}
                    variant={props.metrics.presentationCoveragePct >= 80 ? "success" : "warning"}
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
    </FsRenderingWorkspaceProvider>
  );
}

export function FsRenderingWorkspaceError(props: {
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
