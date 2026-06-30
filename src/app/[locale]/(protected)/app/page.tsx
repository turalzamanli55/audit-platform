import { redirect } from "next/navigation";
import { DASHBOARD_PATH } from "@/config/auth";

type AppIndexPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AppIndexPage({ params }: AppIndexPageProps) {
  const { locale } = await params;
  redirect(`/${locale}${DASHBOARD_PATH}`);
}
