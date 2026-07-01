import type { Locale } from "./types";
import type { MarketingLabels } from "./marketing-types";
import type { AuthExperienceLabels } from "./auth-experience-types";

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
    searchPlaceholder: string;
    companySwitcher: string;
    language: string;
    notifications: string;
    notificationsEmpty: string;
    markAllRead: string;
    userMenu: string;
    profile: string;
    openSearch: string;
    commandPalette: {
      placeholder: string;
      empty: string;
      recent: string;
      navigation: string;
      actions: string;
      settings: string;
      close: string;
    };
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
    theme: string;
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
    workspace: {
      heroEyebrow: string;
      navAriaLabel: string;
      navOverview: string;
      navIdentity: string;
      navFinancial: string;
      navCompliance: string;
      navContacts: string;
      navHistory: string;
      navSettings: string;
      loading: string;
      errorTitle: string;
      errorDescription: string;
      summaryFramework: string;
      summaryCurrency: string;
      summaryPresentationCurrency: string;
      summaryFiscalYear: string;
      summaryEntityType: string;
      summaryIndustry: string;
      metadataTitle: string;
      metadataDescription: string;
      metadataSlug: string;
      metadataCreated: string;
      noAddress: string;
      notValidated: string;
      sections: {
        overview: {
          title: string;
          description: string;
          highlightsTitle: string;
          highlightsDescription: string;
          noDescription: string;
        };
        identity: {
          title: string;
        };
        financial: {
          title: string;
          description: string;
          cardTitle: string;
          cardDescription: string;
        };
        compliance: {
          title: string;
          description: string;
          emptyTitle: string;
          emptyDescription: string;
        };
        contacts: {
          title: string;
          description: string;
          emptyTitle: string;
          emptyDescription: string;
          financeEmptyTitle: string;
          financeEmptyDescription: string;
          auditorEmptyTitle: string;
          auditorEmptyDescription: string;
        };
        history: {
          title: string;
          description: string;
          emptyTitle: string;
          emptyDescription: string;
        };
        settings: {
          title: string;
          description: string;
          configurationTitle: string;
          configurationDescription: string;
          addressesTitle: string;
          addressesDescription: string;
          registeredAddress: string;
          operatingAddress: string;
          defaultLocale: string;
          dataImportSource: string;
          roundingConvention: string;
          recordVersion: string;
          settingsVersion: string;
          validationTitle: string;
          validationDescription: string;
          schemaVersion: string;
          validatedAt: string;
        };
      };
    };
    settings: {
      title: string;
      description: string;
      navAriaLabel: string;
      navGeneral: string;
      navReporting: string;
      navFinancial: string;
      navContacts: string;
      navPreferences: string;
      navValidation: string;
      readOnlyBadge: string;
      saveIdle: string;
      saveSaving: string;
      saveSaved: string;
      saveError: string;
      unsavedMessage: string;
      discardLabel: string;
      saveLabel: string;
      savingLabel: string;
      conflictTitle: string;
      conflictDescription: string;
      conflictRefresh: string;
      conflictDiscard: string;
      loading: string;
      errorTitle: string;
      errorDescription: string;
      sections: {
        general: {
          title: string;
          description: string;
          classificationTitle: string;
          registeredAddressTitle: string;
          operatingAddressTitle: string;
          addressHint: string;
        };
        reporting: {
          title: string;
          description: string;
          groupTitle: string;
          groupDescription: string;
        };
        financial: {
          title: string;
          description: string;
          groupTitle: string;
          groupDescription: string;
          currencyHint: string;
        };
        contacts: {
          title: string;
          description: string;
        };
        preferences: {
          title: string;
          description: string;
          groupTitle: string;
          groupDescription: string;
          defaultLocale: string;
          dataImportSource: string;
          roundingConvention: string;
          tradeNameHint: string;
        };
        validation: {
          title: string;
          description: string;
          groupTitle: string;
          readOnlyNotice: string;
        };
      };
    };
    overview: {
      editDescription: string;
      saveDescription: string;
      cancelEdit: string;
    };
    identity: {
      title: string;
      description: string;
      readOnlyBadge: string;
      readOnlyConfigureBadge: string;
      slugLabel: string;
      archivedYes: string;
      archivedNo: string;
      createdLabel: string;
      archivedLabel: string;
      restoredLabel: string;
      notArchived: string;
      restoredHint: string;
      saveIdle: string;
      saveSaving: string;
      saveSaved: string;
      saveError: string;
      unsavedMessage: string;
      discardLabel: string;
      saveLabel: string;
      savingLabel: string;
      conflictTitle: string;
      conflictDescription: string;
      conflictRefresh: string;
      conflictDiscard: string;
      sections: {
        legal: {
          title: string;
          description: string;
          groupTitle: string;
        };
        registration: {
          title: string;
          description: string;
          groupTitle: string;
        };
        classification: {
          title: string;
          description: string;
          groupTitle: string;
        };
        status: {
          title: string;
          description: string;
          archivedState: string;
        };
        version: {
          title: string;
          description: string;
          groupTitle: string;
          recordVersion: string;
          settingsVersion: string;
        };
        lifecycle: {
          title: string;
          description: string;
          readOnlyDescription: string;
          readOnlyNotice: string;
          actionsTitle: string;
          archivePrompt: string;
          archiveAction: string;
          archiveConfirmTitle: string;
          archiveConfirmDescription: string;
          archiveReasonPlaceholder: string;
          archiveConfirmAction: string;
          restorePrompt: string;
          restoreAction: string;
          restoreConfirmTitle: string;
          restoreConfirmDescription: string;
          restoreReasonPlaceholder: string;
          restoreConfirmAction: string;
          reasonLabel: string;
          cancelAction: string;
        };
      };
    };
    history: {
      title: string;
      description: string;
      errorTitle: string;
      errorDescription: string;
      summary: {
        title: string;
        description: string;
        total: string;
        created: string;
        updated: string;
        settingsUpdated: string;
        archived: string;
        restored: string;
      };
      timeline: {
        title: string;
        description: string;
        emptyTitle: string;
        emptyDescription: string;
        reasonArchive: string;
        reasonRestore: string;
        fieldsChanged: string;
        actions: Record<string, string>;
      };
      version: {
        title: string;
        description: string;
        cardTitle: string;
        recordVersion: string;
        settingsVersion: string;
        created: string;
        archived: string;
        notArchived: string;
        restored: string;
        restoredHint: string;
      };
    };
  };
  marketing: MarketingLabels;
  authExperience: AuthExperienceLabels;
};

async function loadDictionary(locale: Locale): Promise<Dictionary> {
  const [base, marketing, authExperience] = await Promise.all([
    import(`./messages/${locale}.json`).then((m) => m.default),
    import(`./messages/marketing-${locale}.json`).then((m) => m.default as MarketingLabels),
    import(`./messages/auth-experience-${locale}.json`).then(
      (m) => m.default as AuthExperienceLabels,
    ),
  ]);
  return { ...base, marketing, authExperience } as Dictionary;
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  az: () => loadDictionary("az"),
  en: () => loadDictionary("en"),
  ru: () => loadDictionary("ru"),
  tr: () => loadDictionary("tr"),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = dictionaries[locale] ?? dictionaries.az;
  return loader();
}
