import Link from "next/link";
import { getDictionary } from "@/i18n";
import { EngagementEmptyState, EngagementPageShell } from "@/components/engagement";
import { resolveRouteLocale } from "@/lib/i18n/resolve-route-locale";

type EngagementsNotFoundProps = {
  params?: Promise<{ locale: string }>;
};

export default async function EngagementsNotFound({ params }: EngagementsNotFoundProps) {
  const { locale } = await resolveRouteLocale(params);
  const dictionary = await getDictionary(locale);
  const labels = dictionary.engagements;

  return (
    <EngagementPageShell>
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
