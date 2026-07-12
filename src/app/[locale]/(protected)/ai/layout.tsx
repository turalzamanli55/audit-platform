import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getDictionary, isValidLocale, type Locale } from "@/i18n";
import { notFound } from "next/navigation";

type AiLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AiLayoutProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) return {};
  const dictionary = await getDictionary(localeParam as Locale);
  return {
    title: `${dictionary.aiWorkspace.meta.title} | ${dictionary.common.appName}`,
    description: dictionary.aiWorkspace.meta.description,
  };
}

export default async function AiWorkspaceLayout({ children, params }: AiLayoutProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) {
    notFound();
  }
  return <div className="min-h-0 flex-1">{children}</div>;
}
