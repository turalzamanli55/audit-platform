import {
  FsMappingOverviewExperience,
} from "@/components/fs-mapping";
import { loadFsMappingWorkspaceCached } from "@/lib/fs-mapping/load-fs-mapping-workspace";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function FsMappingOverviewPage({ params }: Props) {
  const { slug } = await params;
  const result = await loadFsMappingWorkspaceCached(slug);
  if (!result.ok) notFound();

  return (
    <FsMappingOverviewExperience
      engagementId={result.engagementId}
      hasSet={Boolean(result.mappingSet)}
      mapped={result.metrics?.mappedAccounts ?? 0}
      unmapped={result.metrics?.unmappedAccounts ?? 0}
      errors={result.metrics?.validationErrors ?? 0}
      warnings={result.metrics?.validationWarnings ?? 0}
      versions={result.metrics?.versionCount ?? 0}
    />
  );
}
