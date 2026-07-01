export const COMPANY_PERMISSIONS = {
  READ: "company.read",
  CONFIGURE: "company.configure",
  ADMINISTER: "company.administer",
} as const;

export const REPORTING_FRAMEWORKS = [
  "IFRS",
  "LOCAL_GAAP",
  "OTHER",
] as const;

export const ENTITY_TYPES = [
  "standalone",
  "parent",
  "subsidiary",
  "branch",
  "joint_venture",
] as const;

export const INDUSTRY_CLASSIFICATIONS = [
  "general",
  "banking",
  "insurance",
  "construction",
  "manufacturing",
  "government",
  "oil_gas",
  "other",
] as const;

export const COMPANY_SETTINGS_SCHEMA_VERSION = 1;

export const AUDIT_RESOURCE_TYPE = "company";
