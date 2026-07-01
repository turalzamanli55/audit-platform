import type { ReactNode } from "react";

type CompanyHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  id?: string;
  className?: string;
};

/**
 * Page header for company views — title hierarchy, optional actions.
 */
export function CompanyHeader({
  title,
  description,
  eyebrow,
  meta,
  actions,
  id,
  className = "",
}: CompanyHeaderProps) {
  return (
    <header
      className={`flex flex-col gap-6 border-b border-border/50 pb-8 lg:flex-row lg:items-end lg:justify-between ${className}`}
    >
      <div className="min-w-0 flex-1 space-y-3">
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-2">
          <h1
            id={id}
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {meta ? <div className="flex flex-wrap items-center gap-3 pt-1">{meta}</div> : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">{actions}</div>
      ) : null}
    </header>
  );
}
