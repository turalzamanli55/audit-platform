import { IfrsNotesSearchExperience } from "@/components/ifrs-notes";
import {
  loadIfrsNotesWorkspaceCached,
  searchIfrsNotesWorkspace,
} from "@/lib/ifrs-notes/workspace";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
};

export default async function IfrsNotesSearchPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { q = "" } = await searchParams;
  const result = await loadIfrsNotesWorkspaceCached(slug);
  if (!result.ok) notFound();
  return (
    <IfrsNotesSearchExperience
      query={q}
      results={searchIfrsNotesWorkspace(result, q)}
    />
  );
}
