import { notFound } from "next/navigation";
import Link from "next/link";
import { loadUserDetail } from "@/lib/platform-console/detail-data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { UserDetailView } from "@/components/platform-console/user-detail";

export const dynamic = "force-dynamic";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const user = await loadUserDetail(id);

  if (!user) {
    notFound();
  }

  const basePath = `/${locale}/app/platform`;

  return (
    <div className="space-y-6">
      <Link href={`${basePath}/users`} className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to users
      </Link>
      <PlatformPageHeader title={user.fullName ?? user.email} description={`User administration profile · ${user.email}`} />
      <UserDetailView user={user} basePath={basePath} />
    </div>
  );
}
