import { getDictionary, type Locale } from "@/i18n";
import { EmptyStateShell } from "@/components/layout";

type ProtectedAppPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function ProtectedAppPage({ params }: ProtectedAppPageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <EmptyStateShell
      title={dictionary.shell.navigation}
      description={dictionary.shell.foundation}
    />
  );
}
