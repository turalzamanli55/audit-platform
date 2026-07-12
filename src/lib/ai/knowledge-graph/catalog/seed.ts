import type { AiModuleId } from "@/lib/ai/constants";
import { AI_MODULE_CATALOG } from "@/lib/ai/knowledge/module-catalog";
import { AI_ACTION_DEFINITIONS } from "@/lib/ai/actions/action-definitions";
import { AI_SKILL_CATALOG } from "@/lib/ai/skills/catalog";
import { createKgNode } from "@/lib/ai/knowledge-graph/nodes";
import { createKgEdge } from "@/lib/ai/knowledge-graph/edges";
import { createKgDocument } from "@/lib/ai/knowledge-graph/documents";
import type { KgDocumentRecord, KgEdge, KgNode } from "@/lib/ai/knowledge-graph/types";
import { kgNodeId } from "@/lib/ai/knowledge-graph/utils";

const AUDIT_PHASES: AiModuleId[] = [
  "planning",
  "materiality",
  "risk-assessment",
  "fieldwork",
  "review",
  "completion",
  "reporting",
  "opinion",
];

function buildModuleNodes(): { nodes: KgNode[]; edges: KgEdge[] } {
  const nodes: KgNode[] = [];
  const edges: KgEdge[] = [];

  for (const module of AI_MODULE_CATALOG) {
    const moduleNode = createKgNode({
      type: "module",
      slug: module.id,
      title: module.name,
      summary: module.purpose,
      moduleId: module.id,
      keywords: [module.id, module.name, ...module.navigation.sections],
      permissionCodes: module.permissions,
      metadata: {
        basePath: module.navigation.basePath,
        sections: module.navigation.sections,
        inputs: module.inputs,
        outputs: module.outputs,
      },
    });
    nodes.push(moduleNode);

    const routeNode = createKgNode({
      type: "route",
      slug: module.id,
      title: `${module.name} Route`,
      summary: `Primary route ${module.navigation.basePath}`,
      moduleId: module.id,
      keywords: [module.navigation.basePath, "route", module.id],
      metadata: { path: module.navigation.basePath },
    });
    nodes.push(routeNode);
    edges.push(createKgEdge("belongs_to", routeNode.id, moduleNode.id, 1));

    for (const [index, step] of module.workflow.entries()) {
      const workflowNode = createKgNode({
        type: "workflow",
        slug: `${module.id}.${index}`,
        title: `${module.name}: ${step}`,
        summary: step,
        moduleId: module.id,
        keywords: [step, "workflow", module.id],
        metadata: { stepIndex: index, workflowId: `${module.id}:${index}` },
      });
      nodes.push(workflowNode);
      edges.push(createKgEdge("belongs_to", workflowNode.id, moduleNode.id, 1));
      if (index > 0) {
        const prevId = kgNodeId("workflow", `${module.id}.${index - 1}`);
        edges.push(createKgEdge("previous_step", workflowNode.id, prevId, 1));
        edges.push(createKgEdge("next_step", prevId, workflowNode.id, 1));
      }
    }

    for (const permission of module.permissions.slice(0, 8)) {
      const permissionNode = createKgNode({
        type: "permission",
        slug: permission.replace(/[.:]/g, "-"),
        title: permission,
        summary: `Permission code ${permission}`,
        moduleId: module.id,
        keywords: [permission, "permission"],
        permissionCodes: [permission],
      });
      nodes.push(permissionNode);
      edges.push(createKgEdge("requires", moduleNode.id, permissionNode.id, 1));
    }

    for (const related of module.relatedModules) {
      edges.push(
        createKgEdge("related_to", moduleNode.id, kgNodeId("module", related), 0.8),
      );
    }
    for (const dep of module.dependencies) {
      edges.push(createKgEdge("depends_on", moduleNode.id, kgNodeId("module", dep), 1));
    }
  }

  for (let index = 0; index < AUDIT_PHASES.length - 1; index += 1) {
    edges.push(
      createKgEdge(
        "next_step",
        kgNodeId("module", AUDIT_PHASES[index]!),
        kgNodeId("module", AUDIT_PHASES[index + 1]!),
        1.2,
      ),
    );
    edges.push(
      createKgEdge(
        "previous_step",
        kgNodeId("module", AUDIT_PHASES[index + 1]!),
        kgNodeId("module", AUDIT_PHASES[index]!),
        1.2,
      ),
    );
  }

  return { nodes, edges };
}

