import { PublicShell } from "@/components/public/public-shell";
import { getDictionary, isValidLocale, type Locale } from "@/i18n";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <PublicShell
      locale={locale}
      navLabels={dictionary.marketing.nav}
      footerLabels={dictionary.marketing.footer}
    >
      <section className="ds-container py-20">
        <h1 className="ds-typography-h1 mb-4">Contact</h1>
        <p className="max-w-2xl text-muted-foreground">
          Request a tenant invitation from the Platform Owner. Public self-registration is disabled.
        </p>
        <a
          className="mt-6 inline-flex text-primary hover:underline"
          href="mailto:hello@audit.platform"
        >
          hello@audit.platform
        </a>
      </section>
    </PublicShell>
  );
}
