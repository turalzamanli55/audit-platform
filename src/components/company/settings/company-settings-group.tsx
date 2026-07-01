import type { ReactNode } from "react";

type CompanySettingsGroupProps = {
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function CompanySettingsGroup({
  title,
  description,
  children,
  className = "",
}: CompanySettingsGroupProps) {
  return (
    <section className={`space-y-3 ${className}`}>
      {title ? (
        <div className="space-y-1 px-1">
          <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {title}
          </h3>
          {description ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
      ) : null}
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/80 shadow-xs">
        <div className="divide-y divide-border/40">{children}</div>
      </div>
    </section>
  );
}
