import type { HTMLAttributes, ReactNode } from "react";

type CompanySectionProps = HTMLAttributes<HTMLElement> & {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  headingId?: string;
};

/**
 * Grouped content region with optional heading and action slot.
 */
export function CompanySection({
  title,
  description,
  action,
  children,
  headingId,
  className = "",
  ...props
}: CompanySectionProps) {
  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className={`space-y-5 ${className}`}
      {...props}
    >
      {title ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h2
              id={headingId}
              className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
            >
              {title}
            </h2>
            {description ? (
              <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
        </div>
      ) : null}
      <div>{children}</div>
    </section>
  );
}
