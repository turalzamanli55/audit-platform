export type MarketingFeatureItem = {
  title: string;
  description: string;
};

export type MarketingNavLabels = {
  overview: string;
  features: string;
  enterprise: string;
  ai: string;
  security: string;
  signIn: string;
  register: string;
  requestDemo: string;
  openMenu: string;
  closeMenu: string;
  theme: string;
  language: string;
  themeLight: string;
  themeDark: string;
  primaryNav: string;
};

export type MarketingLabels = {
  nav: MarketingNavLabels;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    trust: [string, string, string];
    trustAriaLabel: string;
  };
  overview: {
    title: string;
    description: string;
    items: {
      aiAudit: MarketingFeatureItem;
      workingPapers: MarketingFeatureItem;
      financialStatements: MarketingFeatureItem;
      trialBalance: MarketingFeatureItem;
      automation: MarketingFeatureItem;
      compliance: MarketingFeatureItem;
    };
  };
  features: {
    title: string;
    description: string;
    items: MarketingFeatureItem[];
  };
  enterprise: {
    title: string;
    description: string;
    items: {
      organizations: MarketingFeatureItem;
      workspaces: MarketingFeatureItem;
      companies: MarketingFeatureItem;
      multiTenant: MarketingFeatureItem;
      permissions: MarketingFeatureItem;
      auditTrail: MarketingFeatureItem;
      versioning: MarketingFeatureItem;
    };
  };
  security: {
    title: string;
    description: string;
    items: {
      encryption: MarketingFeatureItem;
      rls: MarketingFeatureItem;
      auditLogs: MarketingFeatureItem;
      zeroTrust: MarketingFeatureItem;
      compliance: MarketingFeatureItem;
    };
  };
  ai: {
    badge: string;
    title: string;
    description: string;
    items: {
      assistant: MarketingFeatureItem;
      naturalLanguage: MarketingFeatureItem;
      ifrs: MarketingFeatureItem;
      risk: MarketingFeatureItem;
      analysis: MarketingFeatureItem;
      reports: MarketingFeatureItem;
    };
  };
  cta: {
    title: string;
    subtitle: string;
    register: string;
    login: string;
    requestDemo: string;
  };
  footer: {
    tagline: string;
    documentation: string;
    privacy: string;
    terms: string;
    support: string;
    copyright: string;
    socialTwitter: string;
    socialLinkedIn: string;
    socialGitHub: string;
    product: string;
    overview: string;
    features: string;
    legal: string;
    supportColumn: string;
  };
};
