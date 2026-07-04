import { cache } from "react";
import type { Locale } from "./types";
import type { MarketingLabels } from "./marketing-types";
import type { AuthExperienceLabels } from "./auth-experience-types";
import type { DashboardWorkspaceLabels } from "./dashboard-workspace-types";

type RiskAssessmentSectionLabels = {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  titlePlaceholder?: string;
  descriptionPlaceholder?: string;
  addAction?: string;
  categoryLabel?: string;
  riskTypeLabel?: string;
  likelihoodLabel?: string;
  impactLabel?: string;
  inherentRatingLabel?: string;
  namePlaceholder?: string;
  accountPlaceholder?: string;
  riskItemLabel?: string;
  referencePlaceholder?: string;
  ownerPlaceholder?: string;
  updateAction?: string;
  unassignedLabel?: string;
  bodyPlaceholder?: string;
  unratedLabel?: string;
  ratedItems?: string;
  significant?: string;
  likelihood?: string;
  impact?: string;
  residual?: string;
  auditAreaLabel?: string;
  auditAreaPlaceholder?: string;
  significantBadge?: string;
  procedureLinkedBadge?: string;
  procedureUnlinkedBadge?: string;
  accountLabel?: string;
  assertionLabel?: string;
  ratingLabel?: string;
  significantLabel?: string;
  emptyDetail?: string;
  filterSignificant?: string;
  selectRating?: string;
};

type RiskAssessmentLabels = {
  notFoundTitle: string;
  notFoundDescription: string;
  forbiddenTitle: string;
  forbiddenDescription: string;
  noWorkspaceTitle: string;
  noWorkspaceDescription: string;
  statuses: Record<string, string>;
  riskTypes: Record<string, string>;
  ratingLevels: Record<string, string>;
  likelihoods: Record<string, string>;
  impacts: Record<string, string>;
  responseTypes: Record<string, string>;
  assertions: Record<string, string>;
  noteTypes: Record<string, string>;
  actions: {
    add: string;
    update: string;
    archive: string;
    restore: string;
    submit: string;
    approve: string;
    return: string;
  };
  workflow: {
    title: string;
    description: string;
    submitAction: string;
    returnAction: string;
    returnConfirmAction: string;
    approveAction: string;
    acknowledgeAction: string;
    cancelAction: string;
    returnNotesLabel: string;
    returnNotesPlaceholder: string;
    readOnlyNotice: string;
    submittedNotice: string;
    approvedNotice: string;
    acknowledgedNotice: string;
    pendingAcknowledgmentNotice: string;
    errorGeneric: string;
  };
  empty: {
    title: string;
    description: string;
    createAction: string;
    creating: string;
    forbiddenDescription: string;
  };
  workspace: {
    title: string;
    description: string;
    statusTitle: string;
    statusDescription: string;
    progress: string;
    workflowTitle: string;
    workflowDescription: string;
    heatmapPreviewTitle: string;
    heatmapPreviewDescription: string;
    heroEyebrow: string;
    breadcrumbRiskAssessment: string;
    backToEngagement: string;
    planningGateTitle: string;
    planningGateDescription: string;
    materialityGateTitle: string;
    materialityGateDescription: string;
    navAriaLabel: string;
    navOverview: string;
    navInherentRisks: string;
    navControlRisks: string;
    navDetectionRisks: string;
    navFraudRisks: string;
    navItRisks: string;
    navComplianceRisks: string;
    navFinancialStatementRisks: string;
    navAssertionRisks: string;
    navSignificantRisks: string;
    navCategories: string;
    navScoring: string;
    navHeatmap: string;
    navMatrix: string;
    navResponses: string;
    navProcedures: string;
    navOwners: string;
    navReviewNotes: string;
    navComments: string;
    navHistory: string;
    navSettings: string;
    loading: string;
    errorTitle: string;
    errorDescription: string;
    archivedTitle: string;
    archivedDescription: string;
    summaryStatus: string;
    summaryVersion: string;
    summaryProgress: string;
    summarySignificant: string;
    summaryPendingReview: string;
    summaryOpenItems: string;
    sections: Record<string, { title: string; description: string }>;
  };
  inherentRisks: RiskAssessmentSectionLabels;
  controlRisks: RiskAssessmentSectionLabels;
  detectionRisks: RiskAssessmentSectionLabels;
  fraudRisks: RiskAssessmentSectionLabels;
  itRisks: RiskAssessmentSectionLabels;
  complianceRisks: RiskAssessmentSectionLabels;
  financialStatementRisks: RiskAssessmentSectionLabels;
  assertionRisks: RiskAssessmentSectionLabels;
  significantRisks: RiskAssessmentSectionLabels;
  categories: RiskAssessmentSectionLabels;
  scoring: RiskAssessmentSectionLabels;
  heatmap: RiskAssessmentSectionLabels;
  matrix: RiskAssessmentSectionLabels;
  responses: RiskAssessmentSectionLabels;
  procedures: RiskAssessmentSectionLabels;
  owners: RiskAssessmentSectionLabels;
  reviewNotes: RiskAssessmentSectionLabels;
  comments: RiskAssessmentSectionLabels;
  history: RiskAssessmentSectionLabels & {
    versionLabel: string;
    updatedLabel: string;
    actions: Record<string, string>;
  };
  settings: {
    title: string;
    description: string;
    archiveAction: string;
    archiveConfirmAction: string;
    restoreAction: string;
    restoreConfirmAction: string;
    cancelAction: string;
    archivedBanner: string;
    readOnlyNotice: string;
  };
};

