import { notFound } from "next/navigation";
import Link from "next/link";
import { loadUserDetail } from "@/lib/platform-console/detail-data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { UserDetailView } from "@/components/platform-console/user-detail";
import { getPlatformLabels, fillPlatform } from "@/i18n/platform-labels";

export const dynamic = "force-dynamic";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = getPlatformLabels(locale);
  const user = await loadUserDetail(id);

  if (!user) {
    notFound();
  }

  const basePath = `/${locale}/app/platform`;

  return (
    <div className="space-y-6">
      <Link href={`${basePath}/users`} className="text-sm text-muted-foreground hover:text-foreground">
        {t.pages.userDetailPage.back}
      </Link>
      <PlatformPageHeader
        eyebrow={t.eyebrow}
        title={user.fullName ?? user.email}
        description={fillPlatform(t.pages.userDetailPage.description, { email: user.email })}
      />
      <UserDetailView user={user} basePath={basePath} />
    </div>
  );
}
