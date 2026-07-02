"use client";

import { usePathname, useRouter } from "next/navigation";
import { OrganizationSwitcher } from "@/components/dashboard/organization-switcher";
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher";
import { CompanySwitcher, type CompanySwitcherItem } from "./company-switcher";
import { EngagementSwitcher, type EngagementSwitcherItem } from "./engagement-switcher";
import { useActiveCompany } from "@/hooks/use-active-company";
import { useActiveEngagement } from "@/hooks/use-active-engagement";
import { switchCompanyAction } from "@/lib/actions/tenant/switch-company";
import { switchEngagementAction } from "@/lib/actions/tenant/switch-engagement";
import { defaultLocale, isValidLocale } from "@/i18n";
import type { CompanyListLoadReason } from "@/lib/company/company-list-item";
import type { EngagementListLoadReason } from "@/lib/engagement/engagement-list-item";

export type ShellDrawerContextLabels = {
  organization: string;
  workspace: string;
  company: string;
  engagement: string;
  contextTitle: string;
};

type ShellDrawerContextProps = {
  labels: ShellDrawerContextLabels;
  companies: CompanySwitcherItem[];
  preferredCompanySlug?: string | null;
  companiesLoadReason?: CompanyListLoadReason;
  companyEmptyHint?: string;
  engagements: EngagementSwitcherItem[];
  preferredEngagementSlug?: string | null;
  engagementsLoadReason?: EngagementListLoadReason;
  engagementEmptyHint?: string;
};

function resolveLocale(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment && isValidLocale(segment) ? segment : defaultLocale;
}

function resolveEmptyLabel(
  reason: CompanyListLoadReason | EngagementListLoadReason | undefined,
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
  engagements,
  preferredEngagementSlug,
  engagementsLoadReason,
  engagementEmptyHint,
}: ShellDrawerContextProps) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = resolveLocale(pathname);
  const currentCompany = useActiveCompany(companies, preferredCompanySlug);
  const currentEngagement = useActiveEngagement(
    engagements,
    preferredEngagementSlug,
    currentCompany?.id ?? null,
  );

  async function handleCompanySelect(id: string) {
    const company = companies.find((item) => item.id === id);
    if (!company?.slug) return;

    const result = await switchCompanyAction({ slug: company.slug });
    if (!result.success) {
      return;
    }
    router.push(`/${locale}/app/companies/${company.slug}`);
  }

  async function handleEngagementSelect(id: string) {
    const engagement = engagements.find((item) => item.id === id);
    if (!engagement?.slug) return;

    const result = await switchEngagementAction({ slug: engagement.slug });
    if (!result.success) {
      return;
    }
    router.push(`/${locale}/app/engagements/${engagement.slug}`);
  }

  const scopedEngagements = engagements.filter(
    (item) => !currentCompany?.id || item.companyId === currentCompany.id,
  );

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
          emptyLabel={resolveEmptyLabel(companiesLoadReason, companyEmptyHint)}
          onSelect={handleCompanySelect}
        />
        <EngagementSwitcher
          label={labels.engagement}
          items={scopedEngagements}
          currentId={currentEngagement?.id ?? null}
          emptyLabel={resolveEmptyLabel(engagementsLoadReason, engagementEmptyHint)}
          onSelect={handleEngagementSelect}
        />
      </div>
    </div>
  );
}
