import type { ReactNode } from "react";

type WorkspaceLayoutProps = {
  header: ReactNode;
  welcome: ReactNode;
  kpi: ReactNode;
  quickActions: ReactNode;
  mainLeft: ReactNode;
  mainRight: ReactNode;
  footer: ReactNode;
};

export function WorkspaceLayout({
  header,
  welcome,
  kpi,
  quickActions,
  mainLeft,
  mainRight,
  footer,
}: WorkspaceLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-[90rem] space-y-8 pb-10 sm:space-y-10 lg:space-y-12">
      {header}
      {welcome}
      {kpi}
      {quickActions}
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] xl:gap-10">
        <div className="space-y-8 sm:space-y-10">{mainLeft}</div>
        <div className="space-y-6 sm:space-y-8">{mainRight}</div>
      </div>
      {footer}
    </div>
  );
}
