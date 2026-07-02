import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..", "..");
const en = JSON.parse(
  fs.readFileSync(path.join(root, "src/i18n/messages/en.json"), "utf8")
).riskAssessment;

const py = fs.readFileSync(path.join(__dirname, "_gen_risk.py"), "utf8");

function extract(pattern, label) {
  const m = py.match(pattern);
  if (!m) throw new Error(`Failed to extract ${label}`);
  return m[1];
}

function evalObject(literal) {
  // Trusted local file authored in this workspace.
  // eslint-disable-next-line no-new-func
  return Function(`return (${literal});`)();
}

const azLiteral = extract(
  /"az":\s*(\{[\s\S]*?\})\s*,\s*\n\s*"ru":\s*\{\}\s*,/m,
  "az map"
);
const ruLiteral = extract(
  /exact\["ru"\]\s*=\s*\{\s*k:\s*v\s*for\s*k,\s*v\s*in\s*(\{[\s\S]*?\})\.items\(\)\s*\}/m,
  "ru map"
);
const trLiteral = extract(
  /exact\["tr"\]\s*=\s*\{\s*k:\s*v\s*for\s*k,\s*v\s*in\s*(\{[\s\S]*?\})\.items\(\)\s*\}/m,
  "tr map"
);

const exact = {
  az: evalObject(azLiteral),
  ru: evalObject(ruLiteral),
  tr: evalObject(trLiteral),
};

const riskSections = new Set([
  "inherentRisks",
  "controlRisks",
  "detectionRisks",
  "fraudRisks",
  "itRisks",
  "complianceRisks",
  "financialStatementRisks",
  "assertionRisks",
  "significantRisks",
]);

function translateRiskSection(lang, section, field) {
  if (lang === "az") {
    const base = {
      inherentRisks: "Təbii risklər",
      controlRisks: "Nəzarət riskləri",
      detectionRisks: "Aşkarlama riskləri",
      fraudRisks: "Fırıldaqçılıq riskləri",
      itRisks: "İT riskləri",
      complianceRisks: "Uyğunluq riskləri",
      financialStatementRisks: "Maliyyə hesabatı riskləri",
      assertionRisks: "İddia riskləri",
      significantRisks: "Əhəmiyyətli risklər",
    }[section];
    return {
      title: base,
      description: `${base} bəndlərini sənədləşdirin.`,
      emptyTitle: `${base} yoxdur`,
      emptyDescription: "Bu bölməni başlatmaq üçün risk bəndləri əlavə edin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk təsviri",
      addAction: "Risk bəndi əlavə et",
      categoryLabel: "Kateqoriya seçin",
      riskTypeLabel: "Risk növü",
      likelihoodLabel: "Ehtimallılıq",
      impactLabel: "Təsir",
      inherentRatingLabel: "Təbii reytinq",
      auditAreaLabel: "Audit sahəsi",
      auditAreaPlaceholder: "Audit sahəsini seçin",
      significantBadge: "Əhəmiyyətli",
      procedureLinkedBadge: "Prosedur bağlıdır",
      procedureUnlinkedBadge: "Prosedur tələb olunur",
    }[field];
  }
  if (lang === "ru") {
    const base = {
      inherentRisks: "Неотъемлемые риски",
      controlRisks: "Риски контроля",
      detectionRisks: "Риски необнаружения",
      fraudRisks: "Риски мошенничества",
      itRisks: "ИТ-риски",
      complianceRisks: "Комплаенс-риски",
      financialStatementRisks: "Риски финансовой отчетности",
      assertionRisks: "Риски предпосылок",
      significantRisks: "Значимые риски",
    }[section];
    return {
      title: base,
      description: "Документируйте пункты рисков в этом разделе.",
      emptyTitle: `${base} отсутствуют`,
      emptyDescription: "Добавьте пункты рисков, чтобы начать этот раздел.",
      titlePlaceholder: "Заголовок риска",
      descriptionPlaceholder: "Описание риска",
      addAction: "Добавить пункт риска",
      categoryLabel: "Выберите категорию",
      riskTypeLabel: "Тип риска",
      likelihoodLabel: "Вероятность",
      impactLabel: "Влияние",
      inherentRatingLabel: "Неотъемлемый рейтинг",
      auditAreaLabel: "Область аудита",
      auditAreaPlaceholder: "Выберите область аудита",
      significantBadge: "Значимый",
      procedureLinkedBadge: "Процедура связана",
      procedureUnlinkedBadge: "Требуется процедура",
    }[field];
  }
  const base = {
    inherentRisks: "Doğal riskler",
    controlRisks: "Kontrol riskleri",
    detectionRisks: "Tespit riskleri",
    fraudRisks: "Hile riskleri",
    itRisks: "IT riskleri",
    complianceRisks: "Uyum riskleri",
    financialStatementRisks: "Finansal tablo riskleri",
    assertionRisks: "İddia riskleri",
    significantRisks: "Önemli riskler",
  }[section];
  return {
    title: base,
    description: "Bu bölümdeki risk öğelerini belgelendirin.",
    emptyTitle: `${base} yok`,
    emptyDescription: "Bu bölümü başlatmak için risk öğeleri ekleyin.",
    titlePlaceholder: "Risk başlığı",
    descriptionPlaceholder: "Risk açıklaması",
    addAction: "Risk öğesi ekle",
    categoryLabel: "Kategori seçin",
    riskTypeLabel: "Risk türü",
    likelihoodLabel: "Olasılık",
    impactLabel: "Etki",
    inherentRatingLabel: "Doğal derecelendirme",
    auditAreaLabel: "Denetim alanı",
    auditAreaPlaceholder: "Denetim alanını seçin",
    significantBadge: "Önemli",
    procedureLinkedBadge: "Prosedür bağlı",
    procedureUnlinkedBadge: "Prosedür gerekli",
  }[field];
}

