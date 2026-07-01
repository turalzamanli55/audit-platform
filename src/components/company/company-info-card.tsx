import type { ReactNode } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type CompanyInfoCardProps = {
  title: ReactNode;
  description?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  children?: ReactNode;
  className?: string;
};

/**
 * Elevated surface for company metadata summaries.
 */
export function CompanyInfoCard({
  title,
  description,
  leading,
  trailing,
  children,
  className = "",
}: CompanyInfoCardProps) {
  return (
    <Card className={`border-border/60 p-0 shadow-xs ${className}`}>
      <div className="flex items-start justify-between gap-4 p-6 pb-0">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          {leading ? <div className="shrink-0">{leading}</div> : null}
          <CardHeader className="mb-0 min-w-0 flex-1 space-y-1 p-0">
            <CardTitle className="text-lg font-semibold sm:text-xl">{title}</CardTitle>
            {description ? (
              <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
            ) : null}
          </CardHeader>
        </div>
        {trailing ? <div className="shrink-0">{trailing}</div> : null}
      </div>
      {children ? <div className="space-y-4 p-6 pt-5">{children}</div> : null}
    </Card>
  );
}

type CompanyInfoRowProps = {
  label: ReactNode;
  value: ReactNode;
  className?: string;
};

export function CompanyInfoRow({ label, value, className = "" }: CompanyInfoRowProps) {
  return (
    <div
      className={`flex flex-col gap-1 border-t border-border/40 py-3 first:border-t-0 first:pt-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 ${className}`}
    >
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground sm:text-right">{value}</dd>
    </div>
  );
}

export function CompanyInfoList({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <dl className={`divide-y divide-border/40 ${className}`}>{children}</dl>;
}
