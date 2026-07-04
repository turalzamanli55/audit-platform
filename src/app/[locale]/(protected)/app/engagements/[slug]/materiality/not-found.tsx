import { getDictionary, type Locale } from "@/i18n";
import { MaterialityWorkspaceError } from "@/components/materiality";

export default async function MaterialityNotFound({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const dictionary = await getDictionary(localeParam as Locale);
  return (
    <MaterialityWorkspaceError
      title={dictionary.materiality.notFoundTitle}
      description={dictionary.materiality.notFoundDescription}
    />
  );
}