function localize(lang, node, pathArr = []) {
  if (node && typeof node === "object" && !Array.isArray(node)) {
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      out[k] = localize(lang, v, [...pathArr, k]);
    }
    return out;
  }
  if (typeof node !== "string") return node;

  if (pathArr.length >= 2 && riskSections.has(pathArr[0])) {
    const translated = translateRiskSection(lang, pathArr[0], pathArr[1]);
    if (translated) return translated;
  }

  if (pathArr.join(".") === "history.actions.risk_assessment.archived") {
    return {
      az: "Risk qiymətləndirməsi arxivləndi",
      ru: "Оценка рисков архивирована",
      tr: "Risk değerlendirmesi arşivlendi",
    }[lang];
  }
  if (pathArr.join(".") === "history.actions.risk_assessment.restored") {
    return {
      az: "Risk qiymətləndirməsi bərpa edildi",
      ru: "Оценка рисков восстановлена",
      tr: "Risk değerlendirmesi geri yüklendi",
    }[lang];
  }
  if (node === "Manage risk category definitions.") {
    return {
      az: "Risk kateqoriyası təriflərini idarə edin.",
      ru: "Управляйте определениями категорий рисков.",
      tr: "Risk kategori tanımlarını yönetin.",
    }[lang];
  }

  return exact[lang][node] ?? `__MISSING__:${node}`;
}

const result = {};
for (const lang of ["az", "ru", "tr"]) {
  result[lang] = localize(lang, en);
}

function collectMissing(node, set) {
  if (node && typeof node === "object" && !Array.isArray(node)) {
    for (const v of Object.values(node)) collectMissing(v, set);
  } else if (typeof node === "string" && node.startsWith("__MISSING__:")) {
    set.add(node.replace("__MISSING__:", ""));
  }
}

for (const lang of ["az", "ru", "tr"]) {
  const missing = new Set();
  collectMissing(result[lang], missing);
  if (missing.size) {
    console.error(`${lang} missing ${missing.size}`);
    for (const item of [...missing].sort()) console.error(" ", item);
    process.exit(1);
  }
}

const out =
  "/** @type {Record<'az'|'ru'|'tr', object>} */\n" +
  "export const riskAssessment = " +
  JSON.stringify(result, null, 2) +
  ";\n";

fs.writeFileSync(path.join(__dirname, "riskAssessment.mjs"), out, "utf8");
console.log("wrote riskAssessment.mjs");
