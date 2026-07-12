import type { KnowledgeGraph } from "@/lib/ai/knowledge-graph/graph/knowledge-graph";
import type { KgEdge, KgNode, KgRelationshipType } from "@/lib/ai/knowledge-graph/types";

/**
 * Relationship helpers — traverse typed edges without business logic.
 */
export class KgRelationshipService {
  constructor(private readonly graph: KnowledgeGraph) {}

  listByType(type: KgRelationshipType): KgEdge[] {
    return this.graph.listEdges({ type });
  }

  relatedNodes(
    nodeId: string,
    types?: readonly KgRelationshipType[],
  ): Array<{ edge: KgEdge; node: KgNode }> {
    return this.graph.neighbors(nodeId, { direction: "both", types });
  }

  nextSteps(nodeId: string): KgNode[] {
    return this.graph
      .neighbors(nodeId, { direction: "out", types: ["next_step"] })
      .map((item) => item.node);
  }

  previousSteps(nodeId: string): KgNode[] {
    return this.graph
      .neighbors(nodeId, { direction: "out", types: ["previous_step"] })
      .map((item) => item.node);
  }

  explains(nodeId: string): KgNode[] {
    return this.graph
      .neighbors(nodeId, { direction: "out", types: ["explains"] })
      .map((item) => item.node);
  }
}
