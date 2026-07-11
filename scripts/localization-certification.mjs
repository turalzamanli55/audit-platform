#!/usr/bin/env node
/**
 * Localization Certification Sprint
 *
 * Reports: missing keys, unused keys, English leakage, duplicate keys,
 * broken namespaces, hardcoded UI strings.
 *
 * Usage:
 *   node scripts/localization-certification.mjs
 *   node scripts/localization-certification.mjs --fix
 *   node scripts/localization-certification.mjs --walk
 *   node scripts/localization-certification.mjs --json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const messagesDir = path.join(root, "src/i18n/messages");
const srcDir = path.join(root, "src");

const LOCALES = ["en", "az", "ru", "tr"];
const SATELLITES = ["", "auth-experience-", "marketing-", "dashboard-workspace-"];

/** Intentionally allowed English tokens (standards / product names / tech). */
const ALLOWED_EXACT = new Set(
  [
    "IFRS",
    "ISA",
    "ISAs",
    "IAS",
    "SAP",
    "Oracle",
    "NetSuite",
    "Oracle NetSuite",
    "SQL",
    "API",
    "JSON",
    "ERP",
    "AI",
    "UUID",
    "CSV",
    "PDF",
    "XLSX",
    "ID",
    "OK",
    "URL",
    "HTTP",
    "HTTPS",
    "SSO",
    "MFA",
    "UTC",
    "KPI",
    "TB",
    "GL",
    "FS",
    "Xero",
    "Odoo",
    "1C",
    "Logo",
    "Netsis",
    "Mikro",
    "QuickBooks",
    "Zoho",
    "Zoho Books",
    "Dynamics",
    "Dynamics 365",
    "Microsoft Dynamics",
    "SAP Business One",
    "ISA 320",
    "ISA 315",
    "ISA 330",
    "ISA 700",
    "EBITDA",
    "OCI",
    "Twitter",
    "LinkedIn",
    "GitHub",
    "v",
    "·",
    "—",
    "-",
    "/",
    "{count}",
    "{name}",
    "{groupCount}",
    "{procedureCount}",
  ].map((s) => s.toLowerCase()),
);

const ALLOWED_PATTERN =
  /^(IFRS|ISA|IAS|SAP|Oracle|SQL|API|JSON|ERP|AI|UUID|CSV|PDF|XLSX|SSO|MFA|UTC|KPI)\b/i;

const args = new Set(process.argv.slice(2));
const DO_FIX = args.has("--fix");
const DO_WALK = args.has("--walk");
const AS_JSON = args.has("--json");

function flatten(obj, prefix = "", out = {}) {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    out[prefix] = obj;
    return out;
  }
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) flatten(v, p, out);
    else out[p] = v;
  }
  return out;
}

