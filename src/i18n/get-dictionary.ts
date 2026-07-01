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
  companies: {
    navCompanies: string;
    title: string;
    subtitle: string;
    breadcrumbRoot: string;
    search: string;
    filterAll: string;
    filterActive: string;
    filterInactive: string;
    filterArchived: string;
    filterSuspended: string;
    sortName: string;
    sortUpdated: string;
    sortAsc: string;
    sortDesc: string;
    columnCompany: string;
    columnLegalName: string;
    columnCountry: string;
    columnFramework: string;
    columnStatus: string;
    columnUpdated: string;
    emptyTitle: string;
    emptyDescription: string;
    errorTitle: string;
    errorDescription: string;
    forbiddenTitle: string;
    forbiddenDescription: string;
    noWorkspaceTitle: string;
    noWorkspaceDescription: string;
    notFoundTitle: string;
    notFoundDescription: string;
    loading: string;
    results: string;
    page: string;
    of: string;
    previous: string;
    next: string;
    viewCompany: string;
    openMenu: string;
    selected: string;
    frameworkIfrs: string;
    frameworkLocalGaap: string;
    frameworkOther: string;
    updated: string;
    quickActions: string;
    createCompany: string;
    create: {
      title: string;
      subtitle: string;
      breadcrumbCompanies: string;
      breadcrumbCreate: string;
      stepIdentity: string;
      stepJurisdiction: string;
      stepFinancial: string;
      stepContacts: string;
      stepReview: string;
      stepIdentityTitle: string;
      stepIdentityDescription: string;
      stepJurisdictionTitle: string;
      stepJurisdictionDescription: string;
      stepFinancialTitle: string;
      stepFinancialDescription: string;
      stepContactsTitle: string;
      stepContactsDescription: string;
      stepReviewTitle: string;
      stepReviewDescription: string;
      legalName: string;
      displayName: string;
      displayNameHint: string;
      tradeName: string;
      registrationNumber: string;
      description: string;
      entityType: string;
      parentCompany: string;
      selectParent: string;
      industry: string;
      jurisdiction: string;
      addressLine1: string;
      addressLine2: string;
      addressCity: string;
      addressRegion: string;
      addressPostalCode: string;
      addressCountry: string;
      reportingFramework: string;
      functionalCurrency: string;
      presentationCurrency: string;
      fiscalYearEndMonth: string;
      fiscalYearEndDay: string;
      fiscalYearEnd: string;
      financeContactSection: string;
      auditorContactSection: string;
      contactName: string;
      contactTitle: string;
      contactEmail: string;
      contactPhone: string;
      optional: string;
      continue: string;
      back: string;
      cancel: string;
      createCompany: string;
      creating: string;
      autosaveHint: string;
      forbiddenTitle: string;
      forbiddenDescription: string;
      entityTypes: {
        standalone: string;
        parent: string;
        subsidiary: string;
        branch: string;
        joint_venture: string;
      };
      industries: {
        general: string;
        banking: string;
        insurance: string;
        construction: string;
        manufacturing: string;
        government: string;
        oil_gas: string;
        other: string;
      };
      frameworks: {
        IFRS: string;
        LOCAL_GAAP: string;
        OTHER: string;
      };
      months: string[];
    };
    detail: {
      subtitle: string;
      profileSection: string;
    };
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
