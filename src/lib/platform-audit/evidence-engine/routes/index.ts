/**
 * App Router route resolution.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { scoreItem } from "@/lib/platform-audit/evidence-engine/scoring";
import type { EvidenceItem } from "@/lib/platform-audit/evidence-engine/types";
import { toRepoPath, walkFiles } from "@/lib/platform-audit/utils";

export function resolveRoutes(input: {
  moduleId: string;
  aliases: string[];
  cwd: string;
}): EvidenceItem[] {
  const items: EvidenceItem[] = [];
  const aliasNorm = input.aliases.map((a) => a.toLowerCase()).filter((a) => a.length >= 3);
  const appRoot = join(input.cwd, "src", "app");
  if (!existsSync(appRoot)) return items;

  const pages = walkFiles(appRoot, [".tsx"]).filter(
    (file) =>
      file.endsWith(`${join("page.tsx")}`) ||
      file.endsWith("page.tsx") ||
      file.endsWith("route.ts") ||
      file.endsWith("route.tsx"),
  );

  for (const absolute of pages) {
    const relative = toRepoPath(input.cwd, absolute).replace(/\\/g, "/");
    const haystack = relative.toLowerCase();
    const matched = aliasNorm.some((alias) => haystack.includes(alias.replace(/_/g, "-")) || haystack.includes(alias));
    if (!matched) continue;

    const isDynamic = /\[.+\]/.test(relative);
    const isProtected = /\/\(protected\)\//.test(relative);
    const isApi = /\/api\//.test(relative);
    const isWorkspace = /workspace/.test(haystack);

    items.push(
      scoreItem({
        kind: "route",
        path: relative,
        verified: relative.endsWith("page.tsx") || relative.endsWith("route.ts"),
        strong: true,
        reasons: [
          "App Router file",
          isDynamic ? "dynamic segment" : "static segment",
          isProtected ? "protected route group" : "public/other group",
          isApi ? "API route" : "UI route",
          isWorkspace ? "workspace route" : "module route",
        ],
        moduleIds: [input.moduleId],
      }),
    );
  }

  // Nested layouts under matched segments
  for (const absolute of walkFiles(appRoot, [".tsx"]).filter((f) => f.endsWith("layout.tsx"))) {
    const relative = toRepoPath(input.cwd, absolute).replace(/\\/g, "/");
    if (!aliasNorm.some((alias) => relative.toLowerCase().includes(alias))) continue;
    items.push(
      scoreItem({
        kind: "route",
        path: relative,
        strong: true,
        reasons: ["nested layout"],
        moduleIds: [input.moduleId],
      }),
    );
  }

  return dedupe(items);
}

function dedupe(items: EvidenceItem[]): EvidenceItem[] {
  const map = new Map<string, EvidenceItem>();
  for (const item of items) {
    const prior = map.get(item.path);
    if (!prior || item.confidencePct > prior.confidencePct) map.set(item.path, item);
  }
  return [...map.values()];
}
