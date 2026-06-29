import { breakpoints } from "@/constants/breakpoints";

/**
 * Responsive design configuration — desktop-first enterprise layout.
 */
export const responsiveStrategy = {
  approach: "desktop-first" as const,
  breakpoints,
  targets: ["desktop", "laptop", "tablet", "ipad", "android", "iphone"] as const,
  container: "ds-container",
  shell: {
    headerHeight: "var(--ds-header-height)",
    footerHeight: "var(--ds-footer-height)",
    sidebarWidth: "var(--ds-sidebar-width)",
    sidebarCollapsedWidth: "var(--ds-sidebar-width-collapsed)",
  },
};
