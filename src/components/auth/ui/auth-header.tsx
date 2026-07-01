import type { ReactNode } from "react";

type AuthHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children?: ReactNode;
};

export function AuthHeader({ title, subtitle, eyebrow, children }: AuthHeaderProps) {
  return (
    <div className="space-y-3">
      {eyebrow ? <p className="ds-typography-overline text-primary">{eyebrow}</p> : null}
      <div className="space-y-2">
        <h1 className="ds-typography-h2 text-balance text-foreground">{title}</h1>
        {subtitle ? (
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
