/**
 * Evidence resolver — orchestrates dimension resolvers for modules & capabilities.
 */
import {
  discoverCodebaseRoots,
  resolveModuleRoots,
} from "@/lib/platform-audit/evidence-engine/aliases";
import type { AstIndex } from "@/lib/platform-audit/evidence-engine/ast";
import type { ImportGraph } from "@/lib/platform-audit/evidence-engine/imports";
import { resolveRepositories } from "@/lib/platform-audit/evidence-engine/repositories";
import { resolveServerActions } from "@/lib/platform-audit/evidence-engine/server-actions";
import { resolveRoutes } from "@/lib/platform-audit/evidence-engine/routes";
import { resolveComponents } from "@/lib/platform-audit/evidence-engine/components";
import { resolveWorkspaces } from "@/lib/platform-audit/evidence-engine/workspaces";
import { resolveTests } from "@/lib/platform-audit/evidence-engine/tests";
import { resolvePermissions } from "@/lib/platform-audit/evidence-engine/permissions";
import { resolveMigrations, resolveDatabase } from "@/lib/platform-audit/evidence-engine/migrations";
import { resolveLocalization } from "@/lib/platform-audit/evidence-engine/localization";
import { capabilityAliases, pathMatchesAliases, symbolMatchesAliases } from "@/lib/platform-audit/evidence-engine/semantic";
import {
  collapseDimension,
  dimensionConfidenceAverage,
  scoreItem,
  verifiedCompleteness,
} from "@/lib/platform-audit/evidence-engine/scoring";
import type {
  CapabilityEvidenceResolution,
  EvidenceItem,
  EvidenceKind,
  ModuleEvidenceResolution,
  ResolvedDimensionEvidence,
} from "@/lib/platform-audit/evidence-engine/types";

const MODULE_DIMENSIONS: EvidenceKind[] = [
  "database",
  "migration",
  "repository",
  "serverAction",
  "route",
  "workspace",
  "component",
  "localization",
  "test",
  "permission",
  "workflow",
  "documentation",
];

const CAPABILITY_DIMENSIONS: EvidenceKind[] = [
  "database",
  "migration",
  "repository",
  "serverAction",
  "route",
  "workspace",
  "component",
  "localization",
  "test",
  "permission",
  "workflow",
  "documentation",
];

function workflowItems(moduleId: string, roots: string[], ast: AstIndex): EvidenceItem[] {
  const items: EvidenceItem[] = [];
  for (const symbol of ast.symbols) {
    if (!/engine|workflow|pipeline|orchestrat/i.test(symbol.name) && !/engine|workflow|pipeline/i.test(symbol.filePath)) {
      continue;
    }
    if (!roots.some((root) => symbol.filePath.startsWith(root))) continue;
    items.push(
      scoreItem({
        kind: "workflow",
        path: symbol.filePath,
        symbol: symbol.name,
        strong: symbol.exported,
        verified: symbol.exported && /Engine$/.test(symbol.name),
        reasons: ["workflow/engine symbol"],
        moduleIds: [moduleId],
      }),
    );
  }
  return items;
}

