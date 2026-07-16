/**
 * Localization evidence — locale catalogs + namespace keys for module aliases.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { scoreItem } from "@/lib/platform-audit/evidence-engine/scoring";
import type { EvidenceItem } from "@/lib/platform-audit/evidence-engine/types";

const LOCALES = ["en", "az", "ru", "tr"] as const;

function messagesDir(cwd: string): string | null {
  const candidates = [
    join(cwd, "messages"),
    join(cwd, "src", "messages"),
    join(cwd, "src", "i18n", "messages"),
    join(cwd, "src", "lib", "i18n", "messages"),
  ];
  return candidates.find((path) => existsSync(path)) ?? null;
}

export function resolveLocalization(input: {
  moduleId: string;
  aliases: string[];
  cwd: string;
}): EvidenceItem[] {
  const items: EvidenceItem[] = [];
  const dir = messagesDir(input.cwd);
  if (!dir) return items;

  const aliasNorm = input.aliases.map((a) => a.toLowerCase()).filter((a) => a.length >= 3);
  let presentLocales = 0;

  for (const locale of LOCALES) {
    const file = join(dir, `${locale}.json`);
    if (!existsSync(file)) continue;
    presentLocales += 1;
    const raw = readFileSync(file, "utf8").toLowerCase();
    const hit = aliasNorm.some((alias) => raw.includes(`"${alias}"`) || raw.includes(alias));
    if (hit || presentLocales === LOCALES.length) {
      items.push(
        scoreItem({
          kind: "localization",
          path: file.replace(/\\/g, "/").includes("messages")
            ? file.slice(input.cwd.length + 1).replace(/\\/g, "/")
            : `messages/${locale}.json`,
          verified: hit && presentLocales === LOCALES.length,
          strong: hit || presentLocales === LOCALES.length,
          reasons: [
            hit ? "namespace/alias keys present" : "locale catalog present",
            `locale=${locale}`,
          ],
          moduleIds: [input.moduleId],
        }),
      );
    }
  }

  if (presentLocales === LOCALES.length && items.length === 0) {
    items.push(
      scoreItem({
        kind: "localization",
        path: "messages/",
        indirect: true,
        reasons: ["AZ/EN/RU/TR catalogs present (module namespace not proven)"],
        moduleIds: [input.moduleId],
      }),
    );
  }

  return items;
}
