/**
 * Enterprise Knowledge Graph — type contracts.
 * No vector DB. No embeddings. No vendor SDKs.
 */

import type { AiModuleId } from "@/lib/ai/constants";
import type { AiRuntimeContext } from "@/lib/ai/types/context";

export const KG_NODE_TYPES = [
  "module",
  "workflow",
  "permission",
  "entity",
  "route",
  "component",
  "audit_standard",
  "accounting_standard",
  "business_rule",
  "help_article",
  "documentation",
  "template",
  "erp",
  "dictionary",
  "validation_rule",
  "action",
  "skill",
  "prompt_context",
] as const;

export type KgNodeType = (typeof KG_NODE_TYPES)[number];

export const KG_RELATIONSHIP_TYPES = [
  "depends_on",
  "belongs_to",
  "references",
  "uses",
  "creates",
  "updates",
  "reads",
  "requires",
  "next_step",
  "previous_step",
  "related_to",
  "explains",
] as const;

export type KgRelationshipType = (typeof KG_RELATIONSHIP_TYPES)[number];

export const KG_DOCUMENT_KINDS = [
  "project_bible",
  "documentation",
  "help_article",
  "user_guide",
  "erp_guide",
  "template",
  "policy",
  "master_prd",
  "system_architecture",
  "design_system",
  "implementation_standard",
  "implementation_template",
] as const;

export type KgDocumentKind = (typeof KG_DOCUMENT_KINDS)[number];

export type KgSearchMode =
  | "semantic"
  | "keyword"
  | "graph"
  | "module"
  | "workflow"
  | "entity"
  | "documentation";

export type KgNode = {
  id: string;
  type: KgNodeType;
  title: string;
  summary: string;
  moduleId?: AiModuleId | null;
  keywords: readonly string[];
  permissionCodes?: readonly string[];
  confidence: number;
  freshness: string;
  metadata: Record<string, unknown>;
};

export type KgEdge = {
  id: string;
  type: KgRelationshipType;
  fromId: string;
  toId: string;
  weight: number;
  metadata?: Record<string, unknown>;
};

export type KgDocumentRecord = {
  id: string;
  kind: KgDocumentKind;
  title: string;
  path: string;
  summary: string;
  nodeId: string;
  keywords: readonly string[];
  localeScope: readonly string[];
  version: string;
};

export type KgCitation = {
  title: string;
  source: string;
  nodeId: string;
  relationship: KgRelationshipType | "matched" | "ranked";
  confidence: number;
  documentReference: string | null;
};

export type KgRankedHit = {
  node: KgNode;
  score: number;
  reasons: string[];
  citations: KgCitation[];
  edges: KgEdge[];
};

export type KgRetrievalRequest = {
  query: string;
  context: AiRuntimeContext;
  modes?: readonly KgSearchMode[];
  moduleIds?: readonly AiModuleId[];
  nodeTypes?: readonly KgNodeType[];
  limit?: number;
};

export type KgRetrievalResult = {
  hits: KgRankedHit[];
  citations: KgCitation[];
  modesUsed: KgSearchMode[];
  retrievedAt: string;
};

export type KgResolvedSubgraph = {
  seedNodeIds: string[];
  nodes: KgNode[];
  edges: KgEdge[];
  resolvedAt: string;
};

export type KgBuiltContext = {
  currentModule: AiModuleId | null;
  currentWorkflow: string | null;
  currentCompany: string | null;
  currentEngagement: string | null;
  relevantStandards: Array<{ id: string; title: string; type: KgNodeType }>;
  relevantDocumentation: Array<{ id: string; title: string; path: string }>;
  relatedModules: AiModuleId[];
  previousSteps: string[];
  nextSteps: string[];
  citations: KgCitation[];
  structuredKnowledge: Record<string, unknown>;
  builtAt: string;
};

export type KgCacheScope = "knowledge" | "session" | "workspace" | "module";

export type KgCacheKey = {
  scope: KgCacheScope;
  id: string;
};

export type KgCacheEntry<T = unknown> = {
  key: KgCacheKey;
  value: T;
  expiresAt: string | null;
  storedAt: string;
};

/** Semantic search contract — no embedding implementation. */
export type KgSemanticSearchContract = {
  readonly kind: "semantic-search-contract";
  readonly implemented: false;
  readonly reason: "Embeddings and vector indexes are deferred. Use keyword/graph search.";
};
