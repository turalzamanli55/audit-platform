"use client";

import { Button } from "@/components/ui/button";
import { Portal } from "@/components/ui/portal";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import {
  DASHBOARD_WIDGET_IDS,
} from "@/types/dashboard-preferences";
import { useSettings } from "@/providers";
import { updateWidgetPreference } from "@/lib/dashboard/dashboard-preferences-storage";

type DashboardCustomizePanelProps = {
  open: boolean;
  onClose: () => void;
  labels: DashboardWorkspaceLabels["personalization"];
};

export function DashboardCustomizePanel({ open, onClose, labels }: DashboardCustomizePanelProps) {
  const { settings, updateDashboardPreferences, resetDashboardPreferences } = useSettings();

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[1600] flex justify-end">
        <button
          type="button"
          className="absolute inset-0 bg-overlay"
          aria-label={labels.done}
          onClick={onClose}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label={labels.widgetControls}
          className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-border/60 bg-card shadow-xl ds-safe-top ds-safe-bottom"
        >
          <div className="border-b border-border/60 px-5 py-4">
            <h2 className="text-lg font-semibold tracking-tight">{labels.widgetControls}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{labels.customizeDescription}</p>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="space-y-6">
              <section className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">{labels.density}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={settings.dashboard.density === "comfortable" ? "primary" : "secondary"}
                    onClick={() =>
                      updateDashboardPreferences((current) => ({
                        ...current,
                        density: "comfortable",
                      }))
                    }
                  >
                    {labels.densityComfortable}
                  </Button>
                  <Button
                    type="button"
                    variant={settings.dashboard.density === "compact" ? "primary" : "secondary"}
                    onClick={() =>
                      updateDashboardPreferences((current) => ({
                        ...current,
                        density: "compact",
                      }))
                    }
                  >
                    {labels.densityCompact}
                  </Button>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">{labels.favoriteWidgets}</h3>
                <p className="text-sm text-muted-foreground">
                  {settings.dashboard.favoriteWidgetIds.length > 0
                    ? settings.dashboard.favoriteWidgetIds
                        .map((id) => labels.widgetLabels[id])
                        .join(", ")
                    : "—"}
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">{labels.widgetControls}</h3>
                <ul className="space-y-2">
                  {DASHBOARD_WIDGET_IDS.map((widgetId) => {
                    const widget = settings.dashboard.widgets[widgetId];
                    return (
                      <li
                        key={widgetId}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border/50 px-3 py-2.5"
                      >
                        <span className="text-sm font-medium">{labels.widgetLabels[widgetId]}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant={widget.visible ? "secondary" : "ghost"}
                          onClick={() =>
                            updateDashboardPreferences((current) =>
                              updateWidgetPreference(current, widgetId, {
                                visible: !widget.visible,
                              }),
                            )
                          }
                        >
                          {widget.visible ? labels.hide : labels.show}
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </div>
          </div>

          <div className="border-t border-border/60 p-5">
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              onClick={() => {
                resetDashboardPreferences();
                onClose();
              }}
            >
              {labels.reset}
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">{labels.resetConfirm}</p>
          </div>
        </aside>
      </div>
    </Portal>
  );
}
