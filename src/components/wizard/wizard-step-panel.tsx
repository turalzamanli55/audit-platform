import type { ReactNode } from "react";

type WizardStepPanelProps = {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  visible?: boolean;
};

export function WizardStepPanel({
  title,
  description,
  children,
  visible = true,
}: WizardStepPanelProps) {
  return (
    <section
      aria-hidden={!visible}
      className={`space-y-6 transition-all duration-300 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none absolute inset-0 -z-10 translate-y-2 opacity-0"
      }`}
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <div className="space-y-5 rounded-2xl border border-border/50 bg-card/60 p-5 shadow-xs sm:p-6">
        {children}
      </div>
    </section>
  );
}

type WizardFieldProps = {
  label: ReactNode;
  htmlFor: string;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
};

export function WizardField({ label, htmlFor, error, hint, children }: WizardFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
