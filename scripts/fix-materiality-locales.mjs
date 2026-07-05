import fs from "node:fs";
import path from "node:path";

const messagesDir = path.join(process.cwd(), "src/i18n/messages");

const corruptedKeyFixes = {
  az: { noBənchmarklarTitle: "noBenchmarksTitle", noBənchmarklarDescription: "noBenchmarksDescription" },
  ru: { noБенчмаркиTitle: "noBenchmarksTitle", noБенчмаркиDescription: "noBenchmarksDescription" },
  tr: { noKıyaslamalarTitle: "noBenchmarksTitle", noKıyaslamalarDescription: "noBenchmarksDescription" },
};

const deleteKeys = {
  ru: ["breadcrumbСущественность"],
  tr: ["breadcrumbÖnemlilik"],
};

const commandCenterPatches = {
  az: {
    heroTitle: "ISA 320 mahiyyətllik komanda mərkəzi",
    executiveTitle: "Mahiyyətllik həddləri",
    summaryTitle: "Mahiyyətllik xülasəsi",
    metricsTitle: "Paket göstəriciləri",
    workflowTitle: "Təsdiq iş axını",
    workflowDescription: "Qaralamadan inteqrasiyaya — cari addım vurğulanır.",
    approvalQueueTitle: "Təsdiq növbəsi",
    approvalQueueDescription:
      "Partnyor və ya menecerin imzasını gözləyən mahiyyətllik paketləri.",
    calculationBreakdownTitle: "Hesablama bölgüsü",
    calculationBreakdownDescription: "Ümumi, performans və əhəmiyyətsiz hesablama axını.",
    benchmarkComparisonTitle: "Bənchmark müqayisəsi",
    benchmarkComparisonDescription: "Sıralanmış bənchmark məbləğləri və hesablanmış mahiyyətllik.",
    calculationHistoryTitle: "Hesablama tarixi",
    calculationHistoryDescription: "Qeydə alınmış hesablamalar və əl ilə düzəlişlər.",
    selectedBenchmarkTitle: "Seçilmiş bənchmark",
    selectedBenchmarkDescription: "Ümumi mahiyyətllik təyini üçün əsas.",
    versionTimelineTitle: "Versiya qrafiki",
    versionTimelineDescription: "Paket versiyası anlıq görüntüləri və dəyişiklik xülasələri.",
    reviewNotesTitle: "Yoxlama qeydləri",
    reviewNotesDescription: "Partnyor və menecer yoxlama şərhləri.",
    commentsTitle: "Şərhlər",
    commentsDescription: "Mahiyyətllik üzrə yoxlama və daxili müzakirə.",
    recentChangesTitle: "Son dəyişikliklər",
    recentChangesDescription: "Təqdimatlar, geri qaytarmalar, təsdiqlər və versiya yeniləmələri.",
    activityTitle: "Fəaliyyət lenti",
    activityDescription: "Ən son mahiyyətllik iş sahəsi hadisələri.",
    stepUnderReview: "Yoxlamada",
    openWorkflow: "Yoxlama iş axını",
    kpiOverall: "Ümumi mahiyyətllik",
    kpiPerformance: "Performans mahiyyətlliyi",
    kpiSpecific: "Xüsusi mahiyyətllik",
    kpiStatus: "Təsdiq statusu",
    kpiPendingReview: "Yoxlama gözləyir",
    kpiReviewer: "Təyin olunmuş yoxlayıcı",
    hintPerformance: "İş mahiyyətlliyi",
    hintWorkflow: "Təsdiq vəziyyəti",
    hintReviewer: "Yoxlama tapşırığı",
    changeApproved: "Mahiyyətllik təsdiqləndi",
    changeSubmitted: "Yoxlamaya təqdim edildi",
    changeSubmittedDescription: "Paket müsadirə yoxlayıcısına təqdim edildi.",
    emptyBenchmarksDescription: "Mahiyyətllik əsaslarını müqayisə etmək üçün bənchmarklar əlavə edin.",
    emptyReviewNotes: "Yoxlama qeydi yoxdur",
    emptyReviewNotesDescription: "Yoxlama qeydləri təsdiq iş axını zamanı görünür.",
    emptyActivityDescription: "Mahiyyətllik hadisələri burada qeydə alınacaq.",
  },
  ru: {
    heroTitle: "Командный центр существенности ISA 320",
    executiveTitle: "Пороги существенности",
    summaryTitle: "Сводка существенности",
    metricsTitle: "Метрики пакета",
    workflowTitle: "Процесс утверждения",
    workflowDescription: "От черновика до интеграции — выделен текущий этап.",
    approvalQueueTitle: "Очередь утверждения",
    approvalQueueDescription:
      "Пакеты существенности, ожидающие подписи партнёра или менеджера.",
    calculationBreakdownTitle: "Разбивка расчёта",
    calculationBreakdownDescription: "Общая, рабочая и тривиальная цепочка расчётов.",
    benchmarkComparisonTitle: "Сравнение бенчмарков",
    benchmarkComparisonDescription: "Ранжированные суммы бенчмарков и рассчитанная существенность.",
    calculationHistoryTitle: "История расчётов",
    calculationHistoryDescription: "Записанные расчёты и ручные корректировки.",
    selectedBenchmarkTitle: "Выбранный бенчмарк",
    selectedBenchmarkDescription: "Основа для определения общей существенности.",
    versionTimelineTitle: "Хронология версий",
    versionTimelineDescription: "Снимки версий пакета и сводки изменений.",
    reviewNotesTitle: "Примечания к проверке",
    reviewNotesDescription: "Комментарии партнёра и менеджера по проверке.",
    commentsTitle: "Комментарии",
    commentsDescription: "Проверка и внутреннее обсуждение существенности.",
    recentChangesTitle: "Недавние изменения",
    recentChangesDescription: "Отправки, возвраты, утверждения и обновления версий.",
    activityTitle: "Лента активности",
    activityDescription: "Последние события рабочей области существенности.",
    stepUnderReview: "На проверке",
    openWorkflow: "Процесс проверки",
    kpiOverall: "Общая существенность",
    kpiPerformance: "Рабочая существенность",
    kpiSpecific: "Специфическая существенность",
    kpiStatus: "Статус утверждения",
    kpiPendingReview: "Ожидает проверки",
    kpiReviewer: "Назначенный проверяющий",
    hintPerformance: "Рабочая существенность",
    hintWorkflow: "Статус утверждения",
    hintReviewer: "Назначение проверки",
    changeApproved: "Существенность утверждена",
    changeSubmitted: "Отправлено на проверку",
    changeSubmittedDescription: "Пакет отправлен проверяющему по проекту.",
    emptyBenchmarksDescription: "Добавьте бенчмарки для сравнения основ существенности.",
    emptyReviewNotes: "Нет примечаний к проверке",
    emptyReviewNotesDescription: "Примечания появляются в процессе утверждения.",
    emptyActivityDescription: "События существенности будут записаны здесь.",
  },
  tr: {
    heroTitle: "ISA 320 önemlilik komuta merkezi",
    executiveTitle: "Önemlilik eşikleri",
    summaryTitle: "Önemlilik özeti",
    metricsTitle: "Paket metrikleri",
    workflowTitle: "Onay iş akışı",
    workflowDescription: "Taslaktan entegrasyona — mevcut adım vurgulanır.",
    approvalQueueTitle: "Onay kuyruğu",
    approvalQueueDescription:
      "İş ortağı veya yönetici onayı bekleyen önemlilik paketleri.",
    calculationBreakdownTitle: "Hesaplama dökümü",
    calculationBreakdownDescription: "Genel, performans ve önemsiz hesaplama akışı.",
    benchmarkComparisonTitle: "Kıyaslama karşılaştırması",
    benchmarkComparisonDescription: "Sıralanmış kıyaslama tutarları ve hesaplanan önemlilik.",
    calculationHistoryTitle: "Hesaplama geçmişi",
    calculationHistoryDescription: "Kaydedilen hesaplamalar ve manuel geçersiz kılmalar.",
    selectedBenchmarkTitle: "Seçilen kıyaslama",
    selectedBenchmarkDescription: "Genel önemlilik belirlemesinin temeli.",
    versionTimelineTitle: "Sürüm zaman çizelgesi",
    versionTimelineDescription: "Paket sürümü anlık görüntüleri ve değişiklik özetleri.",
    reviewNotesTitle: "İnceleme notları",
    reviewNotesDescription: "Ortak ve yönetici inceleme yorumları.",
    commentsTitle: "Yorumlar",
    commentsDescription: "Önemlilik üzerine inceleme ve dahili tartışma.",
    recentChangesTitle: "Son değişiklikler",
    recentChangesDescription: "Gönderimler, iadeler, onaylar ve sürüm güncellemeleri.",
    activityTitle: "Etkinlik akışı",
    activityDescription: "En son önemlilik çalışma alanı olayları.",
    stepUnderReview: "İncelemede",
    openWorkflow: "İnceleme iş akışı",
    kpiOverall: "Genel önemlilik",
    kpiPerformance: "Performans önemliliği",
    kpiSpecific: "Özel önemlilik",
    kpiStatus: "Onay durumu",
    kpiPendingReview: "İnceleme bekliyor",
    kpiReviewer: "Atanan inceleyici",
    hintPerformance: "Çalışma önemliliği",
    hintWorkflow: "Onay durumu",
    hintReviewer: "İnceleme ataması",
    changeApproved: "Önemlilik onaylandı",
    changeSubmitted: "İncelemeye gönderildi",
    changeSubmittedDescription: "Paket görev inceleyicisine gönderildi.",
    emptyBenchmarksDescription: "Önemlilik temellerini karşılaştırmak için kıyaslamalar ekleyin.",
    emptyReviewNotes: "İnceleme notu yok",
    emptyReviewNotesDescription: "İnceleme notları onay iş akışı sırasında görünür.",
    emptyActivityDescription: "Önemlilik olayları burada kaydedilecek.",
  },
};

