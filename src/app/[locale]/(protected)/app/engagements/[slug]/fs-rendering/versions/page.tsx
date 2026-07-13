import { FsRenderingVersionsExperience } from "@/components/fs-rendering";
import { loadFsRenderingWorkspaceCached } from "@/lib/fs-rendering/workspace";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function FsRenderingVersionsPage({ params }: Props) {
  const { slug } = await params;
  const result = await loadFsRenderingWorkspaceCached(slug);
  if (!result.ok) notFound();
  return <FsRenderingVersionsExperience versions={result.versions} />;
}
