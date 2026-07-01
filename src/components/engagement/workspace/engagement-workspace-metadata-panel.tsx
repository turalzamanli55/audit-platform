import type { ReactNode } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export type EngagementWorkspaceMetadataItem = {
  id: string;
  label: ReactNode;
  value: ReactNode;
};

type EngagementWorkspaceMetadataPanelProps = {
  title: string;
  description?: string;
  items: EngagementWorkspaceMetadataItem[];
  className?: string;
};

export function EngagementWorkspaceMetadataPanel({
  title,
  description,
  items,
  className = "",
}: EngagementWorkspaceMetadataPanelProps) {
  return (
    <Card className={`border-border/60 p-0 shadow-xs ${className}`}>
      <CardHeader className="space-y-1 p-6 pb-0">
        <CardTitle className="text-lg font-semibold sm:text-xl">{title}</CardTitle>
        {description ? (
          <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
        ) : null}
      </CardHeader>
      <dl className="divide-y divide-border/40 p-6 pt-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-1 border-t border-border/40 py-3 first:border-t-0 first:pt-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {item.label}
            </dt>
            <dd className="text-sm text-foreground sm:text-right">{item.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