const localePatches = {
  az: {
    notFoundDescription:
      "Bu müsadirə üçün tələb olunan mahiyyətllik iş sahəsi tapılmadı.",
    forbiddenDescription: "Bu iş sahəsinə daxil olmaq üçün mahiyyətllik icazəsi lazımdır.",
    noWorkspaceDescription: "Mahiyyətlliyi açmazdan əvvəl iş sahəsi seçin.",
    commentTypes: { review: "Yoxlama şərhi", internal: "Daxili şərh" },
    workflow: { title: "Mahiyyətllik iş axını" },
    empty: {
      title: "Mahiyyətllik başlanmayıb",
      description:
        "ISA 320 üzrə ümumi, performans və xüsusi həddləri sənədləşdirmək üçün mahiyyətllik paketi yaradın.",
      createAction: "Mahiyyətllik paketi yarat",
      creating: "Mahiyyətllik paketi yaradılır...",
      forbiddenDescription:
        "Bu iş sahəsini başlatmaq üçün mahiyyətllik yaratma icazəsi lazımdır.",
    },
    workspace: {
      breadcrumbMateriality: "Mahiyyətllik",
      navBenchmarks: "Bənchmarklar",
      navCalculations: "Hesablamalar",
      navVersions: "Versiyalar",
      navComments: "Şərhlər",
      navHistory: "Tarixçə",
      navSettings: "Parametrlər",
      summaryBenchmarks: "Bənchmarklar",
      sections: {
        overview: {
          title: "Mahiyyətllik idarə paneli",
          description: "Status, gedişat və hədd hazırlığı göstəriciləri.",
        },
        overall: {
          description: "Ümumi mahiyyətllik həddi və təyinetmə əsası.",
        },
        performance: {
          description: "Performans mahiyyətlliyi həddi və tətbiq olunan faiz.",
        },
        specific: {
          description: "Hesab və ya açıqlama üzrə xüsusi mahiyyətllik həddləri.",
        },
        benchmarks: {
          description: "Bənchmark məbləğləri, faizlər və seçilmiş əsas.",
        },
        calculations: {
          description: "Qeydə alınmış mahiyyətllik hesablamaları və əl ilə düzəlişlər.",
        },
        versions: {
          description: "Mahiyyətllik paketinin versiya tarixçəsi anlıq görüntüləri.",
        },
        comments: {
          description: "Mahiyyətllik sənədləşməsi üzrə yoxlama və daxili şərhlər.",
        },
        history: {
          description: "Mahiyyətllik dəyişiklikləri və təsdiqlərinin xronologiyası.",
        },
        settings: {
          description: "Bu mahiyyətllik paketini arxivləşdirmə və bərpa idarəetməsi.",
        },
      },
      historyActions: {
        "materiality.created": "Mahiyyətllik paketi yaradıldı",
        "materiality.updated": "Mahiyyətllik paketi yeniləndi",
        "materiality.archived": "Mahiyyətllik paketi arxivləndi",
        "materiality.restored": "Mahiyyətllik paketi bərpa edildi",
        "materiality.submitted": "Mahiyyətllik paketi təqdim edildi",
        "materiality.returned": "Mahiyyətllik paketi geri qaytarıldı",
        "materiality.approved": "Mahiyyətllik paketi təsdiqləndi",
        "materiality.benchmark.added": "Bənchmark əlavə edildi",
        "materiality.benchmark.updated": "Bənchmark yeniləndi",
        "materiality.calculation.recorded": "Hesablama qeydə alındı",
        "materiality.threshold.updated": "Hədd yeniləndi",
        "materiality.comment.added": "Şərh əlavə edildi",
        "materiality.version.created": "Versiya yaradıldı",
      },
    },
    calculator: {
      title: "Mahiyyətllik kalkulyatoru",
      description: "Bənchmark seçin, faiz tətbiq edin və ümumi mahiyyətlliyi hesablayın.",
      benchmarkLabel: "Bənchmark seçimi",
      benchmarkPlaceholder: "Bənchmark seçin",
      amountLabel: "Bənchmark məbləği",
      amountPlaceholder: "Bənchmark məbləğini daxil edin",
      percentageLabel: "Faiz",
      percentagePlaceholder: "Faizi daxil edin",
      calculatedLabel: "Hesablanmış mahiyyətllik",
      manualOverrideLabel: "Əl ilə düzəliş",
      overrideReasonLabel: "Düzəliş səbəbi",
      overrideReasonPlaceholder: "Hesablanmış məbləğin niyə dəyişdirildiyini izah edin.",
      applyAction: "Hesablamanı tətbiq et",
      selectBenchmarkAction: "Seçildi",
      autoCalcNotice:
        "Mahiyyətllik bənchmark məbləği və faizindən avtomatik hesablanır.",
      manualOverrideNotice:
        "Əl ilə düzəliş aktivdir. Tətbiq etməzdən əvvəl əsaslandırmanı sənədləşdirin.",
      savedAmountLabel: "Saxlanılıb",
      noBenchmarksTitle: "Bənchmark konfiqurasiya edilməyib",
      noBenchmarksDescription:
        "Mahiyyətllik kalkulyatorundan istifadə etməzdən əvvəl bənchmarklar əlavə edin.",
    },
    overall: {
      description: "Ümumi mahiyyətllik həddini və təyinetmə əsası sənədləşdirin.",
      emptyTitle: "Ümumi mahiyyətllik təyin edilməyib",
      emptyDescription:
        "Bənchmark seçdikdən və hesablamaları tamamladıqdan sonra ümumi mahiyyətlliyi təyin edin.",
    },
    overallFields: { basisNotesLabel: "Təyinetmə əsası" },
    performance: {
      description:
        "Performans mahiyyətlliyini ümumi mahiyyətlliyin faizi kimi sənədləşdirin.",
      emptyTitle: "Performans mahiyyətlliyi təyin edilməyib",
      emptyDescription:
        "Ümumi mahiyyətllik müəyyən edildikdən sonra performans mahiyyətlliyini təyin edin.",
    },
    performanceFields: { percentageLabel: "Ümumidən faiz" },
    specific: {
      description:
        "Hesablar, açıqlamalar və ya əməliyyat sinifləri üçün xüsusi mahiyyətlliyi sənədləşdirin.",
      emptyTitle: "Xüsusi mahiyyətllik maddəsi yoxdur",
      emptyDescription:
        "Aşağı məbləğlərin tətbiq olunduğu hallarda xüsusi mahiyyətllik həddləri əlavə edin.",
    },
    specificFields: { amountLabel: "Məbləğ", rationaleLabel: "Əsaslandırma" },
    benchmarks: {
      description:
        "Mahiyyətllik təyini üçün istifadə olunan bənchmark məbləğlərini konfiqurasiya edin və müqayisə edin.",
      emptyTitle: "Bənchmark yoxdur",
      emptyDescription: "Ümumi mahiyyətllik təyini üçün bənchmarklar əlavə edin.",
    },
    calculations: {
      description: "Qeydə alınmış mahiyyətllik hesablamalarını və əl ilə düzəlişləri nəzərdən keçirin.",
      emptyTitle: "Hesablama qeydə alınmayıb",
      emptyDescription: "Bənchmarklar tətbiq edildikdə hesablamalar burada görünür.",
    },
    comments: {
      emptyDescription: "Şərhlər əlavə edildikdən sonra burada görünür.",
    },
    history: {
      emptyDescription:
        "Dəyişikliklər qeydə alındıqca mahiyyətllik fəaliyyəti burada görünəcək.",
      actions: {
        "materiality.created": "Mahiyyətllik paketi yaradıldı",
        "materiality.updated": "Mahiyyətllik paketi yeniləndi",
        "materiality.archived": "Mahiyyətllik paketi arxivləndi",
        "materiality.restored": "Mahiyyətllik paketi bərpa edildi",
        "materiality.submitted": "Mahiyyətllik paketi təqdim edildi",
        "materiality.returned": "Mahiyyətllik paketi geri qaytarıldı",
        "materiality.approved": "Mahiyyətllik paketi təsdiqləndi",
      },
    },
    states: {
      permissionDescription: "Bu əməliyyatı yerinə yetirmək üçün icazəniz yoxdur.",
    },
  },
  ru: {
    notFoundDescription:
      "Запрошенная рабочая область существенности не найдена для этого проекта.",
    forbiddenDescription:
      "Для доступа к этой рабочей области требуется разрешение на существенность.",
    noWorkspaceDescription: "Выберите рабочую область перед открытием существенности.",
    commentTypes: { review: "Комментарий проверки", internal: "Внутренний комментарий" },
    workflow: { title: "Рабочий процесс существенности" },
    empty: {
      title: "Существенность не инициирована",
      description:
        "Создайте пакет существенности для документирования общих, рабочих и специфических порогов по ISA 320.",
      createAction: "Создать пакет существенности",
      creating: "Создание пакета существенности...",
      forbiddenDescription:
        "Для инициации этой рабочей области требуется разрешение на создание существенности.",
    },
    workspace: {
      breadcrumbMateriality: "Существенность",
      navBenchmarks: "Бенчмарки",
      navCalculations: "Расчёты",
      navVersions: "Версии",
      navComments: "Комментарии",
      navHistory: "История",
      navSettings: "Настройки",
      summaryBenchmarks: "Бенчмарки",
      sections: {
        overview: {
          title: "Панель существенности",
          description: "Статус, прогресс и показатели готовности порогов.",
        },
        overall: { description: "Общий порог существенности и основа определения." },
        performance: {
          description: "Рабочий порог существенности и применённый процент.",
        },
        specific: {
          description: "Специфические пороги существенности по счетам и раскрытиям.",
        },
        benchmarks: {
          description: "Суммы бенчмарков, проценты и выбранная основа.",
        },
        calculations: {
          description: "Записанные расчёты существенности и ручные корректировки.",
        },
        versions: {
          description: "Снимки истории версий пакета существенности.",
        },
        comments: {
          description: "Комментарии проверки и внутренние заметки по существенности.",
        },
        history: {
          description: "Хронология изменений и утверждений существенности.",
        },
        settings: {
          description: "Управление архивированием и восстановлением пакета существенности.",
        },
      },
      historyActions: {
        "materiality.created": "Пакет существенности создан",
        "materiality.updated": "Пакет существенности обновлён",
        "materiality.archived": "Пакет существенности архивирован",
        "materiality.restored": "Пакет существенности восстановлен",
        "materiality.submitted": "Пакет существенности отправлен",
        "materiality.returned": "Пакет существенности возвращён",
        "materiality.approved": "Пакет существенности утверждён",
        "materiality.benchmark.added": "Бенчмарк добавлен",
        "materiality.benchmark.updated": "Бенчмарк обновлён",
        "materiality.calculation.recorded": "Расчёт записан",
        "materiality.threshold.updated": "Порог обновлён",
        "materiality.comment.added": "Комментарий добавлен",
        "materiality.version.created": "Версия создана",
      },
    },
    calculator: {
      title: "Калькулятор существенности",
      description:
        "Выберите бенчмарк, примените процент и рассчитайте общую существенность.",
      benchmarkLabel: "Выбор бенчмарка",
      benchmarkPlaceholder: "Выберите бенчмарк",
      amountLabel: "Сумма бенчмарка",
      amountPlaceholder: "Введите сумму бенчмарка",
      percentageLabel: "Процент",
      percentagePlaceholder: "Введите процент",
      calculatedLabel: "Рассчитанная существенность",
      manualOverrideLabel: "Ручная корректировка",
      overrideReasonLabel: "Причина корректировки",
      overrideReasonPlaceholder: "Объясните, почему рассчитанная сумма была изменена.",
      applyAction: "Применить расчёт",
      selectBenchmarkAction: "Выбрано",
      autoCalcNotice:
        "Существенность рассчитывается автоматически из суммы бенчмарка и процента.",
      manualOverrideNotice:
        "Ручная корректировка включена. Задокументируйте обоснование перед применением.",
      savedAmountLabel: "Сохранено",
      noBenchmarksTitle: "Бенчмарки не настроены",
      noBenchmarksDescription:
        "Добавьте бенчмарки перед использованием калькулятора существенности.",
    },
    overall: {
      description: "Задокументируйте общий порог существенности и основу определения.",
      emptyTitle: "Общая существенность не задана",
      emptyDescription:
        "Задайте общую существенность после выбора бенчмарка и завершения расчётов.",
    },
    overallFields: { basisNotesLabel: "Основа определения" },
    performance: {
      description:
        "Задокументируйте рабочую существенность как процент от общей существенности.",
      emptyTitle: "Рабочая существенность не задана",
      emptyDescription:
        "Задайте рабочую существенность после определения общей существенности.",
    },
    performanceFields: { percentageLabel: "Процент от общей" },
    specific: {
      description:
        "Задокументируйте специфическую существенность по счетам, раскрытиям и классам операций.",
      emptyTitle: "Нет специфических позиций существенности",
      emptyDescription:
        "Добавьте специфические пороги существенности, где применяются меньшие суммы.",
    },
    specificFields: { amountLabel: "Сумма", rationaleLabel: "Обоснование" },
    benchmarks: {
      description:
        "Настройте и сравните суммы бенчмарков для определения существенности.",
      emptyTitle: "Нет бенчмарков",
      emptyDescription: "Добавьте бенчмарки для определения общей существенности.",
    },
    calculations: {
      description: "Просмотрите записанные расчёты существенности и ручные корректировки.",
      emptyTitle: "Расчёты не записаны",
      emptyDescription: "Расчёты появятся здесь после применения бенчмарков.",
    },
    comments: { emptyDescription: "Комментарии появятся здесь после добавления." },
    history: {
      emptyDescription:
        "Активность существенности появится здесь по мере записи изменений.",
      actions: {
        "materiality.created": "Пакет существенности создан",
        "materiality.updated": "Пакет существенности обновлён",
        "materiality.archived": "Пакет существенности архивирован",
        "materiality.restored": "Пакет существенности восстановлен",
        "materiality.submitted": "Пакет существенности отправлен",
        "materiality.returned": "Пакет существенности возвращён",
        "materiality.approved": "Пакет существенности утверждён",
      },
    },
    states: {
      permissionDescription: "У вас нет разрешения на выполнение этого действия.",
    },
  },
  tr: {
    notFoundDescription:
      "Bu görev için istenen önemlilik çalışma alanı bulunamadı.",
    forbiddenDescription:
      "Bu çalışma alanına erişmek için önemlilik izni gereklidir.",
    noWorkspaceDescription: "Önemliliği açmadan önce bir çalışma alanı seçin.",
    commentTypes: { review: "İnceleme yorumu", internal: "Dahili yorum" },
    workflow: { title: "Önemlilik iş akışı" },
    empty: {
      title: "Önemlilik başlatılmadı",
      description:
        "ISA 320 kapsamında genel, performans ve özel eşikleri belgelemek için önemlilik paketi oluşturun.",
      createAction: "Önemlilik paketi oluştur",
      creating: "Önemlilik paketi oluşturuluyor...",
      forbiddenDescription:
        "Bu çalışma alanını başlatmak için önemlilik oluşturma izni gereklidir.",
    },
    workspace: {
      breadcrumbMateriality: "Önemlilik",
      navBenchmarks: "Kıyaslamalar",
      navCalculations: "Hesaplamalar",
      navVersions: "Sürümler",
      navComments: "Yorumlar",
      navHistory: "Geçmiş",
      navSettings: "Ayarlar",
      summaryBenchmarks: "Kıyaslamalar",
      sections: {
        overview: {
          title: "Önemlilik kontrol paneli",
          description: "Durum, ilerleme ve eşik hazırlık göstergeleri.",
        },
        overall: { description: "Genel önemlilik eşiği ve belirleme temeli." },
        performance: {
          description: "Performans önemliliği eşiği ve uygulanan yüzde.",
        },
        specific: {
          description: "Hesap veya açıklama bazında özel önemlilik eşikleri.",
        },
        benchmarks: {
          description: "Kıyaslama tutarları, yüzdeler ve seçilen temel.",
        },
        calculations: {
          description: "Kaydedilen önemlilik hesaplamaları ve manuel geçersiz kılmalar.",
        },
        versions: {
          description: "Önemlilik paketinin sürüm geçmişi anlık görüntüleri.",
        },
        comments: {
          description: "Önemlilik dokümantasyonu üzerine inceleme ve dahili yorumlar.",
        },
        history: {
          description: "Önemlilik değişiklikleri ve onaylarının zaman çizelgesi.",
        },
        settings: {
          description: "Bu önemlilik paketini arşivleme ve geri yükleme kontrolleri.",
        },
      },
      historyActions: {
        "materiality.created": "Önemlilik paketi oluşturuldu",
        "materiality.updated": "Önemlilik paketi güncellendi",
        "materiality.archived": "Önemlilik paketi arşivlendi",
        "materiality.restored": "Önemlilik paketi geri yüklendi",
        "materiality.submitted": "Önemlilik paketi gönderildi",
        "materiality.returned": "Önemlilik paketi iade edildi",
        "materiality.approved": "Önemlilik paketi onaylandı",
        "materiality.benchmark.added": "Kıyaslama eklendi",
        "materiality.benchmark.updated": "Kıyaslama güncellendi",
        "materiality.calculation.recorded": "Hesaplama kaydedildi",
        "materiality.threshold.updated": "Eşik güncellendi",
        "materiality.comment.added": "Yorum eklendi",
        "materiality.version.created": "Sürüm oluşturuldu",
      },
    },
    calculator: {
      title: "Önemlilik hesaplayıcı",
      description: "Bir kıyaslama seçin, yüzde uygulayın ve genel önemliliği hesaplayın.",
      benchmarkLabel: "Kıyaslama seçimi",
      benchmarkPlaceholder: "Kıyaslama seçin",
      amountLabel: "Kıyaslama tutarı",
      amountPlaceholder: "Kıyaslama tutarını girin",
      percentageLabel: "Yüzde",
      percentagePlaceholder: "Yüzdeyi girin",
      calculatedLabel: "Hesaplanan önemlilik",
      manualOverrideLabel: "Manuel geçersiz kılma",
      overrideReasonLabel: "Geçersiz kılma nedeni",
      overrideReasonPlaceholder: "Hesaplanan tutarın neden değiştirildiğini açıklayın.",
      applyAction: "Hesaplamayı uygula",
      selectBenchmarkAction: "Seçildi",
      autoCalcNotice:
        "Önemlilik, kıyaslama tutarı ve yüzdesinden otomatik olarak hesaplanır.",
      manualOverrideNotice:
        "Manuel geçersiz kılma etkin. Uygulamadan önce gerekçeyi belgeleyin.",
      savedAmountLabel: "Kaydedildi",
      noBenchmarksTitle: "Kıyaslama yapılandırılmadı",
      noBenchmarksDescription:
        "Önemlilik hesaplayıcısını kullanmadan önce kıyaslamalar ekleyin.",
    },
    overall: {
      description: "Genel önemlilik eşiğini ve belirleme temelini belgeleyin.",
      emptyTitle: "Genel önemlilik belirlenmedi",
      emptyDescription:
        "Bir kıyaslama seçip hesaplamaları tamamladıktan sonra genel önemliliği belirleyin.",
    },
    overallFields: { basisNotesLabel: "Belirleme temeli" },
    performance: {
      description:
        "Performans önemliliğini genel önemliliğin yüzdesi olarak belgeleyin.",
      emptyTitle: "Performans önemliliği belirlenmedi",
      emptyDescription:
        "Genel önemlilik belirlendikten sonra performans önemliliğini ayarlayın.",
    },
    performanceFields: { percentageLabel: "Genelden yüzde" },
    specific: {
      description:
        "Hesaplar, açıklamalar veya işlem sınıfları için özel önemliliği belgeleyin.",
      emptyTitle: "Özel önemlilik kalemi yok",
      emptyDescription:
        "Daha düşük tutarların geçerli olduğu durumlarda özel önemlilik eşikleri ekleyin.",
    },
    specificFields: { amountLabel: "Tutar", rationaleLabel: "Gerekçe" },
    benchmarks: {
      description:
        "Önemlilik belirlemesi için kullanılan kıyaslama tutarlarını yapılandırın ve karşılaştırın.",
      emptyTitle: "Kıyaslama yok",
      emptyDescription: "Genel önemlilik belirlemesi için kıyaslamalar ekleyin.",
    },
    calculations: {
      description: "Kaydedilen önemlilik hesaplamalarını ve manuel geçersiz kılmaları inceleyin.",
      emptyTitle: "Hesaplama kaydedilmedi",
      emptyDescription: "Kıyaslamalar uygulandığında hesaplamalar burada görünür.",
    },
    comments: { emptyDescription: "Yorumlar eklendikten sonra burada görünür." },
    history: {
      emptyDescription:
        "Değişiklikler kaydedildikçe önemlilik etkinliği burada görünecek.",
      actions: {
        "materiality.created": "Önemlilik paketi oluşturuldu",
        "materiality.updated": "Önemlilik paketi güncellendi",
        "materiality.archived": "Önemlilik paketi arşivlendi",
        "materiality.restored": "Önemlilik paketi geri yüklendi",
        "materiality.submitted": "Önemlilik paketi gönderildi",
        "materiality.returned": "Önemlilik paketi iade edildi",
        "materiality.approved": "Önemlilik paketi onaylandı",
      },
    },
    states: {
      permissionDescription: "Bu işlemi gerçekleştirmek için izniniz yok.",
    },
  },
};

