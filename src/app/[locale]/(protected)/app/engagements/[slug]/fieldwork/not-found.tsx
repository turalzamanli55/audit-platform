import { getDictionary } from "@/i18n";
import { FieldworkWorkspaceError } from "@/components/fieldwork";
import { resolveRouteLocale } from "@/lib/i18n/resolve-route-locale";

export default async function FieldworkNotFound({
  params,
}: {
  params?: Promise<{ locale: string }>;
}) {
  const { locale } = await resolveRouteLocale(params);
  const dictionary = await getDictionary(locale);
  return (
    <FieldworkWorkspaceError
      title={dictionary.fieldwork.notFoundTitle}
      description={dictionary.fieldwork.notFoundDescription}
    />
  );
}
