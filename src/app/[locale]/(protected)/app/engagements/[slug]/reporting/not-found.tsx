import { getDictionary } from "@/i18n";
import { ReportingWorkspaceError } from "@/components/reporting";
import { resolveRouteLocale } from "@/lib/i18n/resolve-route-locale";

export default async function ReviewNotFound({
  params,
}: {
  params?: Promise<{ locale: string }>;
}) {
  const { locale } = await resolveRouteLocale(params);
  const dictionary = await getDictionary(locale);
  return (
    <ReportingWorkspaceError
      title={dictionary.reporting.notFoundTitle}
      description={dictionary.reporting.notFoundDescription}
    />
  );
}
