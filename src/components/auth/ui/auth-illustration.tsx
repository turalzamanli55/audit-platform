import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type AuthIllustrationProps = {
  label: string;
  className?: string;
};

export function AuthIllustration({ label, className }: AuthIllustrationProps) {
  return (
    <div
      className={cn(
        "relative hidden min-h-[32rem] overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-primary/8 via-muted/30 to-accent/15 lg:block",
        className,
      )}
      role="img"
      aria-label={label}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgb(37_99_235/0.14),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgb(37_99_235/0.1),transparent_50%)]" />
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <div className="w-full max-w-sm space-y-4 opacity-70">
          <div className="h-4 w-2/3 rounded-full bg-foreground/10" />
          <div className="h-4 w-full rounded-full bg-foreground/8" />
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="h-28 rounded-2xl bg-foreground/6" />
            <div className="h-28 rounded-2xl bg-foreground/8" />
            <div className="col-span-2 h-20 rounded-2xl bg-foreground/6" />
          </div>
        </div>
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}

type AuthPanelProps = {
  children: ReactNode;
};

export function AuthPanel({ children }: AuthPanelProps) {
  return (
    <div className="flex flex-col justify-center space-y-8 p-8 lg:p-12 xl:p-16">
      {children}
    </div>
  );
}
