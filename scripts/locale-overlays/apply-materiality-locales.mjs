import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const messagesDir = path.join(root, "src/i18n/messages");
const en = JSON.parse(fs.readFileSync(path.join(messagesDir, "en.json"), "utf8"));

const azMateriality = JSON.parse(
  JSON.stringify(en.materiality)
    .replaceAll("Materiality not found", "Mahiyyətllik tapılmadı")
    .replaceAll("Permission required", "İcazə tələb olunur")
    .replaceAll("Workspace required", "İş sahəsi tələb olunur")
    .replaceAll("Draft", "Qaralama")
    .replaceAll("Submitted", "Təqdim edilib")
    .replaceAll("Under review", "Nəzərdən keçirilir")
    .replaceAll("Returned", "Geri qaytarılıb")
    .replaceAll("Approved", "Təsdiqlənib")
    .replaceAll("Archived", "Arxivləşdirilib")
    .replaceAll("Materiality", "Mahiyyətllik")
    .replaceAll("Overall materiality", "Ümumi mahiyyətllik")
    .replaceAll("Performance materiality", "Performans mahiyyətlliyi")
    .replaceAll("Specific materiality", "Xüsusi mahiyyətllik")
    .replaceAll("Trivial threshold", "Əhəmiyyətsiz hədd")
    .replaceAll("Benchmarks", "Bənchmarklar")
    .replaceAll("Calculations", "Hesablamalar")
    .replaceAll("Versions", "Versiyalar")
    .replaceAll("Comments", "Şərhlər")
    .replaceAll("History", "Tarixçə")
    .replaceAll("Settings", "Parametrlər")
    .replaceAll("Dashboard", "İdarə paneli")
    .replaceAll("Revenue", "Gəlir")
    .replaceAll("Profit before tax", "Vergidən əvvəl mənfəət")
    .replaceAll("Total assets", "Ümumi aktivlər")
    .replaceAll("Equity", "Kapital")
    .replaceAll("Expenses", "Xərclər")
    .replaceAll("Manual benchmark", "Manual bənchmark")
    .replaceAll("Submit for review", "Nəzərdən keçirməyə təqdim et")
    .replaceAll("Return for revision", "Düzəliş üçün geri qaytar")
    .replaceAll("Confirm return", "Geri qaytarmanı təsdiqlə")
    .replaceAll("Approve materiality", "Mahiyyətlliyi təsdiqlə")
    .replaceAll("Cancel", "Ləğv et")
    .replaceAll("Not set", "Təyin edilməyib")
    .replaceAll("Add comment", "Şərh əlavə et")
    .replaceAll("Archive materiality package", "Mahiyyətllik paketini arxivləşdir")
    .replaceAll("Restore materiality package", "Mahiyyətllik paketini bərpa et"),
);

const ruMateriality = JSON.parse(
  JSON.stringify(en.materiality)
    .replaceAll("Materiality not found", "Существенность не найдена")
    .replaceAll("Permission required", "Требуется разрешение")
    .replaceAll("Workspace required", "Требуется рабочая область")
    .replaceAll("Draft", "Черновик")
    .replaceAll("Submitted", "Отправлено")
    .replaceAll("Under review", "На проверке")
    .replaceAll("Returned", "Возвращено")
    .replaceAll("Approved", "Утверждено")
    .replaceAll("Archived", "В архиве")
    .replaceAll("Materiality", "Существенность")
    .replaceAll("Overall materiality", "Общая существенность")
    .replaceAll("Performance materiality", "Рабочая существенность")
    .replaceAll("Specific materiality", "Специфическая существенность")
    .replaceAll("Trivial threshold", "Порог тривиальности")
    .replaceAll("Benchmarks", "Бенчмарки")
    .replaceAll("Calculations", "Расчёты")
    .replaceAll("Versions", "Версии")
    .replaceAll("Comments", "Комментарии")
    .replaceAll("History", "История")
    .replaceAll("Settings", "Настройки")
    .replaceAll("Dashboard", "Панель")
    .replaceAll("Revenue", "Выручка")
    .replaceAll("Profit before tax", "Прибыль до налогообложения")
    .replaceAll("Total assets", "Всего активов")
    .replaceAll("Equity", "Капитал")
    .replaceAll("Expenses", "Расходы")
    .replaceAll("Manual benchmark", "Ручной бенчмарк")
    .replaceAll("Submit for review", "Отправить на проверку")
    .replaceAll("Return for revision", "Вернуть на доработку")
    .replaceAll("Confirm return", "Подтвердить возврат")
    .replaceAll("Approve materiality", "Утвердить существенность")
    .replaceAll("Cancel", "Отмена")
    .replaceAll("Not set", "Не задано")
    .replaceAll("Add comment", "Добавить комментарий")
    .replaceAll("Archive materiality package", "Архивировать пакет существенности")
    .replaceAll("Restore materiality package", "Восстановить пакет существенности"),
);

