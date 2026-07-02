import { getDictionary, type Locale } from "@/i18n";
import { FieldworkWorkspaceError } from "@/components/fieldwork";

export default async function FieldworkNotFound({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const dictionary = await getDictionary(localeParam as Locale);
  return (
    <FieldworkWorkspaceError
      title={dictionary.fieldwork.notFoundTitle}
      description={dictionary.fieldwork.notFoundDescription}
    />
  );
}
