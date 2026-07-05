import { Suspense } from "react";
import { FieldworkProceduresExperience } from "@/components/fieldwork";
import { EngagementLoadingSkeleton } from "@/components/engagement";
import { FIELDWORK_PERMISSIONS } from "@/constants/fieldwork";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { getDictionary, type Locale } from "@/i18n";
import { generateFieldworkWorkspaceMetadata } from "@/lib/fieldwork/fieldwork-workspace-page";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  return generateFieldworkWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const user = await getCurrentUser();
  const canAssign = user ? authorizePermissionCodes(user.permissionCodes, FIELDWORK_PERMISSIONS.ASSIGN) : false;
  const canUpdate = user ? authorizePermissionCodes(user.permissionCodes, FIELDWORK_PERMISSIONS.UPDATE) : false;
  const canReview = user ? authorizePermissionCodes(user.permissionCodes, FIELDWORK_PERMISSIONS.REVIEW) : false;

  return (
    <Suspense fallback={<EngagementLoadingSkeleton />}>
      <FieldworkProceduresExperience
        locale={locale}
        labels={dictionary.fieldwork.procedures}
        emptyLabels={dictionary.fieldwork.empty}
        fieldworkLabels={dictionary.fieldwork}
        canAssign={canAssign}
        canUpdate={canUpdate}
        canReview={canReview}
      />
    </Suspense>
  );
}
