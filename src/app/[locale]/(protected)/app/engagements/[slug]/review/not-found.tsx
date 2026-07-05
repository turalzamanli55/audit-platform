import { getDictionary } from "@/i18n";
import { ReviewWorkspaceError } from "@/components/review";
import { resolveRouteLocale } from "@/lib/i18n/resolve-route-locale";

export default async function ReviewNotFound({
  params,
}: {
  params?: Promise<{ locale: string }>;
}) {
  const { locale } = await resolveRouteLocale(params);
  const dictionary = await getDictionary(locale);
  return (
    <ReviewWorkspaceError
      title={dictionary.review.notFoundTitle}
      description={dictionary.review.notFoundDescription}
    />
  );
}