export function resolveModuleEvidence(input: {
  moduleId: string;
  name: string;
  domainId: string;
  section: string;
  cwd: string;
  ast: AstIndex;
  graph: ImportGraph;
}): ModuleEvidenceResolution {
  const roots = discoverCodebaseRoots(input.cwd);
  const resolved = resolveModuleRoots(input.moduleId, input.name, roots);
  const allRoots = [
    ...resolved.libPaths,
    ...resolved.repositoryPaths,
    ...resolved.componentPaths,
  ];

  const migrationItems = resolveMigrations({
    moduleId: input.moduleId,
    aliases: resolved.aliases,
    cwd: input.cwd,
  });
  const databaseItems = resolveDatabase({
    moduleId: input.moduleId,
    aliases: resolved.aliases,
    cwd: input.cwd,
    migrationItems,
  });
  const repositoryItems = resolveRepositories({
    moduleId: input.moduleId,
    roots: allRoots.filter((r) => r.startsWith("src/repositories") || r.startsWith("src/lib")),
    ast: input.ast,
    graph: input.graph,
  });
  const serverActionItems = resolveServerActions({
    moduleId: input.moduleId,
    aliases: resolved.aliases,
    roots: allRoots,
    ast: input.ast,
    cwd: input.cwd,
  });
  const routeItems = resolveRoutes({
    moduleId: input.moduleId,
    aliases: resolved.aliases,
    cwd: input.cwd,
  });
  const componentItems = resolveComponents({
    moduleId: input.moduleId,
    roots: allRoots,
    aliases: resolved.aliases,
    ast: input.ast,
  });
  const workspaceItems = resolveWorkspaces({
    moduleId: input.moduleId,
    aliases: resolved.aliases,
    roots: allRoots,
    ast: input.ast,
    cwd: input.cwd,
  });
  const testItems = resolveTests({
    moduleId: input.moduleId,
    roots: allRoots,
    aliases: resolved.aliases,
    ast: input.ast,
    graph: input.graph,
  });
  const permissionItems = resolvePermissions({
    moduleId: input.moduleId,
    aliases: resolved.aliases,
    roots: allRoots,
    ast: input.ast,
    cwd: input.cwd,
  });
  const localizationItems = resolveLocalization({
    moduleId: input.moduleId,
    aliases: resolved.aliases,
    cwd: input.cwd,
  });
  const workflow = workflowItems(input.moduleId, allRoots, input.ast);
  const documentation: EvidenceItem[] = [
    scoreItem({
      kind: "documentation",
      path: `docs/PROJECT_BIBLE.md#${input.section}`,
      verified: true,
      reasons: ["PROJECT_BIBLE module definition"],
      moduleIds: [input.moduleId],
    }),
  ];

  const byKind: Record<EvidenceKind, EvidenceItem[]> = {
    database: databaseItems,
    migration: migrationItems,
    repository: repositoryItems,
    serverAction: serverActionItems,
    route: routeItems,
    workspace: workspaceItems,
    component: componentItems,
    localization: localizationItems,
    test: testItems,
    permission: permissionItems,
    workflow,
    documentation,
    ai: [],
    export: [],
    import: [],
  };

  const dimensions: ResolvedDimensionEvidence[] = MODULE_DIMENSIONS.map((dimension) =>
    collapseDimension(dimension, byKind[dimension] ?? []),
  );
  const evidenceItems = dimensions.flatMap((d) => d.items);

  return {
    moduleId: input.moduleId,
    name: input.name,
    aliases: resolved.aliases,
    matchedRoots: resolved.matchedRoots,
    dimensions,
    evidenceItems,
    confidencePct: dimensionConfidenceAverage(dimensions),
    verifiedCompletionPct: verifiedCompleteness(dimensions),
    falsePositiveRisk: resolved.matchedRoots.length > 4,
  };
}

