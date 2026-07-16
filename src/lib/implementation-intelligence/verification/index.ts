/**
 * Shared implementation verification against EPAC evidence + AST signals.
 */
import { loadEvidenceReport } from "@/lib/capability-intelligence/evidence";
import type { EvidenceEngineReport } from "@/lib/platform-audit/evidence-engine/types";
import type {
  ClauseStatus,
  ContractClause,
  ContractClauseId,
} from "@/lib/implementation-intelligence/types";
import type { ContractExpectation } from "@/lib/implementation-intelligence/contracts";
import type { ImplementationIntent } from "@/lib/implementation-intelligence/parser";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { walkFiles, toRepoPath } from "@/lib/platform-audit/utils";

const EPAC_KIND: Partial<Record<ContractClauseId, string>> = {
  migration: "migration",
  database: "database",
  repository: "repository",
  serverAction: "serverAction",
  route: "route",
  workspace: "workspace",
  component: "component",
  workflow: "workflow",
  permission: "permission",
  tests: "test",
  localization: "localization",
  documentation: "documentation",
  ai: "ai",
  history: "workflow",
  versioning: "workflow",
  validation: "workflow",
  devops: "documentation",
  notification: "workflow",
  export: "workflow",
  import: "workflow",
};

export type VerificationContext = {
  cwd: string;
  evidence: EvidenceEngineReport;
  intent: ImplementationIntent;
};

export function createVerificationContext(
  cwd: string,
  intent: ImplementationIntent,
  evidence?: EvidenceEngineReport,
): VerificationContext {
  return {
    cwd,
    evidence: evidence ?? loadEvidenceReport(cwd),
    intent,
  };
}

function epacDimension(
  ctx: VerificationContext,
  clause: ContractClauseId,
): { present: boolean; verified: boolean; confidencePct: number; paths: string[] } {
  const mapped = EPAC_KIND[clause] ?? clause;
  const capability = ctx.evidence.capabilities.find((c) => c.capabilityId === ctx.intent.id);
  const module = ctx.evidence.modules.find((m) => m.moduleId === ctx.intent.moduleId);

  const fromDims = (dims: Array<{ dimension: string; present: boolean; confidence: string; confidencePct: number; items: Array<{ path: string }> }>) => {
    const dim = dims.find((d) => d.dimension === mapped || d.dimension === clause);
    if (!dim) return null;
    const verified = dim.present && (dim.confidence === "verified" || dim.confidence === "strong");
    return {
      present: dim.present,
      verified,
      confidencePct: dim.confidencePct,
      paths: dim.items.map((i) => i.path).slice(0, 20),
    };
  };

  if (capability) {
    const hit = fromDims(capability.dimensions);
    if (hit) return hit;
  }
  if (module) {
    const hit = fromDims(module.dimensions);
    if (hit) return hit;
  }

  // Specialized scans
  if (clause === "ai") {
    const present = ctx.evidence.aiAreas.some((a) => a.present);
    return {
      present,
      verified: present,
      confidencePct: present ? 90 : 0,
      paths: ctx.evidence.aiAreas.filter((a) => a.present).flatMap((a) => a.evidencePaths).slice(0, 20),
    };
  }

  if (clause === "devops") {
    const roots = ["src/lib/devops", "src/lib/platform-audit", "src/lib/capability-intelligence", "src/lib/database-governance"];
    const present = roots.filter((r) => existsSync(join(ctx.cwd, r)));
    return {
      present: present.length > 0,
      verified: present.length >= 2,
      confidencePct: present.length >= 2 ? 90 : present.length === 1 ? 50 : 0,
      paths: present,
    };
  }

  if (clause === "history" || clause === "versioning" || clause === "notification" || clause === "export" || clause === "import" || clause === "validation") {
    const token =
      clause === "history"
        ? /history/i
        : clause === "versioning"
          ? /version/i
          : clause === "notification"
            ? /notif/i
            : clause === "export"
              ? /export/i
              : clause === "import"
                ? /import|uaie|ingest/i
                : /validat|rules/i;
    const paths: string[] = [];
    for (const file of walkFiles(join(ctx.cwd, "src", "lib"), [".ts"]).slice(0, 800)) {
      const relative = toRepoPath(ctx.cwd, file);
      if (token.test(relative) || token.test(ctx.intent.moduleId)) {
        if (token.test(relative)) paths.push(relative);
      }
    }
    // Also check module roots from evidence
    if (module) {
      for (const item of module.evidenceItems) {
        if (token.test(item.path)) paths.push(item.path);
      }
    }
    const unique = [...new Set(paths)].slice(0, 20);
    return {
      present: unique.length > 0,
      verified: unique.length > 0,
      confidencePct: unique.length > 0 ? 90 : 0,
      paths: unique,
    };
  }

  return { present: false, verified: false, confidencePct: 0, paths: [] };
}

