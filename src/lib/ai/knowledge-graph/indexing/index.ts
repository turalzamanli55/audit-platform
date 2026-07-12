import type { KgEdge, KgNode } from "@/lib/ai/knowledge-graph/types";
import { normalizeKgQuery, nodeMatchesKeywords } from "@/lib/ai/knowledge-graph/utils";

/**
 * Keyword inverted index — lexical only. No embeddings / FAISS / Pinecone.
 */
export class KgKeywordIndex {
  private readonly tokenToNodeIds = new Map<string, Set<string>>();
  private readonly nodes = new Map<string, KgNode>();

  indexNode(node: KgNode): void {
    this.nodes.set(node.id, node);
    const tokens = normalizeKgQuery(
      [node.title, node.summary, ...node.keywords, node.type, node.moduleId ?? ""].join(" "),
    );
    for (const token of tokens) {
      const set = this.tokenToNodeIds.get(token) ?? new Set<string>();
      set.add(node.id);
      this.tokenToNodeIds.set(token, set);
    }
  }

  indexNodes(nodes: readonly KgNode[]): void {
    for (const node of nodes) this.indexNode(node);
  }

  search(query: string, limit = 20): Array<{ node: KgNode; hits: number }> {
    const tokens = normalizeKgQuery(query);
    if (tokens.length === 0) return [];
    const scores = new Map<string, number>();
    for (const token of tokens) {
      for (const nodeId of this.tokenToNodeIds.get(token) ?? []) {
        scores.set(nodeId, (scores.get(nodeId) ?? 0) + 1);
      }
    }
    return [...scores.entries()]
      .map(([nodeId, hits]) => {
        const node = this.nodes.get(nodeId);
        if (!node) return null;
        const bonus = nodeMatchesKeywords(node, tokens);
        return { node, hits: hits + bonus };
      })
      .filter((entry): entry is { node: KgNode; hits: number } => entry !== null)
      .sort((a, b) => b.hits - a.hits)
      .slice(0, limit);
  }
}

export type KgIndexSnapshot = {
  nodeCount: number;
  tokenCount: number;
  indexedAt: string;
};

export class KgIndexer {
  readonly keywords = new KgKeywordIndex();

  indexGraph(nodes: readonly KgNode[], _edges: readonly KgEdge[]): KgIndexSnapshot {
    this.keywords.indexNodes(nodes);
    return {
      nodeCount: nodes.length,
      tokenCount: nodes.reduce((sum, node) => sum + node.keywords.length, 0),
      indexedAt: new Date().toISOString(),
    };
  }
}
