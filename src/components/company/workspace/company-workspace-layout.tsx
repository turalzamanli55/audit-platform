import type { ReactNode } from "react";
import { CompanyPageShell } from "@/components/company";
import { CompanyWorkspaceHero, type CompanyWorkspaceHeroLabels } from "./company-workspace-hero";
import {
  CompanyWorkspaceSidebar,
  type CompanyWorkspaceNavItem,
} from "./company-workspace-sidebar";
import type { CompanyWorkspaceView } from "@/lib/company/company-workspace-view";

type CompanyWorkspaceLayoutProps = {
  locale: string;
  company: CompanyWorkspaceView;
  heroLabels: CompanyWorkspaceHeroLabels;
  navItems: CompanyWorkspaceNavItem[];
  navAriaLabel: string;
  children: ReactNode;
  className?: string;
};

/**
 * Permanent company workspace shell — hero, sidebar navigation, and section content.
 */
export function CompanyWorkspaceLayout({
  locale,
  company,
  heroLabels,
  navItems,
  navAriaLabel,
  children,
  className = "",
}: CompanyWorkspaceLayoutProps) {
  return (
    <CompanyPageShell className={`max-w-[90rem] ${className}`}>
      <CompanyWorkspaceHero locale={locale} company={company} labels={heroLabels} />

      <div className="grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[14rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <CompanyWorkspaceSidebar items={navItems} ariaLabel={navAriaLabel} />
        </aside>
        <main className="min-w-0 space-y-10">{children}</main>
      </div>
    </CompanyPageShell>
  );
}
