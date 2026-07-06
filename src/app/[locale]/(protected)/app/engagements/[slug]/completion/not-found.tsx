import { getDictionary } from "@/i18n";
import { CompletionWorkspaceError } from "@/components/completion";
import { resolveRouteLocale } from "@/lib/i18n/resolve-route-locale";

export default async function ReviewNotFound({
  params,
}: {
  params?: Promise<{ locale: string }>;
}) {
  const { locale } = await resolveRouteLocale(params);
  const dictionary = await getDictionary(locale);
  return (
    <CompletionWorkspaceError
      title={dictionary.completion.notFoundTitle}
      description={dictionary.completion.notFoundDescription}
    />
  );
}
