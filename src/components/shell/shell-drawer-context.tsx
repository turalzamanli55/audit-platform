"use client";

import { usePathname, useRouter } from "next/navigation";
import { OrganizationSwitcher } from "@/components/dashboard/organization-switcher";
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher";
import { CompanySwitcher, type CompanySwitcherItem } from "./company-switcher";
import { useActiveCompany } from "@/hooks/use-active-company";
import { switchCompanyAction } from "@/lib/actions/tenant/switch-company";
import { defaultLocale, isValidLocale } from "@/i18n";
import type { CompanyListLoadReason } from "@/lib/company/company-list-item";

export type ShellDrawerContextLabels = {
  organization: string;
  workspace: string;
  company: string;
  contextTitle: string;
};

type ShellDrawerContextProps = {
  labels: ShellDrawerContextLabels;
  companies: CompanySwitcherItem[];
  preferredCompanySlug?: string | null;
  companiesLoadReason?: CompanyListLoadReason;
  companyEmptyHint?: string;
};

function resolveLocale(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment && isValidLocale(segment) ? segment : defaultLocale;
}

function resolveCompanyEmptyLabel(
  reason: CompanyListLoadReason | undefined,
  hint?: string,
): string {
  if (hint) return hint;
  if (reason === "no_workspace") return "Workspace required";
  if (reason === "forbidden") return "Access restricted";
  return "—";
}

export function ShellDrawerContext({
  labels,
  companies,
  preferredCompanySlug,
  companiesLoadReason,
  companyEmptyHint,
}: ShellDrawerContextProps) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = resolveLocale(pathname);
  const currentCompany = useActiveCompany(companies, preferredCompanySlug);

  async function handleCompanySelect(id: string) {
    const company = companies.find((item) => item.id === id);
    if (!company?.slug) return;

    await switchCompanyAction({ slug: company.slug });
    router.push(`/${locale}/app/companies/${company.slug}`);
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-sidebar-muted">
        {labels.contextTitle}
      </p>
      <div className="space-y-2">
        <OrganizationSwitcher label={labels.organization} />
        <WorkspaceSwitcher label={labels.workspace} />
        <CompanySwitcher
          label={labels.company}
          items={companies}
          currentId={currentCompany?.id ?? null}
          emptyLabel={resolveCompanyEmptyLabel(companiesLoadReason, companyEmptyHint)}
          onSelect={handleCompanySelect}
        />
      </div>
    </div>
  );
}
