import { getDictionary } from "@/i18n";
import { OpinionWorkspaceError } from "@/components/opinion";
import { resolveRouteLocale } from "@/lib/i18n/resolve-route-locale";

export default async function ReviewNotFound({
  params,
}: {
  params?: Promise<{ locale: string }>;
}) {
  const { locale } = await resolveRouteLocale(params);
  const dictionary = await getDictionary(locale);
  return (
    <OpinionWorkspaceError
      title={dictionary.opinion.notFoundTitle}
      description={dictionary.opinion.notFoundDescription}
    />
  );
}
