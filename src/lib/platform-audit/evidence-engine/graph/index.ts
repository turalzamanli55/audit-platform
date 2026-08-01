/**
 * Evidence graph: Capability → Module → Implementation → Evidence → Confidence.
 */
import type {
  CapabilityEvidenceResolution,
  EvidenceGraph,
  EvidenceGraphEdge,
  EvidenceGraphNode,
  ModuleEvidenceResolution,
} from "@/lib/platform-audit/evidence-engine/types";

export function buildEvidenceGraph(input: {
  modules: ModuleEvidenceResolution[];
  capabilities: CapabilityEvidenceResolution[];
}): EvidenceGraph {
  const nodes: EvidenceGraphNode[] = [];
  const edges: EvidenceGraphEdge[] = [];
  const seen = new Set<string>();

  const addNode = (node: EvidenceGraphNode) => {
    if (seen.has(node.id)) return;
    seen.add(node.id);
    nodes.push(node);
  };

  for (const evidenceModule of input.modules) {
    addNode({
      id: `module:${evidenceModule.moduleId}`,
      kind: "module",
      label: evidenceModule.name,
      meta: {
        confidencePct: evidenceModule.confidencePct,
        verifiedCompletionPct: evidenceModule.verifiedCompletionPct,
      },
    });
    for (const root of evidenceModule.matchedRoots) {
      const implId = `impl:${root}`;
      addNode({
        id: implId,
        kind: "implementation",
        label: root,
      });
      edges.push({
        from: `module:${evidenceModule.moduleId}`,
        to: implId,
        relation: "implemented_by",
      });
    }
    for (const dim of evidenceModule.dimensions) {
      if (!dim.present) continue;
      for (const item of dim.items.slice(0, 3)) {
        const evId = `evidence:${item.kind}:${item.path}`;
        addNode({
          id: evId,
          kind: "evidence",
          label: `${item.kind}:${item.path}`,
          meta: { confidencePct: item.confidencePct },
        });
        edges.push({
          from: `module:${evidenceModule.moduleId}`,
          to: evId,
          relation: "has_evidence",
        });
        const confId = `confidence:${item.confidence}:${item.path}`;
        addNode({
          id: confId,
          kind: "confidence",
          label: item.confidence,
          meta: { confidencePct: item.confidencePct },
        });
        edges.push({ from: evId, to: confId, relation: "scored_as" });
      }
    }
  }

  for (const capability of input.capabilities) {
    addNode({
      id: `capability:${capability.capabilityId}`,
      kind: "capability",
      label: capability.name,
      meta: {
        confidencePct: capability.confidencePct,
        verifiedCompletionPct: capability.verifiedCompletionPct,
      },
    });
    edges.push({
      from: `capability:${capability.capabilityId}`,
      to: `module:${capability.moduleId}`,
      relation: "belongs_to",
    });
    for (const item of capability.evidenceItems.slice(0, 5)) {
      const evId = `evidence:${item.kind}:${item.path}`;
      addNode({
        id: evId,
        kind: "evidence",
        label: `${item.kind}:${item.path}`,
        meta: { confidencePct: item.confidencePct },
      });
      edges.push({
        from: `capability:${capability.capabilityId}`,
        to: evId,
        relation: "supported_by",
      });
    }
  }

  return {
    nodes: nodes.slice(0, 2000),
    edges: edges.slice(0, 4000),
  };
}