const tokenMap = {
  az: {
    TƏSDİQ: "Təsdiq",
    TƏQDİL: "Təsdiq",
    TƏSQİQ: "Təsdiq",
    MATERİALİYET: "Mahiyyətllik",
    yoxlama: "Yoxlama",
    ŞƏRHLƏR: "Yoxlama",
  },
  ru: {
    УТВЕРЖДЕНИЕ: "Утверждение",
    УТВЕРЖДЕНИЯ: "Утверждения",
    МАТЕРИАЛЬНОСТЬ: "Существенность",
    МАТЕРИАЛЬНОСТИ: "Существенности",
    ОБЗОР: "Проверка",
    ПРОСМОТР: "Проверка",
  },
  tr: {
    ONAY: "Onay",
    İNCELEME: "İnceleme",
    MALZEME: "Önemlilik",
    Malzeme: "Önemlilik",
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
  const mat = data.materiality;
  if (!mat) {
    console.warn(`No materiality in ${locale}`);
    continue;
  }

  const calc = mat.calculator ?? {};
  for (const [wrong, right] of Object.entries(corruptedKeyFixes[locale] ?? {})) {
    if (wrong in calc) {
      calc[right] = calc[wrong];
      delete calc[wrong];
    }
  }
  mat.calculator = calc;

  for (const key of deleteKeys[locale] ?? []) {
    delete mat.workspace?.[key];
  }

  deepAssign(mat, localePatches[locale]);
  if (mat.workspace?.commandCenter) {
    Object.assign(mat.workspace.commandCenter, commandCenterPatches[locale]);
  }

  walkStrings(mat, locale, stripTokens);

  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Patched materiality in ${locale}.json`);
}

const enPath = path.join(messagesDir, "en.json");
const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
en.materiality.calculator.savedAmountLabel = "Saved";
fs.writeFileSync(enPath, `${JSON.stringify(en, null, 2)}\n`, "utf8");
console.log("Added savedAmountLabel to en.json");
