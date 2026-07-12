import type { AiModuleId } from "@/lib/ai/constants";

export type AiLocale = "en" | "az" | "ru" | "tr";

export type AiThemeMode = "light" | "dark" | "system";

export type AiDeviceClass = "desktop" | "tablet" | "mobile" | "unknown";

/**
 * Snapshot of the user's runtime posture for AI governance.
 * Collected by the Context Engine — never inferred by a model.
 */
export type AiRuntimeContext = {
  route: string;
  moduleId: AiModuleId | null;
  pageId: string | null;
  organizationId: string | null;
  workspaceId: string | null;
  companyId: string | null;
  companySlug: string | null;
  engagementId: string | null;
  engagementSlug: string | null;
  locale: AiLocale;
  userId: string | null;
  roleSlugs: string[];
  permissionCodes: string[];
  workflowId: string | null;
  workflowStatus: string | null;
  filters: Record<string, string | number | boolean | null>;
  selectedObjectType: string | null;
  selectedObjectId: string | null;
  navigationPath: string[];
  hasUnsavedChanges: boolean;
  theme: AiThemeMode;
  device: AiDeviceClass;
  auditYear: number | null;
  collectedAt: string;
};

export type AiContextCollectionInput = {
  route: string;
  moduleId?: AiModuleId | null;
  pageId?: string | null;
  organizationId?: string | null;
  workspaceId?: string | null;
  companyId?: string | null;
  companySlug?: string | null;
  engagementId?: string | null;
  engagementSlug?: string | null;
  locale: AiLocale;
  userId?: string | null;
  roleSlugs?: string[];
  permissionCodes?: string[];
  workflowId?: string | null;
  workflowStatus?: string | null;
  filters?: Record<string, string | number | boolean | null>;
  selectedObjectType?: string | null;
  selectedObjectId?: string | null;
  navigationPath?: string[];
  hasUnsavedChanges?: boolean;
  theme?: AiThemeMode;
  device?: AiDeviceClass;
  auditYear?: number | null;
};
