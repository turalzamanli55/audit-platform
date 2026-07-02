import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { engagements } from "./engagements.mjs";
import { planning } from "./planning.mjs";
import { fieldwork } from "./fieldwork.mjs";
import { riskAssessment } from "./riskAssessment.mjs";
import { valueTranslations } from "./value-translations.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");
const en = JSON.parse(
  fs.readFileSync(path.join(root, "src/i18n/messages/en.json"), "utf8")
);

const MODULE_KEYS = ["engagements", "planning", "fieldwork", "riskAssessment"];
const modules = { engagements, planning, fieldwork, riskAssessment };

const pathOverrides = {
  az: {
    "engagements.columnStatus": "Vəziyyət",
    "planning.workspace.navRisk": "Risklər",
    "planning.workspace.status.planningStatus": "Vəziyyət",
  },
  ru: {},
  tr: {
    "planning.workspace.navRisk": "Riskler",
  },
};

function deepClone(obj) {
  if (typeof obj === "string") return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  const out = {};
  for (const [k, v] of Object.entries(obj)) out[k] = deepClone(v);
  return out;
}

function applyTranslations(node, enNode, lang, prefix) {
  for (const [k, enVal] of Object.entries(enNode)) {
    const dotPath = prefix ? `${prefix}.${k}` : k;
    if (typeof enVal === "string") {
      if (pathOverrides[lang]?.[dotPath]) {
        node[k] = pathOverrides[lang][dotPath];
      } else if (node[k] === enVal && valueTranslations[enVal]?.[lang]) {
        node[k] = valueTranslations[enVal][lang];
      }
    } else {
      applyTranslations(node[k], enVal, lang, dotPath);
    }
  }
}

function countLeaves(obj) {
  let n = 0;
  for (const v of Object.values(obj)) {
    if (typeof v === "string") n++;
    else if (v && typeof v === "object") n += countLeaves(v);
  }
  return n;
}

function deepEqual(a, b) {
  if (typeof a !== typeof b) return false;
  if (typeof a === "string") return true;
  const ak = Object.keys(a).sort();
  const bk = Object.keys(b).sort();
  if (ak.length !== bk.length || ak.some((k, i) => k !== bk[i])) return false;
  return ak.every((k) => deepEqual(a[k], b[k]));
}

function collectIdentical(translated, english, prefix = "") {
  const out = [];
  for (const [k, enVal] of Object.entries(english)) {
    const dotPath = prefix ? `${prefix}.${k}` : k;
    const trVal = translated[k];
    if (typeof enVal === "string") {
      if (trVal === enVal && !/\{[^}]+\}/.test(enVal)) out.push(dotPath);
    } else {
      out.push(...collectIdentical(trVal, enVal, dotPath));
    }
  }
  return out;
}

for (const lang of ["az", "ru", "tr"]) {
  const out = {};
  for (const key of MODULE_KEYS) {
    out[key] = deepClone(modules[key][lang]);
    applyTranslations(out[key], en[key], lang, key);
    if (!deepEqual(out[key], en[key])) {
      console.error(`Structure mismatch in ${lang}.${key}`);
      process.exit(1);
    }
  }

  const identical = [];
  for (const key of MODULE_KEYS) {
    identical.push(...collectIdentical(out[key], en[key], key));
  }
  if (identical.length) {
    console.error(`[${lang}] ${identical.length} untranslated strings remain:`);
    identical.slice(0, 20).forEach((p) => console.error(" ", p));
    process.exit(1);
  }

  const filename = path.join(__dirname, "..", `${lang}-modules.json`);
  fs.writeFileSync(filename, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`${filename}: ${countLeaves(out)} strings`);
}
