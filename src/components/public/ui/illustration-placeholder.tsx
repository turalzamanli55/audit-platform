import { cn } from "@/lib/ui/cn";

type IllustrationPlaceholderProps = {
  label: string;
  className?: string;
  variant?: "hero" | "ai" | "default";
};

const variantClasses = {
  hero: "min-h-[280px] sm:min-h-[360px] lg:min-h-[420px]",
  ai: "min-h-[240px] sm:min-h-[300px]",
  default: "min-h-[200px]",
};

export function IllustrationPlaceholder({
  label,
  className,
  variant = "default",
}: IllustrationPlaceholderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-primary/5 via-muted/30 to-accent/20 shadow-sm",
        variantClasses[variant],
        className,
      )}
      role="img"
      aria-label={label}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(37_99_235/0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgb(37_99_235/0.08),transparent_45%)]" />
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="grid w-full max-w-md gap-3 opacity-60">
          <div className="h-3 w-2/3 rounded-full bg-foreground/10" />
          <div className="h-3 w-full rounded-full bg-foreground/8" />
          <div className="h-3 w-5/6 rounded-full bg-foreground/8" />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="h-16 rounded-xl bg-foreground/6" />
            <div className="h-16 rounded-xl bg-foreground/8" />
            <div className="h-16 rounded-xl bg-foreground/6" />
          </div>
        </div>
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
