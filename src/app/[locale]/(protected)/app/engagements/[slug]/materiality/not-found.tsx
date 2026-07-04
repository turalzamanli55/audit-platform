import { getDictionary } from "@/i18n";
import { MaterialityWorkspaceError } from "@/components/materiality";
import { resolveRouteLocale } from "@/lib/i18n/resolve-route-locale";

export default async function MaterialityNotFound({
  params,
}: {
  params?: Promise<{ locale: string }>;
}) {
  const { locale } = await resolveRouteLocale(params);
  const dictionary = await getDictionary(locale);
  return (
    <MaterialityWorkspaceError
      title={dictionary.materiality.notFoundTitle}
      description={dictionary.materiality.notFoundDescription}
    />
  );
}
