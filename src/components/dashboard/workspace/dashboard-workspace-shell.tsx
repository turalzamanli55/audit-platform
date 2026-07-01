"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { buildWelcomeGreeting, buildWelcomeSummary } from "@/lib/dashboard/workspace-greeting";
import type { DashboardWorkspaceViewModel } from "@/lib/dashboard/load-dashboard-workspace";
import { COMPANIES_PATH, ENGAGEMENTS_PATH } from "@/config/dashboard-navigation";
import { useSettings } from "@/providers";
import { useShell } from "@/components/shell/shell-provider";
import { useTheme } from "@/providers";
import {
  trackRecentCompany,
  toggleFavoriteCompany,
} from "@/lib/dashboard/dashboard-preferences-storage";
import type { DashboardWidgetId } from "@/types/dashboard-preferences";
import { WorkspaceActivity } from "./workspace-activity";
import { WorkspaceCalendarCard } from "./workspace-calendar-card";
import { WorkspaceContextHeader, WorkspaceWelcome } from "./workspace-welcome";
import { WorkspaceContinueWorking } from "./workspace-continue-working";
import { WorkspaceInsightsCard } from "./workspace-insights-card";
import { WorkspaceKpiGrid } from "./workspace-kpi-grid";
import { WorkspacePinned } from "./workspace-pinned";
import { WorkspaceQuickActions } from "./workspace-quick-actions";
import { WorkspaceShortcutsCard } from "./workspace-shortcuts-card";
import { WorkspaceTasks } from "./workspace-tasks";
import { WorkspaceTipsCard } from "./workspace-tips-card";
import { DashboardWidgetChrome } from "./dashboard-widget-chrome";
import {
  DashboardCustomizePanel,
  DashboardCustomizeToolbar,
  densityClasses,
  useDashboardWidgetActions,
} from "./dashboard-personalization";
import { SkeletonCard } from "@/components/ui/skeleton";
import { cn } from "@/lib/ui/cn";

const WorkspaceAiCard = dynamic(
  () => import("./workspace-ai-card").then((module) => module.WorkspaceAiCard),
  { loading: () => <SkeletonCard /> },
);

const WorkspaceNotificationsCard = dynamic(
  () => import("./workspace-notifications-card").then((module) => module.WorkspaceNotificationsCard),
  { loading: () => <SkeletonCard /> },
);

type DashboardWorkspaceShellProps = {
  model: DashboardWorkspaceViewModel;
};

function resolveCompaniesByIds(
  companies: DashboardWorkspaceViewModel["companies"],
  ids: string[],
) {
  return ids
    .map((id) => companies.find((company) => company.id === id))
    .filter((company): company is NonNullable<typeof company> => Boolean(company));
}

