import type { KnowledgeGraph } from "@/lib/ai/knowledge-graph/graph/knowledge-graph";
import type { KgDocumentIndex } from "@/lib/ai/knowledge-graph/documents";
import type { KgIndexer } from "@/lib/ai/knowledge-graph/indexing";
import type {
  KgBuiltContext,
  KgRetrievalRequest,
  KgRetrievalResult,
  KgSearchMode,
} from "@/lib/ai/knowledge-graph/types";
import { KgSearchService, KG_SEMANTIC_SEARCH_CONTRACT } from "@/lib/ai/knowledge-graph/search";
import { KgRanker } from "@/lib/ai/knowledge-graph/ranking";
import { KgResolver } from "@/lib/ai/knowledge-graph/resolver";
import { KgContextBuilder } from "@/lib/ai/knowledge-graph/retriever/context-builder";
import type { AiModuleId } from "@/lib/ai/constants";

const DEFAULT_MODES: KgSearchMode[] = [
  "keyword",
  "graph",
  "module",
  "workflow",
  "documentation",
];

/**
 * Knowledge Retriever — permission-aware hybrid retrieval without embeddings.
 */
export class KgRetriever {
  readonly search: KgSearchService;
  readonly ranker = new KgRanker();
  readonly resolver: KgResolver;
  readonly contextBuilder: KgContextBuilder;
  readonly semanticContract = KG_SEMANTIC_SEARCH_CONTRACT;

  constructor(
    private readonly graph: KnowledgeGraph,
    indexer: KgIndexer,
    documents: KgDocumentIndex,
  ) {
    this.search = new KgSearchService(graph, indexer, documents);
    this.resolver = new KgResolver(graph);
    this.contextBuilder = new KgContextBuilder(graph, documents);
  }

  retrieve(request: KgRetrievalRequest): KgRetrievalResult {
    const modes = request.modes?.length
      ? request.modes.filter((mode) => mode !== "semantic" || false)
      : DEFAULT_MODES;

    const effectiveModes = modes.filter((mode) => mode !== "semantic");
    const subgraph = this.resolver.resolve(request.context, []);
    const moduleIds = [
      ...(request.moduleIds ?? []),
      ...(request.context.moduleId ? [request.context.moduleId] : []),
    ] as AiModuleId[];

    const hits = this.search.search(
      {
        ...request,
        moduleIds: moduleIds.length > 0 ? moduleIds : request.moduleIds,
      },
      effectiveModes.includes("graph") || effectiveModes.includes("keyword")
        ? effectiveModes
        : [...effectiveModes, "keyword"],
    );

    // Prefer nodes that appear in the resolved subgraph.
    const subgraphIds = new Set(subgraph.nodes.map((node) => node.id));
    const boosted = hits.map((hit) =>
      subgraphIds.has(hit.node.id)
        ? { ...hit, score: hit.score + 6, reasons: [...hit.reasons, "resolver_subgraph"] }
        : hit,
    );

    const ranked = this.ranker.rank(boosted, request).slice(0, request.limit ?? 12);
    const citations = ranked.flatMap((hit) => hit.citations);

    return {
      hits: ranked,
      citations,
      modesUsed: effectiveModes,
      retrievedAt: new Date().toISOString(),
    };
  }

  buildContext(request: KgRetrievalRequest): KgBuiltContext {
    const retrieval = this.retrieve(request);
    return this.contextBuilder.build(request.context, retrieval);
  }
}
