import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { IconArrowRight } from "@/components/ui/icons";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import type { DashboardWorkspaceCompany } from "@/lib/dashboard/load-dashboard-workspace";
import { WorkspacePanel, WorkspaceSection } from "./workspace-section";

type WorkspaceContinueWorkingProps = {
  locale: string;
  labels: DashboardWorkspaceLabels["continueWorking"];
  continueCompany: DashboardWorkspaceCompany | null;
};

export function WorkspaceContinueWorking({
  locale,
  labels,
  continueCompany,
}: WorkspaceContinueWorkingProps) {
  return (
    <WorkspaceSection title={labels.title} description={labels.description}>
      {!continueCompany ? (
        <EmptyState title={labels.emptyTitle} description={labels.emptyDescription} />
      ) : (
        <Link
          href={`/${locale}/app/companies/${continueCompany.slug}`}
          className="block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <WorkspacePanel
            variant="elevated"
            className="group flex items-center justify-between gap-4 transition-all duration-200 hover:shadow-md motion-reduce:transition-none"
          >
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{labels.title}</p>
              <p className="text-xl font-semibold tracking-tight">{continueCompany.name}</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none">
              <IconArrowRight />
            </span>
          </WorkspacePanel>
        </Link>
      )}
    </WorkspaceSection>
  );
}
