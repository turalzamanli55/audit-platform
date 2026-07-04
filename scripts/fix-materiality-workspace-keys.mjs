import fs from "node:fs";
import path from "node:path";

const messagesDir = path.join(process.cwd(), "src/i18n/messages");

const patches = {
  az: {
    breadcrumbMateriality: "Mahiyyətllik",
    backToEngagement: "Müsadirəyə qayıt",
    planningGateTitle: "Planlaşdırma təsdiqi tələb olunur",
    planningGateDescription:
      "Mahiyyətllik başlamazdan əvvəl audit planlaşdırması təsdiqlənməlidir.",
    navAriaLabel: "Mahiyyətllik iş sahəsi bölmələri",
    navOverall: "Ümumi",
    navPerformance: "Performans",
    navSpecific: "Xüsusi",
    navBenchmarks: "Bənchmarklar",
    navCalculations: "Hesablamalar",
    navVersions: "Versiyalar",
    navComments: "Şərhlər",
    navHistory: "Tarixçə",
    navSettings: "Parametrlər",
    loading: "Mahiyyətllik iş sahəsi yüklənir",
    errorTitle: "Mahiyyətllik iş sahəsi yüklənə bilmədi",
    errorDescription: "Bu mahiyyətllik iş sahəsi yüklənərkən xəta baş verdi.",
    archivedTitle: "Mahiyyətllik arxivlənib",
    archivedDescription:
      "Bu mahiyyətllik paketi yalnız oxumaq üçündür. Yeniləməyə davam etmək üçün bərpa edin.",
    summaryStatus: "Mahiyyətllik statusu",
    summaryVersion: "Paket versiyası",
    summaryProgress: "Ümumi gedişat",
    summaryBenchmarks: "Bənchmarklar",
    summaryPendingReview: "Yoxlama gözləyir",
    benchmarksPreviewTitle: "Bənchmark önizləməsi",
    benchmarksPreviewDescription:
      "Bənchmark məbləğləri, faizlər və hesablanmış mahiyyətllik.",
  },
  ru: {
    breadcrumbMateriality: "Существенность",
    backToEngagement: "Вернуться к проекту",
    planningGateTitle: "Требуется утверждение планирования",
    planningGateDescription:
      "Планирование аудита должно быть утверждено до начала работы с существенностью.",
    navAriaLabel: "Разделы рабочей области существенности",
    navOverall: "Общая",
    navPerformance: "Рабочая",
    navSpecific: "Специфическая",
    navBenchmarks: "Бенчмарки",
    navCalculations: "Расчёты",
    navVersions: "Версии",
    navComments: "Комментарии",
    navHistory: "История",
    navSettings: "Настройки",
    loading: "Загрузка рабочей области существенности",
    errorTitle: "Не удалось загрузить рабочую область существенности",
    errorDescription:
      "При загрузке этой рабочей области существенности произошла ошибка.",
    archivedTitle: "Существенность в архиве",
    archivedDescription:
      "Этот пакет существенности доступен только для чтения. Восстановите его, чтобы продолжить обновления.",
    summaryStatus: "Статус существенности",
    summaryVersion: "Версия пакета",
    summaryProgress: "Общий прогресс",
    summaryBenchmarks: "Бенчмарки",
    summaryPendingReview: "Ожидает проверки",
    benchmarksPreviewTitle: "Предпросмотр бенчмарков",
    benchmarksPreviewDescription:
      "Суммы бенчмарков, проценты и рассчитанная существенность.",
  },
  tr: {
    breadcrumbMateriality: "Önemlilik",
    backToEngagement: "Göreve dön",
    planningGateTitle: "Planlama onayı gerekli",
    planningGateDescription:
      "Önemlilik başlamadan önce denetim planlaması onaylanmalıdır.",
    navAriaLabel: "Önemlilik çalışma alanı bölümleri",
    navOverall: "Genel",
    navPerformance: "Performans",
    navSpecific: "Özel",
    navBenchmarks: "Kıyaslamalar",
    navCalculations: "Hesaplamalar",
    navVersions: "Sürümler",
    navComments: "Yorumlar",
    navHistory: "Geçmiş",
    navSettings: "Ayarlar",
    loading: "Önemlilik çalışma alanı yükleniyor",
    errorTitle: "Önemlilik çalışma alanı yüklenemedi",
    errorDescription: "Bu önemlilik çalışma alanı yüklenirken bir hata oluştu.",
    archivedTitle: "Önemlilik arşivlendi",
    archivedDescription:
      "Bu önemlilik paketi salt okunurdur. Güncellemeye devam etmek için geri yükleyin.",
    summaryStatus: "Önemlilik durumu",
    summaryVersion: "Paket sürümü",
    summaryProgress: "Genel ilerleme",
    summaryBenchmarks: "Kıyaslamalar",
    summaryPendingReview: "İnceleme bekliyor",
    benchmarksPreviewTitle: "Kıyaslama önizlemesi",
    benchmarksPreviewDescription:
      "Kıyaslama tutarları, yüzdeler ve hesaplanan önemlilik.",
  },
};

const corruptedKeyPrefixes = [
  "navBənchmarklar",
  "navHesablamalar",
  "navVersiyalar",
  "navŞərhlər",
  "navTarixçə",
  "navParametrlər",
  "navБенчмарки",
  "navРасчёты",
  "navВерсии",
  "navКомментарии",
  "navИстория",
  "navНастройки",
  "navKıyaslamalar",
  "navHesaplamalar",
  "navSürümler",
  "navYorumlar",
  "navGeçmiş",
  "navAyarlar",
  "summaryBənchmarklar",
  "summaryБенчмарки",
  "summaryKıyaslamalar",
  "breadcrumbMahiyyətllik",
];

for (const locale of ["az", "ru", "tr"]) {
  const filePath = path.join(messagesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const workspace = data.materiality?.workspace;
  if (!workspace) {
    console.warn(`No materiality.workspace in ${locale}`);
    continue;
  }

  for (const key of corruptedKeyPrefixes) {
    delete workspace[key];
  }

  Object.assign(workspace, patches[locale]);

  const activityKeys = {
    az: {
      "materiality.archived": "Mahiyyətllik paketi arxivlənib",
      archiveTitle: "Mahiyyətllik arxivlənib",
    },
    ru: {
      "materiality.archived": "Пакет существенности архивирован",
      archiveTitle: "Существенность в архиве",
    },
    tr: {
      "materiality.archived": "Önemlilik paketi arşivlendi",
      archiveTitle: "Önemlilik arşivlendi",
    },
  };

  if (data.materiality.activity) {
    Object.assign(data.materiality.activity, activityKeys[locale]);
  }

  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Patched materiality.workspace in ${locale}.json`);
}
