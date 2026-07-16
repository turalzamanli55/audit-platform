import { IfrsNotesValidationExperience } from "@/components/ifrs-notes";
import { loadIfrsNotesWorkspaceCached } from "@/lib/ifrs-notes/workspace";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function IfrsNotesValidationPage({ params }: Props) {
  const { slug } = await params;
  const result = await loadIfrsNotesWorkspaceCached(slug);
  if (!result.ok) notFound();
  return <IfrsNotesValidationExperience validation={result.validation} />;
}
