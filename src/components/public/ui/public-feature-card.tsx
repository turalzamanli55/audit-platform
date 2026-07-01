import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type PublicFeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
  interactive?: boolean;
};

export function PublicFeatureCard({
  icon,
  title,
  description,
  className,
  interactive = true,
}: PublicFeatureCardProps) {
  return (
    <article
      className={cn(
        "group relative rounded-2xl border border-border/50 bg-card/80 p-6 shadow-xs transition-all duration-300 sm:p-7",
        interactive && "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md motion-reduce:transform-none",
        className,
      )}
    >
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/15">
        {icon}
      </div>
      <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </article>
  );
}
