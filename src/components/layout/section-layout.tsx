import type { ReactNode } from "react";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/ui/cn";

type SectionLayoutProps = {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
};

export function SectionLayout({
  title,
  description,
  actions,
  children,
  className,
  id,
}: SectionLayoutProps) {
  return (
    <section id={id} className={cn("space-y-6", className)}>
      {(title || description || actions) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 space-y-1.5">
            {title ? (
              typeof title === "string" ? (
                <Typography variant="h2" as="h2">
                  {title}
                </Typography>
              ) : (
                title
              )
            ) : null}
            {description ? (
              typeof description === "string" ? (
                <Typography variant="body-sm" className="text-muted-foreground">
                  {description}
                </Typography>
              ) : (
                description
              )
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}
