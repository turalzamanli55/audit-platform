import { FsMappingSearchExperience } from "@/components/fs-mapping";
import {
  loadFsMappingWorkspaceCached,
  searchFsMappingWorkspace,
} from "@/lib/fs-mapping/load-fs-mapping-workspace";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
};

export default async function FsMappingSearchPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { q = "" } = await searchParams;
  const result = await loadFsMappingWorkspaceCached(slug);
  if (!result.ok) notFound();
  const results = searchFsMappingWorkspace(result, q);
  return <FsMappingSearchExperience results={results} query={q} />;
}