export function DashboardWorkspaceShell({ model }: DashboardWorkspaceShellProps) {
  const { labels, locale } = model;
  const router = useRouter();
  const { setMode, resolvedTheme } = useTheme();
  const { toggleSidebar, setCommandPaletteOpen } = useShell();
  const {
    updateDashboardPreferences,
    resetDashboardPreferences,
    registerDashboardCommands,
  } = useSettings();
  const [customizeMode, setCustomizeMode] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const {
    preferences,
    density,
    getWidgetLabel,
    sortedHeroWidgets,
    sortedMainWidgets,
    sortedSideWidgets,
    isVisible,
    actions,
  } = useDashboardWidgetActions({ customizeMode });

  const recentCompanies = useMemo(
    () => resolveCompaniesByIds(model.companies, preferences.recentCompanyIds),
    [model.companies, preferences.recentCompanyIds],
  );

  const favoriteCompanies = useMemo(
    () => resolveCompaniesByIds(model.companies, preferences.favoriteCompanyIds),
    [model.companies, preferences.favoriteCompanyIds],
  );

  const continueCompany =
    recentCompanies[0] ?? favoriteCompanies[0] ?? model.continueCompany;

  const greeting = buildWelcomeGreeting(labels.welcome.greeting, {
    timeOfDay: model.timeOfDay,
    name: model.userName,
  });

  const summary = buildWelcomeSummary(labels.welcome.summary, {
    workspace: model.workspaceName,
    organization: model.organizationName,
  });

  const trackCompany = useCallback(
    (companyId: string) => {
      updateDashboardPreferences((current) => trackRecentCompany(current, companyId));
    },
    [updateDashboardPreferences],
  );

  const toggleFavoriteCompanyById = useCallback(
    (companyId: string) => {
      updateDashboardPreferences((current) => toggleFavoriteCompany(current, companyId));
    },
    [updateDashboardPreferences],
  );

  const scrollToWidget = useCallback((widgetId: DashboardWidgetId) => {
    document.getElementById(`dashboard-widget-${widgetId}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  useEffect(() => {
    registerDashboardCommands({
      customize: () => {
        setCustomizeMode(true);
        setPanelOpen(true);
      },
      reset: () => resetDashboardPreferences(),
      toggleSidebar: () => toggleSidebar(),
      toggleTheme: () => setMode(resolvedTheme === "dark" ? "light" : "dark"),
      searchCompanies: () => router.push(`/${locale}${COMPANIES_PATH}`),
      searchEngagements: () => router.push(`/${locale}${ENGAGEMENTS_PATH}`),
      openCalendar: () => scrollToWidget("calendar"),
      openAi: () => scrollToWidget("ai"),
    });

    return () => registerDashboardCommands(null);
  }, [
    locale,
    registerDashboardCommands,
    resetDashboardPreferences,
    resolvedTheme,
    router,
    scrollToWidget,
    setCommandPaletteOpen,
    setMode,
    toggleSidebar,
  ]);

  function renderWidget(widgetId: DashboardWidgetId) {
    if (!isVisible(widgetId)) return null;

    const preference = preferences.widgets[widgetId];
    const widgetLabel = getWidgetLabel(widgetId, labels);
    const isFavorite = preferences.favoriteWidgetIds.includes(widgetId);

    const content = (() => {
      switch (widgetId) {
        case "welcome":
          return (
            <WorkspaceWelcome
              greeting={greeting}
              summary={summary}
              motivation={labels.welcome.motivation}
            />
          );
        case "kpi":
          return <WorkspaceKpiGrid labels={labels.kpi} values={model.kpi} />;
        case "quick-actions":
          return (
            <WorkspaceQuickActions
              locale={locale}
              labels={labels.quickActions}
              continueCompany={continueCompany}
              onContinueSelect={continueCompany ? () => trackCompany(continueCompany.id) : undefined}
            />
          );
        case "activity":
          return <WorkspaceActivity labels={labels.activity} />;
        case "continue":
          return (
            <WorkspaceContinueWorking
              locale={locale}
              labels={labels.continueWorking}
              continueCompany={continueCompany}
              onOpen={continueCompany ? () => trackCompany(continueCompany.id) : undefined}
            />
          );
        case "tasks":
          return <WorkspaceTasks labels={labels.tasks} />;
        case "pinned":
          return (
            <WorkspacePinned
              locale={locale}
              labels={labels.pinned}
              companies={model.companies}
              recentCompanies={recentCompanies}
              favoriteCompanies={favoriteCompanies}
              favoriteCompanyIds={preferences.favoriteCompanyIds}
              onToggleFavoriteCompany={toggleFavoriteCompanyById}
              onOpenCompany={trackCompany}
              personalizationLabels={labels.personalization}
              favoriteEngagementIds={preferences.favoriteEngagementIds}
              favoriteReportIds={preferences.favoriteReportIds}
            />
          );
        case "ai":
          return <WorkspaceAiCard labels={labels.ai} />;
        case "calendar":
          return <WorkspaceCalendarCard labels={labels.calendar} />;
        case "notifications":
          return <WorkspaceNotificationsCard labels={labels.notifications} />;
        case "insights":
          return <WorkspaceInsightsCard labels={labels.insights} />;
        case "shortcuts":
          return <WorkspaceShortcutsCard labels={labels.shortcuts} />;
        case "tips":
          return <WorkspaceTipsCard labels={labels.tips} />;
        default:
          return null;
      }
    })();

    return (
      <DashboardWidgetChrome
        key={widgetId}
        widgetId={widgetId}
        label={widgetLabel}
        preference={preference}
        customizeMode={customizeMode}
        isFavorite={isFavorite}
        labels={labels.personalization}
        onPin={() => actions.pin(widgetId)}
        onCollapse={() => actions.collapse(widgetId)}
        onExpand={() => actions.expand(widgetId)}
        onHide={() => actions.hide(widgetId)}
        onMoveUp={() => actions.moveUp(widgetId)}
        onMoveDown={() => actions.moveDown(widgetId)}
        onToggleFavorite={() => actions.favorite(widgetId)}
      >
        {content}
      </DashboardWidgetChrome>
    );
  }

  const wideWidgets = [...sortedMainWidgets, ...sortedSideWidgets].filter((widgetId) => {
    const pref = preferences.widgets[widgetId];
    return isVisible(widgetId) && (pref.expanded || pref.size === "wide");
  });

  const normalMain = sortedMainWidgets.filter(
    (widgetId) =>
      isVisible(widgetId) &&
      !preferences.widgets[widgetId].expanded &&
      preferences.widgets[widgetId].size !== "wide",
  );

  const normalSide = sortedSideWidgets.filter(
    (widgetId) =>
      isVisible(widgetId) &&
      !preferences.widgets[widgetId].expanded &&
      preferences.widgets[widgetId].size !== "wide",
  );

  return (
    <div className={cn("mx-auto w-full max-w-[90rem] pb-10", densityClasses(density))}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <WorkspaceContextHeader
          labels={labels.context}
          organizationName={model.organizationName}
          workspaceName={model.workspaceName}
          companyName={continueCompany?.name ?? model.companyName}
          formattedDate={model.formattedDate}
        />
        <DashboardCustomizeToolbar
          labels={labels.personalization}
          customizeMode={customizeMode}
          onToggleCustomize={() => setCustomizeMode((open) => !open)}
          onOpenPanel={() => setPanelOpen(true)}
        />
      </div>

      <div className="space-y-8 sm:space-y-10">
        {sortedHeroWidgets.map((widgetId) => renderWidget(widgetId))}
      </div>

      {wideWidgets.length > 0 ? (
        <div className="mt-8 space-y-8 sm:space-y-10">{wideWidgets.map((widgetId) => renderWidget(widgetId))}</div>
      ) : null}

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] xl:gap-10">
        <div className="space-y-8 sm:space-y-10">{normalMain.map((widgetId) => renderWidget(widgetId))}</div>
        <div className="space-y-6 sm:space-y-8">{normalSide.map((widgetId) => renderWidget(widgetId))}</div>
      </div>

      <DashboardCustomizePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        labels={labels.personalization}
      />
    </div>
  );
}
