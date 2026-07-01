import type { ReactNode } from "react";

type CompanyActionBarProps = {
  primary?: ReactNode;
  secondary?: ReactNode;
  className?: string;
  sticky?: boolean;
};

/**
 * Primary/secondary action row for company views.
 */
export function CompanyActionBar({
  primary,
  secondary,
  className = "",
  sticky = false,
}: CompanyActionBarProps) {
  if (!primary && !secondary) {
    return null;
  }

  return (
    <div
      className={`flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between ${
        sticky
          ? "sticky bottom-0 z-10 -mx-4 border-t border-border/50 bg-background/90 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none"
          : ""
      } ${className}`}
      role="toolbar"
      aria-label="Company actions"
    >
      <div className="flex flex-wrap items-center gap-2">{secondary}</div>
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">{primary}</div>
    </div>
  );
}
