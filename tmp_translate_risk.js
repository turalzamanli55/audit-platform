const fs = require("fs");
const path = require("path");

const root = "C:/Users/Tural/audit";
const enPath = path.join(root, "src/i18n/messages/en.json");
const en = JSON.parse(fs.readFileSync(enPath, "utf8")).riskAssessment;

const leaves = [];
const walk = (o) => {
  if (o && typeof o === "object" && !Array.isArray(o)) {
    for (const v of Object.values(o)) walk(v);
  } else {
    leaves.push(String(o));
  }
};
walk(en);
const unique = [...new Set(leaves)];

const cache = new Map();
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function translateText(text, lang) {
  const key = `${lang}|${text}`;
  if (cache.has(key)) return cache.get(key);
  const q = encodeURIComponent(text);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${q}`;
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`http ${res.status}`);
      const data = await res.json();
      const out = (data[0] || []).map((x) => x[0]).join("");
      cache.set(key, out);
      await delay(35);
      return out;
    } catch (e) {
      if (i === 2) throw e;
      await delay(300 * (i + 1));
    }
  }
}

async function buildLang(lang) {
  const dict = new Map();
  for (const s of unique) {
    const t = await translateText(s, lang);
    dict.set(s, t);
  }

  const mapNode = (node) => {
    if (node && typeof node === "object" && !Array.isArray(node)) {
      const out = {};
      for (const [k, v] of Object.entries(node)) out[k] = mapNode(v);
      return out;
    }
    return dict.get(String(node));
  };

  return mapNode(en);
}

function fixTokens(node) {
  if (node && typeof node === "object" && !Array.isArray(node)) {
    for (const k of Object.keys(node)) node[k] = fixTokens(node[k]);
    return node;
  }

  let s = String(node);
  s = s
    .replace(/\{\s*count\s*\}/g, "{count}")
    .replace(/\{\s*name\s*\}/g, "{name}")
    .replace(/\{\s*version\s*\}/g, "{version}")
    .replace(/ENG\s*[- ]\s*03/g, "ENG-03");
  return s;
}

const identifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const q = (s) => JSON.stringify(s);

const toJs = (v, l = 0) => {
  const ind = "  ".repeat(l);
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const e = Object.entries(v);
    const lines = ["{"];
    e.forEach(([k, val], i) => {
      lines.push(
        "  ".repeat(l + 1) +
          (identifier.test(k) ? k : q(k)) +
          ": " +
          toJs(val, l + 1) +
          (i < e.length - 1 ? "," : "")
      );
    });
    lines.push(ind + "}");
    return lines.join("\n");
  }
  return q(v);
};

(async () => {
  const az = fixTokens(await buildLang("az"));
  const ru = fixTokens(await buildLang("ru"));
  const tr = fixTokens(await buildLang("tr"));

  const content =
    "/** @type {Record<'az'|'ru'|'tr', object>} */\n" +
    "export const riskAssessment = {\n" +
    `  az: ${toJs(az, 1)},\n` +
    `  ru: ${toJs(ru, 1)},\n` +
    `  tr: ${toJs(tr, 1)},\n` +
    "};\n";

  const outPath = path.join(root, "scripts/locale-overlays/maps/riskAssessment.mjs");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, content, "utf8");
  console.log(`Wrote ${outPath}`);
})();
