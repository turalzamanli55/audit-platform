import type { ReactNode } from "react";

type ErrorShellProps = {
  title?: string;
  description?: string;
  children?: ReactNode;
};

export function ErrorShell({
  title = "Something went wrong",
  description = "An error occurred while loading this section.",
  children,
}: ErrorShellProps) {
  return (
    <div
      className="flex min-h-[12rem] flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center"
      role="alert"
    >
      <p className="text-sm font-semibold text-destructive">{title}</p>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}
