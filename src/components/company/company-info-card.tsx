import type { ReactNode } from "react";
import { WorkspaceCard } from "@/components/workspace";

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
  const cardTitle =
    leading != null ? (
      <span className="flex items-start gap-4">
        <span className="shrink-0">{leading}</span>
        <span>{title}</span>
      </span>
    ) : (
      title
    );

  return (
    <WorkspaceCard
      title={cardTitle}
      description={description}
      action={trailing}
      className={className}
    >
      {children}
    </WorkspaceCard>
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
