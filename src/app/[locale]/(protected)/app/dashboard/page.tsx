import type { Metadata } from "next";
import { Suspense } from "react";
import { getDictionary, isValidLocale, type Locale } from "@/i18n";
import {
  DashboardWorkspaceExperience,
  DashboardWorkspaceSkeleton,
} from "@/components/dashboard/workspace";
import { loadDashboardWorkspace } from "@/lib/dashboard/load-dashboard-workspace";
import { notFound } from "next/navigation";

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: DashboardPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  return {
    title: `${dictionary.dashboardWorkspace.meta.title} | ${dictionary.common.appName}`,
    description: dictionary.dashboardWorkspace.meta.description,
  };
}

async function DashboardWorkspaceLoader({ locale }: { locale: Locale }) {
  const dictionary = await getDictionary(locale);
  const model = await loadDashboardWorkspace(locale, dictionary.dashboardWorkspace);
  return <DashboardWorkspaceExperience model={model} />;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale: localeParam } = await params;

  if (!isValidLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;

  return (
    <Suspense fallback={<DashboardWorkspaceSkeleton />}>
      <DashboardWorkspaceLoader locale={locale} />
    </Suspense>
  );
}
