import type { HTMLAttributes, ReactNode } from "react";

type CompanyPageShellProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  /** Associates the shell with a page heading for screen readers */
  labelledBy?: string;
};

/**
 * Top-level layout container for company module views.
 * Establishes vertical rhythm and max readable width.
 */
export function CompanyPageShell({
  children,
  className = "",
  labelledBy,
  ...props
}: CompanyPageShellProps) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={`mx-auto w-full max-w-6xl space-y-8 py-1 sm:space-y-10 lg:space-y-12 ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
