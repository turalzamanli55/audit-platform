import dynamic from "next/dynamic";
import { SkeletonCard } from "@/components/ui/skeleton";
import { buildWelcomeGreeting, buildWelcomeSummary } from "@/lib/dashboard/workspace-greeting";
import type { DashboardWorkspaceViewModel } from "@/lib/dashboard/load-dashboard-workspace";
import { WorkspaceActivity } from "./workspace-activity";
import { WorkspaceCalendarCard } from "./workspace-calendar-card";
import { WorkspaceContextHeader, WorkspaceWelcome } from "./workspace-welcome";
import { WorkspaceContinueWorking } from "./workspace-continue-working";
import { WorkspaceInsightsCard } from "./workspace-insights-card";
import { WorkspaceKpiGrid } from "./workspace-kpi-grid";
import { WorkspaceLayout } from "./workspace-layout";
import { WorkspacePinned } from "./workspace-pinned";
import { WorkspaceQuickActions } from "./workspace-quick-actions";
import { WorkspaceShortcutsCard } from "./workspace-shortcuts-card";
import { WorkspaceTasks } from "./workspace-tasks";
import { WorkspaceTipsCard } from "./workspace-tips-card";

const WorkspaceAiCard = dynamic(
  () => import("./workspace-ai-card").then((module) => module.WorkspaceAiCard),
  { loading: () => <SkeletonCard /> },
);

const WorkspaceNotificationsCard = dynamic(
  () => import("./workspace-notifications-card").then((module) => module.WorkspaceNotificationsCard),
  { loading: () => <SkeletonCard /> },
);

type DashboardWorkspaceExperienceProps = {
  model: DashboardWorkspaceViewModel;
};

export function DashboardWorkspaceExperience({ model }: DashboardWorkspaceExperienceProps) {
  const { labels, locale } = model;

  const greeting = buildWelcomeGreeting(labels.welcome.greeting, {
    timeOfDay: model.timeOfDay,
    name: model.userName,
  });

  const summary = buildWelcomeSummary(labels.welcome.summary, {
    workspace: model.workspaceName,
    organization: model.organizationName,
  });

  return (
    <WorkspaceLayout
      header={
        <WorkspaceContextHeader
          labels={labels.context}
          organizationName={model.organizationName}
          workspaceName={model.workspaceName}
          companyName={model.companyName}
          formattedDate={model.formattedDate}
        />
      }
      welcome={
        <WorkspaceWelcome
          greeting={greeting}
          summary={summary}
          motivation={labels.welcome.motivation}
        />
      }
      kpi={<WorkspaceKpiGrid labels={labels.kpi} values={model.kpi} />}
      quickActions={
        <WorkspaceQuickActions
          locale={locale}
          labels={labels.quickActions}
          continueCompany={model.continueCompany}
        />
      }
      mainLeft={
        <>
          <WorkspaceActivity labels={labels.activity} />
          <WorkspaceContinueWorking
            locale={locale}
            labels={labels.continueWorking}
            continueCompany={model.continueCompany}
          />
          <WorkspaceTasks labels={labels.tasks} />
          <WorkspacePinned locale={locale} labels={labels.pinned} companies={model.companies} />
        </>
      }
      mainRight={
        <>
          <WorkspaceAiCard labels={labels.ai} />
          <WorkspaceCalendarCard labels={labels.calendar} />
          <WorkspaceNotificationsCard labels={labels.notifications} />
          <WorkspaceInsightsCard labels={labels.insights} />
          <WorkspaceShortcutsCard labels={labels.shortcuts} />
          <WorkspaceTipsCard labels={labels.tips} />
        </>
      }
      footer={null}
    />
  );
}
