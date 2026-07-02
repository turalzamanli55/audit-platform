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
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeSwitcher } from "./theme-switcher";
import { NotificationMenu } from "./notification-menu";
import { UserMenu } from "./user-menu";
import { defaultLocale, isValidLocale } from "@/i18n";
import type { CompanyListLoadReason } from "@/lib/company/company-list-item";
import type { EngagementListLoadReason } from "@/lib/engagement/engagement-list-item";

export type ShellHeaderActionsLabels = {
  organization: string;
  workspace: string;
  company: string;
  engagement: string;
  theme: string;
  themeLight: string;
  themeDark: string;
  language: string;
  notifications: string;
  notificationsEmpty: string;
  markAllRead: string;
  userMenu: string;
  profile: string;
  signOut: string;
  openSearch: string;
  workspaceRequired: string;
  accessRestricted: string;
};

type ShellHeaderActionsProps = {
  labels: ShellHeaderActionsLabels;
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
  hint: string | undefined,
  labels: Pick<ShellHeaderActionsLabels, "workspaceRequired" | "accessRestricted">,
): string {
  if (hint) return hint;
  if (reason === "no_workspace") return labels.workspaceRequired;
  if (reason === "forbidden") return labels.accessRestricted;
  return "—";
}

export function ShellHeaderActions({
  labels,
  companies,
  preferredCompanySlug,
  companiesLoadReason,
  companyEmptyHint,
  engagements,
  preferredEngagementSlug,
  engagementsLoadReason,
  engagementEmptyHint,
}: ShellHeaderActionsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = resolveLocale(pathname);
  const currentCompany = useActiveCompany(companies, preferredCompanySlug);
  const currentEngagement = useActiveEngagement(
    engagements,
    preferredEngagementSlug,
    currentCompany?.id ?? null,
  );

  const userLabels = {
    title: labels.userMenu,
    profile: labels.profile,
    signOut: labels.signOut,
  };

  const notificationLabels = {
    title: labels.notifications,
    empty: labels.notificationsEmpty,
    markAllRead: labels.markAllRead,
  };

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

  return (
    <div className="flex items-center gap-0.5 max-lg:gap-px sm:gap-1">
      <div className="hidden items-center gap-0.5 lg:flex">
        <OrganizationSwitcher label={labels.organization} />
        <WorkspaceSwitcher label={labels.workspace} />
        <CompanySwitcher
          label={labels.company}
          items={companies}
          currentId={currentCompany?.id ?? null}
          emptyLabel={resolveEmptyLabel(companiesLoadReason, companyEmptyHint, labels)}
          onSelect={handleCompanySelect}
        />
        <EngagementSwitcher
          label={labels.engagement}
          items={engagements.filter(
            (item) => !currentCompany?.id || item.companyId === currentCompany.id,
          )}
          currentId={currentEngagement?.id ?? null}
          emptyLabel={resolveEmptyLabel(engagementsLoadReason, engagementEmptyHint, labels)}
          onSelect={handleEngagementSelect}
        />
      </div>

      <NotificationMenu labels={notificationLabels} />

      <LocaleSwitcher label={labels.language} responsive />

      <ThemeSwitcher
        label={labels.theme}
        themeLight={labels.themeLight}
        themeDark={labels.themeDark}
      />

      <UserMenu labels={userLabels} />
    </div>
  );
}
