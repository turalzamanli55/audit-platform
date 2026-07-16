/**
 * EPAC Phase 6 — Localization Audit (AZ, EN, RU, TR).
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { walkFiles, toRepoPath } from "@/lib/platform-audit/utils";
import type { AuditFinding, PhaseHealth } from "@/lib/platform-audit/types";

const LOCALES = ["en", "az", "ru", "tr"] as const;

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object") return prefix ? [prefix] : [];
  const keys: string[] = [];
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (nested !== null && typeof nested === "object" && !Array.isArray(nested)) {
      keys.push(...flattenKeys(nested, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

function resolveMessagesDir(cwd: string): string | null {
  const candidates = [
    join(cwd, "messages"),
    join(cwd, "src", "messages"),
    join(cwd, "src", "i18n", "messages"),
    join(cwd, "src", "lib", "i18n", "messages"),
  ];
  return candidates.find((path) => existsSync(path)) ?? null;
}

export function auditLocalization(cwd = process.cwd()): PhaseHealth {
  const started = Date.now();
  const findings: AuditFinding[] = [];
  const messagesDir = resolveMessagesDir(cwd);

  if (!messagesDir) {
    findings.push({
      phase: "localization",
      code: "messages_directory_missing",
      severity: "blocker",
      message: "No messages directory found for locales",
      rootCause: "Localization message catalogs absent",
    });
    return {
      phase: "localization",
      label: "Localization Audit",
      ok: false,
      scorePct: 0,
      findings,
      metrics: {
        localesExpected: LOCALES.length,
        localesPresent: 0,
        coveragePct: 0,
        hardcodedSuspects: 0,
      },
      durationMs: Date.now() - started,
    };
  }

  const keySets = new Map<string, Set<string>>();
  let presentLocales = 0;
  for (const locale of LOCALES) {
    const filePath = join(messagesDir, `${locale}.json`);
    if (!existsSync(filePath)) {
      findings.push({
        phase: "localization",
        code: "missing_locale_catalog",
        severity: "error",
        message: `Missing locale catalog: ${locale}.json`,
        rootCause: "Required locale AZ/EN/RU/TR incomplete",
        evidencePaths: [toRepoPath(cwd, filePath)],
      });
      continue;
    }
    presentLocales += 1;
    const json = JSON.parse(readFileSync(filePath, "utf8")) as unknown;
    keySets.set(locale, new Set(flattenKeys(json)));
  }

  const base = keySets.get("en") ?? keySets.values().next().value ?? new Set<string>();
  for (const [locale, keys] of keySets) {
    if (locale === "en") continue;
    const missing = [...base].filter((key) => !keys.has(key));
    if (missing.length > 0) {
      findings.push({
        phase: "localization",
        code: "missing_translations",
        severity: "error",
        message: `${locale}: ${missing.length} keys missing vs EN`,
        rootCause: "Locale catalog incomplete relative to EN",
        evidencePaths: missing.slice(0, 20),
      });
    }
  }

  let hardcodedSuspects = 0;
  for (const file of walkFiles(join(cwd, "src", "components"), [".tsx"]).slice(0, 400)) {
    const source = readFileSync(file, "utf8");
    const matches = source.match(/>\s*[A-Z][a-z]+(?:\s+[A-Za-z]+){1,6}\s*</g);
    if (matches && matches.length >= 3) {
      hardcodedSuspects += 1;
    }
  }
  if (hardcodedSuspects > 0) {
    findings.push({
      phase: "localization",
      code: "hardcoded_text_suspects",
      severity: "warning",
      message: `${hardcodedSuspects} component files show likely hardcoded UI text`,
      rootCause: "UI strings may bypass i18n message catalogs",
    });
  }

  const coveragePct = Number(((presentLocales / LOCALES.length) * 100).toFixed(2));
  const missingPenalty = Math.min(40, findings.filter((f) => f.code === "missing_translations").length * 10);
  const scorePct = Math.max(0, Number((coveragePct - missingPenalty).toFixed(2)));

  return {
    phase: "localization",
    label: "Localization Audit",
    ok: findings.every((finding) => finding.severity !== "blocker"),
    scorePct,
    findings,
    metrics: {
      localesExpected: LOCALES.length,
      localesPresent: presentLocales,
      coveragePct,
      hardcodedSuspects,
      messagesDir: toRepoPath(cwd, messagesDir),
      messageFiles: existsSync(messagesDir)
        ? readdirSync(messagesDir).filter((name) => name.endsWith(".json")).length
        : 0,
    },
    durationMs: Date.now() - started,
  };
}
