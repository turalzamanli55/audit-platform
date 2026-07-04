import type { ReactNode } from "react";
import { WorkspaceCard } from "@/components/workspace";

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
  embedded?: boolean;
};

export function EngagementWorkspaceMetadataPanel({
  title,
  description,
  items,
  className = "",
  embedded = false,
}: EngagementWorkspaceMetadataPanelProps) {
  return (
    <WorkspaceCard
      title={embedded ? "" : title}
      description={embedded ? undefined : description}
      className={className}
    >
      <dl className="divide-y divide-border/40">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-1 py-3 first:pt-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {item.label}
            </dt>
            <dd className="text-sm text-foreground sm:text-right">{item.value}</dd>
          </div>
        ))}
      </dl>
    </WorkspaceCard>
  );
}
