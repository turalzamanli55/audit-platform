import { FsRenderingOverviewExperience } from "@/components/fs-rendering";
import { loadFsRenderingWorkspaceCached } from "@/lib/fs-rendering/workspace";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function FsRenderingOverviewPage({ params }: Props) {
  const { slug } = await params;
  const result = await loadFsRenderingWorkspaceCached(slug);
  if (!result.ok) notFound();

  return (
    <FsRenderingOverviewExperience
      engagementId={result.engagementId}
      hasPresentation={Boolean(result.presentation)}
      renderedStatements={result.metrics?.renderedStatements ?? 0}
      coverage={result.metrics?.presentationCoveragePct ?? 0}
      errors={result.metrics?.renderingErrors ?? 0}
      warnings={result.metrics?.warnings ?? 0}
    />
  );
}