function buildStandardNodes(): { nodes: KgNode[]; edges: KgEdge[] } {
  const standards: Array<{
    type: "audit_standard" | "accounting_standard" | "business_rule" | "workflow";
    slug: string;
    title: string;
    summary: string;
    keywords: string[];
    explainsModules: AiModuleId[];
  }> = [
    {
      type: "audit_standard",
      slug: "isa",
      title: "ISA",
      summary: "International Standards on Auditing — professional audit requirements.",
      keywords: ["isa", "audit standard", "international standards on auditing"],
      explainsModules: ["planning", "risk-assessment", "fieldwork", "review", "opinion"],
    },
    {
      type: "accounting_standard",
      slug: "ias",
      title: "IAS",
      summary: "International Accounting Standards forming part of IFRS literature.",
      keywords: ["ias", "accounting standard"],
      explainsModules: ["financial-statements", "reporting"],
    },
    {
      type: "accounting_standard",
      slug: "ifrs",
      title: "IFRS",
      summary: "International Financial Reporting Standards for financial statement presentation.",
      keywords: ["ifrs", "financial reporting", "accounting"],
      explainsModules: ["financial-statements", "reporting", "trial-balance"],
    },
    {
      type: "audit_standard",
      slug: "internal-methodology",
      title: "Internal Methodology",
      summary: "Firm internal audit methodology overlays on ISA requirements.",
      keywords: ["methodology", "internal methodology", "firm methodology"],
      explainsModules: ["planning", "fieldwork", "review", "completion"],
    },
    {
      type: "workflow",
      slug: "audit-workflow",
      title: "Audit Workflow",
      summary: "End-to-end audit phase workflow from planning through opinion.",
      keywords: ["audit workflow", "engagement lifecycle", "phases"],
      explainsModules: ["engagements", ...AUDIT_PHASES],
    },
    {
      type: "business_rule",
      slug: "materiality-concepts",
      title: "Materiality Concepts",
      summary: "Overall, performance, and clearly trivial materiality concepts.",
      keywords: ["materiality", "threshold", "performance materiality"],
      explainsModules: ["materiality", "planning"],
    },
    {
      type: "business_rule",
      slug: "risk-concepts",
      title: "Risk Concepts",
      summary: "Inherent, control, and combined risk assessment concepts.",
      keywords: ["risk", "inherent risk", "control risk", "significant risk"],
      explainsModules: ["risk-assessment", "planning"],
    },
    {
      type: "business_rule",
      slug: "fieldwork-concepts",
      title: "Fieldwork Concepts",
      summary: "Procedures, evidence, sampling, and outstanding work concepts.",
      keywords: ["fieldwork", "procedures", "evidence", "working papers"],
      explainsModules: ["fieldwork", "review"],
    },
    {
      type: "business_rule",
      slug: "opinion-types",
      title: "Opinion Types",
      summary: "Unmodified, qualified, adverse, and disclaimer opinion types.",
      keywords: ["opinion", "unmodified", "qualified", "adverse", "disclaimer"],
      explainsModules: ["opinion", "reporting"],
    },
    {
      type: "business_rule",
      slug: "reporting-concepts",
      title: "Reporting Concepts",
      summary: "Reporting package structure, disclosures, and completion linkage.",
      keywords: ["reporting", "disclosures", "audit report"],
      explainsModules: ["reporting", "completion", "financial-statements"],
    },
  ];

  const nodes: KgNode[] = [];
  const edges: KgEdge[] = [];
  for (const standard of standards) {
    const node = createKgNode({
      type: standard.type,
      slug: standard.slug,
      title: standard.title,
      summary: standard.summary,
      keywords: standard.keywords,
      confidence: 0.92,
      metadata: { domain: "audit_knowledge" },
    });
    nodes.push(node);
    for (const moduleId of standard.explainsModules) {
      edges.push(createKgEdge("explains", node.id, kgNodeId("module", moduleId), 1));
      edges.push(createKgEdge("references", kgNodeId("module", moduleId), node.id, 0.9));
    }
  }
  return { nodes, edges };
}

