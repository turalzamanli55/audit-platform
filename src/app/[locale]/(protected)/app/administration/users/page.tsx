import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

/** Legacy path — Company Administration now lives at /app/administration. */
export default async function CompanyAdministrationUsersRedirect({ params }: PageProps) {
  const { locale } = await params;
  redirect(`/${locale}/app/administration`);
}
