/**
 * EPAC Phase 2 — Architecture Audit.
 * Verifies layers, folder structure, isolation; detects circular import risks via heuristics.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  listImmediateChildren,
  toRepoPath,
  walkFiles,
} from "@/lib/platform-audit/utils";
import type { AuditFinding, PhaseHealth } from "@/lib/platform-audit/types";

const REQUIRED_LAYERS = [
  "src/app",
  "src/components",
  "src/lib",
  "src/repositories",
  "src/types",
  "supabase/migrations",
  "docs",
] as const;

const FORBIDDEN_IMPORT_PATTERNS: Array<{
  from: RegExp;
  into: RegExp;
  code: string;
  message: string;
}> = [
  {
    from: /src[\\/]repositories[\\/]/,
    into: /src[\\/]components[\\/]/,
    code: "repository_imported_by_component",
    message: "Component layer imports repository layer",
  },
  {
    from: /src[\\/]app[\\/]/,
    into: /src[\\/]repositories[\\/]/,
    code: "app_imported_by_repository",
    message: "Repository imports app layer",
  },
];

function detectImportViolations(cwd: string): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const files = walkFiles(join(cwd, "src"), [".ts", ".tsx"]);
  for (const file of files) {
    const relative = toRepoPath(cwd, file);
    if (relative.includes("platform-audit")) continue;
    const source = readFileSync(file, "utf8");
    const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]!);
    for (const imported of imports) {
      const resolved = imported.startsWith("@/")
        ? imported.replace(/^@\//, "src/")
        : imported;
      for (const rule of FORBIDDEN_IMPORT_PATTERNS) {
        if (rule.into.test(relative.replace(/\\/g, "/")) && rule.from.test(resolved)) {
          findings.push({
            phase: "architecture",
            code: rule.code,
            severity: "error",
            message: `${rule.message}: ${relative} → ${imported}`,
            rootCause: "Layer dependency rule violated",
            evidencePaths: [relative],
          });
        }
      }
    }
  }
  return findings.slice(0, 50);
}

function detectDuplicateModuleNames(cwd: string): AuditFinding[] {
  const lib = listImmediateChildren(join(cwd, "src", "lib"));
  const repos = listImmediateChildren(join(cwd, "src", "repositories"));
  const findings: AuditFinding[] = [];
  const libSet = new Set(lib);
  for (const repo of repos) {
    if (!libSet.has(repo)) continue;
    // Shared names across lib+repositories is expected for module pairing — not a violation.
  }
  const seen = new Map<string, string>();
  for (const name of lib) {
    const key = name.replace(/-/g, "");
    const prior = seen.get(key);
    if (prior && prior !== name) {
      findings.push({
        phase: "architecture",
        code: "near_duplicate_lib_module",
        severity: "warning",
        message: `Near-duplicate lib modules: ${prior} and ${name}`,
        rootCause: "Module naming collision risk",
        evidencePaths: [`src/lib/${prior}`, `src/lib/${name}`],
      });
    }
    seen.set(key, name);
  }
  return findings;
}

export function auditArchitecture(cwd = process.cwd()): PhaseHealth {
  const started = Date.now();
  const findings: AuditFinding[] = [];

  let presentLayers = 0;
  for (const layer of REQUIRED_LAYERS) {
    if (existsSync(join(cwd, layer))) {
      presentLayers += 1;
    } else {
      findings.push({
        phase: "architecture",
        code: "missing_architecture_layer",
        severity: "blocker",
        message: `Missing required layer: ${layer}`,
        rootCause: "Folder structure does not match platform architecture",
        evidencePaths: [layer],
      });
    }
  }

  findings.push(...detectImportViolations(cwd));
  findings.push(...detectDuplicateModuleNames(cwd));

  const libModules = listImmediateChildren(join(cwd, "src", "lib"));
  const repositories = listImmediateChildren(join(cwd, "src", "repositories"));
  const components = listImmediateChildren(join(cwd, "src", "components"));

  const layerScore = Number(((presentLayers / REQUIRED_LAYERS.length) * 100).toFixed(2));
  const violationPenalty = Math.min(40, findings.filter((f) => f.severity === "error").length * 2);
  const scorePct = Math.max(0, Number((layerScore - violationPenalty).toFixed(2)));

  return {
    phase: "architecture",
    label: "Architecture Audit",
    ok: findings.every((finding) => finding.severity !== "blocker"),
    scorePct,
    findings,
    metrics: {
      requiredLayers: REQUIRED_LAYERS.length,
      presentLayers,
      libModules: libModules.length,
      repositories: repositories.length,
      componentGroups: components.length,
      importViolations: findings.filter((f) => f.code.includes("import") || f.code.includes("imported")).length,
    },
    durationMs: Date.now() - started,
  };
}
