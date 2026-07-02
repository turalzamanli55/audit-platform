import { redirect } from "next/navigation";
import { type Locale } from "@/i18n";
import { generatePlanningWorkspaceMetadata } from "@/lib/planning/planning-workspace-page";

type PlanningSectionPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PlanningSectionPageProps) {
  const { locale: localeParam, slug } = await params;
  return generatePlanningWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function PlanningRiskPage({ params }: PlanningSectionPageProps) {
  const { locale: localeParam, slug } = await params;
  redirect(`/${localeParam as Locale}/app/engagements/${slug}/risk-assessment`);
}