function buildPlatformDocumentBundle(): {
  nodes: KgNode[];
  edges: KgEdge[];
  documents: KgDocumentRecord[];
} {
  const docs: Array<{
    kind: Parameters<typeof createKgDocument>[0]["kind"];
    slug: string;
    title: string;
    path: string;
    summary: string;
    keywords: string[];
  }> = [
    {
      kind: "project_bible",
      slug: "project-bible",
      title: "PROJECT_BIBLE",
      path: "docs/PROJECT_BIBLE.md",
      summary: "Constitutional product doctrine for the audit platform.",
      keywords: ["project bible", "constitution", "product doctrine"],
    },
    {
      kind: "master_prd",
      slug: "master-prd",
      title: "MASTER_PRD",
      path: "docs/MASTER_PRD.md",
      summary: "Master product requirements for platform capabilities.",
      keywords: ["prd", "requirements", "master prd"],
    },
    {
      kind: "system_architecture",
      slug: "system-architecture",
      title: "SYSTEM_ARCHITECTURE",
      path: "docs/SYSTEM_ARCHITECTURE.md",
      summary: "System architecture including AI gateway and knowledge retrieval.",
      keywords: ["architecture", "system architecture", "ai gateway"],
    },
    {
      kind: "design_system",
      slug: "design-system",
      title: "DESIGN_SYSTEM",
      path: "docs/DESIGN_SYSTEM.md",
      summary: "Visual and interaction constitution for the platform UI.",
      keywords: ["design system", "ui", "accessibility"],
    },
    {
      kind: "implementation_standard",
      slug: "implementation-standard",
      title: "IMPLEMENTATION_STANDARD",
      path: "docs/IMPLEMENTATION_STANDARD.md",
      summary: "Engineering implementation standards and AI abstraction rules.",
      keywords: ["implementation", "engineering standard"],
    },
    {
      kind: "implementation_template",
      slug: "master-implementation-template",
      title: "MASTER_IMPLEMENTATION_TEMPLATE",
      path: "docs/MASTER_IMPLEMENTATION_TEMPLATE.md",
      summary: "Template for implementing platform modules consistently.",
      keywords: ["implementation template", "module template"],
    },
    {
      kind: "help_article",
      slug: "getting-started",
      title: "Getting Started Help",
      path: "docs/help/getting-started.md",
      summary: "Help article contract for first-run workspace orientation.",
      keywords: ["help", "getting started", "onboarding"],
    },
    {
      kind: "user_guide",
      slug: "auditor-user-guide",
      title: "Auditor User Guide",
      path: "docs/guides/auditor-user-guide.md",
      summary: "User guide contract for auditor workflows.",
      keywords: ["user guide", "auditor", "guide"],
    },
    {
      kind: "erp_guide",
      slug: "erp-import-guide",
      title: "ERP Import Guide",
      path: "docs/guides/erp-import-guide.md",
      summary: "ERP guide contract for UAIE import mapping.",
      keywords: ["erp", "import", "uaie", "guide"],
    },
    {
      kind: "template",
      slug: "engagement-checklist-template",
      title: "Engagement Checklist Template",
      path: "docs/templates/engagement-checklist.md",
      summary: "Template contract for engagement completion checklists.",
      keywords: ["template", "checklist", "engagement"],
    },
    {
      kind: "policy",
      slug: "ai-governance-policy",
      title: "AI Governance Policy",
      path: "docs/policies/ai-governance.md",
      summary: "Policy contract: AI assists judgment and never replaces it.",
      keywords: ["policy", "ai governance", "professional judgment"],
    },
  ];

  const nodes: KgNode[] = [];
  const edges: KgEdge[] = [];
  const documents: KgDocumentRecord[] = [];

  for (const doc of docs) {
    const document = createKgDocument(doc);
    documents.push(document);
    const node = createKgNode({
      type: document.kind === "help_article" ? "help_article" : document.kind === "template" ? "template" : "documentation",
      slug: doc.slug,
      title: doc.title,
      summary: doc.summary,
      keywords: doc.keywords,
      confidence: 0.95,
      metadata: { path: doc.path, kind: doc.kind, documentId: document.id },
    });
    nodes.push(node);
  }

  // Platform docs explain the whole product surface.
  for (const module of AI_MODULE_CATALOG) {
    edges.push(
      createKgEdge(
        "explains",
        kgNodeId("documentation", "project-bible"),
        kgNodeId("module", module.id),
        0.5,
      ),
    );
  }

  return { nodes, edges, documents };
}