type MaterialitySectionLabels = {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  bodyPlaceholder?: string;
  addAction?: string;
};

type MaterialityLabels = {
  notFoundTitle: string;
  notFoundDescription: string;
  forbiddenTitle: string;
  forbiddenDescription: string;
  noWorkspaceTitle: string;
  noWorkspaceDescription: string;
  statuses: Record<string, string>;
  benchmarkTypes: Record<string, string>;
  calculationTypes: Record<string, string>;
  commentTypes: Record<string, string>;
  thresholds: {
    overall: string;
    performance: string;
    trivial: string;
    notSet: string;
  };
  workflow: {
    title: string;
    description: string;
    submitAction: string;
    returnAction: string;
    returnConfirmAction: string;
    approveAction: string;
    cancelAction: string;
    returnNotesLabel: string;
    returnNotesPlaceholder: string;
    readOnlyNotice: string;
    submittedNotice: string;
    approvedNotice: string;
    returnedNotice: string;
    errorGeneric: string;
  };
  empty: {
    title: string;
    description: string;
    createAction: string;
    creating: string;
    forbiddenDescription: string;
  };
  workspace: {
    title: string;
    description: string;
    statusTitle: string;
    statusDescription: string;
    progress: string;
    workflowTitle: string;
    workflowDescription: string;
    thresholdsPreviewTitle: string;
    thresholdsPreviewDescription: string;
    heroEyebrow: string;
    breadcrumbMateriality: string;
    backToEngagement: string;
    planningGateTitle: string;
    planningGateDescription: string;
    navAriaLabel: string;
    navOverview: string;
    navOverall: string;
    navPerformance: string;
    navSpecific: string;
    navBenchmarks: string;
    navCalculations: string;
    navVersions: string;
    navComments: string;
    navHistory: string;
    navSettings: string;
    loading: string;
    errorTitle: string;
    errorDescription: string;
    archivedTitle: string;
    archivedDescription: string;
    summaryStatus: string;
    summaryVersion: string;
    summaryProgress: string;
    summaryOverall: string;
    summaryBenchmarks: string;
    summaryPendingReview: string;
    sections: Record<string, { title: string; description: string }>;
    historyActions: Record<string, string>;
  };
  calculator: {
    title: string;
    description: string;
    benchmarkLabel: string;
    benchmarkPlaceholder: string;
    amountLabel: string;
    amountPlaceholder: string;
    percentageLabel: string;
    percentagePlaceholder: string;
    calculatedLabel: string;
    manualOverrideLabel: string;
    overrideReasonLabel: string;
    overrideReasonPlaceholder: string;
    applyAction: string;
    selectBenchmarkAction: string;
    autoCalcNotice: string;
    manualOverrideNotice: string;
    noBenchmarksTitle: string;
    noBenchmarksDescription: string;
    benchmarkTypes: Record<string, string>;
  };
  overall: MaterialitySectionLabels;
  overallFields: {
    overallLabel: string;
    basisNotesLabel: string;
    notSetLabel: string;
  };
  performance: MaterialitySectionLabels;
  performanceFields: {
    performanceLabel: string;
    percentageLabel: string;
    notSetLabel: string;
  };
  specific: MaterialitySectionLabels;
  specificFields: {
    amountLabel: string;
    rationaleLabel: string;
  };
  benchmarks: MaterialitySectionLabels;
  calculations: MaterialitySectionLabels;
  versions: MaterialitySectionLabels;
  comments: MaterialitySectionLabels;
  history: MaterialitySectionLabels & {
    versionLabel: string;
    updatedLabel: string;
    actions: Record<string, string>;
  };
  settings: {
    title: string;
    description: string;
    archiveAction: string;
    archiveConfirmAction: string;
    restoreAction: string;
    restoreConfirmAction: string;
    cancelAction: string;
    archivedBanner: string;
    readOnlyNotice: string;
  };
  states: {
    loadingTitle: string;
    loadingDescription: string;
    archiveTitle: string;
    archiveDescription: string;
    readonlyTitle: string;
    readonlyDescription: string;
    permissionTitle: string;
    permissionDescription: string;
  };
};

