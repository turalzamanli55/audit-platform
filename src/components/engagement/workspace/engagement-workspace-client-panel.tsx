import Link from "next/link";
import type { EngagementWorkspaceMetadataItem } from "./engagement-workspace-metadata-panel";
import { EngagementWorkspaceMetadataPanel } from "./engagement-workspace-metadata-panel";

type EngagementWorkspaceClientPanelProps = {
  locale: string;
  title: string;
  description?: string;
  items: EngagementWorkspaceMetadataItem[];
  companySlug?: string;
  companyName: string;
  viewClientLabel: string;
};

export function EngagementWorkspaceClientPanel({
  locale,
  title,
  description,
  items,
  companySlug,
  companyName,
  viewClientLabel,
}: EngagementWorkspaceClientPanelProps) {
  return (
    <div className="space-y-4">
      <EngagementWorkspaceMetadataPanel
        title={title}
        description={description}
        items={items}
        embedded
      />
      {companySlug ? (
        <Link
          href={`/${locale}/app/companies/${companySlug}`}
          className="inline-flex h-10 items-center rounded-xl border border-border/60 bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {viewClientLabel.replace("{name}", companyName)}
        </Link>
      ) : null}
    </div>
  );
}
