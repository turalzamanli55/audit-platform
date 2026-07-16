import { IfrsNotesOverviewExperience } from "@/components/ifrs-notes";
import { loadIfrsNotesWorkspaceCached } from "@/lib/ifrs-notes/workspace";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function IfrsNotesOverviewPage({ params }: Props) {
  const { slug } = await params;
  const result = await loadIfrsNotesWorkspaceCached(slug);
  if (!result.ok) notFound();

  return (
    <IfrsNotesOverviewExperience
      engagementId={result.engagementId}
      hasPackage={Boolean(result.notePackage)}
      requiredNotes={result.metrics?.requiredNotes ?? 0}
      completedNotes={result.metrics?.completedNotes ?? 0}
      missingNotes={result.metrics?.missingNotes ?? 0}
      errors={result.metrics?.validationErrors ?? 0}
      warnings={result.metrics?.warnings ?? 0}
      coverage={result.metrics?.coveragePct ?? 0}
    />
  );
}
