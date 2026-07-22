import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { resolveTenantLicenseAccess } from "@/lib/auth/license-access";
import { getDictionary, type Locale } from "@/i18n";
import { AUTH_ROUTES } from "@/config/auth";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const dictionary = await getDictionary(localeParam as Locale);
  return {
    title: `${dictionary.licenseExpired.title} | ${dictionary.common.appName}`,
  };
}

export default async function LicenseExpiredPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.licenseExpired;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${locale}${AUTH_ROUTES.login}`);
  }

  const access = await resolveTenantLicenseAccess(user.id);
  if (access.allowed) {
    redirect(`/${locale}/app`);
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col justify-center px-4 py-16">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {labels.eyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{labels.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{labels.description}</p>

        <dl className="mt-6 space-y-3 rounded-2xl bg-muted/40 p-4 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{labels.company}</dt>
            <dd className="font-medium">{access.companyName ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{labels.expiration}</dt>
            <dd className="font-medium">
              {access.endsAt ? new Date(access.endsAt).toLocaleDateString() : "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{labels.daysExpired}</dt>
            <dd className="font-medium tabular-nums">{access.daysExpired}</dd>
          </div>
        </dl>

        <div className="mt-6 space-y-2">
          <p className="text-sm text-muted-foreground">{labels.contactAdmin}</p>
          <p className="text-sm text-muted-foreground">{labels.contactOwner}</p>
        </div>

        <div className="mt-8 flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/${locale}${AUTH_ROUTES.login}`}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-border px-4 text-sm font-medium"
          >
            {labels.signOutHint}
          </Link>
          <Link
            href={`/${locale}/app`}
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-foreground px-4 text-sm font-medium text-background"
          >
            {labels.retry}
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">{labels.dataSafe}</p>
      </div>
    </main>
  );
}
