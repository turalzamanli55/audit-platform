import type { ReactNode } from "react";

type SidebarProps = {
  children?: ReactNode;
  collapsed?: boolean;
};

export function Sidebar({ children, collapsed = false }: SidebarProps) {
  return (
    <aside
      className="hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex lg:flex-col"
      style={{
        width: collapsed ? "var(--ds-sidebar-width-collapsed)" : "var(--ds-sidebar-width)",
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex flex-1 flex-col overflow-y-auto p-3">{children}</div>
    </aside>
  );
}
