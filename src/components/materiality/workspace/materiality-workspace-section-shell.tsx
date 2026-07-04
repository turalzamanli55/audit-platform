import type { ReactNode } from "react";

type MaterialityWorkspaceSectionShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  headingId?: string;
  className?: string;
};

export function MaterialityWorkspaceSectionShell({
  title,
  description,
  children,
  headingId,
  className = "",
}: MaterialityWorkspaceSectionShellProps) {
  return (
    <section aria-labelledby={headingId} className={`space-y-5 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 id={headingId} className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {title}
          </h2>
          {description ? <p className="max-w-2xl text-sm text-muted-foreground">{description}</p> : null}
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
}
