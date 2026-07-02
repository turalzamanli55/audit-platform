import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { engagements } from "./engagements.mjs";
import { planning } from "./planning.mjs";
import { fieldwork } from "./fieldwork.mjs";
import { riskAssessment } from "./riskAssessment.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const en = JSON.parse(
  fs.readFileSync(path.join(root, "src/i18n/messages/en.json"), "utf8")
);

const MODULE_KEYS = ["engagements", "planning", "fieldwork", "riskAssessment"];
const modules = { engagements, planning, fieldwork, riskAssessment };

function deepEqual(a, b) {
  if (typeof a !== typeof b) return false;
  if (typeof a === "string") return true;
  if (Array.isArray(a) || Array.isArray(b)) return false;
  const ak = Object.keys(a).sort();
  const bk = Object.keys(b).sort();
  if (ak.length !== bk.length || ak.some((k, i) => k !== bk[i])) return false;
  return ak.every((k) => deepEqual(a[k], b[k]));
}

function countLeaves(obj) {
  let n = 0;
  for (const v of Object.values(obj)) {
    if (typeof v === "string") n++;
    else if (v && typeof v === "object") n += countLeaves(v);
  }
  return n;
}

function hasEnglishLeak(text, enText) {
  if (text === enText) return true;
  if (/\{[^}]+\}/.test(enText)) return false;
  const words = enText.match(/\b[A-Za-z]{4,}\b/g);
  if (!words) return false;
  const allow = new Set([
    "IFRS", "GAAP", "ENG", "IT", "MFMS", "UMU", "UFRS", "TFRS", "МСФО",
  ]);
  return words.some((w) => !allow.has(w) && text.includes(w));
}

function validate(lang, key, translated, english) {
  if (!deepEqual(translated, english)) {
    console.error(`[${lang}] Structure mismatch in ${key}`);
    process.exit(1);
  }
  const issues = [];
  function walk(t, e, prefix) {
    for (const [k, ev] of Object.entries(e)) {
      const p = prefix ? `${prefix}.${k}` : k;
      const tv = t[k];
      if (typeof ev === "string") {
        if (typeof tv !== "string") issues.push(`${p}: not a string`);
        else if (hasEnglishLeak(tv, ev)) issues.push(`${p}: possible English leak -> ${tv}`);
      } else walk(tv, ev, p);
    }
  }
  walk(translated, english, key);
  if (issues.length) {
    console.error(`[${lang}] ${issues.length} issues in ${key}:`);
    issues.slice(0, 15).forEach((i) => console.error("  ", i));
    process.exit(1);
  }
}

const langs = ["az", "ru", "tr"];
for (const lang of langs) {
  const out = {};
  for (const key of MODULE_KEYS) {
    out[key] = modules[key][lang];
    validate(lang, key, out[key], en[key]);
  }
  const filename = `${lang}-modules.json`;
  fs.writeFileSync(
    path.join(__dirname, "..", filename),
    JSON.stringify(out, null, 2) + "\n",
    "utf8"
  );
  console.log(`Wrote ${filename} (${countLeaves(out)} strings)`);
}

// cleanup
for (const f of ["_paths.json", "_engagements-en.json"]) {
  try {
    fs.unlinkSync(path.join(__dirname, f));
  } catch {
    /* ignore */
  }
}
