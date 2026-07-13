import { FsRenderingValidationExperience } from "@/components/fs-rendering";
import { loadFsRenderingWorkspaceCached } from "@/lib/fs-rendering/workspace";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function FsRenderingValidationPage({ params }: Props) {
  const { slug } = await params;
  const result = await loadFsRenderingWorkspaceCached(slug);
  if (!result.ok) notFound();
  return <FsRenderingValidationExperience validation={result.validation} />;
}
