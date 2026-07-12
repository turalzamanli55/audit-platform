import type { KnowledgeGraph } from "@/lib/ai/knowledge-graph/graph/knowledge-graph";
import type { KgDocumentIndex } from "@/lib/ai/knowledge-graph/documents";
import type { KgIndexer } from "@/lib/ai/knowledge-graph/indexing";
import type {
  KgNode,
  KgRankedHit,
  KgRetrievalRequest,
  KgSearchMode,
  KgSemanticSearchContract,
} from "@/lib/ai/knowledge-graph/types";
import { buildKgCitation } from "@/lib/ai/knowledge-graph/citations";
import { kgNodeId } from "@/lib/ai/knowledge-graph/utils";

export const KG_SEMANTIC_SEARCH_CONTRACT: KgSemanticSearchContract = {
  kind: "semantic-search-contract",
  implemented: false,
  reason: "Embeddings and vector indexes are deferred. Use keyword/graph search.",
};

/**
 * Knowledge search — keyword, graph, module, workflow, entity, documentation.
 * Semantic mode returns empty with contract (no embeddings).
 */
export class KgSearchService {
  constructor(
    private readonly graph: KnowledgeGraph,
    private readonly indexer: KgIndexer,
    private readonly documents: KgDocumentIndex,
  ) {}

  search(request: KgRetrievalRequest, modes: readonly KgSearchMode[]): KgRankedHit[] {
    const byId = new Map<string, KgRankedHit>();

    for (const mode of modes) {
      const hits = this.searchMode(request, mode);
      for (const hit of hits) {
        const existing = byId.get(hit.node.id);
        if (!existing || hit.score > existing.score) {
          byId.set(hit.node.id, hit);
        } else {
          existing.reasons.push(...hit.reasons.filter((reason) => !existing.reasons.includes(reason)));
        }
      }
    }

    return [...byId.values()];
  }

  private searchMode(request: KgRetrievalRequest, mode: KgSearchMode): KgRankedHit[] {
    switch (mode) {
      case "semantic":
        return [];
      case "keyword":
        return this.keywordSearch(request);
      case "graph":
        return this.graphSearch(request);
      case "module":
        return this.typeSearch(request, "module");
      case "workflow":
        return this.typeSearch(request, "workflow");
      case "entity":
        return this.typeSearch(request, "entity");
      case "documentation":
        return this.documentationSearch(request);
      default:
        return [];
    }
  }

  private keywordSearch(request: KgRetrievalRequest): KgRankedHit[] {
    return this.indexer.keywords.search(request.query, request.limit ?? 20).map(({ node, hits }) =>
      this.toHit(node, hits * 4, ["keyword"], request),
    );
  }

  private graphSearch(request: KgRetrievalRequest): KgRankedHit[] {
    const seedIds: string[] = [];
    if (request.context.moduleId) {
      seedIds.push(kgNodeId("module", request.context.moduleId));
    }
    for (const moduleId of request.moduleIds ?? []) {
      seedIds.push(kgNodeId("module", moduleId));
    }

    const hits: KgRankedHit[] = [];
    for (const seedId of seedIds) {
      const seed = this.graph.getNode(seedId);
      if (seed) hits.push(this.toHit(seed, 20, ["graph_seed"], request));
      for (const neighbor of this.graph.neighbors(seedId, { direction: "both" })) {
        hits.push(
          this.toHit(neighbor.node, 12 * neighbor.edge.weight, [`graph:${neighbor.edge.type}`], request, [
            neighbor.edge,
          ]),
        );
      }
    }
    return hits;
  }

  private typeSearch(
    request: KgRetrievalRequest,
    type: KgNode["type"],
  ): KgRankedHit[] {
    const query = request.query.toLowerCase();
    return this.graph
      .listNodes({ type })
      .filter((node) => {
        if (request.moduleIds && node.moduleId && !request.moduleIds.includes(node.moduleId)) {
          return false;
        }
        if (!query) return true;
        return (
          node.title.toLowerCase().includes(query) ||
          node.summary.toLowerCase().includes(query) ||
          node.keywords.some((keyword) => keyword.toLowerCase().includes(query))
        );
      })
      .map((node) => this.toHit(node, 10, [`type:${type}`], request));
  }

  private documentationSearch(request: KgRetrievalRequest): KgRankedHit[] {
    const query = request.query.toLowerCase();
    return this.documents
      .list()
      .filter((document) => {
        if (!query) return true;
        return (
          document.title.toLowerCase().includes(query) ||
          document.summary.toLowerCase().includes(query) ||
          document.keywords.some((keyword) => keyword.toLowerCase().includes(query)) ||
          document.path.toLowerCase().includes(query)
        );
      })
      .map((document) => {
        const node = this.graph.getNode(document.nodeId);
        if (!node) return null;
        return this.toHit(node, 14, ["documentation"], request, [], document.path);
      })
      .filter((hit): hit is KgRankedHit => hit !== null);
  }

  private toHit(
    node: KgNode,
    score: number,
    reasons: string[],
    request: KgRetrievalRequest,
    edges: import("@/lib/ai/knowledge-graph/types").KgEdge[] = [],
    documentReference?: string | null,
  ): KgRankedHit {
    if (request.nodeTypes && !request.nodeTypes.includes(node.type)) {
      return {
        node,
        score: -1000,
        reasons: [...reasons, "type_filtered"],
        citations: [],
        edges,
      };
    }
    const doc = documentReference ?? this.documents.findByNodeId(node.id)?.path ?? null;
    return {
      node,
      score,
      reasons,
      citations: [
        buildKgCitation({
          node,
          relationship: "matched",
          documentReference: doc,
        }),
      ],
      edges,
    };
  }
}
