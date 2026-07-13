import { FsMappingHierarchyExperience } from "@/components/fs-mapping";
import { loadFsMappingWorkspaceCached } from "@/lib/fs-mapping/load-fs-mapping-workspace";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function FsMappingHierarchyPage({ params }: Props) {
  const { slug } = await params;
  const result = await loadFsMappingWorkspaceCached(slug);
  if (!result.ok) notFound();
  return <FsMappingHierarchyExperience hierarchy={result.hierarchy} />;
}
