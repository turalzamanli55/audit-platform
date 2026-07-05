import fs from "node:fs";
import path from "node:path";

const messagesDir = path.join(process.cwd(), "src/i18n/messages");

const commandCenterPatches = {
  az: {
    heroTitle: "Müəssisə riski komanda mərkəzi",
    workflowTitle: "Təsdiq iş axını",
    workflowDescription: "Qaralamadan inteqrasiyaya — cari addım vurğulanır.",
    reviewQueueTitle: "Yoxlama növbəsi",
    reviewQueueDescription:
      "Partnyor və ya menecerin imzasını gözləyən risk qiymətləndirmələri.",
    matrixDescription: "Hesab və iddia risk reytinqlərinin icmalı.",
    reviewNotesTitle: "Yoxlama qeydləri",
    reviewNotesDescription: "Partnyor və menecer yoxlama şərhləri.",
    commentsDescription: "Risk qiymətləndirməsi üzrə daxili əməkdaşlıq qeydləri.",
    recentChangesDescription: "Təqdimatlar, təsdiqlər və reyestr yeniləmələri.",
    activityDescription: "Ən son risk qiymətləndirməsi iş sahəsi hadisələri.",
    stepUnderReview: "Yoxlamada",
    openWorkflow: "Yoxlama iş axını",
    viewReviewNotes: "Yoxlama qeydlərinə bax",
    kpiApproval: "Təsdiq statusu",
    kpiPendingReview: "Yoxlama gözləyir",
    hintWorkflow: "Təsdiq vəziyyəti",
    changeApproved: "Risk qiymətləndirməsi təsdiqləndi",
    changeSubmitted: "Yoxlamaya təqdim edildi",
    changeSubmittedDescription: "Qiymətləndirmə müsadirə yoxlayıcısına təqdim edildi.",
    emptyReviewNotes: "Yoxlama qeydi yoxdur",
    emptyReviewNotesDescription: "Yoxlama qeydləri təsdiq iş axını zamanı görünür.",
    emptyActivityDescription: "Risk qiymətləndirməsi hadisələri burada qeydə alınacaq.",
  },
  ru: {
    heroTitle: "Командный центр корпоративных рисков",
    workflowTitle: "Процесс утверждения",
    workflowDescription: "От черновика до интеграции — выделен текущий этап.",
    reviewQueueTitle: "Очередь проверки",
    reviewQueueDescription:
      "Оценки рисков, ожидающие подписи партнёра или менеджера.",
    matrixDescription: "Сводка рейтингов рисков по счетам и утверждениям.",
    reviewNotesTitle: "Примечания к проверке",
    reviewNotesDescription: "Комментарии партнёра и менеджера по проверке.",
    commentsDescription: "Внутренние заметки по оценке рисков.",
    recentChangesDescription: "Отправки, утверждения и обновления реестра.",
    activityDescription: "Последние события рабочей области оценки рисков.",
    stepUnderReview: "На проверке",
    openWorkflow: "Процесс проверки",
    viewReviewNotes: "Просмотреть примечания к проверке",
    kpiApproval: "Статус утверждения",
    kpiPendingReview: "Ожидает проверки",
    hintWorkflow: "Статус утверждения",
    changeApproved: "Оценка рисков утверждена",
    changeSubmitted: "Отправлено на проверку",
    changeSubmittedDescription: "Оценка отправлена проверяющему по проекту.",
    emptyReviewNotes: "Нет примечаний к проверке",
    emptyReviewNotesDescription: "Примечания появляются в процессе утверждения.",
    emptyActivityDescription: "События оценки рисков будут записаны здесь.",
  },
  tr: {
    heroTitle: "Kurumsal risk komuta merkezi",
    workflowTitle: "Onay iş akışı",
    workflowDescription: "Taslaktan entegrasyona — mevcut adım vurgulanır.",
    reviewQueueTitle: "İnceleme kuyruğu",
    reviewQueueDescription:
      "İş ortağı veya yönetici onayı bekleyen risk değerlendirmeleri.",
    matrixDescription: "Hesap ve iddia risk derecelendirmelerinin özeti.",
    reviewNotesTitle: "İnceleme notları",
    reviewNotesDescription: "Ortak ve yönetici inceleme yorumları.",
    commentsDescription: "Risk değerlendirmesi üzerine dahili iş birliği notları.",
    recentChangesDescription: "Gönderimler, onaylar ve kayıt güncellemeleri.",
    activityDescription: "En son risk değerlendirmesi çalışma alanı olayları.",
    stepUnderReview: "İncelemede",
    openWorkflow: "İnceleme iş akışı",
    viewReviewNotes: "İnceleme notlarını görüntüle",
    kpiApproval: "Onay durumu",
    kpiPendingReview: "İnceleme bekliyor",
    hintWorkflow: "Onay durumu",
    changeApproved: "Risk değerlendirmesi onaylandı",
    changeSubmitted: "İncelemeye gönderildi",
    changeSubmittedDescription: "Değerlendirme görev inceleyicisine gönderildi.",
    emptyReviewNotes: "İnceleme notu yok",
    emptyReviewNotesDescription: "İnceleme notları onay iş akışı sırasında görünür.",
    emptyActivityDescription: "Risk değerlendirmesi olayları burada kaydedilecek.",
  },
};

