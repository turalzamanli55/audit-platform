"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";
import { workspaceTokens } from "./workspace-tokens";
import { AiSectionToolbar } from "@/components/ai-inline/actions/ai-section-toolbar";

type WorkspaceSectionShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  headingId?: string;
  className?: string;
  action?: ReactNode;
  /** When true, shows Ask / Explain / Analyze inline AI toolbar. */
  aiToolbar?: boolean;
};

export function WorkspaceSectionShell({
  title,
  description,
  children,
  headingId,
  className,
  action,
  aiToolbar = true,
}: WorkspaceSectionShellProps) {
  return (
    <section aria-labelledby={headingId} className={cn(workspaceTokens.sectionGap, className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 id={headingId} className={workspaceTokens.sectionTitle}>
            {title}
          </h2>
          {description ? (
            <p className={workspaceTokens.sectionDescription}>{description}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {aiToolbar ? <AiSectionToolbar /> : null}
          {action}
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
}
