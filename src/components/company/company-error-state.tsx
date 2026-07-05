import type { ReactNode } from "react";

type CompanyErrorStateProps = {
  title: ReactNode;
  description: ReactNode;
  action?: ReactNode;
  className?: string;
};

/**
 * Calm error surface for company module failures.
 */
export function CompanyErrorState({
  title,
  description,
  action,
  className = "",
}: {
  title: ReactNode;
  description: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={`flex min-h-[16rem] flex-col items-center justify-center gap-6 rounded-2xl border border-destructive/15 bg-destructive/[0.03] px-8 py-12 text-center sm:min-h-[18rem] ${className}`}
    >
      <div
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive"
      >
        <AlertIcon />
      </div>
      <div className="max-w-md space-y-2">
        <p className="text-base font-medium tracking-tight text-foreground">{title}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}

function AlertIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 7v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="11" cy="15" r="0.75" fill="currentColor" />
    </svg>
  );
}