export function resolveCapabilityEvidence(input: {
  capabilityId: string;
  name: string;
  moduleId: string;
  featureId: string;
  domainId: string;
  section: string;
  cwd: string;
  ast: AstIndex;
  graph: ImportGraph;
  moduleResolution?: ModuleEvidenceResolution;
}): CapabilityEvidenceResolution {
  const aliases = capabilityAliases({
    id: input.capabilityId,
    name: input.name,
    moduleId: input.moduleId,
    featureId: input.featureId,
  });

  const moduleRes =
    input.moduleResolution ??
    resolveModuleEvidence({
      moduleId: input.moduleId,
      name: input.moduleId,
      domainId: input.domainId,
      section: input.section,
      cwd: input.cwd,
      ast: input.ast,
      graph: input.graph,
    });

  // Start from module evidence, then refine with capability-specific AST hits
  const items: EvidenceItem[] = [];

  for (const symbol of input.ast.symbols) {
    if (!symbol.exported) continue;
    if (!symbolMatchesAliases(symbol, aliases)) continue;
    const kind: EvidenceKind = symbol.isRepository
      ? "repository"
      : symbol.isServerActionFile || symbol.kind === "serverAction"
        ? "serverAction"
        : symbol.isReactComponent
          ? "component"
          : symbol.kind === "hook" || symbol.kind === "provider"
            ? "workspace"
            : "workflow";
    items.push(
      scoreItem({
        kind,
        path: symbol.filePath,
        symbol: symbol.name,
        verified: true,
        reasons: ["AST export matches capability aliases"],
        moduleIds: [input.moduleId],
        capabilityIds: [input.capabilityId],
      }),
    );
  }

  // Inherit trusted module dimension items when capability aliases align with module
  for (const dim of moduleRes.dimensions) {
    for (const item of dim.items) {
      if (item.confidencePct < 75) continue;
      if (
        pathMatchesAliases(item.path, aliases) ||
        moduleRes.matchedRoots.some((root) => item.path.includes(root))
      ) {
        items.push({
          ...item,
          capabilityIds: [...new Set([...item.capabilityIds, input.capabilityId])],
        });
      }
    }
  }

  // Migration/database/routes/tests/localization refined by capability alias
  const capabilityMigrations = resolveMigrations({
    moduleId: input.moduleId,
    aliases,
    cwd: input.cwd,
  });
  items.push(
    ...capabilityMigrations.map((item) => ({
      ...item,
      capabilityIds: [input.capabilityId],
    })),
  );
  items.push(
    ...resolveDatabase({
      moduleId: input.moduleId,
      aliases,
      cwd: input.cwd,
      migrationItems: capabilityMigrations,
    }).map((item) => ({
      ...item,
      capabilityIds: [input.capabilityId],
    })),
  );
  items.push(
    ...resolveRoutes({ moduleId: input.moduleId, aliases, cwd: input.cwd }).map((item) => ({
      ...item,
      capabilityIds: [input.capabilityId],
    })),
  );
  items.push(
    ...resolveTests({
      moduleId: input.moduleId,
      roots: moduleRes.matchedRoots.map((r) =>
        moduleRes.evidenceItems.find((i) => i.path.includes(r))?.path.startsWith("src/repositories")
          ? `src/repositories/${r}`
          : `src/lib/${r}`,
      ),
      aliases,
      ast: input.ast,
      graph: input.graph,
    }).map((item) => ({ ...item, capabilityIds: [input.capabilityId] })),
  );
  items.push(
    ...resolveLocalization({
      moduleId: input.moduleId,
      aliases,
      cwd: input.cwd,
    }).map((item) => ({ ...item, capabilityIds: [input.capabilityId] })),
  );
  items.push(
    scoreItem({
      kind: "documentation",
      path: `docs/PROJECT_BIBLE.md#${input.section}`,
      verified: true,
      reasons: ["PROJECT_BIBLE capability definition"],
      capabilityIds: [input.capabilityId],
      moduleIds: [input.moduleId],
    }),
  );

  const byKind = new Map<EvidenceKind, EvidenceItem[]>();
  for (const kind of CAPABILITY_DIMENSIONS) byKind.set(kind, []);
  for (const item of items) {
    const list = byKind.get(item.kind) ?? [];
    list.push(item);
    byKind.set(item.kind, list);
  }

  const dimensions = CAPABILITY_DIMENSIONS.map((dimension) =>
    collapseDimension(dimension, byKind.get(dimension) ?? []),
  );
  const missingDimensions = dimensions.filter((d) => !d.present).map((d) => d.dimension);
  const verifiedCompletionPct = verifiedCompleteness(dimensions);
  const confidencePct = dimensionConfidenceAverage(dimensions);

  return {
    capabilityId: input.capabilityId,
    name: input.name,
    moduleId: input.moduleId,
    featureId: input.featureId,
    dimensions,
    evidenceItems: dimensions.flatMap((d) => d.items),
    confidencePct,
    verifiedCompletionPct,
    missingDimensions,
    rootCause:
      verifiedCompletionPct === 0
        ? "No verified/strong implementation evidence for capability"
        : missingDimensions.length > 0
          ? `Missing trusted evidence: ${missingDimensions.join(", ")}`
          : null,
  };
}
