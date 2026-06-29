import type { ReactNode } from "react";

type ShellProps = {
  children?: ReactNode;
  title?: string;
  description?: string;
};

export function LoadingShell({ title, description }: ShellProps) {
  return (
    <div
      className="flex min-h-[12rem] flex-col items-center justify-center gap-4 p-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
        aria-hidden="true"
      />
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{title ?? "Loading"}</p>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
