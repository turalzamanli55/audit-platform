"use client";

import { usePathname, useRouter } from "next/navigation";
import { OrganizationSwitcher } from "@/components/dashboard/organization-switcher";
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher";
import { CompanySwitcher, type CompanySwitcherItem } from "./company-switcher";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeSwitcher } from "./theme-switcher";
import { NotificationMenu } from "./notification-menu";
import { UserMenu } from "./user-menu";
import { useActiveCompany } from "@/hooks/use-active-company";
import { switchCompanyAction } from "@/lib/actions/tenant/switch-company";
import { defaultLocale, isValidLocale } from "@/i18n";
import type { CompanyListLoadReason } from "@/lib/company/company-list-item";

export type ShellHeaderActionsLabels = {
  organization: string;
  workspace: string;
  company: string;
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
};

type ShellHeaderActionsProps = {
  labels: ShellHeaderActionsLabels;
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

export function ShellHeaderActions({
  labels,
  companies,
  preferredCompanySlug,
  companiesLoadReason,
  companyEmptyHint,
}: ShellHeaderActionsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = resolveLocale(pathname);
  const currentCompany = useActiveCompany(companies, preferredCompanySlug);

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

    await switchCompanyAction({ slug: company.slug });
    router.push(`/${locale}/app/companies/${company.slug}`);
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
          emptyLabel={resolveCompanyEmptyLabel(companiesLoadReason, companyEmptyHint)}
          onSelect={handleCompanySelect}
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
