import { FsRenderingPresentationExperience } from "@/components/fs-rendering";
import { loadFsRenderingWorkspaceCached } from "@/lib/fs-rendering/workspace";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function FsRenderingPresentationPage({ params }: Props) {
  const { slug } = await params;
  const result = await loadFsRenderingWorkspaceCached(slug);
  if (!result.ok) notFound();
  return (
    <FsRenderingPresentationExperience
      standard={result.presentation?.standard ?? null}
      comparativeMode={result.presentation?.comparativeMode ?? null}
      currencyCode={result.presentation?.currencyCode ?? null}
    />
  );
}
