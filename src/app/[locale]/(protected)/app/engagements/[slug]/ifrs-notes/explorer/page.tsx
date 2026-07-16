import { IfrsNotesExplorerExperience } from "@/components/ifrs-notes";
import { loadIfrsNotesWorkspaceCached } from "@/lib/ifrs-notes/workspace";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function IfrsNotesExplorerPage({ params }: Props) {
  const { slug } = await params;
  const result = await loadIfrsNotesWorkspaceCached(slug);
  if (!result.ok) notFound();
  return <IfrsNotesExplorerExperience structure={result.structure} />;
}