export type Dictionary = {
  common: {
    appName: string;
    loading: string;
    error: string;
    empty: string;
    retry: string;
    accessRestricted: string;
    signInRequired: string;
    permissionDenied: string;
    permissionDeniedDescription: string;
    tryAgain: string;
    breadcrumbLabel: string;
    backTo: string;
  };
  shell: {
    header: string;
    footer: string;
    navigation: string;
    foundation: string;
    searchPlaceholder: string;
    companySwitcher: string;
    engagementSwitcher: string;
    language: string;
    notifications: string;
    notificationsEmpty: string;
    markAllRead: string;
    userMenu: string;
    profile: string;
    openSearch: string;
    drawerContextTitle: string;
    commandPalette: {
      placeholder: string;
      empty: string;
      recent: string;
      navigation: string;
      actions: string;
      settings: string;
      close: string;
      createCompany: string;
      createCompanyDescription: string;
      createEngagement: string;
      createEngagementDescription: string;
      goToDashboard: string;
    };
    workspaceRequired: string;
    accessRestricted: string;
    expandSidebar: string;
    collapseSidebar: string;
    dashboardHome: string;
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
      commandCenter: {
        heroTitle: string;
        heroSubtitle: string;
        healthTitle: string;
        executiveTitle: string;
        moduleProgressTitle: string;
        moduleProgressDescription: string;
        activeEngagementsTitle: string;
        activeEngagementsDescription: string;
        recentActivityTitle: string;
        recentActivityDescription: string;
        recentDocumentsTitle: string;
        recentDocumentsDescription: string;
        recentCommentsTitle: string;
        recentCommentsDescription: string;
        financialTitle: string;
        financialDescription: string;
        complianceTitle: string;
        complianceDescription: string;
        deadlinesTitle: string;
        deadlinesDescription: string;
        teamTitle: string;
        teamDescription: string;
        pendingReviewsTitle: string;
        pendingReviewsHint: string;
        kpiHealth: string;
        kpiActiveEngagements: string;
        kpiPendingReviews: string;
        kpiOpenFindings: string;
        kpiOverdue: string;
        kpiPlanningProgress: string;
        kpiFieldworkProgress: string;
        kpiTeamMembers: string;
        hintHealth: string;
        hintEngagements: string;
        hintReviews: string;
        hintFindings: string;
        hintOverdue: string;
        hintPlanning: string;
        hintFieldwork: string;
        hintTeam: string;
        healthOnTrack: string;
        healthMonitor: string;
        healthAttention: string;
        modulePlanning: string;
        moduleMateriality: string;
        moduleRisk: string;
        moduleFieldwork: string;
        statusActive: string;
        statusReview: string;
        statusNotStarted: string;
        pendingReview: string;
        complianceValidated: string;
        compliancePending: string;
        complianceStatus: string;
        jurisdiction: string;
        activeEngagementsLabel: string;
        framework: string;
        currency: string;
        fiscalYear: string;
        entityType: string;
        industry: string;
        viewFinancial: string;
        viewCompliance: string;
        overdue: string;
        engagementCount: string;
        actionViewEngagements: string;
        actionCreateEngagement: string;
        actionOpenPlanning: string;
        actionOpenRisk: string;
        actionOpenFieldwork: string;
        actionOpenMateriality: string;
        emptyEngagements: string;
        emptyEngagementsDescription: string;
        emptyActivity: string;
        emptyActivityDescription: string;
        emptyDocuments: string;
        emptyDocumentsDescription: string;
        emptyComments: string;
        emptyCommentsDescription: string;
        emptyDeadlines: string;
        emptyDeadlinesDescription: string;
        emptyTeam: string;
        emptyTeamDescription: string;
        activityCreated: string;
        activityUpdated: string;
        activitySettings: string;
        activityArchived: string;
        activityRestored: string;
        activityGeneric: string;
      };
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
  engagements: {
    navEngagements: string;
    title: string;
    subtitle: string;
    breadcrumbRoot: string;
    search: string;
    filterAll: string;
    filterActive: string;
    filterInactive: string;
    filterArchived: string;
    filterSuspended: string;
    filterLifecycleAll: string;
    sortName: string;
    sortUpdated: string;
    sortAsc: string;
    sortDesc: string;
    columnEngagement: string;
    columnClient: string;
    columnCode: string;
    columnType: string;
    columnLifecycle: string;
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
    viewEngagement: string;
    openMenu: string;
    selected: string;
    frameworkIfrs: string;
    frameworkLocalGaap: string;
    frameworkOther: string;
    updated: string;
    quickActions: string;
    createEngagement: string;
    lifecycleStatuses: Record<
      "draft" | "planning" | "fieldwork" | "review" | "completed" | "closed",
      string
    >;
    create: {
      title: string;
      subtitle: string;
      breadcrumbEngagements: string;
      breadcrumbCreate: string;
      stepGeneral: string;
      stepClient: string;
      stepReporting: string;
      stepTeam: string;
      stepDates: string;
      stepNotes: string;
      stepReview: string;
      stepGeneralTitle: string;
      stepGeneralDescription: string;
      stepClientTitle: string;
      stepClientDescription: string;
      stepReportingTitle: string;
      stepReportingDescription: string;
      stepTeamTitle: string;
      stepTeamDescription: string;
      stepDatesTitle: string;
      stepDatesDescription: string;
      stepNotesTitle: string;
      stepNotesDescription: string;
      stepReviewTitle: string;
      stepReviewDescription: string;
      name: string;
      engagementCode: string;
      engagementType: string;
      lifecycleStatus: string;
      clientCompany: string;
      selectClient: string;
      reportingFramework: string;
      periodStart: string;
      periodEnd: string;
      plannedStart: string;
      plannedEnd: string;
      description: string;
      notes: string;
      optional: string;
      continue: string;
      back: string;
      cancel: string;
      createEngagement: string;
      creating: string;
      autosaveHint: string;
      forbiddenTitle: string;
      forbiddenDescription: string;
      teamHelper: string;
      teamEmptyTitle: string;
      teamEmptyDescription: string;
      teamReviewLabel: string;
      teamReviewEmpty: string;
      teamRoles: Record<
        | "engagement_partner"
        | "engagement_manager"
        | "senior"
        | "staff"
        | "reviewer"
        | "observer",
        string
      >;
      engagementTypes: Record<
        "statutory_audit" | "review" | "agreed_upon_procedures" | "advisory" | "other",
        string
      >;
      frameworks: Record<"IFRS" | "LOCAL_GAAP" | "OTHER", string>;
    };
    workspace: {
      heroEyebrow: string;
      navAriaLabel: string;
      navOverview: string;
      navMembers: string;
      navPlanning: string;
      navMateriality: string;
      navRiskAssessment: string;
      navFieldwork: string;
      navHistory: string;
      navSettings: string;
      loading: string;
      errorTitle: string;
      errorDescription: string;
      summaryClient: string;
      summaryCode: string;
      summaryType: string;
      summaryLifecycle: string;
      summaryFramework: string;
      summaryPlannedDates: string;
      metadataTitle: string;
      metadataDescription: string;
      metadataSlug: string;
      metadataCreated: string;
      metadataPlannedDates: string;
      metadataMembers: string;
      commandCenter: {
        heroTitle: string;
        overallCompletion: string;
        executiveTitle: string;
        auditHealthTitle: string;
        auditMetricsTitle: string;
        pipelineTitle: string;
        pipelineDescription: string;
        reviewQueueTitle: string;
        reviewQueueDescription: string;
        outstandingTitle: string;
        outstandingDescription: string;
        activityTitle: string;
        activityDescription: string;
        timelineTitle: string;
        timelineDescription: string;
        documentsTitle: string;
        documentsDescription: string;
        teamTitle: string;
        teamDescription: string;
        decisionsTitle: string;
        decisionsDescription: string;
        commentsTitle: string;
        commentsDescription: string;
        companyHealthTitle: string;
        companyHealthDescription: string;
        phaseReview: string;
        phaseCompletion: string;
        statusReview: string;
        statusClear: string;
        openReviewQueue: string;
        openSettings: string;
        owner: string;
        lastUpdate: string;
        overdue: string;
        deadline: string;
        reportingPeriod: string;
        plannedSchedule: string;
        validationStatus: string;
        framework: string;
        jurisdiction: string;
        viewHistory: string;
        kpiAuditHealth: string;
        kpiCompletion: string;
        kpiPendingReviews: string;
        kpiOpenFindings: string;
        kpiLifecycle: string;
        kpiPlanning: string;
        kpiFieldwork: string;
        kpiTeam: string;
        kpiMateriality: string;
        kpiRisk: string;
        kpiProcedures: string;
        kpiSignificantRisks: string;
        hintAuditHealth: string;
        hintCompletion: string;
        hintReviews: string;
        hintFindings: string;
        hintLifecycle: string;
        hintPlanning: string;
        hintFieldwork: string;
        hintTeam: string;
        hintMateriality: string;
        hintRisk: string;
        hintProcedures: string;
        hintSignificant: string;
        healthOnTrack: string;
        healthMonitor: string;
        healthAttention: string;
        modulePlanning: string;
        moduleMateriality: string;
        moduleRisk: string;
        issueFindings: string;
        issueRiskItems: string;
        issueMaterialityItems: string;
        companyValidated: string;
        companyPending: string;
        decisionPlanningApproved: string;
        decisionMaterialityApproved: string;
        decisionRiskApproved: string;
        emptyActivity: string;
        emptyActivityDescription: string;
        emptyTimeline: string;
        emptyTimelineDescription: string;
        emptyDocuments: string;
        emptyDocumentsDescription: string;
        emptyTeam: string;
        emptyTeamDescription: string;
        emptyDecisions: string;
        emptyDecisionsDescription: string;
        emptyComments: string;
        emptyCommentsDescription: string;
      };
      phaseDashboard: {
        title: string;
        description: string;
        attentionTitle: string;
        attentionDescription: string;
        attentionPlanning: string;
        attentionMateriality: string;
        attentionRisk: string;
        attentionFieldwork: string;
      };
      phaseEmpty: {
        notStarted: string;
        planningTitle: string;
        planningDescription: string;
        materialityTitle: string;
        materialityDescription: string;
        riskTitle: string;
        riskDescription: string;
        fieldworkTitle: string;
        fieldworkDescription: string;
      };
      planning: {
        title: string;
        description: string;
        lifecycleStage: string;
        financialYear: string;
        plannedSchedule: string;
        teamSize: string;
        planningStatus: string;
        planningProgress: string;
        planVersion: string;
        checklistProgress: string;
        reportingFramework: string;
        openPlanning: string;
      };
      materiality: {
        title: string;
        description: string;
        lifecycleStage: string;
        financialYear: string;
        plannedSchedule: string;
        teamSize: string;
        materialityStatus: string;
        materialityProgress: string;
        packageVersion: string;
        overallMateriality: string;
        benchmarkCount: string;
        openMateriality: string;
      };
      riskAssessment: {
        title: string;
        description: string;
        lifecycleStage: string;
        financialYear: string;
        plannedSchedule: string;
        teamSize: string;
        riskStatus: string;
        riskProgress: string;
        assessmentVersion: string;
        significantRisks: string;
        pendingReview: string;
        openRiskAssessment: string;
      };
      fieldwork: {
        title: string;
        description: string;
        lifecycleStage: string;
        financialYear: string;
        plannedSchedule: string;
        teamSize: string;
        fieldworkStatus: string;
        fieldworkProgress: string;
        proceduresComplete: string;
        findingsCount: string;
        evidenceCount: string;
        openFieldwork: string;
      };
      client: {
        title: string;
        description: string;
        companyName: string;
        companySlug: string;
        engagementName: string;
        engagementCode: string;
        viewClient: string;
      };
      status: {
        title: string;
        description: string;
        progressLabel: string;
      };
      information: {
        title: string;
        description: string;
        reportingPeriod: string;
        internalNotes: string;
      };
      sections: {
        overview: {
          title: string;
          description: string;
          highlightsTitle: string;
          highlightsDescription: string;
          noDescription: string;
        };
        members: {
          title: string;
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
        };
      };
    };
    settings: {
      title: string;
      description: string;
      readOnlyNotice: string;
      saveLabel: string;
      savingLabel: string;
      discardLabel: string;
      sections: {
        general: { title: string; description: string };
        client: { title: string; description: string };
        reporting: { title: string; description: string };
        dates: { title: string; description: string };
        notes: { title: string; description: string };
      };
      lifecycle: {
        title: string;
        description: string;
        archivedBannerTitle: string;
        archivedBannerDescription: string;
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
        restoreConfirmAction: string;
        reasonLabel: string;
        cancelAction: string;
      };
    };
    overview: {
      editDescription: string;
      saveDescription: string;
      cancelEdit: string;
    };
    members: {
      title: string;
      description: string;
      emptyTitle: string;
      emptyDescription: string;
      joinedLabel: string;
      forbiddenTitle: string;
      forbiddenDescription: string;
      roles: Record<
        | "engagement_partner"
        | "engagement_manager"
        | "senior"
        | "staff"
        | "reviewer"
        | "observer",
        string
      >;
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
        statusChanged: string;
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
        created: string;
        archived: string;
        notArchived: string;
        restored: string;
        restoredHint: string;
      };
    };
  };
  planning: {
    notFoundTitle: string;
    notFoundDescription: string;
    forbiddenTitle: string;
    forbiddenDescription: string;
    noWorkspaceTitle: string;
    noWorkspaceDescription: string;
    statuses: Record<
      "not_started" | "in_progress" | "pending_review" | "returned" | "approved" | "superseded",
      string
    >;
    integrationStatuses: Record<"not_configured" | "placeholder" | "integrated", string>;
    empty: {
      title: string;
      description: string;
      createAction: string;
      creating: string;
      forbiddenDescription: string;
    };
    editor: {
      readOnlyNotice: string;
      saveLabel: string;
      savingLabel: string;
      discardLabel: string;
      placeholder: string;
    };
    workspace: {
      heroEyebrow: string;
      breadcrumbPlanning: string;
      backToEngagement: string;
      navAriaLabel: string;
      navOverview: string;
      navStrategy: string;
      navObjectives: string;
      navScope: string;
      navFramework: string;
      navMateriality: string;
      navRisk: string;
      navTeam: string;
      navTimeline: string;
      navNotes: string;
      navChecklist: string;
      navDocuments: string;
      navHistory: string;
      navSettings: string;
      loading: string;
      errorTitle: string;
      errorDescription: string;
      archivedTitle: string;
      archivedDescription: string;
      summaryStatus: string;
      summaryVersion: string;
      summaryFramework: string;
      summaryChecklist: string;
      summaryIntegration: string;
      status: {
        title: string;
        description: string;
        progressLabel: string;
        planningStatus: string;
        planVersion: string;
        checklistProgress: string;
        kpiProgress: string;
        materiality: string;
        risk: string;
      };
      sections: Record<
        | "overview"
        | "strategy"
        | "objectives"
        | "scope"
        | "framework"
        | "materiality"
        | "risk"
        | "team"
        | "timeline"
        | "notes"
        | "checklist"
        | "documents"
        | "history"
        | "settings",
        { title: string; description: string }
      >;
    };
    workflow: {
      eyebrow: string;
      lockedBadge: string;
      submitAction: string;
      returnAction: string;
      returnConfirmAction: string;
      approveAction: string;
      reviseAction: string;
      reviseConfirmAction: string;
      cancelAction: string;
      returnNotesTitle: string;
      returnNotesLabel: string;
      returnNotesPlaceholder: string;
      reviseNotesLabel: string;
      reviseNotesPlaceholder: string;
      pendingReviewNotice: string;
      errorGeneric: string;
    };
    comments: {
      title: string;
      description: string;
      emptyDescription: string;
      addLabel: string;
      addPlaceholder: string;
      addAction: string;
      reviewModeNotice: string;
      types: Record<"review" | "general" | "return", string>;
    };
    integration: {
      integrationReady: string;
      currentStatus: string;
      statuses: Record<"not_configured" | "placeholder" | "integrated", string>;
      materiality: {
        title: string;
        description: string;
        placeholderTitle: string;
        placeholderDescription: string;
      };
      risk: {
        title: string;
        description: string;
        placeholderTitle: string;
        placeholderDescription: string;
      };
    };
    team: {
      title: string;
      description: string;
      rosterTitle: string;
      rosterEmpty: string;
      capacityTitle: string;
      estimatedHours: string;
      notes: string;
      saveLabel: string;
      savingLabel: string;
    };
    timeline: {
      title: string;
      description: string;
      startDate: string;
      endDate: string;
      saveLabel: string;
      savingLabel: string;
      milestones: Record<"planning" | "fieldwork" | "review" | "completion", string>;
    };
    checklist: {
      title: string;
      description: string;
      progress: string;
      saveLabel: string;
      savingLabel: string;
      items: Record<
        | "objectives"
        | "scope"
        | "strategy"
        | "framework"
        | "materiality"
        | "risk"
        | "team"
        | "timeline",
        string
      >;
    };
    documents: {
      title: string;
      description: string;
      emptyTitle: string;
      emptyDescription: string;
      addTitle: string;
      nameLabel: string;
      namePlaceholder: string;
      typeLabel: string;
      addAction: string;
      metadataNotice: string;
      documentTypes: Record<
        "planning_memorandum" | "risk_assessment" | "materiality_worksheet" | "other",
        string
      >;
      statuses: Record<"uploaded" | "pending" | "archived", string>;
    };
    history: {
      title: string;
      description: string;
      emptyTitle: string;
      emptyDescription: string;
      actions: {
        created: string;
        updated: string;
        statusChanged: string;
        archived: string;
        restored: string;
        checklistUpdated: string;
        timelineUpdated: string;
        submitted: string;
        returned: string;
        approved: string;
        revised: string;
        commentAdded: string;
        documentAdded: string;
        documentRemoved: string;
      };
      revision: {
        title: string;
        description: string;
        entryTitle: string;
      };
      version: {
        title: string;
        description: string;
        cardTitle: string;
        recordVersion: string;
        planVersion: string;
        submitted: string;
        approved: string;
        notSubmitted: string;
        notApproved: string;
        created: string;
        updated: string;
        archived: string;
        notArchived: string;
      };
    };
    settings: {
      title: string;
      description: string;
      readOnlyNotice: string;
      lifecycle: {
        archivedBannerTitle: string;
        archivedBannerDescription: string;
        archivePrompt: string;
        archiveAction: string;
        archiveReasonPlaceholder: string;
        archiveConfirmAction: string;
        restorePrompt: string;
        restoreAction: string;
        restoreConfirmAction: string;
        reasonLabel: string;
        cancelAction: string;
      };
    };
  };
  riskAssessment: RiskAssessmentLabels;
  materiality: MaterialityLabels;
  fieldwork: {
    notFoundTitle: string;
    notFoundDescription: string;
    forbiddenTitle: string;
    forbiddenDescription: string;
    noWorkspaceTitle: string;
    noWorkspaceDescription: string;
    statuses: Record<"not_started" | "in_progress" | "substantially_complete" | "archived", string>;
    programStatuses: Record<
      "draft" | "approved" | "in_execution" | "substantially_complete" | "superseded",
      string
    >;
    procedureStatuses: Record<
      | "not_started"
      | "in_progress"
      | "pending_evidence"
      | "submitted_for_review"
      | "review_in_progress"
      | "returned"
      | "review_cleared"
      | "complete"
      | "blocked"
      | "deferred",
      string
    >;
    procedureTypes: Record<
      | "test_of_controls"
      | "substantive"
      | "analytical"
      | "sampling"
      | "inquiry"
      | "observation"
      | "inspection"
      | "reperformance",
      string
    >;
    workingPaperStatuses: Record<
      | "draft"
      | "in_progress"
      | "submitted"
      | "under_review"
      | "returned"
      | "cleared"
      | "complete"
      | "archived",
      string
    >;
    evidenceStatuses: Record<"pending" | "recorded" | "verified" | "archived", string>;
    findingStatuses: Record<"open" | "in_review" | "resolved" | "closed", string>;
    actions: {
      start: string;
      complete: string;
      addWorkingPaper: string;
      addEvidence: string;
      addFinding: string;
      addNote: string;
      addTickmark: string;
      uploadEvidence: string;
    };
    workflow: {
      queueTitle: string;
      queueDescription: string;
      queueEmpty: string;
      pendingReviewCount: string;
      openProcedureAction: string;
      submitAction: string;
      returnAction: string;
      returnConfirmAction: string;
      clearAction: string;
      clearConfirmAction: string;
      cancelAction: string;
      returnNotesTitle: string;
      returnNotesPlaceholder: string;
      clearanceNotesPlaceholder: string;
      errorGeneric: string;
    };
    empty: {
      title: string;
      description: string;
      createAction: string;
      creating: string;
      forbiddenDescription: string;
    };
    workspace: {
      heroEyebrow: string;
      breadcrumbFieldwork: string;
      backToEngagement: string;
      planningGateTitle: string;
      planningGateDescription: string;
      navAriaLabel: string;
      navOverview: string;
      navProgram: string;
      navProcedureGroups: string;
      navProcedures: string;
      navWorkingPapers: string;
      navEvidence: string;
      navFindings: string;
      navNotes: string;
      navReviewNotes: string;
      navComments: string;
      navHistory: string;
      navSettings: string;
      loading: string;
      errorTitle: string;
      errorDescription: string;
      archivedTitle: string;
      archivedDescription: string;
      summaryStatus: string;
      summaryVersion: string;
      summaryProgress: string;
      summaryProcedures: string;
      summaryPendingReview: string;
      summaryFindings: string;
      status: {
        title: string;
        description: string;
        packageStatus: string;
        programStatus: string;
        progress: string;
        workingPapers: string;
        evidence: string;
      };
      sections: Record<
        | "overview"
        | "program"
        | "procedure-groups"
        | "procedures"
        | "working-papers"
        | "evidence"
        | "findings"
        | "notes"
        | "review-notes"
        | "comments"
        | "history"
        | "settings",
        { title: string; description: string }
      >;
    };
    program: { title: string; description: string; emptyTitle: string; emptyDescription: string };
    procedureGroups: { title: string; description: string; emptyTitle: string; emptyDescription: string };
    procedures: {
      title: string;
      description: string;
      emptyTitle: string;
      emptyDescription: string;
      assignAuditor: string;
      unassigned: string;
      dueDate: string;
      assignedTo: string;
    };
    workingPapers: {
      title: string;
      description: string;
      emptyTitle: string;
      emptyDescription: string;
      procedureLabel: string;
      assignAuditor: string;
      titlePlaceholder: string;
      tickmarkSymbol: string;
      tickmarkMeaning: string;
      libraryTitle: string;
      libraryDescription: string;
    };
    evidence: {
      title: string;
      description: string;
      emptyTitle: string;
      emptyDescription: string;
      fileLabel: string;
      procedureLabel: string;
      uploadedBadge: string;
      namePlaceholder: string;
      downloadAction: string;
      downloadError: string;
    };
    findings: {
      title: string;
      description: string;
      emptyTitle: string;
      emptyDescription: string;
      titlePlaceholder: string;
    };
    notes: {
      title: string;
      description: string;
      emptyTitle: string;
      emptyDescription: string;
      bodyPlaceholder: string;
    };
    reviewNotes: { title: string; description: string; emptyTitle: string; emptyDescription: string };
    comments: { title: string; description: string; emptyTitle: string; emptyDescription: string };
    history: {
      title: string;
      description: string;
      emptyTitle: string;
      emptyDescription: string;
      versionLabel: string;
      actions: {
        created: string;
        updated: string;
        archived: string;
        restored: string;
        programUpdated: string;
        procedureAssigned: string;
        procedureUpdated: string;
        procedureCompleted: string;
        procedureSubmitted: string;
        procedureReturned: string;
        procedureCleared: string;
        workingPaperAdded: string;
        workingPaperUpdated: string;
        workingPaperSubmitted: string;
        workingPaperReturned: string;
        workingPaperCleared: string;
        evidenceAdded: string;
        findingAdded: string;
        noteAdded: string;
      };
    };
    settings: {
      title: string;
      description: string;
      readOnlyNotice: string;
      tickmarkLibraryTitle: string;
      tickmarkLibraryDescription: string;
      tickmarkSymbol: string;
      tickmarkMeaning: string;
      addTickmark: string;
      lifecycle: {
        archivedBannerTitle: string;
        archivedBannerDescription: string;
        archivePrompt: string;
        archiveAction: string;
        archiveConfirmAction: string;
        restorePrompt: string;
        restoreAction: string;
        restoreConfirmAction: string;
        cancelAction: string;
      };
    };
  };
  marketing: MarketingLabels;
  authExperience: AuthExperienceLabels;
  dashboardWorkspace: DashboardWorkspaceLabels;
};

