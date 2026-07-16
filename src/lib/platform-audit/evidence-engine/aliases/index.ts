/**
 * Semantic module aliases — bible IDs resolve to real implementation roots.
 * Exact folder names are NOT required.
 */
import { listImmediateChildren } from "@/lib/platform-audit/utils";
import { join } from "node:path";

/** Strip common prefixes/suffixes and normalize separators. */
export function normalizeIdentity(value: string): string {
  return value
    .toLowerCase()
    .replace(/^mod[_-]/, "")
    .replace(/^cap[_-]/, "")
    .replace(/^feat[_-]/, "")
    .replace(/[_-]/g, "")
    .replace(/\s+/g, "");
}

/** Generate alias variants for a module id/name. */
export function expandAliases(...parts: Array<string | undefined | null>): string[] {
  const aliases = new Set<string>();
  for (const part of parts) {
    if (!part) continue;
    const raw = part.trim();
    if (!raw) continue;
    aliases.add(raw.toLowerCase());
    aliases.add(normalizeIdentity(raw));

    const withoutPrefix = raw.replace(/^(mod_|cap_|feat_)/i, "");
    aliases.add(withoutPrefix.toLowerCase());
    aliases.add(normalizeIdentity(withoutPrefix));

    const kebab = withoutPrefix
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[_\s]+/g, "-")
      .toLowerCase();
    aliases.add(kebab);
    aliases.add(normalizeIdentity(kebab));

    // plural/singular heuristics
    if (kebab.endsWith("ies")) {
      aliases.add(kebab.replace(/ies$/, "y"));
      aliases.add(normalizeIdentity(kebab.replace(/ies$/, "y")));
    } else if (kebab.endsWith("s") && kebab.length > 3) {
      aliases.add(kebab.slice(0, -1));
      aliases.add(normalizeIdentity(kebab.slice(0, -1)));
    } else {
      aliases.add(`${kebab}s`);
      aliases.add(normalizeIdentity(`${kebab}s`));
    }

    // compound suffixes often used in folders
    for (const suffix of ["core", "management", "engine", "module", "service", "admin"]) {
      aliases.add(`${kebab}-${suffix}`);
      aliases.add(normalizeIdentity(`${kebab}${suffix}`));
    }
  }
  return [...aliases].filter(Boolean);
}

/** Known bible ↔ filesystem semantic mappings (enterprise aliases). */
export const KNOWN_MODULE_ALIASES: Record<string, string[]> = {
  mod_foundation: ["sql-foundation", "database-governance", "supabase", "health"],
  mod_organizations: ["organization", "membership"],
  mod_organization: ["organization", "membership"],
  mod_companies: ["company"],
  mod_company: ["company"],
  mod_users: ["user"],
  mod_user: ["user"],
  mod_authentication: ["auth", "security", "permission", "role"],
  mod_auth: ["auth", "security"],
  mod_workspaces: ["workspace"],
  mod_workspace: ["workspace"],
  mod_engagements: ["engagement"],
  mod_engagement: ["engagement"],
  "mod_financial-data-import": ["trial-balance", "uaie"],
  mod_financial_data_import: ["trial-balance", "uaie"],
  "mod_general-ledger": ["trial-balance"],
  mod_trial_balance: ["trial-balance"],
  mod_financial_statements: ["financial-statements", "fs-mapping", "fs-rendering"],
  "mod_financial-statements": ["financial-statements", "fs-mapping", "fs-rendering"],
  mod_ifrs_notes: ["ifrs-notes"],
  "mod_ifrs-notes": ["ifrs-notes"],
  mod_risk_assessment: ["risk-assessment"],
  "mod_risk-assessment": ["risk-assessment"],
  mod_ai: ["ai"],
  mod_artificial_intelligence: ["ai"],
  mod_devops: ["devops", "platform-audit", "database-governance"],
  mod_capability_registry: ["capability-registry"],
  mod_platform_registry: ["platform-registry"],
  mod_project_sync: ["project-sync"],
  mod_platform_audit: ["platform-audit"],
};

/** Known AI area aliases — folder names need not match bible labels. */
export const AI_AREA_ALIASES: Record<string, string[]> = {
  foundation: ["core", "types", "utils", "registry"],
  context_engine: ["context", "context-resolvers", "conversation"],
  knowledge_engine: ["knowledge", "knowledge-graph"],
  memory_engine: ["memory", "memory-engine"],
  planner: ["planner"],
  prompt_builder: ["prompts"],
  providers: ["providers"],
  skills: ["skills"],
  knowledge_graph: ["knowledge-graph"],
  tools: ["tools"],
  orchestrator: ["orchestrator"],
  pipeline: ["pipeline"],
  host: ["host"],
  workspace: ["ui", "actions", "permissions"],
  everywhere: ["ui", "host", "pipeline"],
};

export type CodebaseRoots = {
  lib: string[];
  repositories: string[];
  components: string[];
};

export function discoverCodebaseRoots(cwd: string): CodebaseRoots {
  return {
    lib: listImmediateChildren(join(cwd, "src", "lib")),
    repositories: listImmediateChildren(join(cwd, "src", "repositories")),
    components: listImmediateChildren(join(cwd, "src", "components")),
  };
}

export function resolveModuleRoots(
  moduleId: string,
  moduleName: string,
  roots: CodebaseRoots,
): {
  aliases: string[];
  matchedRoots: string[];
  libPaths: string[];
  repositoryPaths: string[];
  componentPaths: string[];
} {
  const known = KNOWN_MODULE_ALIASES[moduleId] ?? KNOWN_MODULE_ALIASES[moduleId.replace(/-/g, "_")] ?? [];
  const aliases = expandAliases(moduleId, moduleName, ...known);
  const aliasSet = new Set(aliases.map(normalizeIdentity));

  const matchRoot = (name: string): boolean => {
    const normalized = normalizeIdentity(name);
    if (aliasSet.has(normalized)) return true;
    for (const alias of aliasSet) {
      if (alias.length >= 4 && (normalized.includes(alias) || alias.includes(normalized))) {
        return true;
      }
    }
    return known.some((k) => normalizeIdentity(k) === normalized || name === k);
  };

  const libPaths = roots.lib.filter(matchRoot).map((name) => `src/lib/${name}`);
  const repositoryPaths = roots.repositories
    .filter(matchRoot)
    .map((name) => `src/repositories/${name}`);
  const componentPaths = roots.components.filter(matchRoot).map((name) => `src/components/${name}`);
  const matchedRoots = [
    ...new Set([
      ...libPaths.map((p) => p.split("/").pop()!),
      ...repositoryPaths.map((p) => p.split("/").pop()!),
      ...componentPaths.map((p) => p.split("/").pop()!),
    ]),
  ];

  return { aliases, matchedRoots, libPaths, repositoryPaths, componentPaths };
}
