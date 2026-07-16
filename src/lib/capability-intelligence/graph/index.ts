/**
 * Capability graph: Domain → Module → Capability → Dependencies → Evidence → Completion → Certification.
 */
import type {
  CapabilityGraph,
  CertificationIntelligence,
  IntelligentCapability,
  IntelligentDomain,
  IntelligentModule,
} from "@/lib/capability-intelligence/types";

export function buildCapabilityGraph(input: {
  domains: IntelligentDomain[];
  modules: IntelligentModule[];
  capabilities: IntelligentCapability[];
  certification: CertificationIntelligence;
}): CapabilityGraph {
  const nodes: CapabilityGraph["nodes"] = [];
  const edges: CapabilityGraph["edges"] = [];
  const seen = new Set<string>();

  const add = (node: CapabilityGraph["nodes"][number]) => {
    if (seen.has(node.id)) return;
    seen.add(node.id);
    nodes.push(node);
  };

  add({
    id: "certification:platform",
    kind: "certification",
    label: input.certification.level,
    meta: {
      requiredCompletionPct: input.certification.requiredCompletionPct,
      enterpriseCertified: input.certification.enterpriseCertified,
    },
  });

  for (const domain of input.domains) {
    add({
      id: `domain:${domain.id}`,
      kind: "domain",
      label: domain.name,
      meta: { completionPct: domain.completionPct },
    });
    edges.push({
      from: `domain:${domain.id}`,
      to: "certification:platform",
      relation: "contributes_to",
    });
  }

  for (const module of input.modules) {
    add({
      id: `module:${module.id}`,
      kind: "module",
      label: module.name,
      meta: { completionPct: module.completionPct, readiness: module.readiness },
    });
    edges.push({
      from: `domain:${module.domainId}`,
      to: `module:${module.id}`,
      relation: "contains",
    });
  }

  for (const capability of input.capabilities) {
    add({
      id: `capability:${capability.id}`,
      kind: "capability",
      label: capability.name,
      meta: {
        completionPct: capability.requiredCompletionPct,
        lifecycle: capability.lifecycle,
        countsTowardCompletion: capability.countsTowardCompletion,
      },
    });
    edges.push({
      from: `module:${capability.moduleId}`,
      to: `capability:${capability.id}`,
      relation: "owns",
    });

    for (const dep of capability.dependencies) {
      edges.push({
        from: `capability:${capability.id}`,
        to: `capability:${dep}`,
        relation: "depends_on",
      });
    }

    for (const requirement of capability.requiredEvidence) {
      const evId = `evidence-req:${capability.id}:${requirement.kind}`;
      add({
        id: evId,
        kind: "evidence",
        label: requirement.kind,
        meta: { required: true },
      });
      edges.push({
        from: `capability:${capability.id}`,
        to: evId,
        relation: "requires",
      });
    }

    for (const satisfaction of capability.evidence.filter((e) => e.required)) {
      const curId = `evidence-cur:${capability.id}:${satisfaction.kind}`;
      add({
        id: curId,
        kind: "evidence",
        label: `${satisfaction.kind}:${satisfaction.verified ? "verified" : "missing"}`,
        meta: {
          verified: satisfaction.verified,
          confidencePct: satisfaction.confidencePct,
        },
      });
      edges.push({
        from: `capability:${capability.id}`,
        to: curId,
        relation: "has_evidence",
      });
    }

    const completionId = `completion:${capability.id}`;
    add({
      id: completionId,
      kind: "completion",
      label: `${capability.requiredCompletionPct}%`,
      meta: { completionPct: capability.requiredCompletionPct },
    });
    edges.push({
      from: `capability:${capability.id}`,
      to: completionId,
      relation: "scored_as",
    });
  }

  return {
    nodes: nodes.slice(0, 3000),
    edges: edges.slice(0, 6000),
  };
}
