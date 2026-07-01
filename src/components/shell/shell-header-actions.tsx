"use client";

import { usePathname, useRouter } from "next/navigation";
import { OrganizationSwitcher } from "@/components/dashboard/organization-switcher";
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher";
import { CompanySwitcher, type CompanySwitcherItem } from "./company-switcher";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeSwitcher } from "./theme-switcher";
import { NotificationMenu } from "./notification-menu";
import { UserMenu } from "./user-menu";
import { defaultLocale, isValidLocale } from "@/i18n";

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
};

function resolveLocale(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment && isValidLocale(segment) ? segment : defaultLocale;
}

function resolveCompanySlug(pathname: string): string | null {
  const match = pathname.match(/\/app\/companies\/([^/]+)/);
  return match?.[1] ?? null;
}

export function ShellHeaderActions({ labels, companies }: ShellHeaderActionsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = resolveLocale(pathname);
  const slug = resolveCompanySlug(pathname);
  const currentCompany =
    (slug ? companies.find((item) => item.slug === slug) : null) ?? companies[0] ?? null;

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

  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      <div className="hidden items-center gap-0.5 lg:flex">
        <OrganizationSwitcher label={labels.organization} />
        <WorkspaceSwitcher label={labels.workspace} />
        <CompanySwitcher
          label={labels.company}
          items={companies}
          currentId={currentCompany?.id ?? null}
          onSelect={(id) => {
            const company = companies.find((item) => item.id === id);
            if (company?.slug) {
              router.push(`/${locale}/app/companies/${company.slug}`);
            }
          }}
        />
      </div>

      <NotificationMenu labels={notificationLabels} />

      <LocaleSwitcher label={labels.language} compact className="lg:hidden" />
      <LocaleSwitcher label={labels.language} className="hidden lg:inline-flex" />

      <ThemeSwitcher
        label={labels.theme}
        themeLight={labels.themeLight}
        themeDark={labels.themeDark}
      />

      <UserMenu labels={userLabels} />
    </div>
  );
}
