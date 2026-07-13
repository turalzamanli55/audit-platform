import { FsRenderingSearchExperience } from "@/components/fs-rendering";
import {
  loadFsRenderingWorkspaceCached,
  searchFsRenderingWorkspace,
} from "@/lib/fs-rendering/workspace";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
};

export default async function FsRenderingSearchPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { q = "" } = await searchParams;
  const result = await loadFsRenderingWorkspaceCached(slug);
  if (!result.ok) notFound();
  return (
    <FsRenderingSearchExperience
      query={q}
      results={searchFsRenderingWorkspace(result, q)}
    />
  );
}
