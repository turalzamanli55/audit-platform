"use client";

import { usePathname, useRouter } from "next/navigation";
import { OrganizationSwitcher } from "@/components/dashboard/organization-switcher";
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher";
import { CompanySwitcher, type CompanySwitcherItem } from "./company-switcher";
import { defaultLocale, isValidLocale } from "@/i18n";

export type ShellDrawerContextLabels = {
  organization: string;
  workspace: string;
  company: string;
  contextTitle: string;
};

type ShellDrawerContextProps = {
  labels: ShellDrawerContextLabels;
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

export function ShellDrawerContext({ labels, companies }: ShellDrawerContextProps) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = resolveLocale(pathname);
  const slug = resolveCompanySlug(pathname);
  const currentCompany =
    (slug ? companies.find((item) => item.slug === slug) : null) ?? companies[0] ?? null;

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
          onSelect={(id) => {
            const company = companies.find((item) => item.id === id);
            if (company?.slug) {
              router.push(`/${locale}/app/companies/${company.slug}`);
            }
          }}
        />
      </div>
    </div>
  );
}
