import { EngagementMembersSection } from "@/components/engagement/members/engagement-members-section";
import { getDictionary, type Locale } from "@/i18n";
import {
  generateEngagementWorkspaceMetadata,
  requireEngagementWorkspace,
} from "@/lib/engagement/engagement-workspace-page";

type EngagementMembersPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: EngagementMembersPageProps) {
  const { locale: localeParam, slug } = await params;
  return generateEngagementWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function EngagementMembersPage({ params }: EngagementMembersPageProps) {
  const { locale: localeParam, slug } = await params;
  const dictionary = await getDictionary(localeParam as Locale);
  const engagement = await requireEngagementWorkspace(slug);

  return (
    <EngagementMembersSection
      members={engagement.members}
      labels={dictionary.engagements.members}
    />
  );
}