const localePatches = {
  az: {
    history: {
      actionColumn: "Əməliyyat",
      dateColumn: "Tarix",
      summaryColumn: "Xülasə",
    },
    heatmap: { summaryLabel: "Xülasə" },
    settings: {
      readOnlyNotice: "Risk qiymətləndirməsi parametrlərinə yalnız baxış hüququnuz var.",
    },
  },
  ru: {
    history: {
      actionColumn: "Действие",
      dateColumn: "Дата",
      summaryColumn: "Сводка",
    },
    heatmap: { summaryLabel: "Сводка" },
    settings: {
      readOnlyNotice: "У вас доступ только для просмотра настроек оценки рисков.",
    },
  },
  tr: {
    history: {
      actionColumn: "İşlem",
      dateColumn: "Tarih",
      summaryColumn: "Özet",
    },
    heatmap: { summaryLabel: "Özet" },
    settings: {
      readOnlyNotice: "Risk değerlendirmesi ayarlarına yalnızca görüntüleme erişiminiz var.",
    },
  },
};

const tokenMap = {
  az: {
    TƏSDİQ: "Təsdiq",
    TƏQDİL: "Təsdiq",
    TƏSQİQ: "Təsdiq",
    yoxlama: "Yoxlama",
    ŞƏRHLƏR: "Yoxlama",
  },
  ru: {
    УТВЕРЖДЕНИЕ: "Утверждение",
    ОБЗОР: "Проверка",
    ПРОСМОТР: "Проверка",
    ОДОБРАЖЕНИЯ: "Утверждения",
    ПОЛЕВЫХ: "Полевых",
    РАБОТАХ: "работах",
  },
  tr: {
    ONAY: "Onay",
    İNCELEME: "İnceleme",
    GÖZDEN: "İnceleme",
    GEÇİRMEK: "İnceleme",
  },
};

function deepAssign(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      if (!target[key] || typeof target[key] !== "object") target[key] = {};
      deepAssign(target[key], value);
    } else {
      target[key] = value;
    }
  }
}

function stripTokens(str, locale) {
  if (typeof str !== "string" || !str.includes("[[")) return str;
  return str.replace(/\[\[([^\]]+)\]\]/g, (_, token) => tokenMap[locale]?.[token] ?? token);
}

function walkStrings(obj, locale, fn) {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "string") {
      obj[key] = fn(obj[key], locale);
    } else if (obj[key] && typeof obj[key] === "object") {
      walkStrings(obj[key], locale, fn);
    }
  }
}

for (const locale of ["az", "ru", "tr"]) {
  const filePath = path.join(messagesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const ra = data.riskAssessment;
  if (!ra) {
    console.warn(`No riskAssessment in ${locale}`);
    continue;
  }

  deepAssign(ra, localePatches[locale]);
  if (ra.workspace?.commandCenter) {
    Object.assign(ra.workspace.commandCenter, commandCenterPatches[locale]);
  }

  walkStrings(ra.workspace?.commandCenter ?? {}, locale, stripTokens);

  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Patched riskAssessment in ${locale}.json`);
}

const enPath = path.join(messagesDir, "en.json");
const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
en.riskAssessment.history.actionColumn = "Action";
en.riskAssessment.history.dateColumn = "Date";
en.riskAssessment.history.summaryColumn = "Summary";
en.riskAssessment.heatmap.summaryLabel = "Summary";
fs.writeFileSync(enPath, `${JSON.stringify(en, null, 2)}\n`, "utf8");
console.log("Added history/heatmap column labels to en.json");
