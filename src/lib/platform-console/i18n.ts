/**
 * Platform Console interface translations.
 *
 * This is a UI-only concern: the console language preference lives in its own
 * cookie and ONLY changes interface strings. It never changes routing, the app
 * locale, permissions, or any business logic. English is the default and the
 * fallback for any unsupported value. Adding a future language is a matter of
 * extending {@link CONSOLE_LOCALES} and adding a matching entry to
 * {@link CONSOLE_STRINGS}.
 */

export const PLATFORM_LOCALE_COOKIE = "audit-platform-locale";

export type ConsoleLocale = "en" | "az" | "ru";

export const DEFAULT_CONSOLE_LOCALE: ConsoleLocale = "en";

/** Languages offered in the Platform Console language selector. */
export const CONSOLE_LOCALES: ReadonlyArray<{ code: ConsoleLocale; label: string }> = [
  { code: "en", label: "English" },
  { code: "az", label: "Azərbaycan" },
  { code: "ru", label: "Русский" },
];

export type NavKey =
  | "dashboard"
  | "search"
  | "companies"
  | "organizations"
  | "users"
  | "subscriptions"
  | "licenses"
  | "plans"
  | "modules"
  | "featureFlags"
  | "security"
  | "activity"
  | "loginHistory"
  | "database"
  | "devops"
  | "settings";

export type ConsoleStrings = {
  header: { console: string };
  sidebar: { platform: string };
  account: {
    menu: string;
    signedInAs: string;
    profile: string;
    language: string;
    appearance: string;
    about: string;
    signOut: string;
    signingOut: string;
  };
  appearance: { system: string; light: string; dark: string };
  about: {
    title: string;
    version: string;
    environment: string;
    buildDate: string;
    gitCommit: string;
    databaseVersion: string;
    notAvailable: string;
    close: string;
  };
  profile: {
    title: string;
    email: string;
    role: string;
    owner: string;
    environment: string;
  };
  nav: Record<NavKey, string>;
};

const CONSOLE_STRINGS: Record<ConsoleLocale, ConsoleStrings> = {
  en: {
    header: { console: "Platform Owner Console" },
    sidebar: { platform: "Platform" },
    account: {
      menu: "Account",
      signedInAs: "Signed in as",
      profile: "Profile",
      language: "Language",
      appearance: "Appearance",
      about: "About Platform",
      signOut: "Sign out",
      signingOut: "Signing out…",
    },
    appearance: { system: "System", light: "Light", dark: "Dark" },
    about: {
      title: "About Platform",
      version: "Platform Version",
      environment: "Environment",
      buildDate: "Build Date",
      gitCommit: "Git Commit",
      databaseVersion: "Database Version",
      notAvailable: "Not available",
      close: "Close",
    },
    profile: {
      title: "Profile",
      email: "Email",
      role: "Role",
      owner: "Platform Owner",
      environment: "Environment",
    },
    nav: {
      dashboard: "Dashboard",
      search: "Search",
      companies: "Companies",
      organizations: "Organizations",
      users: "Users",
      subscriptions: "Subscriptions",
      licenses: "Licenses",
      plans: "Plans",
      modules: "Modules",
      featureFlags: "Feature Flags",
      security: "Security Events",
      activity: "Activity",
      loginHistory: "Login History",
      database: "Database",
      devops: "DevOps",
      settings: "Settings",
    },
  },
  az: {
    header: { console: "Platforma Sahibi Konsolu" },
    sidebar: { platform: "Platforma" },
    account: {
      menu: "Hesab",
      signedInAs: "Daxil olub",
      profile: "Profil",
      language: "Dil",
      appearance: "Görünüş",
      about: "Platforma haqqında",
      signOut: "Çıxış",
      signingOut: "Çıxılır…",
    },
    appearance: { system: "Sistem", light: "İşıqlı", dark: "Qaranlıq" },
    about: {
      title: "Platforma haqqında",
      version: "Platforma versiyası",
      environment: "Mühit",
      buildDate: "Toplanma tarixi",
      gitCommit: "Git commit",
      databaseVersion: "Verilənlər bazası versiyası",
      notAvailable: "Mövcud deyil",
      close: "Bağla",
    },
    profile: {
      title: "Profil",
      email: "E-poçt",
      role: "Rol",
      owner: "Platforma sahibi",
      environment: "Mühit",
    },
    nav: {
      dashboard: "İdarə paneli",
      search: "Axtarış",
      companies: "Şirkətlər",
      organizations: "Təşkilatlar",
      users: "İstifadəçilər",
      subscriptions: "Abunəliklər",
      licenses: "Lisenziyalar",
      plans: "Planlar",
      modules: "Modullar",
      featureFlags: "Funksiya bayraqları",
      security: "Təhlükəsizlik hadisələri",
      activity: "Fəaliyyət",
      loginHistory: "Giriş tarixçəsi",
      database: "Verilənlər bazası",
      devops: "DevOps",
      settings: "Parametrlər",
    },
  },
  ru: {
    header: { console: "Консоль владельца платформы" },
    sidebar: { platform: "Платформа" },
    account: {
      menu: "Аккаунт",
      signedInAs: "Вы вошли как",
      profile: "Профиль",
      language: "Язык",
      appearance: "Оформление",
      about: "О платформе",
      signOut: "Выйти",
      signingOut: "Выход…",
    },
    appearance: { system: "Системная", light: "Светлая", dark: "Тёмная" },
    about: {
      title: "О платформе",
      version: "Версия платформы",
      environment: "Окружение",
      buildDate: "Дата сборки",
      gitCommit: "Git-коммит",
      databaseVersion: "Версия базы данных",
      notAvailable: "Недоступно",
      close: "Закрыть",
    },
    profile: {
      title: "Профиль",
      email: "Эл. почта",
      role: "Роль",
      owner: "Владелец платформы",
      environment: "Окружение",
    },
    nav: {
      dashboard: "Панель",
      search: "Поиск",
      companies: "Компании",
      organizations: "Организации",
      users: "Пользователи",
      subscriptions: "Подписки",
      licenses: "Лицензии",
      plans: "Планы",
      modules: "Модули",
      featureFlags: "Флаги функций",
      security: "События безопасности",
      activity: "Активность",
      loginHistory: "История входов",
      database: "База данных",
      devops: "DevOps",
      settings: "Настройки",
    },
  },
};

/**
 * Persists the console interface language to its dedicated cookie. UI-only:
 * this never changes the app locale, routing, or any business logic. Safe to
 * call on the server (no-op when `document` is unavailable).
 */
export function persistConsoleLocale(locale: ConsoleLocale): void {
  if (typeof document === "undefined") return;
  document.cookie = `${PLATFORM_LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`;
}

/** Normalizes any incoming value to a supported console locale (English fallback). */
export function resolveConsoleLocale(value: string | null | undefined): ConsoleLocale {
  if (value === "az" || value === "ru" || value === "en") return value;
  return DEFAULT_CONSOLE_LOCALE;
}

/** Returns the interface strings for the given locale, defaulting to English. */
export function getConsoleStrings(locale: string | null | undefined): ConsoleStrings {
  return CONSOLE_STRINGS[resolveConsoleLocale(locale)];
}
