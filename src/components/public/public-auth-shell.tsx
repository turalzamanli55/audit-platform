import type { ReactNode } from "react";
import { PublicAuthChrome } from "./public-auth-chrome";
import { cn } from "@/lib/ui/cn";

type PublicAuthShellProps = {
  children: ReactNode;
  locale: string;
  wide?: boolean;
  chromeLabels: {
    language: string;
    theme: string;
    themeLight: string;
    themeDark: string;
  };
};

export function PublicAuthShell({ children, locale, wide = false, chromeLabels }: PublicAuthShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PublicAuthChrome locale={locale} labels={chromeLabels} />
      <main
        id="main-content"
        className={cn(
          "flex flex-1 px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-10",
          wide ? "items-start justify-center lg:items-center lg:py-12" : "items-center justify-center",
        )}
        role="main"
      >
        {children}
      </main>
    </div>
  );
}
