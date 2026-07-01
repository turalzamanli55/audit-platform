"use client";

import { usePathname, useRouter } from "next/navigation";
import { OrganizationSwitcher } from "@/components/dashboard/organization-switcher";
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher";
import { CompanySwitcher, type CompanySwitcherItem } from "./company-switcher";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeSwitcher } from "./theme-switcher";
import { UserMenu } from "./user-menu";
import { defaultLocale, isValidLocale } from "@/i18n";

export type ShellDrawerFooterLabels = {
  organization: string;
  workspace: string;
  company: string;
  theme: string;
  themeLight: string;
  themeDark: string;
  language: string;
  userMenu: string;
  profile: string;
  signOut: string;
};

type ShellDrawerFooterProps = {
  labels: ShellDrawerFooterLabels;
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

export function ShellDrawerFooter({ labels, companies }: ShellDrawerFooterProps) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = resolveLocale(pathname);
  const slug = resolveCompanySlug(pathname);
  const currentCompany =
    (slug ? companies.find((item) => item.slug === slug) : null) ?? companies[0] ?? null;

  return (
    <div className="space-y-4">
      <p className="text-xs font-medium uppercase tracking-wide text-sidebar-muted">Workspace</p>
      <div className="space-y-2">
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

      <div className="flex items-center gap-1 border-t border-sidebar-border pt-4">
        <LocaleSwitcher label={labels.language} compact />
        <ThemeSwitcher
          label={labels.theme}
          themeLight={labels.themeLight}
          themeDark={labels.themeDark}
        />
        <div className="ml-auto">
          <UserMenu
            labels={{
              title: labels.userMenu,
              profile: labels.profile,
              signOut: labels.signOut,
            }}
          />
        </div>
      </div>
    </div>
  );
}
