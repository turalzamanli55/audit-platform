export type AuthExperienceLabels = {
  common: {
    showPassword: string;
    hidePassword: string;
    loading: string;
    or: string;
    termsPrefix: string;
    termsLink: string;
    privacyLink: string;
    and: string;
  };
  login: {
    benefits: string[];
    quote: string;
    quoteAuthor: string;
  };
  register: {
    stepLabel: string;
    requirementsTitle: string;
    requirements: string[];
    trust: string[];
    verificationNote: string;
    benefits: string[];
  };
  forgot: {
    explanation: string;
    successTitle: string;
  };
  reset: {
    successTitle: string;
    successDescription: string;
    redirecting: string;
    mismatch: string;
  };
  verify: {
    tipsTitle: string;
    tips: string[];
    resend: string;
    resendIn: string;
    resendSuccess: string;
    resendError: string;
    pendingTitle: string;
    expiredTitle: string;
    expiredDescription: string;
    verifiedTitle: string;
    verifiedDescription: string;
  };
  passwordStrength: {
    label: string;
    weak: string;
    fair: string;
    good: string;
    strong: string;
  };
  status: {
    accountNotFound: string;
    accountNotFoundDescription: string;
    verificationPending: string;
    sessionExpired: string;
    sessionExpiredDescription: string;
    invalidLink: string;
    invalidLinkDescription: string;
    passwordUpdated: string;
    accountCreated: string;
  };
};
