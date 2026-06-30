import type { ReactNode } from "react";

type AlertProps = {
  variant?: "error" | "success" | "info";
  children: ReactNode;
};

const variantClasses = {
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  success: "border-success/30 bg-success/10 text-success",
  info: "border-border bg-muted text-foreground",
};

export function Alert({ variant = "info", children }: AlertProps) {
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${variantClasses[variant]}`} role="alert">
      {children}
    </div>
  );
}
