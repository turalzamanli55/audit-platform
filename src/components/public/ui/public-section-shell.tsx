import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type PublicSectionShellProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "muted" | "gradient";
};

const variantClasses = {
  default: "",
  muted: "bg-muted/25",
  gradient: "bg-gradient-to-b from-muted/20 via-background to-background",
};

export function PublicSectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  variant = "default",
}: PublicSectionShellProps) {
  return (
    <section id={id} className={cn("py-20 sm:py-24 lg:py-28", variantClasses[variant], className)}>
      <div className="ds-container">
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          {eyebrow ? (
            <p className="ds-typography-overline mb-4 text-primary">{eyebrow}</p>
          ) : null}
          <h2 className="ds-typography-h2 text-balance text-foreground">{title}</h2>
          {description ? (
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
