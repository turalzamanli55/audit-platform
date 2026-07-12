import {
  populateKnowledgeGraph,
  type PopulatedKnowledgeGraph,
} from "@/lib/ai/knowledge-graph/catalog";
import { KgRetriever } from "@/lib/ai/knowledge-graph/retriever";
import { createKgCacheContracts, type KgCacheContracts } from "@/lib/ai/knowledge-graph/cache";
import { KgRelationshipService } from "@/lib/ai/knowledge-graph/relationships";
import type {
  KgBuiltContext,
  KgRetrievalRequest,
  KgRetrievalResult,
  KgResolvedSubgraph,
} from "@/lib/ai/knowledge-graph/types";
import type { AiRuntimeContext } from "@/lib/ai/types/context";
import { KG_SEMANTIC_SEARCH_CONTRACT } from "@/lib/ai/knowledge-graph/search";

export const AI_KNOWLEDGE_GRAPH_VERSION = "1.0.0" as const;

/**
 * Enterprise Knowledge Graph & Retrieval Engine facade.
 * Business modules must retrieve documentation through this layer only.
 */
export class KnowledgeGraphEngine {
  readonly version = AI_KNOWLEDGE_GRAPH_VERSION;
  readonly populated: PopulatedKnowledgeGraph;
  readonly retriever: KgRetriever;
  readonly relationships: KgRelationshipService;
  readonly cache: KgCacheContracts;
  readonly semanticContract = KG_SEMANTIC_SEARCH_CONTRACT;

  constructor(populated: PopulatedKnowledgeGraph = populateKnowledgeGraph()) {
    this.populated = populated;
    this.retriever = new KgRetriever(
      populated.graph,
      populated.indexer,
      populated.documents,
    );
    this.relationships = new KgRelationshipService(populated.graph);
    this.cache = createKgCacheContracts();
  }

  get graph() {
    return this.populated.graph;
  }

  get documents() {
    return this.populated.documents;
  }

  resolve(context: AiRuntimeContext, extraSeedIds?: string[]): KgResolvedSubgraph {
    const cacheKey = `resolve:${context.workspaceId ?? "none"}:${context.moduleId ?? "none"}`;
    const cached = this.cache.module.get<KgResolvedSubgraph>("module", cacheKey);
    if (cached) return cached.value;

    const resolved = this.retriever.resolver.resolve(context, extraSeedIds);
    this.cache.module.set("module", cacheKey, resolved);
    return resolved;
  }

  retrieve(request: KgRetrievalRequest): KgRetrievalResult {
    return this.retriever.retrieve(request);
  }

  buildContext(request: KgRetrievalRequest): KgBuiltContext {
    const cacheKey = `ctx:${request.context.workspaceId ?? "none"}:${request.context.moduleId ?? "none"}:${request.query}`;
    const cached = this.cache.session.get<KgBuiltContext>("session", cacheKey);
    if (cached) return cached.value;

    const built = this.retriever.buildContext(request);
    this.cache.session.set("session", cacheKey, built);
    this.cache.knowledge.set("knowledge", cacheKey, built);
    this.cache.workspace.set(
      "workspace",
      `${request.context.workspaceId ?? "none"}:${request.query}`,
      built,
    );
    return built;
  }

  stats() {
    return {
      version: this.version,
      nodeCount: this.graph.nodeCount(),
      edgeCount: this.graph.edgeCount(),
      documentCount: this.documents.count(),
      semanticSearchImplemented: this.semanticContract.implemented,
    };
  }
}

export function bootstrapKnowledgeGraphEngine(): KnowledgeGraphEngine {
  return new KnowledgeGraphEngine();
}
