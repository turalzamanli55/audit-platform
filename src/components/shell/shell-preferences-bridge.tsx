"use client";

import { useEffect, useRef } from "react";
import { useSettings } from "@/providers";
import { useShell } from "./shell-provider";

export function ShellPreferencesBridge() {
  const { settings, hydrated, updateDashboardPreferences } = useSettings();
  const { sidebarCollapsed, setSidebarCollapsed, toggleSidebar } = useShell();
  const hydratedSidebar = useRef(false);

  useEffect(() => {
    if (!hydrated || hydratedSidebar.current) return;
    hydratedSidebar.current = true;
    setSidebarCollapsed(settings.dashboard.sidebarCollapsed);
  }, [hydrated, settings.dashboard.sidebarCollapsed, setSidebarCollapsed]);

  useEffect(() => {
    if (!hydrated) return;
    updateDashboardPreferences((current) =>
      current.sidebarCollapsed === sidebarCollapsed
        ? current
        : { ...current, sidebarCollapsed },
    );
  }, [sidebarCollapsed, hydrated, updateDashboardPreferences]);

  useEffect(() => {
    const handleToggle = () => toggleSidebar();
    window.addEventListener("shell:toggle-sidebar", handleToggle);
    return () => window.removeEventListener("shell:toggle-sidebar", handleToggle);
  }, [toggleSidebar]);

  return null;
}
