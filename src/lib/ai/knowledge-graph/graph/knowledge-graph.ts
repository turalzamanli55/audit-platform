import type { KgEdge, KgNode, KgNodeType, KgRelationshipType } from "@/lib/ai/knowledge-graph/types";

/**
 * In-memory enterprise knowledge graph store.
 * No vector index. No external graph database.
 */
export class KnowledgeGraph {
  private readonly nodes = new Map<string, KgNode>();
  private readonly edges = new Map<string, KgEdge>();
  private readonly outbound = new Map<string, Set<string>>();
  private readonly inbound = new Map<string, Set<string>>();

  addNode(node: KgNode): void {
    this.nodes.set(node.id, node);
  }

  addNodes(nodes: readonly KgNode[]): void {
    for (const node of nodes) this.addNode(node);
  }

  addEdge(edge: KgEdge): void {
    if (!this.nodes.has(edge.fromId) || !this.nodes.has(edge.toId)) {
      throw new Error(`Cannot add edge ${edge.id}: missing endpoint node.`);
    }
    this.edges.set(edge.id, edge);
    const out = this.outbound.get(edge.fromId) ?? new Set<string>();
    out.add(edge.id);
    this.outbound.set(edge.fromId, out);
    const inn = this.inbound.get(edge.toId) ?? new Set<string>();
    inn.add(edge.id);
    this.inbound.set(edge.toId, inn);
  }

  addEdges(edges: readonly KgEdge[]): void {
    for (const edge of edges) this.addEdge(edge);
  }

  getNode(id: string): KgNode | null {
    return this.nodes.get(id) ?? null;
  }

  requireNode(id: string): KgNode {
    const node = this.getNode(id);
    if (!node) throw new Error(`Unknown knowledge graph node: ${id}`);
    return node;
  }

  listNodes(filter?: { type?: KgNodeType; moduleId?: string }): KgNode[] {
    return [...this.nodes.values()].filter((node) => {
      if (filter?.type && node.type !== filter.type) return false;
      if (filter?.moduleId && node.moduleId !== filter.moduleId) return false;
      return true;
    });
  }

  listEdges(filter?: { type?: KgRelationshipType; fromId?: string; toId?: string }): KgEdge[] {
    return [...this.edges.values()].filter((edge) => {
      if (filter?.type && edge.type !== filter.type) return false;
      if (filter?.fromId && edge.fromId !== filter.fromId) return false;
      if (filter?.toId && edge.toId !== filter.toId) return false;
      return true;
    });
  }

  neighbors(
    nodeId: string,
    options?: { direction?: "out" | "in" | "both"; types?: readonly KgRelationshipType[] },
  ): Array<{ edge: KgEdge; node: KgNode }> {
    const direction = options?.direction ?? "both";
    const edgeIds = new Set<string>();
    if (direction === "out" || direction === "both") {
      for (const id of this.outbound.get(nodeId) ?? []) edgeIds.add(id);
    }
    if (direction === "in" || direction === "both") {
      for (const id of this.inbound.get(nodeId) ?? []) edgeIds.add(id);
    }

    const results: Array<{ edge: KgEdge; node: KgNode }> = [];
    for (const edgeId of edgeIds) {
      const edge = this.edges.get(edgeId);
      if (!edge) continue;
      if (options?.types && !options.types.includes(edge.type)) continue;
      const otherId = edge.fromId === nodeId ? edge.toId : edge.fromId;
      const node = this.nodes.get(otherId);
      if (!node) continue;
      results.push({ edge, node });
    }
    return results;
  }

  nodeCount(): number {
    return this.nodes.size;
  }

  edgeCount(): number {
    return this.edges.size;
  }

  snapshot(): { nodes: KgNode[]; edges: KgEdge[] } {
    return {
      nodes: [...this.nodes.values()],
      edges: [...this.edges.values()],
    };
  }
}
