import type { Locale } from "./types";

export type Dictionary = {
  common: {
    appName: string;
    loading: string;
    error: string;
    empty: string;
    retry: string;
  };
  shell: {
    header: string;
    footer: string;
    navigation: string;
    foundation: string;
  };
  auth: {
    signIn: string;
    signOut: string;
    register: string;
    email: string;
    password: string;
    fullName: string;
    rememberMe: string;
    forgotPassword: string;
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    registerPrompt: string;
    registerLink: string;
    loginPrompt: string;
    forgotPasswordTitle: string;
    forgotPasswordSubtitle: string;
    sendResetLink: string;
    resetLinkSent: string;
    resetPasswordTitle: string;
    resetPasswordSubtitle: string;
    newPassword: string;
    confirmPassword: string;
    updatePassword: string;
    passwordUpdated: string;
    backToLogin: string;
    verifyEmailTitle: string;
    verifyEmailSubtitle: string;
    verifyEmailSent: string;
    verifyEmailGeneric: string;
    verificationSent: string;
  };
  onboarding: {
    title: string;
    subtitle: string;
    stepOrganization: string;
    stepWorkspace: string;
    stepComplete: string;
    organizationName: string;
    workspaceName: string;
    continue: string;
    finish: string;
    completeTitle: string;
    completeDescription: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    organization: string;
    workspace: string;
    themeLight: string;
    themeDark: string;
    navDashboard: string;
    userCardTitle: string;
    roles: string;
    permissions: string;
    statsOrganizations: string;
    statsWorkspaces: string;
    statsMembers: string;
    statsActivity: string;
    statsPlaceholder: string;
    welcomeTitle: string;
    welcomeDescription: string;
  };
};

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  az: () => import("./messages/az.json").then((m) => m.default as Dictionary),
  en: () => import("./messages/en.json").then((m) => m.default as Dictionary),
  ru: () => import("./messages/ru.json").then((m) => m.default as Dictionary),
  tr: () => import("./messages/tr.json").then((m) => m.default as Dictionary),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = dictionaries[locale] ?? dictionaries.az;
  return loader();
}
