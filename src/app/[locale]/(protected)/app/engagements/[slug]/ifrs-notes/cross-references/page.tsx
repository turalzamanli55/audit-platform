import { IfrsNotesCrossReferencesExperience } from "@/components/ifrs-notes";
import { loadIfrsNotesWorkspaceCached } from "@/lib/ifrs-notes/workspace";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function IfrsNotesCrossReferencesPage({ params }: Props) {
  const { slug } = await params;
  const result = await loadIfrsNotesWorkspaceCached(slug);
  if (!result.ok) notFound();
  return (
    <IfrsNotesCrossReferencesExperience crossReferences={result.crossReferences} />
  );
}