async function loadDictionary(locale: Locale): Promise<Dictionary> {
  const [base, marketing, authExperience, dashboardWorkspace] = await Promise.all([
    import(`./messages/${locale}.json`).then((m) => m.default),
    import(`./messages/marketing-${locale}.json`).then((m) => m.default as MarketingLabels),
    import(`./messages/auth-experience-${locale}.json`).then(
      (m) => m.default as AuthExperienceLabels,
    ),
    import(`./messages/dashboard-workspace-${locale}.json`).then(
      (m) => m.default as DashboardWorkspaceLabels,
    ),
  ]);
  return { ...base, marketing, authExperience, dashboardWorkspace } as Dictionary;
}

const dictionaryMemoryCache = new Map<Locale, Dictionary>();
const dictionaryInflight = new Map<Locale, Promise<Dictionary>>();

const getCachedDictionary = cache(async (locale: Locale): Promise<Dictionary> => {
  const memoized = dictionaryMemoryCache.get(locale);
  if (memoized) return memoized;

  let inflight = dictionaryInflight.get(locale);
  if (!inflight) {
    inflight = loadDictionary(locale).then((dictionary) => {
      dictionaryMemoryCache.set(locale, dictionary);
      dictionaryInflight.delete(locale);
      return dictionary;
    });
    dictionaryInflight.set(locale, inflight);
  }

  return inflight;
});

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return getCachedDictionary(locale);
}
