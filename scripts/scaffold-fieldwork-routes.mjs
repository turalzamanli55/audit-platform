import fs from "fs";
import path from "path";

const root = path.resolve(".");
const baseRoute = path.join(
  root,
  "src/app/[locale]/(protected)/app/engagements/[slug]/fieldwork",
);

const sections = [
  ["overview", "FieldworkOverviewExperience", "workspace"],
  ["program", "FieldworkProgramExperience", "program"],
  ["procedure-groups", "FieldworkProcedureGroupsExperience", "procedureGroups"],
  ["procedures", "FieldworkProceduresExperience", "procedures"],
  ["working-papers", "FieldworkWorkingPapersExperience", "workingPapers"],
  ["evidence", "FieldworkEvidenceExperience", "evidence"],
  ["findings", "FieldworkFindingsExperience", "findings"],
  ["notes", "FieldworkNotesExperience", "notes"],
  ["review-notes", "FieldworkReviewNotesExperience", "reviewNotes"],
  ["comments", "FieldworkCommentsExperience", "comments"],
  ["history", "FieldworkHistoryExperience", "history"],
  ["settings", "FieldworkSettingsExperience", "settings"],
];

for (const [slug, comp, dictKey] of sections) {
  const dir = slug === "overview" ? baseRoute : path.join(baseRoute, slug);
  fs.mkdirSync(dir, { recursive: true });
  const labelsExpr =
    dictKey === "workspace"
      ? "dictionary.fieldwork.workspace"
      : `dictionary.fieldwork.${dictKey}`;

  let imports = "";
  let pre = "";
  let extra = "";
  let props = "locale={locale}";

  if (slug === "overview") {
    imports = `import { FIELDWORK_PERMISSIONS } from "@/constants/fieldwork";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { loadFieldworkWorkspaceCached } from "@/lib/fieldwork/load-fieldwork-workspace";`;
    pre = "const fieldworkResult = await loadFieldworkWorkspaceCached(slugParam);";
    extra = `const user = await getCurrentUser();
  const canCreate = user ? authorizePermissionCodes(user.permissionCodes, FIELDWORK_PERMISSIONS.CREATE) : false;
  const planningApproved = fieldworkResult.ok ? fieldworkResult.planningApproved : false;`;
    props += " canCreate={canCreate} planningApproved={planningApproved}";
  } else if (slug === "settings") {
    imports = `import { FIELDWORK_PERMISSIONS } from "@/constants/fieldwork";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";`;
    extra = `const user = await getCurrentUser();
  const canCreate = user ? authorizePermissionCodes(user.permissionCodes, FIELDWORK_PERMISSIONS.CREATE) : false;
  const canArchive = user ? authorizePermissionCodes(user.permissionCodes, FIELDWORK_PERMISSIONS.ARCHIVE) : false;`;
    props += " canCreate={canCreate} canArchive={canArchive}";
  } else if (slug === "history") {
    imports = `import { loadFieldworkActivityCached } from "@/lib/fieldwork/load-fieldwork-activity";
import { loadFieldworkWorkspaceCached } from "@/lib/fieldwork/load-fieldwork-workspace";`;
    pre = `const [fieldworkResult, activityResult] = await Promise.all([
    loadFieldworkWorkspaceCached(slugParam),
    loadFieldworkActivityCached(slugParam),
  ]);
  const plan = fieldworkResult.ok ? fieldworkResult.fieldwork : null;
  const activity = activityResult.ok ? activityResult.activity : { entries: [] };`;
    props += " plan={plan} activity={activity}";
  }

  const content = `import { ${comp} } from "@/components/fieldwork";
import { getDictionary, type Locale } from "@/i18n";
import { generateFieldworkWorkspaceMetadata } from "@/lib/fieldwork/fieldwork-workspace-page";
${imports}

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  return generateFieldworkWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam, slug: slugParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  ${pre}
  ${extra}
  return (
    <${comp}
      ${props}
      labels={${labelsExpr}}
      emptyLabels={dictionary.fieldwork.empty}
      fieldworkLabels={dictionary.fieldwork}
    />
  );
}
`;
  fs.writeFileSync(path.join(dir, "page.tsx"), content);
}

fs.writeFileSync(
  path.join(baseRoute, "layout.tsx"),
  `import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { FieldworkWorkspaceError, FieldworkWorkspaceShell } from "@/components/fieldwork";
import { getDictionary, type Locale } from "@/i18n";
import { loadEngagementWorkspacePage } from "@/lib/engagement/engagement-workspace-page";
import { buildFieldworkWorkspaceNavItems } from "@/lib/fieldwork/fieldwork-workspace-display";
import { loadFieldworkWorkspacePage } from "@/lib/fieldwork/fieldwork-workspace-page";

type Props = { children: ReactNode; params: Promise<{ locale: string; slug: string }> };

export default async function FieldworkLayout({ children, params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.fieldwork.workspace;
  const fieldworkLabels = dictionary.fieldwork;

  const [engagementResult, fieldworkResult] = await Promise.all([
    loadEngagementWorkspacePage(slug),
    loadFieldworkWorkspacePage(slug),
  ]);

  if (!engagementResult.ok) notFound();

  if (!fieldworkResult.ok) {
    if (fieldworkResult.reason === "not_found") notFound();
    if (fieldworkResult.reason === "forbidden") {
      return (
        <FieldworkWorkspaceError
          title={fieldworkLabels.forbiddenTitle}
          description={fieldworkLabels.forbiddenDescription}
        />
      );
    }
    if (fieldworkResult.reason === "no_workspace") {
      return (
        <FieldworkWorkspaceError
          title={fieldworkLabels.noWorkspaceTitle}
          description={fieldworkLabels.noWorkspaceDescription}
        />
      );
    }
    return (
      <FieldworkWorkspaceError
        title={labels.errorTitle}
        description={labels.errorDescription}
      />
    );
  }

  return (
    <FieldworkWorkspaceShell
      locale={locale}
      engagementSlug={slug}
      engagementName={engagementResult.engagement.name}
      initialFieldwork={fieldworkResult.fieldwork}
      planningApproved={fieldworkResult.planningApproved}
      engagementId={engagementResult.engagement.id}
      navItems={buildFieldworkWorkspaceNavItems(locale, slug, labels)}
      navAriaLabel={labels.navAriaLabel}
      labels={labels}
      fieldworkLabels={fieldworkLabels}
      engagementsLabels={dictionary.engagements}
    >
      {children}
    </FieldworkWorkspaceShell>
  );
}
`,
);

fs.writeFileSync(
  path.join(baseRoute, "loading.tsx"),
  `import { EngagementLoadingSkeleton } from "@/components/engagement";
export default function FieldworkLoading() {
  return <EngagementLoadingSkeleton />;
}
`,
);

fs.writeFileSync(
  path.join(baseRoute, "error.tsx"),
  `"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FieldworkWorkspaceError } from "@/components/fieldwork";

export default function FieldworkError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <FieldworkWorkspaceError
      action={
        <Button type="button" variant="secondary" onClick={reset}>
          Retry
        </Button>
      }
    />
  );
}
`,
);

fs.writeFileSync(
  path.join(baseRoute, "not-found.tsx"),
  `import { getDictionary, type Locale } from "@/i18n";
import { FieldworkWorkspaceError } from "@/components/fieldwork";

export default async function FieldworkNotFound({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const dictionary = await getDictionary(localeParam as Locale);
  return (
    <FieldworkWorkspaceError
      title={dictionary.fieldwork.notFoundTitle}
      description={dictionary.fieldwork.notFoundDescription}
    />
  );
}
`,
);

console.log("fieldwork routes scaffolded");
