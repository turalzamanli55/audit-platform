/**
 * Intelligent Evidence Engine — scan once, resolve semantically, score confidence.
 */
import { buildAstIndex } from "@/lib/platform-audit/evidence-engine/ast";
import { buildImportGraph } from "@/lib/platform-audit/evidence-engine/imports";
import { resolveAiAreas } from "@/lib/platform-audit/evidence-engine/ai";
import { buildCrossReference } from "@/lib/platform-audit/evidence-engine/cross-reference";
import { detectFalsePositives } from "@/lib/platform-audit/evidence-engine/false-positives";
import { buildEvidenceGraph } from "@/lib/platform-audit/evidence-engine/graph";
import { classifyTechnicalDebt } from "@/lib/platform-audit/evidence-engine/debt";
import {
  resolveCapabilityEvidence,
  resolveModuleEvidence,
} from "@/lib/platform-audit/evidence-engine/resolver";
import type { EvidenceEngineReport } from "@/lib/platform-audit/evidence-engine/types";
import { averageConfidence } from "@/lib/platform-audit/evidence-engine/types";
import type { DocumentExtraction } from "@/lib/platform-audit/types";
import { projectSyncEngine } from "@/lib/project-sync/engine";

export function runEvidenceEngine(input: {
  extraction: DocumentExtraction;
  cwd?: string;
}): EvidenceEngineReport {
  const cwd = input.cwd ?? process.cwd();
  const ast = buildAstIndex(cwd);
  const graph = buildImportGraph(cwd, ast);
  const sync = projectSyncEngine.synchronize({ cwd, persist: false });

  const moduleById = new Map(
    input.extraction.modules.map((module) => {
      const resolution = resolveModuleEvidence({
        moduleId: module.id,
        name: module.name,
        domainId: module.domainId,
        section: module.section,
        cwd,
        ast,
        graph,
      });
      return [module.id, resolution] as const;
    }),
  );

  const modules = [...moduleById.values()];

  const capabilities = sync.snapshot.capabilities.map((capability) =>
    resolveCapabilityEvidence({
      capabilityId: capability.id,
      name: capability.name,
      moduleId: capability.moduleId,
      featureId: capability.featureId,
      domainId: capability.domainId,
      section: capability.sourceSection,
      cwd,
      ast,
      graph,
      moduleResolution: moduleById.get(capability.moduleId),
    }),
  );

  const aiAreas = resolveAiAreas({ cwd, ast, graph });
  const crossReference = buildCrossReference(input.extraction, cwd);
  const falsePositives = detectFalsePositives({ modules, capabilities, aiAreas });
  const debt = classifyTechnicalDebt({ cwd, modules });
  const evidenceGraph = buildEvidenceGraph({ modules, capabilities });

  const verifiedCompletionPct = averageConfidence(
    capabilities.map((c) => ({ confidencePct: c.verifiedCompletionPct })),
  );
  const evidenceCoveragePct = averageConfidence(
    modules.map((m) => ({
      confidencePct:
        (m.dimensions.filter((d) => d.present).length / Math.max(1, m.dimensions.length)) * 100,
    })),
  );

  return {
    generatedAt: new Date().toISOString(),
    modules,
    capabilities,
    aiAreas,
    falsePositives,
    debt: debt.items,
    crossReference,
    graph: evidenceGraph,
    averages: {
      moduleConfidencePct: averageConfidence(
        modules.map((m) => ({ confidencePct: m.confidencePct })),
      ),
      capabilityConfidencePct: averageConfidence(
        capabilities.map((c) => ({ confidencePct: c.confidencePct })),
      ),
      verifiedCompletionPct,
      evidenceCoveragePct: Number(evidenceCoveragePct.toFixed(2)),
      falsePositiveCount: falsePositives.length,
    },
    symbolsScanned: ast.symbols.length,
    filesScanned: ast.filesScanned,
    importEdges: graph.edges.length,
  };
}

export class IntelligentEvidenceEngine {
  run(extraction: DocumentExtraction, cwd = process.cwd()): EvidenceEngineReport {
    return runEvidenceEngine({ extraction, cwd });
  }
}

export const intelligentEvidenceEngine = new IntelligentEvidenceEngine();
