import fs from "fs";
import { riskAssessment } from "./riskAssessment.mjs";

const en = JSON.parse(fs.readFileSync("C:/Users/Tural/audit/src/i18n/messages/en.json", "utf8")).riskAssessment;

function deepEqualShape(a, b) {
  if (typeof a !== typeof b) return false;
  if (typeof a === "string") return true;
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length || ak.some((k) => !bk.includes(k))) return false;
  return ak.every((k) => deepEqualShape(a[k], b[k]));
}

const issues = [];

function checkLeaks(translated, english, prefix = "") {
  for (const [k, ev] of Object.entries(english)) {
    const p = prefix ? `${prefix}.${k}` : k;
    const tv = translated[k];
    if (typeof ev === "string") {
      if (typeof tv !== "string") {
        issues.push(`${p}:non-string`);
        continue;
      }
      if (ev === tv) issues.push(`${p}:unchanged-from-en`);
    } else {
      checkLeaks(tv, ev, p);
    }
  }
}

for (const lang of ["az", "ru", "tr"]) {
  if (!deepEqualShape(riskAssessment[lang], en)) {
    console.error(`${lang}: structure mismatch`);
    process.exit(1);
  }
  checkLeaks(riskAssessment[lang], en);
}

if (issues.length) {
  console.error(`issues: ${issues.length}`);
  for (const i of issues.slice(0, 50)) console.error(i);
  process.exit(1);
}

console.log("riskAssessment structure/leak check passed");
