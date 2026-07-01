import type { HTMLAttributes, ReactNode } from "react";

type EngagementPageShellProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  labelledBy?: string;
};

export function EngagementPageShell({
  children,
  className = "",
  labelledBy,
  ...props
}: EngagementPageShellProps) {
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
