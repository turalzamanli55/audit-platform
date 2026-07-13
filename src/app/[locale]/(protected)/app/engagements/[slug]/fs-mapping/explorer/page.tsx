import { FsMappingExplorerExperience } from "@/components/fs-mapping";
import { loadFsMappingWorkspaceCached } from "@/lib/fs-mapping/load-fs-mapping-workspace";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function FsMappingExplorerPage({ params }: Props) {
  const { slug } = await params;
  const result = await loadFsMappingWorkspaceCached(slug);
  if (!result.ok) notFound();
  return <FsMappingExplorerExperience rules={result.rules} lines={result.lines} />;
}
