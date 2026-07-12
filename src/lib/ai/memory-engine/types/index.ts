/**
 * Enterprise Memory Engine — type contracts.
 * Provider-independent. No vectors. No embeddings. No LLM dependency.
 */

import type { AiModuleId } from "@/lib/ai/constants";
import type { AiRuntimeContext } from "@/lib/ai/types/context";

export const EME_VERSION = "1.0.0" as const;

export const EME_MEMORY_LEVELS = [
  "session",
  "user",
  "workspace",
  "company",
  "engagement",
  "organization",
  "preference",
  "learning",
  "temporary",
  "persistent",
] as const;
export type EmeMemoryLevel = (typeof EME_MEMORY_LEVELS)[number];

export const EME_MEMORY_VISIBILITIES = [
  "private",
  "workspace",
  "organization",
  "system",
] as const;
export type EmeMemoryVisibility = (typeof EME_MEMORY_VISIBILITIES)[number];

export const EME_MEMORY_SOURCES = [
  "user",
  "interaction",
  "learning",
  "import",
  "system",
  "summary",
] as const;
export type EmeMemorySource = (typeof EME_MEMORY_SOURCES)[number];

export const EME_MEMORY_STATUSES = [
  "active",
  "candidate",
  "pinned",
  "archived",
  "forgotten",
] as const;
export type EmeMemoryStatus = (typeof EME_MEMORY_STATUSES)[number];

export const EME_SEARCH_MODES = [
  "keyword",
  "entity",
  "workspace",
  "company",
  "engagement",
  "module",
  "semantic",
] as const;
export type EmeSearchMode = (typeof EME_SEARCH_MODES)[number];

export type EmeMemoryError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type EmeMemoryScope = {
  organizationId: string | null;
  workspaceId: string | null;
  userId: string | null;
  companyId: string | null;
  engagementId: string | null;
  conversationId: string | null;
};

export type EmeMemoryPolicy = {
  visibility: EmeMemoryVisibility;
  ownerId: string | null;
  workspaceId: string | null;
  organizationId: string | null;
  companyId: string | null;
  engagementId: string | null;
  expiresAt: string | null;
  confidence: number;
  source: EmeMemorySource;
  importance: number;
  learningEnabled: boolean;
};

export type EmeMemoryRecord = {
  id: string;
  key: string;
  level: EmeMemoryLevel;
  category: string;
  label: string;
  value: unknown;
  valueType: "string" | "number" | "boolean" | "json";
  keywords: string[];
  moduleId: AiModuleId | null;
  policy: EmeMemoryPolicy;
  status: EmeMemoryStatus;
  pinned: boolean;
  frequency: number;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
  conversationId: string | null;
  summaryOf: string[];
};

export type EmeMemoryCandidate = {
  id: string;
  record: Omit<EmeMemoryRecord, "id" | "status" | "createdAt" | "updatedAt" | "frequency" | "lastUsedAt" | "summaryOf">;
  interactionId: string | null;
  reviewDecision: "pending" | "accepted" | "rejected";
  reviewedAt: string | null;
  reviewedBy: string | null;
  createdAt: string;
};

export type EmeMemoryWriteInput = {
  key: string;
  level: EmeMemoryLevel;
  category: string;
  label: string;
  value: unknown;
  keywords?: string[];
  moduleId?: AiModuleId | null;
  policy?: Partial<EmeMemoryPolicy>;
  pinned?: boolean;
  conversationId?: string | null;
};

export type EmeMemoryResolveRequest = {
  context: AiRuntimeContext;
  conversationId?: string | null;
  moduleId?: AiModuleId | null;
  limit?: number;
  includeCandidates?: boolean;
};

export type EmeMemoryRankInput = {
  record: EmeMemoryRecord;
  context: AiRuntimeContext;
  now?: number;
};

export type EmeRankedMemory = EmeMemoryRecord & {
  rankScore: number;
  rankFactors: {
    confidence: number;
    freshness: number;
    frequency: number;
    workspaceRelevance: number;
    organizationRelevance: number;
    engagementRelevance: number;
    pinBoost: number;
  };
};

export type EmeMemorySearchQuery = {
  context: AiRuntimeContext;
  mode: EmeSearchMode;
  text?: string;
  entityType?: string;
  entityId?: string;
  moduleId?: AiModuleId | null;
  level?: EmeMemoryLevel;
  limit?: number;
};

export type EmeMemoryContext = {
  version: string;
  scope: EmeMemoryScope;
  entries: EmeRankedMemory[];
  summaries: EmeMemorySummary[];
  preferences: EmeUserPreferenceSnapshot;
  builtAt: string;
  tokenEstimate: number;
};

export type EmeMemorySummary = {
  id: string;
  level: EmeMemoryLevel;
  category: string;
  summary: string;
  memoryCount: number;
  compressedAt: string;
  policy: Pick<EmeMemoryPolicy, "organizationId" | "workspaceId" | "ownerId">;
};

export type EmeUserPreferenceSnapshot = {
  language: string | null;
  responseLength: "concise" | "balanced" | "detailed" | null;
  detailLevel: "low" | "medium" | "high" | null;
  auditMethodology: string | null;
  reportingFormat: string | null;
  financialPresentation: string | null;
  aiVerbosity: "minimal" | "standard" | "verbose" | null;
  explanationStyle: "brief" | "guided" | "technical" | null;
};

export type EmeLearningSignal = {
  kind:
    | "approved_mapping"
    | "approved_suggestion"
    | "rejected_suggestion"
    | "tool_usage"
    | "workflow_order"
    | "navigation_habit"
    | "repeated_prompt"
    | "frequent_action";
  key: string;
  value: unknown;
  confidence: number;
  moduleId?: AiModuleId | null;
};

export type EmeMemoryTelemetrySnapshot = {
  memoriesCreated: number;
  memoriesUsed: number;
  memoriesIgnored: number;
  memoryHitRate: number;
  averageConfidence: number;
  compressionRate: number;
  candidatesPending: number;
  candidatesAccepted: number;
  candidatesRejected: number;
  byLevel: Record<EmeMemoryLevel, number>;
};

export type EmeMemoryExportBundle = {
  version: string;
  exportedAt: string;
  scope: EmeMemoryScope;
  records: EmeMemoryRecord[];
  summaries: EmeMemorySummary[];
};

export type EmeMemoryHumanAction =
  | { action: "pin"; memoryId: string }
  | { action: "edit"; memoryId: string; patch: Partial<Pick<EmeMemoryRecord, "label" | "value" | "keywords" | "category">> }
  | { action: "forget"; memoryId: string }
  | { action: "disable_learning"; userId: string }
  | { action: "reset"; scope: Partial<EmeMemoryScope>; levels?: EmeMemoryLevel[] };
