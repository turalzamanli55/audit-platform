import Link from "next/link";
import {
  IconArrowRight,
  IconBriefcase,
  IconUsers,
  IconZap,
} from "@/components/ui/icons";
import { COMPANIES_NEW_PATH, ENGAGEMENTS_NEW_PATH } from "@/config/dashboard-navigation";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import type { DashboardWorkspaceCompany } from "@/lib/dashboard/load-dashboard-workspace";
import { WorkspacePanel, WorkspaceSection } from "./workspace-section";

type WorkspaceQuickActionsProps = {
  locale: string;
  labels: DashboardWorkspaceLabels["quickActions"];
  continueCompany: DashboardWorkspaceCompany | null;
  onContinueSelect?: () => void;
};

const actionIcons = [IconBriefcase, IconZap, IconArrowRight, IconUsers] as const;

export function WorkspaceQuickActions({
  locale,
  labels,
  continueCompany,
  onContinueSelect,
}: WorkspaceQuickActionsProps) {
  const actions = [
    {
      id: "create-company",
      label: labels.createCompany,
      href: `/${locale}${COMPANIES_NEW_PATH}`,
      enabled: true,
    },
    {
      id: "create-engagement",
      label: labels.createEngagement,
      href: `/${locale}${ENGAGEMENTS_NEW_PATH}`,
      enabled: true,
    },
    {
      id: "continue",
      label: labels.continueLastWork,
      href: continueCompany ? `/${locale}/app/companies/${continueCompany.slug}` : "#",
      enabled: Boolean(continueCompany),
    },
  ].filter((action) => action.enabled);

  return (
    <WorkspaceSection title={labels.title} description={labels.description}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map((action, index) => {
          const Icon = actionIcons[index] ?? IconZap;
          const content = (
            <WorkspacePanel
              variant="soft"
              className="group flex h-full flex-col justify-between gap-4 p-5 transition-all duration-200 hover:border-border-strong hover:bg-card/80 hover:shadow-sm motion-reduce:transition-none"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none">
                  <Icon width={18} height={18} />
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">{action.label}</p>
              </div>
            </WorkspacePanel>
          );

          return (
            <Link
              key={action.id}
              href={action.href}
              onClick={action.id === "continue" ? onContinueSelect : undefined}
              className="block h-full rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </WorkspaceSection>
  );
}