export function verifyClause(
  ctx: VerificationContext,
  expectation: ContractExpectation,
  blocked: boolean,
): ContractClause {
  if (blocked && expectation.required) {
    return {
      id: expectation.id,
      required: expectation.required,
      reason: expectation.reason,
      bibleTrace: `docs/PROJECT_BIBLE.md#${ctx.intent.sourceSection}`,
      status: "blocked",
      expected: expectation.expected,
      implemented: [],
      missing: expectation.expected,
      deprecated: [],
      evidencePaths: [],
      confidencePct: 0,
      verified: false,
    };
  }

  if (!expectation.required) {
    return {
      id: expectation.id,
      required: false,
      reason: expectation.reason,
      bibleTrace: `docs/PROJECT_BIBLE.md#${ctx.intent.sourceSection}`,
      status: "not_applicable",
      expected: expectation.expected,
      implemented: [],
      missing: [],
      deprecated: [],
      evidencePaths: [],
      confidencePct: 100,
      verified: true,
    };
  }

  const hit = epacDimension(ctx, expectation.id);
  let status: ClauseStatus = "missing";
  if (hit.verified) status = "verified";
  else if (hit.present) status = "implemented";
  else status = "missing";

  return {
    id: expectation.id,
    required: expectation.required,
    reason: expectation.reason,
    bibleTrace: `docs/PROJECT_BIBLE.md#${ctx.intent.sourceSection}`,
    status,
    expected: expectation.expected,
    implemented: hit.paths,
    missing: hit.verified ? [] : expectation.expected,
    deprecated: [],
    evidencePaths: hit.paths,
    confidencePct: hit.confidencePct,
    verified: hit.verified,
  };
}

export function scanRepositoryMethods(cwd: string): {
  files: string[];
  methods: string[];
} {
  const files = walkFiles(join(cwd, "src", "repositories"), [".ts"]);
  const methods: string[] = [];
  for (const file of files.slice(0, 200)) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/(?:async\s+)?([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*\{/g)) {
      const name = match[1]!;
      if (!["if", "for", "while", "switch", "catch", "constructor"].includes(name)) {
        methods.push(`${toRepoPath(cwd, file)}#${name}`);
      }
    }
  }
  return { files: files.map((f) => toRepoPath(cwd, f)), methods };
}

export function scanServerActions(cwd: string): {
  files: string[];
  actions: string[];
} {
  const files = [
    ...walkFiles(join(cwd, "src", "lib", "actions"), [".ts"]),
    ...walkFiles(join(cwd, "src", "actions"), [".ts"]),
  ];
  const actions: string[] = [];
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    if (!/["']use server["']/.test(source.slice(0, 500))) continue;
    for (const match of source.matchAll(/export\s+(?:async\s+)?function\s+([a-zA-Z0-9_]+)/g)) {
      actions.push(`${toRepoPath(cwd, file)}#${match[1]}`);
    }
    for (const match of source.matchAll(/export\s+const\s+([a-zA-Z0-9_]+)\s*=/g)) {
      actions.push(`${toRepoPath(cwd, file)}#${match[1]}`);
    }
  }
  return { files: files.map((f) => toRepoPath(cwd, f)), actions };
}
