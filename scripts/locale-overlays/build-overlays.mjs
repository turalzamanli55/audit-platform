import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const en = JSON.parse(
  fs.readFileSync(path.join(root, "src/i18n/messages/en.json"), "utf8")
);

const MODULE_KEYS = ["engagements", "planning", "fieldwork", "riskAssessment"];

function setByPath(obj, dotPath, value) {
  const parts = dotPath.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!(p in cur)) cur[p] = {};
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = value;
}

function buildOverlay(flatMap) {
  const overlay = {};
  for (const [dotPath, value] of Object.entries(flatMap)) {
    setByPath(overlay, dotPath, value);
  }
  return overlay;
}

function extractModules(overlay) {
  const out = {};
  for (const k of MODULE_KEYS) out[k] = overlay[k];
  return out;
}

function countLeaves(obj) {
  let n = 0;
  for (const v of Object.values(obj)) {
    if (typeof v === "string") n++;
    else if (v && typeof v === "object") n += countLeaves(v);
  }
  return n;
}

function validateOverlay(lang, flatMap, overlay) {
  const missing = [];
  function walk(obj, prefix) {
    for (const [k, v] of Object.entries(obj)) {
      const p = prefix ? `${prefix}.${k}` : k;
      if (typeof v === "string") {
        if (!(p in flatMap)) missing.push(p);
        else if (/[A-Za-z]{4,}/.test(flatMap[p]) && !/\{[^}]+\}/.test(v)) {
          const translated = flatMap[p];
          if (translated === v) missing.push(`${p} (untranslated)`);
        }
      } else walk(v, p);
    }
  }
  for (const k of MODULE_KEYS) walk(en[k], k);
  if (missing.length) {
    console.error(`[${lang}] missing or untranslated (${missing.length}):`, missing.slice(0, 10));
    process.exit(1);
  }
  const leaves = countLeaves(overlay);
  console.log(`[${lang}] ${leaves} leaf strings validated`);
}

// Import translation maps
const { azMap } = await import("./maps/az-map.mjs");
const { ruMap } = await import("./maps/ru-map.mjs");
const { trMap } = await import("./maps/tr-map.mjs");

const outDir = path.join(__dirname);
const langs = [
  ["az", azMap, "az-modules.json"],
  ["ru", ruMap, "ru-modules.json"],
  ["tr", trMap, "tr-modules.json"],
];

for (const [lang, map, filename] of langs) {
  const overlay = extractModules(buildOverlay(map));
  validateOverlay(lang, map, overlay);
  fs.writeFileSync(
    path.join(outDir, filename),
    JSON.stringify(overlay, null, 2) + "\n",
    "utf8"
  );
  console.log(`Wrote ${filename}`);
}

// cleanup temp
try {
  fs.unlinkSync(path.join(__dirname, "_paths.json"));
} catch {
  /* ignore */
}