function unflatten(flat) {
  const rootObj = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split(".");
    let cur = rootObj;
    for (let i = 0; i < parts.length - 1; i++) {
      cur[parts[i]] ??= {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
  }
  return rootObj;
}

function deepMergeMissing(target, source) {
  if (source === null || typeof source !== "object" || Array.isArray(source)) {
    return target === undefined ? source : target;
  }
  const out = target && typeof target === "object" && !Array.isArray(target) ? { ...target } : {};
  for (const [k, v] of Object.entries(source)) {
    if (!(k in out)) out[k] = structuredClone(v);
    else out[k] = deepMergeMissing(out[k], v);
  }
  return out;
}

function findDuplicates(flat) {
  const byValue = new Map();
  for (const [k, v] of Object.entries(flat)) {
    if (typeof v !== "string") continue;
    if (!byValue.has(v)) byValue.set(v, []);
    byValue.get(v).push(k);
  }
  return [...byValue.entries()]
    .filter(([, keys]) => keys.length > 3 && vLooksLikeUi(keys[0] ? flat[keys[0]] : ""))
    .map(([value, keys]) => ({ value, keys: keys.slice(0, 8), count: keys.length }));
}

function vLooksLikeUi(v) {
  return typeof v === "string" && v.length > 2 && /[A-Za-z]/.test(v);
}

function isAllowedEnglish(value) {
  const t = String(value).trim();
  if (!t) return true;
  if (ALLOWED_EXACT.has(t.toLowerCase())) return true;
  if (ALLOWED_PATTERN.test(t) && t.length <= 24) return true;
  // placeholders only
  if (/^\{[a-zA-Z0-9_]+\}$/.test(t)) return true;
  // placeholder templates with punctuation only between tokens
  const withoutPlaceholders = t.replace(/\{[a-zA-Z0-9_]+\}/g, "").trim();
  if (withoutPlaceholders.length > 0 && !/[A-Za-z]{3,}/.test(withoutPlaceholders)) return true;
  if (!withoutPlaceholders) return true;
  // pure punctuation / numbers
  if (!/[A-Za-z]{3,}/.test(t)) return true;
  return false;
}

function loadMessageBundle(locale) {
  const bundles = [];
  for (const sat of SATELLITES) {
    const file = path.join(messagesDir, `${sat}${locale}.json`);
    if (!fs.existsSync(file)) continue;
    const json = JSON.parse(fs.readFileSync(file, "utf8"));
    const prefix = sat
      ? sat.replace(/-$/, "").replace(/-/g, ".")
      : "";
    // main en.json has no prefix; satellites are merged at runtime under marketing/authExperience/dashboardWorkspace
    if (!sat) bundles.push({ file, prefix: "", json, flatPrefix: "" });
    else if (sat.startsWith("auth-experience"))
      bundles.push({ file, prefix: "authExperience", json, flatPrefix: "authExperience" });
    else if (sat.startsWith("marketing"))
      bundles.push({ file, prefix: "marketing", json, flatPrefix: "marketing" });
    else if (sat.startsWith("dashboard-workspace"))
      bundles.push({ file, prefix: "dashboardWorkspace", json, flatPrefix: "dashboardWorkspace" });
  }
  return bundles;
}

function flattenBundles(bundles) {
  const flat = {};
  for (const b of bundles) {
    const f = flatten(b.json);
    for (const [k, v] of Object.entries(f)) {
      const full = b.flatPrefix ? `${b.flatPrefix}.${k}` : k;
      flat[full] = v;
    }
  }
  return flat;
}

function walkTsFiles(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".next") continue;
      walkTsFiles(p, out);
    } else if (/\.(tsx|ts)$/.test(ent.name)) out.push(p);
  }
  return out;
}

