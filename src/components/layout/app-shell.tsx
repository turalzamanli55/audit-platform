import type { ReactNode } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { ContentArea } from "./content-area";
import { Footer } from "./footer";

type AppShellProps = {
  children: ReactNode;
  header?: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
};

/**
 * Responsive application shell — desktop sidebar + header/footer grid.
 * Architecture foundation; navigation items added in future sprints.
 */
export function AppShell({ children, header, sidebar, footer }: AppShellProps) {
  return (
    <div className="ds-shell-grid min-h-dvh bg-background">
      {header ?? <Header />}
      <div className="ds-app-grid min-h-0">
        {sidebar ?? <Sidebar />}
        <ContentArea>{children}</ContentArea>
      </div>
      {footer ?? <Footer />}
    </div>
  );
}
