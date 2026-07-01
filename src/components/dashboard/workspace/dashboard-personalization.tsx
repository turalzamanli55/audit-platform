"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import {
  DASHBOARD_WIDGET_IDS,
  type DashboardWidgetId,
  sortWidgetsByPreference,
} from "@/types/dashboard-preferences";
import { cn } from "@/lib/ui/cn";
import { useSettings } from "@/providers";
import { moveWidget, toggleFavoriteWidget, updateWidgetPreference } from "@/lib/dashboard/dashboard-preferences-storage";

const DashboardCustomizePanel = dynamic(
  () => import("./dashboard-customize-panel").then((module) => module.DashboardCustomizePanel),
  { ssr: false },
);

type DashboardCustomizeToolbarProps = {
  labels: DashboardWorkspaceLabels["personalization"];
  customizeMode: boolean;
  onToggleCustomize: () => void;
  onOpenPanel: () => void;
};

export function DashboardCustomizeToolbar({
  labels,
  customizeMode,
  onToggleCustomize,
  onOpenPanel,
}: DashboardCustomizeToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant={customizeMode ? "primary" : "secondary"}
        onClick={onToggleCustomize}
        aria-pressed={customizeMode}
      >
        {customizeMode ? labels.done : labels.customize}
      </Button>
      <Button type="button" variant="ghost" onClick={onOpenPanel}>
        {labels.widgetControls}
      </Button>
    </div>
  );
}

type UseDashboardWidgetActionsOptions = {
  customizeMode: boolean;
};

export function useDashboardWidgetActions({ customizeMode }: UseDashboardWidgetActionsOptions) {
  const { settings, updateDashboardPreferences } = useSettings();

  function mutateWidget(
    widgetId: DashboardWidgetId,
    partial: Parameters<typeof updateWidgetPreference>[2],
  ) {
    updateDashboardPreferences((current) => updateWidgetPreference(current, widgetId, partial));
  }

  return {
    preferences: settings.dashboard,
    density: settings.dashboard.density,
    getWidgetLabel: (widgetId: DashboardWidgetId, labels: DashboardWorkspaceLabels) =>
      labels.personalization.widgetLabels[widgetId] ?? widgetId,
    sortedHeroWidgets: sortWidgetsByPreference(
      DASHBOARD_WIDGET_IDS.filter((id) => settings.dashboard.widgets[id].column === "hero"),
      settings.dashboard.widgets,
    ),
    sortedMainWidgets: sortWidgetsByPreference(
      DASHBOARD_WIDGET_IDS.filter((id) => settings.dashboard.widgets[id].column === "main"),
      settings.dashboard.widgets,
    ),
    sortedSideWidgets: sortWidgetsByPreference(
      DASHBOARD_WIDGET_IDS.filter((id) => settings.dashboard.widgets[id].column === "side"),
      settings.dashboard.widgets,
    ),
    isVisible: (widgetId: DashboardWidgetId) =>
      settings.dashboard.widgets[widgetId].visible || customizeMode,
    actions: {
      pin: (widgetId: DashboardWidgetId) =>
        mutateWidget(widgetId, { pinned: !settings.dashboard.widgets[widgetId].pinned }),
      collapse: (widgetId: DashboardWidgetId) =>
        mutateWidget(widgetId, { collapsed: !settings.dashboard.widgets[widgetId].collapsed }),
      expand: (widgetId: DashboardWidgetId) =>
        mutateWidget(widgetId, {
          size: settings.dashboard.widgets[widgetId].size === "wide" ? "default" : "wide",
        }),
      hide: (widgetId: DashboardWidgetId) => mutateWidget(widgetId, { visible: false }),
      show: (widgetId: DashboardWidgetId) => mutateWidget(widgetId, { visible: true }),
      moveUp: (widgetId: DashboardWidgetId) =>
        updateDashboardPreferences((current) => moveWidget(current, widgetId, "up")),
      moveDown: (widgetId: DashboardWidgetId) =>
        updateDashboardPreferences((current) => moveWidget(current, widgetId, "down")),
      favorite: (widgetId: DashboardWidgetId) =>
        updateDashboardPreferences((current) => toggleFavoriteWidget(current, widgetId)),
    },
  };
}

export function densityClasses(density: "comfortable" | "compact") {
  return cn(
    density === "compact"
      ? "space-y-5 sm:space-y-6 [&_.workspace-panel]:p-5"
      : "space-y-8 sm:space-y-10 lg:space-y-12",
  );
}

export { DashboardCustomizePanel };