function scanHardcoded(files) {
  const hits = [];
  const patterns = [
    />([A-Z][A-Za-z0-9 ,.'’\-/%]{2,60})</g,
    /placeholder=["']([A-Za-z][^"']{2,80})["']/g,
    /aria-label=["']([A-Za-z][^"']{2,80})["']/g,
    /title=["']([A-Za-z][^"']{2,80})["']/g,
    /description=["']([A-Za-z][^"']{2,80})["']/g,
  ];
  for (const file of files) {
    const rel = path.relative(root, file).replace(/\\/g, "/");
    if (rel.includes("/i18n/")) continue;
    const src = fs.readFileSync(file, "utf8");
    if (!src.includes('"use client"') && !rel.includes("/components/") && !rel.includes("/app/"))
      continue;
    for (const re of patterns) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(src))) {
        const text = m[1].trim();
        if (isAllowedEnglish(text)) continue;
        if (/^(https?:|\/|[a-z]+@[a-z])/i.test(text)) continue;
        if (/^(sm:|md:|lg:|xl:|2xl:)/.test(text)) continue;
        hits.push({ file: rel, text });
      }
    }
  }
  // unique by file+text
  const seen = new Set();
  return hits.filter((h) => {
    const k = `${h.file}::${h.text}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

async function loadPhrasebooks() {
  const books = [];
  try {
    const mod = await import(
      pathToFileURL(path.join(__dirname, "locale-overlays/maps/value-translations.mjs")).href
    );
    books.push(mod.valueTranslations || {});
  } catch {
    /* optional */
  }
  const phrasePath = path.join(__dirname, "locale-overlays/maps/certification-phrasebook.json");
  if (fs.existsSync(phrasePath)) {
    books.push(JSON.parse(fs.readFileSync(phrasePath, "utf8")));
  }
  return books;
}

function lookupTranslation(books, english, locale) {
  for (const book of books) {
    const entry = book[english];
    if (!entry) continue;
    if (typeof entry === "string" && locale === "en") return entry;
    if (entry[locale]) return entry[locale];
  }
  return null;
}

function applyTranslationsToTree(node, books, locale, stats) {
  if (typeof node === "string") {
    const t = lookupTranslation(books, node, locale);
    if (t && t !== node) {
      stats.applied += 1;
      return t;
    }
    return node;
  }
  if (node === null || typeof node !== "object" || Array.isArray(node)) return node;
  const out = Array.isArray(node) ? [...node] : { ...node };
  for (const k of Object.keys(out)) {
    out[k] = applyTranslationsToTree(out[k], books, locale, stats);
  }
  return out;
}

function setByPath(obj, dotted, value) {
  const parts = dotted.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    cur[parts[i]] ??= {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

function getByPath(obj, dotted) {
  const parts = dotted.split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = cur[p];
  }
  return cur;
}

async function main() {
  const books = await loadPhrasebooks();
  const enBundles = loadMessageBundle("en");
  const enFlat = flattenBundles(enBundles);
  const enMain = JSON.parse(fs.readFileSync(path.join(messagesDir, "en.json"), "utf8"));

  const report = {
    missingKeys: {},
    unusedKeys: {},
    englishLeakage: {},
    duplicateKeys: findDuplicates(enFlat).slice(0, 40),
    brokenNamespaces: [],
    hardcoded: [],
    walk: {},
    stats: {},
  };

  const enNamespaces = new Set(Object.keys(enMain));

  for (const locale of ["az", "ru", "tr"]) {
    const bundles = loadMessageBundle(locale);
    const flat = flattenBundles(bundles);
    const missing = [...Object.keys(enFlat)].filter((k) => !(k in flat));
    const extra = Object.keys(flat).filter((k) => !(k in enFlat));
    const leakage = [];
    for (const [k, v] of Object.entries(enFlat)) {
      if (!(k in flat)) continue;
      if (typeof v !== "string") continue;
      if (flat[k] !== v) continue;
      if (isAllowedEnglish(v)) continue;
      leakage.push({ key: k, value: v });
    }
    report.missingKeys[locale] = missing;
    report.unusedKeys[locale] = extra;
    report.englishLeakage[locale] = leakage;

    const localeMain = JSON.parse(fs.readFileSync(path.join(messagesDir, `${locale}.json`), "utf8"));
    for (const ns of enNamespaces) {
      if (!(ns in localeMain)) report.brokenNamespaces.push({ locale, namespace: ns });
    }
  }

  const tsFiles = walkTsFiles(srcDir);
  report.hardcoded = scanHardcoded(tsFiles).slice(0, 200);

  if (DO_FIX) {
    const fixStats = { synced: 0, applied: 0, hardcodedMoved: 0 };
    for (const locale of ["az", "ru", "tr"]) {
      const file = path.join(messagesDir, `${locale}.json`);
      let json = JSON.parse(fs.readFileSync(file, "utf8"));
      const before = JSON.stringify(json);
      json = deepMergeMissing(json, enMain);
      // apply phrasebooks to any string still equal to English
      const enF = flatten(enMain);
      const locF = flatten(json);
      for (const [k, enVal] of Object.entries(enF)) {
        if (typeof enVal !== "string") continue;
        if (!(k in locF) || locF[k] === enVal) {
          const translated = lookupTranslation(books, enVal, locale);
          if (translated) {
            setByPath(json, k, translated);
            fixStats.applied += 1;
          } else if (!(k in locF)) {
            setByPath(json, k, enVal);
            fixStats.synced += 1;
          } else if (!(k in flatten(JSON.parse(before)))) {
            fixStats.synced += 1;
          }
        }
      }
      // ensure missing structural keys exist
      json = deepMergeMissing(json, enMain);
      // second pass translate
      const locF2 = flatten(json);
      for (const [k, enVal] of Object.entries(enF)) {
        if (typeof enVal !== "string") continue;
        if (locF2[k] === enVal) {
          const translated = lookupTranslation(books, enVal, locale);
          if (translated) setByPath(json, k, translated);
        }
      }
      fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`, "utf8");
    }

    // Move known hardcoded strings into uaie.intelligence.ui filters
    const intelPath = path.join(messagesDir, "en.json");
    const enJson = JSON.parse(fs.readFileSync(intelPath, "utf8"));
    if (enJson.uaie?.intelligence?.ui) {
      enJson.uaie.intelligence.ui.filters ??= {};
      const filters = enJson.uaie.intelligence.ui.filters;
      let changed = false;
      if (!filters.allErp) {
        filters.allErp = "All ERP";
        changed = true;
      }
      if (!filters.allStatus) {
        filters.allStatus = "All status";
        changed = true;
      }
      if (!filters.source) {
        filters.source = "Source";
        changed = true;
      }
      if (!filters.target) {
        filters.target = "Target";
        changed = true;
      }
      if (!filters.importDictionaryJson) {
        filters.importDictionaryJson = "Import dictionary JSON";
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(intelPath, `${JSON.stringify(enJson, null, 2)}\n`, "utf8");
        fixStats.hardcodedMoved += 5;
        for (const locale of ["az", "ru", "tr"]) {
          const file = path.join(messagesDir, `${locale}.json`);
          const json = JSON.parse(fs.readFileSync(file, "utf8"));
          json.uaie ??= {};
          json.uaie.intelligence ??= {};
          json.uaie.intelligence.ui ??= {};
          json.uaie.intelligence.ui.filters ??= {};
          const f = json.uaie.intelligence.ui.filters;
          const map = {
            allErp: {
              az: "Bütün ERP",
              ru: "Все ERP",
              tr: "Tüm ERP",
            },
            allStatus: {
              az: "Bütün statuslar",
              ru: "Все статусы",
              tr: "Tüm durumlar",
            },
            source: { az: "Mənbə", ru: "Источник", tr: "Kaynak" },
            target: { az: "Hədəf", ru: "Цель", tr: "Hedef" },
            importDictionaryJson: {
              az: "Lüğət JSON idxalı",
              ru: "Импорт словаря JSON",
              tr: "Sözlük JSON içe aktar",
            },
          };
          for (const [key, tr] of Object.entries(map)) {
            f[key] = tr[locale];
          }
          fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`, "utf8");
        }
      }
    }

    // trial balance all types
    {
      const enJson2 = JSON.parse(fs.readFileSync(path.join(messagesDir, "en.json"), "utf8"));
      enJson2.trialBalance ??= {};
      enJson2.trialBalance.ui ??= {};
      enJson2.trialBalance.ui.filters ??= {};
      if (!enJson2.trialBalance.ui.filters.allTypes) {
        enJson2.trialBalance.ui.filters.allTypes = "All types";
        fs.writeFileSync(
          path.join(messagesDir, "en.json"),
          `${JSON.stringify(enJson2, null, 2)}\n`,
          "utf8",
        );
        for (const locale of ["az", "ru", "tr"]) {
          const file = path.join(messagesDir, `${locale}.json`);
          const json = JSON.parse(fs.readFileSync(file, "utf8"));
          json.trialBalance ??= {};
          json.trialBalance.ui ??= {};
          json.trialBalance.ui.filters ??= {};
          json.trialBalance.ui.filters.allTypes =
            locale === "az" ? "Bütün növlər" : locale === "ru" ? "Все типы" : "Tüm türler";
          fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`, "utf8");
        }
        fixStats.hardcodedMoved += 1;
      }
    }

    report.fixStats = fixStats;

    // Sync satellite message files (auth / marketing / dashboard-workspace)
    for (const sat of ["auth-experience-", "marketing-", "dashboard-workspace-"]) {
      const enSatPath = path.join(messagesDir, `${sat}en.json`);
      if (!fs.existsSync(enSatPath)) continue;
      const enSat = JSON.parse(fs.readFileSync(enSatPath, "utf8"));
      for (const locale of ["az", "ru", "tr"]) {
        const satPath = path.join(messagesDir, `${sat}${locale}.json`);
        if (!fs.existsSync(satPath)) continue;
        let json = JSON.parse(fs.readFileSync(satPath, "utf8"));
        json = deepMergeMissing(json, enSat);
        const enF = flatten(enSat);
        const locF = flatten(json);
        for (const [k, enVal] of Object.entries(enF)) {
          if (typeof enVal !== "string") continue;
          if (locF[k] === enVal || !(k in locF)) {
            const translated = lookupTranslation(books, enVal, locale);
            if (translated) setByPath(json, k, translated);
            else if (!(k in locF)) setByPath(json, k, enVal);
          }
        }
        // second pass after deep merge
        const locF2 = flatten(json);
        for (const [k, enVal] of Object.entries(enF)) {
          if (typeof enVal !== "string") continue;
          if (locF2[k] === enVal) {
            const translated = lookupTranslation(books, enVal, locale);
            if (translated) setByPath(json, k, translated);
          }
        }
        fs.writeFileSync(satPath, `${JSON.stringify(json, null, 2)}\n`, "utf8");
      }
    }

    // intelligence adminRequired label
    {
      const enPath = path.join(messagesDir, "en.json");
      const enJson = JSON.parse(fs.readFileSync(enPath, "utf8"));
      if (enJson.uaie?.intelligence?.ui && !enJson.uaie.intelligence.ui.adminRequired) {
        enJson.uaie.intelligence.ui.adminRequired = "Administrator permission required.";
        fs.writeFileSync(enPath, `${JSON.stringify(enJson, null, 2)}\n`, "utf8");
        const adminTr = {
          az: "Administrator icazəsi tələb olunur.",
          ru: "Требуются права администратора.",
          tr: "Yönetici izni gerekli.",
        };
        for (const locale of ["az", "ru", "tr"]) {
          const file = path.join(messagesDir, `${locale}.json`);
          const json = JSON.parse(fs.readFileSync(file, "utf8"));
          json.uaie ??= {};
          json.uaie.intelligence ??= {};
          json.uaie.intelligence.ui ??= {};
          json.uaie.intelligence.ui.adminRequired = adminTr[locale];
          fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`, "utf8");
        }
        fixStats.hardcodedMoved += 1;
      }
    }
  }

  // recompute after fix
  if (DO_FIX) {
    for (const locale of ["az", "ru", "tr"]) {
      const flat = flattenBundles(loadMessageBundle(locale));
      const enFlat2 = flattenBundles(loadMessageBundle("en"));
      report.missingKeys[locale] = [...Object.keys(enFlat2)].filter((k) => !(k in flat));
      report.englishLeakage[locale] = Object.entries(enFlat2)
        .filter(
          ([k, v]) =>
            typeof v === "string" &&
            flat[k] === v &&
            !isAllowedEnglish(v),
        )
        .map(([key, value]) => ({ key, value }));
    }
  }

  if (DO_WALK) {
    const base = process.env.CERT_BASE_URL || "http://localhost:3000";
    const routes = [
      "/app/dashboard",
      "/app/companies",
      "/app/engagements",
      "/app/import-intelligence",
    ];
    for (const locale of ["az", "ru", "tr"]) {
      report.walk[locale] = [];
      for (const route of routes) {
        const url = `${base}/${locale}${route}`;
        try {
          const res = await fetch(url, { redirect: "manual" });
          const html = await res.text();
          // crude: visible English phrases from leakage sample
          const samples = (report.englishLeakage[locale] || [])
            .slice(0, 30)
            .map((x) => x.value)
            .filter((v) => v.length > 12);
          const found = samples.filter((s) => html.includes(s));
          report.walk[locale].push({
            route,
            status: res.status,
            leakageHits: found.length,
            samples: found.slice(0, 5),
          });
        } catch (e) {
          report.walk[locale].push({ route, error: String(e.message || e) });
        }
      }
    }
  }

  const leakCounts = Object.fromEntries(
    ["az", "ru", "tr"].map((l) => [l, report.englishLeakage[l]?.length ?? 0]),
  );
  const missingCounts = Object.fromEntries(
    ["az", "ru", "tr"].map((l) => [l, report.missingKeys[l]?.length ?? 0]),
  );
  const totalEn = Object.keys(enFlat).length;
  const avgLeak =
    (leakCounts.az + leakCounts.ru + leakCounts.tr) / 3;
  const localizationCompletion = Math.max(
    0,
    Math.round((1 - avgLeak / Math.max(totalEn, 1)) * 1000) / 10,
  );
  // platform completion: structural keys present + localization weighted
  const avgMissing =
    (missingCounts.az + missingCounts.ru + missingCounts.tr) / 3;
  const structural = Math.round((1 - avgMissing / Math.max(totalEn, 1)) * 1000) / 10;
  const overallPlatform = Math.round((structural * 0.45 + localizationCompletion * 0.55) * 10) / 10;

  report.stats = {
    totalEnglishKeys: totalEn,
    missingCounts,
    leakCounts,
    hardcodedCount: report.hardcoded.length,
    brokenNamespaceCount: report.brokenNamespaces.length,
    localizationCompletionPct: localizationCompletion,
    overallPlatformCompletionPct: overallPlatform,
    zeroLeakage: leakCounts.az === 0 && leakCounts.ru === 0 && leakCounts.tr === 0,
  };

  if (AS_JSON) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log("=== Localization Certification ===");
  console.log(`English keys: ${totalEn}`);
  for (const locale of ["az", "ru", "tr"]) {
    console.log(
      `\n[${locale}] missing=${missingCounts[locale]} leakage=${leakCounts[locale]} unused=${report.unusedKeys[locale]?.length ?? 0}`,
    );
    if (missingCounts[locale] > 0) {
      console.log("  missing sample:", report.missingKeys[locale].slice(0, 8).join(", "));
    }
    if (leakCounts[locale] > 0) {
      console.log(
        "  leakage sample:",
        report.englishLeakage[locale]
          .slice(0, 8)
          .map((x) => x.value)
          .join(" | "),
      );
    }
  }
  console.log(`\nHardcoded UI hits (sample): ${report.hardcoded.length}`);
  for (const h of report.hardcoded.slice(0, 12)) {
    console.log(`  ${h.file}: "${h.text}"`);
  }
  console.log(`Broken namespaces: ${report.brokenNamespaces.length}`);
  if (report.fixStats) console.log("Fix stats:", report.fixStats);
  if (DO_WALK) console.log("Walk:", JSON.stringify(report.walk, null, 2));
  console.log(`\nLocalization completion: ${localizationCompletion}%`);
  console.log(`Overall platform completion: ${overallPlatform}%`);
  console.log(`ZERO English leakage: ${report.stats.zeroLeakage ? "YES" : "NO"}`);

  const outPath = path.join(__dirname, "localization-certification-report.json");
  fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`\nWrote ${path.relative(root, outPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
