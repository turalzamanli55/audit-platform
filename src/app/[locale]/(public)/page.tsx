import { getDictionary, type Locale } from "@/i18n";
import { EmptyStateShell } from "@/components/layout";

type PublicHomePageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function PublicHomePage({ params }: PublicHomePageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <EmptyStateShell
      title={dictionary.common.appName}
      description={dictionary.shell.foundation}
    />
  );
}
