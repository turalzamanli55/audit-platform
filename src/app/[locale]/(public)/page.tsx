import { PublicHome } from "@/components/public";
import { getDictionary, type Locale } from "@/i18n";

type PublicHomePageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function PublicHomePage({ params }: PublicHomePageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return <PublicHome locale={locale} marketing={dictionary.marketing} />;
}
