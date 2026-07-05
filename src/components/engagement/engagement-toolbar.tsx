"use client";

import type { ReactNode } from "react";

type EngagementToolbarProps = {
  ariaLabel: string;
  search?: ReactNode;
  filters?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function EngagementToolbar({
  ariaLabel,
  search,
  filters,
  actions,
  className = "",
}: EngagementToolbarProps) {
  if (!search && !filters && !actions) {
    return null;
  }

  return (
    <div
      className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ${className}`}
      role="region"
      aria-label={ariaLabel}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {search ? <div className="w-full sm:w-auto sm:min-w-[12rem] sm:flex-1">{search}</div> : null}
        {filters ? <div className="min-w-0 flex-1">{filters}</div> : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">{actions}</div>
      ) : null}
    </div>
  );
}
