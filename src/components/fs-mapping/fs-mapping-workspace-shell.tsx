"use client";

import type { ReactNode } from "react";
import {
  WorkspaceBackLink,
  WorkspaceChrome,
  WorkspaceHero,
  WorkspaceStatusBadge,
} from "@/components/workspace";
import type { FsMappingNavGroup, FsMappingNavItem } from "@/lib/fs-mapping/display";
import { FsMappingWorkspaceProvider } from "@/lib/fs-mapping/provider";
import type { FsMappingDashboardMetrics, FsMappingSet } from "@/types/fs-mapping";

export function FsMappingWorkspaceShell(props: {
  locale: string;
  engagementSlug: string;
  navItems: FsMappingNavItem[];
  navGroups: FsMappingNavGroup[];
  navAriaLabel: string;
  labels: {
    heroEyebrow: string;
    title: string;
    description: string;
    backToEngagement: string;
  };
  mappingSet: FsMappingSet | null;
  metrics: FsMappingDashboardMetrics | null;
  children: ReactNode;
}) {
  return (
    <FsMappingWorkspaceProvider
      value={{
        mappingSet: props.mappingSet,
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
                {props.mappingSet ? (
                  <WorkspaceStatusBadge
                    label={props.mappingSet.setStatus.replaceAll("_", " ")}
                    variant="outline"
                  />
                ) : null}
                {props.metrics ? (
                  <WorkspaceStatusBadge
                    label={`Coverage ${props.metrics.coveragePct.toFixed(0)}%`}
                    variant={props.metrics.coveragePct >= 90 ? "success" : "warning"}
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
    </FsMappingWorkspaceProvider>
  );
}

export function FsMappingWorkspaceError(props: {
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