const trMateriality = JSON.parse(
  JSON.stringify(en.materiality)
    .replaceAll("Materiality not found", "Önemlilik bulunamadı")
    .replaceAll("Permission required", "İzin gerekli")
    .replaceAll("Workspace required", "Çalışma alanı gerekli")
    .replaceAll("Draft", "Taslak")
    .replaceAll("Submitted", "Gönderildi")
    .replaceAll("Under review", "İncelemede")
    .replaceAll("Returned", "İade edildi")
    .replaceAll("Approved", "Onaylandı")
    .replaceAll("Archived", "Arşivlendi")
    .replaceAll("Materiality", "Önemlilik")
    .replaceAll("Overall materiality", "Genel önemlilik")
    .replaceAll("Performance materiality", "Performans önemliliği")
    .replaceAll("Specific materiality", "Özel önemlilik")
    .replaceAll("Trivial threshold", "Önemsizlik eşiği")
    .replaceAll("Benchmarks", "Kıyaslamalar")
    .replaceAll("Calculations", "Hesaplamalar")
    .replaceAll("Versions", "Sürümler")
    .replaceAll("Comments", "Yorumlar")
    .replaceAll("History", "Geçmiş")
    .replaceAll("Settings", "Ayarlar")
    .replaceAll("Dashboard", "Kontrol paneli")
    .replaceAll("Revenue", "Gelir")
    .replaceAll("Profit before tax", "Vergi öncesi kâr")
    .replaceAll("Total assets", "Toplam varlıklar")
    .replaceAll("Equity", "Özkaynak")
    .replaceAll("Expenses", "Giderler")
    .replaceAll("Manual benchmark", "Manuel kıyaslama")
    .replaceAll("Submit for review", "İncelemeye gönder")
    .replaceAll("Return for revision", "Revizyon için iade et")
    .replaceAll("Confirm return", "İadeyi onayla")
    .replaceAll("Approve materiality", "Önemliliği onayla")
    .replaceAll("Cancel", "İptal")
    .replaceAll("Not set", "Belirlenmedi")
    .replaceAll("Add comment", "Yorum ekle")
    .replaceAll("Archive materiality package", "Önemlilik paketini arşivle")
    .replaceAll("Restore materiality package", "Önemlilik paketini geri yükle"),
);

const engagementPatches = {
  az: {
    navMateriality: "Mahiyyətllik",
    materiality: {
      title: "Mahiyyətllik xülasəsi",
      description:
        "Bu müqavilə üçün ISA 320 mahiyyətllik statusu, həddləri və bənchmark hazırlığı.",
      lifecycleStage: "Həyat dövrü mərhələsi",
      financialYear: "Maliyyə ili",
      plannedSchedule: "Planlaşdırılmış cədvəl",
      teamSize: "Komanda ölçüsü",
      materialityStatus: "Mahiyyətllik statusu",
      materialityProgress: "Mahiyyətllik irəliləyişi",
      packageVersion: "Paket versiyası",
      overallMateriality: "Ümumi mahiyyətllik",
      benchmarkCount: "Bənchmarklar",
      openMateriality: "Mahiyyətllik iş sahəsini aç",
    },
  },
  ru: {
    navMateriality: "Существенность",
    materiality: {
      title: "Сводка по существенности",
      description:
        "Статус ISA 320, пороги и готовность бенчмарков для этого задания.",
      lifecycleStage: "Этап жизненного цикла",
      financialYear: "Финансовый год",
      plannedSchedule: "Плановый график",
      teamSize: "Размер команды",
      materialityStatus: "Статус существенности",
      materialityProgress: "Прогресс существенности",
      packageVersion: "Версия пакета",
      overallMateriality: "Общая существенность",
      benchmarkCount: "Бенчмарки",
      openMateriality: "Открыть рабочую область существенности",
    },
  },
  tr: {
    navMateriality: "Önemlilik",
    materiality: {
      title: "Önemlilik özeti",
      description:
        "Bu görev için ISA 320 önemlilik durumu, eşikler ve kıyaslama hazırlığı.",
      lifecycleStage: "Yaşam döngüsü aşaması",
      financialYear: "Mali yıl",
      plannedSchedule: "Planlanan takvim",
      teamSize: "Ekip büyüklüğü",
      materialityStatus: "Önemlilik durumu",
      materialityProgress: "Önemlilik ilerlemesi",
      packageVersion: "Paket sürümü",
      overallMateriality: "Genel önemlilik",
      benchmarkCount: "Kıyaslamalar",
      openMateriality: "Önemlilik çalışma alanını aç",
    },
  },
};

for (const [code, materiality] of [
  ["az", azMateriality],
  ["ru", ruMateriality],
  ["tr", trMateriality],
]) {
  const localePath = path.join(messagesDir, `${code}.json`);
  const locale = JSON.parse(fs.readFileSync(localePath, "utf8"));
  locale.materiality = materiality;
  const patch = engagementPatches[code];
  locale.engagements.workspace.navMateriality = patch.navMateriality;
  locale.engagements.workspace.materiality = patch.materiality;
  if (locale.riskAssessment?.workspace) {
    locale.riskAssessment.workspace.materialityGateTitle =
      code === "az"
        ? "Mahiyyətllik təsdiqi tələb olunur"
        : code === "ru"
          ? "Требуется утверждение существенности"
          : "Önemlilik onayı gerekli";
    locale.riskAssessment.workspace.materialityGateDescription =
      code === "az"
        ? "Risk qiymətləndirməsinə başlamazdan əvvəl ISA 320 mahiyyətlliyi təsdiqlənməlidir."
        : code === "ru"
          ? "Оценка рисков не может начаться, пока не утверждена существенность по ISA 320."
          : "ISA 320 önemliliği onaylanmadan risk değerlendirmesi başlayamaz.";
  }
  fs.writeFileSync(localePath, `${JSON.stringify(locale, null, 2)}\n`, "utf8");
  console.log(`Applied materiality translations -> ${code}.json`);
}
