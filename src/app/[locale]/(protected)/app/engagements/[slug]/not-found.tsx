import { getDictionary, type Locale } from "@/i18n";
import { EngagementEmptyState, EngagementPageShell } from "@/components/engagement";
import Link from "next/link";

type EngagementWorkspaceNotFoundProps = {
  params: Promise<{ locale: string }>;
};

export default async function EngagementWorkspaceNotFound({
  params,
}: EngagementWorkspaceNotFoundProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.engagements;

  return (
    <EngagementPageShell className="max-w-[90rem]">
      <EngagementEmptyState
        title={labels.notFoundTitle}
        description={labels.notFoundDescription}
        action={
          <Link
            href={`/${locale}/app/engagements`}
            className="inline-flex h-11 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {labels.breadcrumbRoot}
          </Link>
        }
      />
    </EngagementPageShell>
  );
}
