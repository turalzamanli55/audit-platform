import type { ReactNode } from "react";

export type WizardStepDefinition = {
  id: string;
  label: string;
};

type WizardShellProps = {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function WizardShell({
  title,
  description,
  children,
  footer,
  className = "",
}: WizardShellProps) {
  return (
    <div className={`mx-auto w-full max-w-2xl ${className}`}>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {description ? (
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
        ) : null}
      </div>
      <div className="mt-8">{children}</div>
      {footer ? (
        <div className="sticky bottom-0 mt-8 border-t border-border/50 bg-background/95 py-4 backdrop-blur-md">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
