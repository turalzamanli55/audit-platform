import Link from "next/link";
import { getDictionary } from "@/i18n";
import { resolveRouteLocale } from "@/lib/i18n/resolve-route-locale";

type PlanningNotFoundProps = {
  params?: Promise<{ locale: string; slug: string }>;
};

export default async function PlanningNotFound({ params }: PlanningNotFoundProps) {
  const { locale, slug } = await resolveRouteLocale(params);
  const dictionary = await getDictionary(locale);

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-16 text-center">
      <h1 className="text-xl font-semibold tracking-tight text-foreground">
        {dictionary.planning.notFoundTitle}
      </h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {dictionary.planning.notFoundDescription}
      </p>
      <Link
        href={`/${locale}/app/engagements/${slug}`}
        className="inline-flex text-sm font-medium text-foreground underline-offset-4 hover:underline"
      >
        {dictionary.engagements.workspace.navOverview}
      </Link>
    </div>
  );
}
