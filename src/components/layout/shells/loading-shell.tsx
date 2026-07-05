"use client";

import type { ReactNode } from "react";
import { Spinner } from "@/components/ui";
import { WorkspaceInlineLoading } from "@/components/workspace";
import { useCommonLabels } from "@/i18n/use-common-labels";

type ShellProps = {
  children?: ReactNode;
  title?: string;
  description?: string;
};

export function LoadingShell({ title, description }: ShellProps) {
  const { loading } = useCommonLabels();

  return (
    <div
      className="flex min-h-[16rem] flex-col items-center justify-center gap-5 p-10"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={title ?? loading}
    >
      <Spinner size="lg" />
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium text-foreground">{title ?? loading}</p>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <div className="w-full max-w-md" aria-hidden="true">
        <WorkspaceInlineLoading />
      </div>
    </div>
  );
}