function buildEntityErpDictionaryNodes(): { nodes: KgNode[]; edges: KgEdge[] } {
  const nodes: KgNode[] = [
    createKgNode({
      type: "entity",
      slug: "company",
      title: "Company Entity",
      summary: "Audited entity graph node used across company and engagement workspaces.",
      keywords: ["company", "entity", "client"],
      moduleId: "companies",
    }),
    createKgNode({
      type: "entity",
      slug: "engagement",
      title: "Engagement Entity",
      summary: "Engagement lifecycle entity spanning audit phases.",
      keywords: ["engagement", "audit engagement"],
      moduleId: "engagements",
    }),
    createKgNode({
      type: "erp",
      slug: "generic-erp",
      title: "ERP Systems",
      summary: "ERP source systems detected and mapped by UAIE.",
      keywords: ["erp", "sap", "1c", "oracle", "dynamics"],
      moduleId: "uaie",
    }),
    createKgNode({
      type: "dictionary",
      slug: "import-dictionary",
      title: "Import Dictionary",
      summary: "Header and vocabulary dictionary for Import Intelligence.",
      keywords: ["dictionary", "mapping", "unknown words"],
      moduleId: "import-intelligence",
    }),
    createKgNode({
      type: "validation_rule",
      slug: "trial-balance-balance-check",
      title: "Trial Balance Validation",
      summary: "Debits equal credits and mapping completeness validation rules.",
      keywords: ["validation", "trial balance", "debits", "credits"],
      moduleId: "trial-balance",
    }),
    createKgNode({
      type: "component",
      slug: "ai-workspace",
      title: "AI Workspace Component",
      summary: "Enterprise AI Workspace UI surface consuming the knowledge graph.",
      keywords: ["ai workspace", "component", "copilot"],
      moduleId: "dashboard",
    }),
    createKgNode({
      type: "prompt_context",
      slug: "enterprise-prompt-context",
      title: "Enterprise Prompt Context",
      summary: "Structured prompt context assembled from graph retrieval — not vendor prompts.",
      keywords: ["prompt context", "context builder", "structured context"],
    }),
  ];

  const edges: KgEdge[] = [
    createKgEdge("uses", kgNodeId("module", "uaie"), kgNodeId("erp", "generic-erp"), 1),
    createKgEdge("uses", kgNodeId("module", "import-intelligence"), kgNodeId("dictionary", "import-dictionary"), 1),
    createKgEdge("reads", kgNodeId("module", "trial-balance"), kgNodeId("validation_rule", "trial-balance-balance-check"), 1),
    createKgEdge("belongs_to", kgNodeId("entity", "engagement"), kgNodeId("entity", "company"), 1),
    createKgEdge("uses", kgNodeId("component", "ai-workspace"), kgNodeId("prompt_context", "enterprise-prompt-context"), 1),
  ];

  return { nodes, edges };
}

function buildActionSkillNodes(): { nodes: KgNode[]; edges: KgEdge[] } {
  const nodes: KgNode[] = [];
  const edges: KgEdge[] = [];

  for (const action of AI_ACTION_DEFINITIONS) {
    const node = createKgNode({
      type: "action",
      slug: action.id.replace(/\./g, "-"),
      title: action.label,
      summary: action.description,
      keywords: [action.id, action.kind, action.label],
      metadata: { actionId: action.id, kind: action.kind },
    });
    nodes.push(node);
    const modules = action.moduleIds === "*" ? AI_MODULE_CATALOG.map((module) => module.id) : action.moduleIds;
    for (const moduleId of modules.slice(0, 6)) {
      edges.push(createKgEdge("uses", kgNodeId("module", moduleId), node.id, 0.6));
    }
  }

  for (const skill of AI_SKILL_CATALOG) {
    const def = skill.definition;
    const node = createKgNode({
      type: "skill",
      slug: def.id.replace(/\./g, "-"),
      title: def.name,
      summary: def.description,
      moduleId: def.moduleId,
      keywords: [def.id, def.name, def.category, ...def.intentHints],
      permissionCodes: def.permission.anyOf,
      metadata: { skillId: def.id, category: def.category },
    });
    nodes.push(node);
    edges.push(createKgEdge("belongs_to", node.id, kgNodeId("module", def.moduleId), 1));
    edges.push(createKgEdge("uses", kgNodeId("module", def.moduleId), node.id, 0.7));
  }

  return { nodes, edges };
}

export type KgCatalogSeed = {
  nodes: KgNode[];
  edges: KgEdge[];
  documents: KgDocumentRecord[];
};

/**
 * Seed catalog for the enterprise knowledge graph.
 * Deduplicates nodes/edges by id after merge.
 */
export function buildKnowledgeGraphCatalog(): KgCatalogSeed {
  const bundles = [
    buildModuleNodes(),
    buildStandardNodes(),
    buildPlatformDocumentBundle(),
    buildEntityErpDictionaryNodes(),
    buildActionSkillNodes(),
  ];

  const nodeMap = new Map<string, KgNode>();
  const edgeMap = new Map<string, KgEdge>();
  const documents: KgDocumentRecord[] = [];

  for (const bundle of bundles) {
    for (const node of bundle.nodes) nodeMap.set(node.id, node);
    for (const edge of bundle.edges) edgeMap.set(edge.id, edge);
    if ("documents" in bundle && Array.isArray(bundle.documents)) {
      documents.push(...bundle.documents);
    }
  }

  // Drop edges whose endpoints were never materialized (e.g. related module typos).
  const edges = [...edgeMap.values()].filter(
    (edge) =>
      nodeMap.has(edge.fromId) &&
      nodeMap.has(edge.toId) &&
      !(edge.fromId === edge.toId && edge.metadata?.self),
  );

  return {
    nodes: [...nodeMap.values()],
    edges,
    documents,
  };
}
