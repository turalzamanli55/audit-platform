import type { ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/ui/cn";

type PageLayoutProps = {
  title?: ReactNode;
  description?: ReactNode;
  breadcrumb?: BreadcrumbItem[];
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  width?: "default" | "readable" | "full";
};

export function PageLayout({
  title,
  description,
  breadcrumb,
  actions,
  children,
  className,
  width = "default",
}: PageLayoutProps) {
  return (
    <div className={cn("space-y-8 ds-animate-fade-in", className)}>
      {(breadcrumb?.length || title || actions) && (
        <div className="space-y-4">
          {breadcrumb?.length ? <Breadcrumb items={breadcrumb} /> : null}
          {(title || actions) && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-2">
                {title ? (
                  typeof title === "string" ? (
                    <Typography variant="h1" as="h1">
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
              {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
            </div>
          )}
        </div>
      )}
      <div
        className={cn(
          width === "readable" && "ds-readable",
          width === "full" && "w-full",
        )}
      >
        {children}
      </div>
    </div>
  );
}
