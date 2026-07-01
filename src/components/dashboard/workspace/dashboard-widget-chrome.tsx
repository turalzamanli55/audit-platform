"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  IconChevronDown,
  IconChevronUp,
  IconPanelLeft,
  IconStar,
  IconX,
} from "@/components/ui/icons";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import type { DashboardWidgetId, DashboardWidgetPreference } from "@/types/dashboard-preferences";
import { cn } from "@/lib/ui/cn";

type DashboardWidgetChromeProps = {
  widgetId: DashboardWidgetId;
  label: string;
  preference: DashboardWidgetPreference;
  customizeMode: boolean;
  isFavorite: boolean;
  labels: DashboardWorkspaceLabels["personalization"];
  onPin: () => void;
  onCollapse: () => void;
  onExpand: () => void;
  onHide: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleFavorite: () => void;
  children: ReactNode;
};

export function DashboardWidgetChrome({
  widgetId,
  label,
  preference,
  customizeMode,
  isFavorite,
  labels,
  onPin,
  onCollapse,
  onExpand,
  onHide,
  onMoveUp,
  onMoveDown,
  onToggleFavorite,
  children,
}: DashboardWidgetChromeProps) {
  if (!preference.visible && !customizeMode) {
    return null;
  }

  return (
    <section
      id={`dashboard-widget-${widgetId}`}
      aria-labelledby={`dashboard-widget-${widgetId}-label`}
      className={cn(
        "relative scroll-mt-28 transition-all duration-200 motion-reduce:transition-none",
        !preference.visible && customizeMode && "opacity-50",
        preference.expanded && "xl:col-span-2",
        preference.size === "wide" && "xl:col-span-2",
      )}
    >
      {customizeMode ? (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-primary/25 bg-primary/5 px-3 py-2">
          <p
            id={`dashboard-widget-${widgetId}-label`}
            className="mr-auto text-sm font-medium text-foreground"
          >
            {label}
          </p>
          <Button type="button" size="sm" variant="ghost" onClick={onMoveUp} aria-label={labels.moveUp}>
            <IconChevronUp />
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={onMoveDown} aria-label={labels.moveDown}>
            <IconChevronDown />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={preference.pinned ? "primary" : "ghost"}
            onClick={onPin}
            aria-label={preference.pinned ? labels.unpin : labels.pin}
          >
            <IconPanelLeft />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={isFavorite ? "primary" : "ghost"}
            onClick={onToggleFavorite}
            aria-label={isFavorite ? labels.unfavorite : labels.favorite}
          >
            <IconStar />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onCollapse}
            aria-label={preference.collapsed ? labels.expand : labels.collapse}
          >
            {preference.collapsed ? labels.expand : labels.collapse}
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={onExpand} aria-label={labels.resize}>
            {preference.size === "wide" ? labels.resizeDefault : labels.resizeWide}
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={onHide} aria-label={labels.hide}>
            <IconX />
          </Button>
        </div>
      ) : null}

      {preference.collapsed ? (
        <button
          type="button"
          onClick={onCollapse}
          className="flex w-full items-center justify-between rounded-2xl border border-border/50 bg-card/70 px-5 py-4 text-left text-sm font-medium text-foreground hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {label}
          <span className="text-muted-foreground">{labels.expand}</span>
        </button>
      ) : (
        children
      )}
    </section>
  );
}
