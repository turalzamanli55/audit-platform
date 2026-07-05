import type { ReactNode } from "react";

type ShellProps = {
  children?: ReactNode;
  title: string;
  description?: string;
};

export function ErrorShell({ title, description, children }: ShellProps) {
  return (
    <div
      className="flex min-h-[16rem] flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-10 text-center"
      role="alert"
    >
      <p className="text-base font-medium text-foreground">{title}</p>
      {description ? <p className="max-w-md text-sm text-muted-foreground">{description}</p> : null}
      {children}
    </div>
  );
}
