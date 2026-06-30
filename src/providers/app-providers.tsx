import type { ReactNode } from "react";
import type { Locale } from "@/i18n";
import type { AuthSession } from "@/types/auth";
import { ThemeProvider } from "./theme-provider";
import { LanguageProvider } from "./language-provider";
import { AuthProvider } from "./auth-provider";
import { NotificationProvider } from "./notification-provider";
import { SettingsProvider } from "./settings-provider";

type AppProvidersProps = {
  children: ReactNode;
  locale: Locale;
  initialSession?: AuthSession;
};

function buildAuthProviderKey(session: AuthSession | undefined): string {
  if (!session) return "unauthenticated";
  const permissionCodes = Array.isArray(session.user?.permissionCodes)
    ? session.user.permissionCodes.join(",")
    : "";
  return [
    session.status,
    session.user?.id ?? "anonymous",
    session.user?.organizationId ?? "",
    session.user?.workspaceId ?? "",
    permissionCodes,
    session.expiresAt ?? "",
  ].join(":");
}

export function AppProviders({ children, locale, initialSession }: AppProvidersProps) {
  const authKey = buildAuthProviderKey(initialSession);

  return (
    <ThemeProvider>
      <LanguageProvider locale={locale}>
        <AuthProvider key={authKey} initialSession={initialSession}>
          <SettingsProvider initialLocale={locale}>
            <NotificationProvider>{children}</NotificationProvider>
          </SettingsProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export { ThemeProvider, useTheme } from "./theme-provider";
export { LanguageProvider, useLanguage } from "./language-provider";
export { AuthProvider, useAuth } from "./auth-provider";
export { NotificationProvider, useNotifications } from "./notification-provider";
export { SettingsProvider, useSettings } from "./settings-provider";
