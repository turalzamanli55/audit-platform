import { getDictionary } from "@/i18n";
import { FinancialStatementsWorkspaceError } from "@/components/financial-statements";
import { resolveRouteLocale } from "@/lib/i18n/resolve-route-locale";

export default async function ReviewNotFound({
  params,
}: {
  params?: Promise<{ locale: string }>;
}) {
  const { locale } = await resolveRouteLocale(params);
  const dictionary = await getDictionary(locale);
  return (
    <FinancialStatementsWorkspaceError
      title={dictionary.financialStatements.notFoundTitle}
      description={dictionary.financialStatements.notFoundDescription}
    />
  );
}
