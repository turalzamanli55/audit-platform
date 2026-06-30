import Link from "next/link";
import { headers } from "next/headers";
import { getDictionary, defaultLocale, isValidLocale, type Locale } from "@/i18n";
import { EmptyStateShell } from "@/components/layout";

export default async function LocaleNotFound() {
  const headerStore = await headers();
  const localeHeader = headerStore.get("x-locale");
  const locale = (localeHeader && isValidLocale(localeHeader) ? localeHeader : defaultLocale) as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <EmptyStateShell title="404" description={dictionary.common.empty}>
      <Link
        href={`/${locale}`}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        {dictionary.common.retry}
      </Link>
    </EmptyStateShell>
  );
}
