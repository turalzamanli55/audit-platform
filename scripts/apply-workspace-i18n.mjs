import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const messagesDir = path.join(root, "src/i18n/messages");

/** Embedded professional audit translations for workspace command centers and related keys. */
const EMBEDDED_PATCHES = {
  "az": {
    "companies": {
      "workspace": {
        "commandCenter": {
          "heroTitle": "Şirkət idarəetmə mərkəzi",
          "heroSubtitle": "Müsadirə sağlamlığı, uyğunluq vəziyyəti və bu subyekt üzrə audit gedişatı.",
          "healthTitle": "Şirkət sağlamlığı",
          "executiveTitle": "İcra icmalı",
          "moduleProgressTitle": "Audit modul gedişatı",
          "moduleProgressDescription": "Şirkət müsadirələri üzrə planlaşdırma, mahiyyətllik, risk və sahə işi.",
          "activeEngagementsTitle": "Aktiv müsadirələr",
          "activeEngagementsDescription": "Bu şirkət üçün davam edən audit və təminat işləri.",
          "recentActivityTitle": "Son fəaliyyət",
          "recentActivityDescription": "Bu şirkət üçün qeydə alınan son dəyişikliklər.",
          "recentDocumentsTitle": "Son sənədlər",
          "recentDocumentsDescription": "Şirkət müsadirələrinə əlavə edilmiş planlaşdırma sənədləri.",
          "recentCommentsTitle": "Son şərhlər",
          "recentCommentsDescription": "Mahiyyətllik və risk iş sahələrindən yoxlama qeydləri.",
          "financialTitle": "Maliyyə icmalı",
          "financialDescription": "Hesabat çərçivəsi, valyuta və maliyyə ili konfiqurasiyası.",
          "complianceTitle": "Uyğunluq statusu",
          "complianceDescription": "Tənzimləyici vəziyyət və validasiya hazırlığı.",
          "deadlinesTitle": "Yaxınlaşan son tarixlər",
          "deadlinesDescription": "Aktiv müsadirələr üçün hesabat dövrünün sonu.",
          "teamTitle": "Təyin edilmiş komanda",
          "teamDescription": "Şirkət auditləri üzrə müsadirə komanda üzvləri.",
          "pendingReviewsTitle": "Gözləyən yoxlamalar",
          "pendingReviewsHint": "Təsdiq gözləyən planlaşdırma, mahiyyətllik, risk və sahə işi.",
          "kpiHealth": "Sağlamlıq",
          "kpiActiveEngagements": "Aktiv müsadirələr",
          "kpiPendingReviews": "Gözləyən yoxlamalar",
          "kpiOpenFindings": "Açıq nəticələr",
          "kpiOverdue": "Gecikmiş",
          "kpiPlanningProgress": "Planlaşdırma",
          "kpiFieldworkProgress": "Sahə işi",
          "kpiTeamMembers": "Komanda üzvləri",
          "hintHealth": "Ümumi iş sahəsi vəziyyəti",
          "hintEngagements": "Bu şirkət üçün davam edən",
          "hintReviews": "Təsdiq gözləyir",
          "hintFindings": "Həll edilməmiş sahə işi maddələri",
          "hintOverdue": "Dövr sonu keçib",
          "hintPlanning": "Orta yoxlama siyahısı gedişatı",
          "hintFieldwork": "Orta icra gedişatı",
          "hintTeam": "Müsadirələr üzrə",
          "healthOnTrack": "Normal gedişat",
          "healthMonitor": "Monitorinq",
          "healthAttention": "Diqqət tələb edir",
          "modulePlanning": "Planlaşdırma",
          "moduleMateriality": "Mahiyyətllik",
          "moduleRisk": "Risk qiymətləndirilməsi",
          "moduleFieldwork": "Sahə işi",
          "statusActive": "Aktiv",
          "statusReview": "Yoxlamada",
          "statusNotStarted": "Başlanmayıb",
          "pendingReview": "Yoxlama gözləyir",
          "complianceValidated": "Validasiya edilib",
          "compliancePending": "Validasiya gözləyir",
          "complianceStatus": "Vəziyyət",
          "jurisdiction": "Yurisdiksiya",
          "activeEngagementsLabel": "Aktiv müsadirələr",
          "framework": "Çərçivə",
          "currency": "Valyuta",
          "fiscalYear": "Maliyyə ili sonu",
          "entityType": "Subyekt növü",
          "industry": "Sənaye",
          "viewFinancial": "Maliyyə profilinə bax",
          "viewCompliance": "Uyğunluğa bax",
          "overdue": "Gecikmiş",
          "engagementCount": "{count} müsadirə",
          "actionViewEngagements": "Müsadirələrə bax",
          "actionCreateEngagement": "Müsadirə yarat",
          "actionOpenPlanning": "Planlaşdırmanı aç",
          "actionOpenRisk": "Riski aç",
          "actionOpenFieldwork": "Sahə işini aç",
          "actionOpenMateriality": "Mahiyyətlliyi aç",
          "emptyEngagements": "Müsadirə yoxdur",
          "emptyEngagementsDescription": "Bu şirkət üçün audit işinə başlamaq üçün müsadirə yaradın.",
          "emptyActivity": "Son fəaliyyət yoxdur",
          "emptyActivityDescription": "Şirkət dəyişiklikləri fəaliyyət xəttində görünəcək.",
          "emptyDocuments": "Sənəd yoxdur",
          "emptyDocumentsDescription": "Planlaşdırma sənədləri əlavə edildikcə görünəcək.",
          "emptyComments": "Şərh yoxdur",
          "emptyCommentsDescription": "Yoxlama şərhləri mahiyyətllik və riskdən görünəcək.",
          "emptyDeadlines": "Yaxınlaşan son tarix yoxdur",
          "emptyDeadlinesDescription": "Müsadirə dövr sonları burada görünəcək.",
          "emptyTeam": "Komanda təyin edilməyib",
          "emptyTeamDescription": "Komanda üzvləri şirkət müsadirələrinə əlavə edildikcə görünür.",
          "activityCreated": "Şirkət yaradılıb",
          "activityUpdated": "Şirkət yenilənib",
          "activitySettings": "Parametrlər yenilənib",
          "activityArchived": "Şirkət arxivlənib",
          "activityRestored": "Şirkət bərpa edilib",
          "activityGeneric": "Şirkət audit izində qeydə alınıb"
        },
        "heroEyebrow": "Şirkət iş sahəsi",
        "sections": {
          "overview": {
            "title": "İcmal",
            "description": "Bu şirkətin hesabat identifikasiyasının sakit icmalı.",
            "highlightsTitle": "Əsas məqamlar",
            "highlightsDescription": "Kontekst və təsnifat bir baxışda.",
            "noDescription": "Hələ şirkət təsviri əlavə edilməyib."
          },
          "identity": {
            "title": "Identifikasiya"
          },
          "financial": {
            "title": "Maliyyə",
            "description": "Hesabat çərçivəsi, valyuta və maliyyə ili konfiqurasiyası.",
            "cardTitle": "Maliyyə hesabatı profili",
            "cardDescription": "Subyektin maliyyə parametrlərinin yalnız oxuma görünüşü."
          },
          "compliance": {
            "title": "Uyğunluq",
            "description": "Müsadirələr, bəyanatlar və tənzimləyici vəziyyət.",
            "emptyTitle": "Uyğunluq konfiqurasiya edilməyib",
            "emptyDescription": "Müsadirələr və öhdəliklər konfiqurasiya edildikdən sonra uyğunluq izləməsi burada görünəcək."
          },
          "contacts": {
            "title": "Əlaqələr",
            "description": "Bu subyekt üçün maliyyə və xarici auditor əlaqələri.",
            "emptyTitle": "Faylda əlaqə yoxdur",
            "emptyDescription": "Əsas maliyyə və auditor əlaqələri əlavə edildikcə burada görünəcək.",
            "financeEmptyTitle": "Maliyyə əlaqəsi yoxdur",
            "financeEmptyDescription": "Bu şirkət üçün əsas maliyyə əlaqəsi qeydə alınmayıb.",
            "auditorEmptyTitle": "Auditor əlaqəsi yoxdur",
            "auditorEmptyDescription": "Bu şirkət üçün xarici auditor əlaqəsi qeydə alınmayıb."
          },
          "history": {
            "title": "Tarixçə",
            "description": "Bu şirkət üçün xronoloji fəaliyyət və audit izi.",
            "emptyTitle": "Hələ fəaliyyət yoxdur",
            "emptyDescription": "Platformada dəyişikliklər qeydə alındıqca fəaliyyət tarixçəsi burada görünəcək."
          },
          "settings": {
            "title": "Parametrlər",
            "description": "Bu şirkət iş sahəsi üçün konfiqurasiya icmalı.",
            "configurationTitle": "Konfiqurasiya",
            "configurationDescription": "Bu subyekt üçün seçimlər və versiyalaşdırma.",
            "addressesTitle": "Ünvanlar",
            "addressesDescription": "Faylda qeydə alınmış qeydiyyat və fəaliyyət ünvanları.",
            "registeredAddress": "Qeydiyyat ünvanı",
            "operatingAddress": "Fəaliyyət ünvanı",
            "defaultLocale": "Standart dil",
            "dataImportSource": "Məlumat idxal mənbəyi",
            "roundingConvention": "Yuvarlaqlaşdırma qaydası",
            "recordVersion": "Qeyd versiyası",
            "settingsVersion": "Parametr versiyası",
            "validationTitle": "Validasiya",
            "validationDescription": "Şirkət parametrləri üçün sxem validasiya metadatası.",
            "schemaVersion": "Sxem versiyası",
            "validatedAt": "Son validasiya"
          }
        }
      }
    },
    "engagements": {
      "workspace": {
        "commandCenter": {
          "heroTitle": "Audit komanda mərkəzi",
          "overallCompletion": "Ümumi tamamlama",
          "executiveTitle": "İcra xülasəsi",
          "auditHealthTitle": "Sağlamlığı yoxlayın",
          "auditMetricsTitle": "Audit ölçüləri",
          "pipelineTitle": "Audit mərhələsi boru kəməri",
          "pipelineDescription": "[[PLANLAŞMA]] tamamlama vasitəsilə — hər bir mərhələ üçün status, irəliləyiş və naviqasiya.",
          "reviewQueueTitle": "yoxlama növbə",
          "reviewQueueDescription": "Partnyor və ya menecerin imzalanmasını gözləyən elementlər.",
          "outstandingTitle": "Qarşıda duran məsələlər",
          "outstandingDescription": "Tapıntılar və həll tələb edən açıq maddələr.",
          "activityTitle": "Son fəaliyyət",
          "activityDescription": "Bu müsadirə üzrə son dəyişikliklər.",
          "timelineTitle": "Audit qrafiki",
          "timelineDescription": "Xronoloji müsadirə hadisələri.",
          "documentsTitle": "Son sənədlər",
          "documentsDescription": "planlaşdırma sənədləri bu [[NAGAGEMENT]]-ə əlavə edilmişdir.",
          "teamTitle": "Təyin olunmuş komanda",
          "teamDescription": "müsadirə komanda üzvləri və rolları.",
          "decisionsTitle": "Son qərarlar",
          "decisionsDescription": "[[TƏSQİQ]]lar və bu [[NAGAGEMENT]] üçün qeydiyyatdan keçmələr qeydə alınıb.",
          "commentsTitle": "Son şərhlər",
          "commentsDescription": "yoxlama qeydlər mahiyyətlilik və riskli iş yerləri.",
          "companyHealthTitle": "Şirkət sağlamlığı",
          "companyHealthDescription": "Müştəri qurumunun yoxlanılması və hesabat vermə mövqeyi.",
          "phaseReview": "[[YƏZLƏ]]",
          "phaseCompletion": "Tamamlama",
          "statusReview": "yoxlama-də",
          "statusClear": "Təmiz",
          "openReviewQueue": "yoxlama növbəsini açın",
          "openSettings": "müsadirə parametrləri",
          "owner": "Sahib",
          "lastUpdate": "Yenilənib",
          "overdue": "Vaxtı keçmiş",
          "deadline": "Son tarix",
          "reportingPeriod": "Hesabat dövrü",
          "plannedSchedule": "Planlaşdırılmış cədvəl",
          "validationStatus": "Doğrulama",
          "framework": "Çərçivə",
          "jurisdiction": "Yurisdiksiya",
          "viewHistory": "Tam tarixçəyə baxın",
          "kpiAuditHealth": "Sağlamlığı yoxlayın",
          "kpiCompletion": "Tamamlama",
          "kpiPendingReviews": "Gözlənir [[yoxlama]]",
          "kpiOpenFindings": "Tapıntıları açın",
          "kpiLifecycle": "Həyat dövrü",
          "kpiPlanning": "[[PLANLAŞMA]]",
          "kpiFieldwork": "[[SAHA İŞİ]]",
          "kpiTeam": "Komanda",
          "kpiMateriality": "[[MATERİALİYET]]",
          "kpiRisk": "Risk qiymətləndirilməsi",
          "kpiProcedures": "Prosedurlar",
          "kpiSignificantRisks": "Əhəmiyyətli risklər",
          "hintAuditHealth": "müsadirə duruş",
          "hintCompletion": "Bütün mərhələlərdə çəkisi",
          "hintReviews": "İmzalanmanı gözləyir",
          "hintFindings": "sahə işi tapıntılarını açın",
          "hintLifecycle": "Cari mərhələ",
          "hintPlanning": "Yoxlama siyahısı tərəqqi",
          "hintFieldwork": "İcra tərəqqisi",
          "hintTeam": "Təyin edilmiş üzvlər",
          "hintMateriality": "ISA 320 tərəqqi",
          "hintRisk": "Qiymətləndirmənin tərəqqisi",
          "hintProcedures": "Ümumi prosedurlar",
          "hintSignificant": "Müəyyən edilmiş əhəmiyyətli risklər",
          "healthOnTrack": "Yolda",
          "healthMonitor": "Monitorinq",
          "healthAttention": "Diqqət lazımdır",
          "modulePlanning": "[[PLANLAŞMA]]",
          "moduleMateriality": "[[MATERİALİYET]]",
          "moduleRisk": "Risk qiymətləndirilməsi",
          "issueFindings": "Tapıntıları açın",
          "issueRiskItems": "Açıq riskli maddələr",
          "issueMaterialityItems": "mahiyyətlilik elementi açın",
          "companyValidated": "Təsdiqlənmişdir",
          "companyPending": "Doğrulama gözlənilir",
          "decisionPlanningApproved": "planlaşdırma təsdiq edildi",
          "decisionMaterialityApproved": "mahiyyətlilik təsdiq edildi",
          "decisionRiskApproved": "risk qiymətləndirilməsi təsdiq edildi",
          "emptyActivity": "Son fəaliyyət yoxdur",
          "emptyActivityDescription": "müsadirə tədbirlər burada görünəcək.",
          "emptyTimeline": "Heç bir zaman qrafiki tədbirləri yoxdur",
          "emptyTimelineDescription": "İş irəlilədikcə fəaliyyət qeyd olunacaq.",
          "emptyDocuments": "Sənəd yoxdur",
          "emptyDocumentsDescription": "[[PLANLAŞMA]] sənədləri burada görünəcək.",
          "emptyTeam": "Komanda təyin edilməyib",
          "emptyTeamDescription": "Bu müsadirə-i işə başlamaq üçün üzvləri əlavə edin.",
          "emptyDecisions": "Qərarlar qeydə alınmayıb",
          "emptyDecisionsDescription": "[[TƏSQİQ]]lar hesabdan çıxdıqdan sonra görünəcək.",
          "emptyComments": "Şərh yoxdur",
          "emptyCommentsDescription": "yoxlama şərhlər modul iş yerlərindən görünəcək."
        },
        "heroEyebrow": "Müsadirə iş sahəsi",
        "sections": {
          "overview": {
            "title": "İcmal",
            "description": "Bu müsadirənin sakit icmal görüntüsü.",
            "highlightsTitle": "Əsas məqamlar",
            "highlightsDescription": "Kontekst və status bir baxışda.",
            "noDescription": "Hələ müsadirə təsviri əlavə edilməyib."
          },
          "members": {
            "title": "Üzvlər"
          },
          "history": {
            "title": "Tarixçə",
            "description": "Bu müsadirə üçün xronoloji fəaliyyət və audit izi.",
            "emptyTitle": "Hələ fəaliyyət yoxdur",
            "emptyDescription": "Dəyişikliklər qeydə alındıqca fəaliyyət tarixçəsi burada görünəcək."
          },
          "settings": {
            "title": "Parametrlər",
            "description": "Bu müsadirə üçün konfiqurasiya və həyat dövrü idarəetməsi."
          }
        }
      }
    },
    "planning": {
      "workspace": {
        "commandCenter": {
          "heroTitle": "[[PLANLAŞMA]] komanda mərkəzi",
          "executiveTitle": "İcra xülasəsi",
          "healthTitle": "[[PLANLAŞMA]] sağlamlıq",
          "metricsTitle": "planlaşdırma göstəriciləri",
          "workflowTitle": "[[TƏSDİQ]] iş axını",
          "workflowDescription": "İnteqrasiya edilmiş qaralama — cari addım vurğulanıb.",
          "reviewQueueTitle": "yoxlama növbə",
          "reviewQueueDescription": "planlaşdırma paketləri partnyor və ya menecerin qeydiyyatdan keçməsini gözləyir.",
          "checklistTitle": "planlaşdırma yoxlama siyahısı",
          "checklistDescription": "sahə işi-dan əvvəl tələb olunan əsas çıxışlar.",
          "outstandingTitle": "Görkəmli vəzifələr",
          "outstandingDescription": "Tamamlanması tələb olunan yoxlama siyahısı elementlərini açın.",
          "activityTitle": "Son fəaliyyət",
          "activityDescription": "Bu audit planına edilən son dəyişikliklər.",
          "changesTitle": "Son dəyişikliklər",
          "changesDescription": "Yeniləmələr, təqdimatlar və [[TƏQDİL]]lər.",
          "calendarTitle": "planlaşdırma təqvimi",
          "calendarDescription": "müsadirə üzrə mühüm mərhələdir.",
          "documentsTitle": "[[PLANLAŞMA]] sənədləri",
          "documentsDescription": "Memorandumlar və dəstəkləyici istinadlar.",
          "notesTitle": "planlaşdırma qeydləri",
          "notesDescription": "Daxili [[PLANLAŞMA]] kontekst və mühakimə.",
          "teamTitle": "Təyin olunmuş komanda",
          "teamDescription": "müsadirə siyahısı və tutum.",
          "stepDraft": "Qaralama",
          "stepSubmitted": "Təqdim edildi",
          "stepUnderReview": "yoxlama altında",
          "stepReturned": "Qayıtdı",
          "stepApproved": "Təsdiq edildi",
          "stepIntegrated": "İnteqrasiya edilmiş",
          "overdue": "Vaxtı keçmiş",
          "deadline": "Son tarix",
          "complete": "Bitdi",
          "open": "Açıq",
          "openWorkflow": "yoxlama iş axını",
          "viewHistory": "Tam tarixçəyə baxın",
          "viewNotes": "planlaşdırma qeydlərinə baxın",
          "estimatedHours": "Təxmini saatlar",
          "planVersion": "Versiya",
          "kpiHealth": "Sağlamlıq",
          "kpiProgress": "Tərəqqi",
          "kpiChecklist": "Yoxlama siyahısı",
          "kpiWorkflow": "İş axını",
          "kpiStatus": "Vəziyyət",
          "kpiFramework": "Çərçivə",
          "kpiOpenItems": "Açıq maddələr",
          "kpiDocuments": "Sənədlər",
          "kpiMateriality": "[[MATERİALİYET]]",
          "kpiRisk": "Risk qiymətləndirilməsi",
          "kpiComments": "Şərhlər",
          "kpiTeam": "Komanda",
          "hintHealth": "planlaşdırma duruş",
          "hintProgress": "Ümumi tamamlama",
          "hintChecklist": "Çatdırılan yoxlama siyahısı",
          "hintWorkflow": "[[TƏSQİQ]] vəziyyəti",
          "hintFramework": "Hesabat standartı",
          "hintOpenItems": "Natamam yoxlama siyahısı",
          "hintDocuments": "Faylda",
          "hintMateriality": "İnteqrasiya hazırlığı",
          "hintRisk": "İnteqrasiya hazırlığı",
          "hintComments": "yoxlama qeydlər",
          "hintTeam": "Təyin edilmiş üzvlər",
          "healthOnTrack": "Yolda",
          "healthMonitor": "Monitorinq",
          "healthAttention": "Diqqət lazımdır",
          "emptyChecklist": "Yoxlama siyahısı elementləri yoxdur",
          "emptyChecklistDescription": "Yoxlama siyahısı elementləri planlaşdırma yaradıldıqda görünəcək.",
          "emptyOutstanding": "Görkəmli tapşırıq yoxdur",
          "emptyOutstandingDescription": "Bütün yoxlama siyahısı maddələri tamamlandı.",
          "emptyActivity": "Son fəaliyyət yoxdur",
          "emptyActivityDescription": "planlaşdırma tədbirlər burada görünəcək.",
          "emptyChanges": "Son dəyişikliklər yoxdur",
          "emptyChangesDescription": "Yeniləmələr fəaliyyət cığırında qeyd olunacaq.",
          "emptyTimeline": "Heç bir mərhələ yoxdur",
          "emptyTimelineDescription": "Zaman qrafiki bölməsində vaxt qrafiki tarixləri əlavə edin.",
          "emptyDocuments": "Sənəd yoxdur",
          "emptyDocumentsDescription": "planlaşdırma sənəd istinadlarını əlavə edin.",
          "emptyNotes": "planlaşdırma qeydi yoxdur",
          "emptyNotesDescription": "Qeydlər bölməsində [[PLANLAŞMA]] qərarını sənədləşdirin.",
          "emptyTeam": "Komanda təyin edilməyib",
          "emptyTeamDescription": "İşçilərin işə başlaması üçün müsadirə üzvlərini təyin edin."
        },
        "navGroups": {
          "content": "Planlaşdırma məzmunu",
          "integrations": "İnteqrasiyalar",
          "execution": "İcra",
          "admin": "İdarəetmə"
        },
        "heroEyebrow": "Audit planlaşdırması",
        "sections": {
          "overview": {
            "title": "Planlaşdırma idarə paneli",
            "description": "Planlaşdırma statusu, hazırlıq və əsas göstəricilərin icmalı."
          },
          "strategy": {
            "title": "Audit strategiyası",
            "description": "Ümumi audit yanaşmasını və əhəmiyyətli məsələləri sənədləşdirin."
          },
          "objectives": {
            "title": "Müsadirə məqsədləri",
            "description": "Əsas təminat məqsədini və rəy əhatə dairəsini bəyan edin."
          },
          "scope": {
            "title": "Audit əhatə dairəsi",
            "description": "Maliyyə dövrlərini, müəssisələri və əhatədə olan hesabatları müəyyən edin."
          },
          "framework": {
            "title": "Maliyyə hesabatı çərçivəsi",
            "description": "Bu müsadirə üçün tətbiq olunan hesabat çərçivəsini təsdiqləyin."
          },
          "materiality": {
            "title": "Mahiyyətllik",
            "description": "Mahiyyətllik idarəetməsi üçün inteqrasiyaya hazır müvəqqəti yer."
          },
          "risk": {
            "title": "Risk qiymətləndirilməsi",
            "description": "Risk qiymətləndirilməsi üçün inteqrasiyaya hazır müvəqqəti yer."
          },
          "team": {
            "title": "Komanda planlaşdırması",
            "description": "Müsadirə komandasının siyahısını və tutum planlaşdırmasını nəzərdən keçirin."
          },
          "timeline": {
            "title": "Zaman xətti",
            "description": "Planlaşdırma, sahə işi və yoxlama üzrə mərhələ tarixlərini planlaşdırın."
          },
          "notes": {
            "title": "Planlaşdırma qeydləri",
            "description": "Daxili planlaşdırma qeydləri və iş konteksti."
          },
          "checklist": {
            "title": "Planlaşdırma yoxlama siyahısı",
            "description": "Əsas planlaşdırma nəticələrinin tamamlanmasını izləyin."
          },
          "documents": {
            "title": "Planlaşdırma sənədləri",
            "description": "Planlaşdırma memorandumları və dəstək sənədləri."
          },
          "history": {
            "title": "Planlaşdırma tarixçəsi",
            "description": "Bu audit planı üçün fəaliyyət və versiya tarixçəsi."
          },
          "settings": {
            "title": "Planlaşdırma parametrləri",
            "description": "Bu planlaşdırma qeydini arxivləyin və ya bərpa edin."
          }
        }
      }
    },
    "fieldwork": {
      "workspace": {
        "commandCenter": {
          "heroTitle": "Auditin icrası üzrə komanda mərkəzi",
          "executiveTitle": "İcra xülasəsi",
          "executionTitle": "İcra tərəqqisi",
          "kpisTitle": "[[SAHA İşi]] KPI-lar",
          "workflowTitle": "İcra iş prosesi",
          "workflowDescription": "Tamamlanmışdan başlamadı - cari addım vurğulandı.",
          "reviewQueueTitle": "yoxlama növbə",
          "reviewQueueDescription": "[[YƏZLƏ]] və ya rəsmiləşdirməni gözləyən prosedurlar.",
          "procedureProgressTitle": "Prosedurun gedişi",
          "procedureProgressDescription": "Prosedur icra statusuna görə hesablanır.",
          "paperProgressTitle": "iş vərəqi tərəqqi",
          "paperProgressDescription": "iş vərəqi sənəd statusuna görə hesablanır.",
          "evidenceStatusTitle": "[[DƏLİL]] statusu",
          "evidenceStatusDescription": "Doğrulama statusuna görə [[DƏLİL]] element.",
          "outstandingTitle": "Görkəmli prosedurlar",
          "outstandingDescription": "Prosedurlar hələ tamamlanmayıb və ya təmizlənməyib.",
          "findingsTitle": "Tapıntıları açın",
          "findingsDescription": "Həll edilməsini tələb edən səhvlər və çatışmazlıqlar.",
          "severityTitle": "Şiddət paylanması",
          "severityDescription": "Nəticələr şiddət təsnifatına görə qruplaşdırılmışdır.",
          "assignedWorkTitle": "Təyin olunmuş iş",
          "assignedWorkDescription": "Təyin edilmiş auditorlarla prosedurlar və son tarixlər.",
          "workingPapersTitle": "iş vərəqləri",
          "workingPapersDescription": "Sənədlər, işarələr və nəticələr.",
          "recentDocumentsTitle": "Son sənədlər",
          "recentDocumentsDescription": "Faylda ən son iş vərəqləri.",
          "evidenceTitle": "[[DƏLİL]] qeydiyyatdan keçin",
          "evidenceDescription": "İndekslənmiş audit [[DƏLİL]] və əlavələr.",
          "timelineTitle": "İcra qrafiki",
          "timelineDescription": "Son tarixlər və son sahə işi mərhələləri.",
          "reviewNotesTitle": "yoxlama qeydlər",
          "reviewNotesDescription": "yoxlamaşərhlər və icazələrin izlənməsi.",
          "commentsTitle": "Daxili şərhlər",
          "commentsDescription": "sahə işi icrası zamanı komanda müzakirəsi.",
          "activityTitle": "Son fəaliyyət",
          "activityDescription": "Ən son sahə işi iş məkanı hadisələri.",
          "stepNotStarted": "Başlanmayıb",
          "stepInProgress": "Davam edir",
          "stepSubmitted": "Təqdim edildi",
          "stepReturned": "Qayıtdı",
          "stepReviewCleared": "yoxlama silindi",
          "stepCompleted": "Tamamlandı",
          "programVersion": "Proqram versiyası",
          "lastUpdate": "Son yeniləmə",
          "viewHistory": "Tam tarixçəyə baxın",
          "complete": "tam",
          "coverage": "əhatə",
          "assigned": "Təyin edilmişdir",
          "unassigned": "Təyin edilmədi",
          "unspecified": "Müəyyən edilməmiş",
          "notSet": "Qurulmayıb",
          "kpiHealth": "sahə işi sağlamlıq",
          "kpiProgress": "İcra tərəqqisi",
          "kpiProcedures": "Prosedurlar",
          "kpiWorkingPapers": "iş vərəqləri",
          "kpiEvidence": "[[DƏLİT]]",
          "kpiOpenFindings": "Tapıntıları açın",
          "kpiResolvedFindings": "Həll edilmiş tapıntılar",
          "kpiPendingReview": "Gözlənir [[yoxlama]]",
          "kpiOutstanding": "Görkəmli prosedurlar",
          "kpiAuditors": "Təyin olunmuş auditorlar",
          "kpiOpenNotes": "Açıq qeydlər",
          "kpiReviewNotes": "yoxlama qeydlər",
          "kpiStatus": "Paket statusu",
          "kpiTickmarks": "İşarələr",
          "kpiComments": "Şərhlər",
          "kpiProgram": "Audit proqramı",
          "kpiGroups": "Prosedur qrupları",
          "kpiLastUpdate": "Son yeniləmə",
          "hintHealth": "İcra duruşu",
          "hintProgress": "Ümumi tamamlama",
          "hintProcedures": "Tam vs cəmi",
          "hintOpenFindings": "Qətnamə tələb edir",
          "hintResolvedFindings": "Bağlanıb və ya həll olunub",
          "hintPendingReview": "Təmizləməni gözləyir",
          "hintOutstanding": "Natamam prosedurlar",
          "hintAuditors": "Unikal təyinatlar",
          "hintOpenNotes": "Sənədlərin hazırlanması",
          "hintReviewNotes": "yoxlamaşərh",
          "hintTickmarks": "Tətbiq edilmiş işarələr",
          "hintComments": "Komanda müzakirəsi",
          "hintProgram": "Proqramın həyat dövrü",
          "hintGroups": "Audit sahələri",
          "hintLastUpdate": "Ən son dəyişiklik",
          "healthOnTrack": "Yolda",
          "healthMonitor": "Monitorinq",
          "healthAttention": "Diqqət lazımdır",
          "emptyReviewQueue": "yoxlama növbə boşdur",
          "emptyReviewQueueDescription": "Gözləyən heç bir prosedur yoxdur [[ŞƏRHLƏR]].",
          "emptyOutstanding": "Gözlənilməmiş prosedurlar yoxdur",
          "emptyOutstandingDescription": "Bütün prosedurlar tamamlandı və ya təmizləndi.",
          "emptyFindings": "Açıq tapıntı yoxdur",
          "emptyFindingsDescription": "Açıq tapıntılar sənədləşdirildikdə görünəcək.",
          "emptySeverity": "Tapıntı yoxdur",
          "emptySeverityDescription": "Şiddət bölgüsü tapıntılar mövcud olduqda görünür.",
          "emptyAssigned": "Təyin olunmuş iş yoxdur",
          "emptyAssignedDescription": "İcraya başlamaq üçün auditorları prosedurlara təyin edin.",
          "emptyPapers": "iş vərəqləri yoxdur",
          "emptyPapersDescription": "Audit işini sənədləşdirməyə iş vərəqləri əlavə edin.",
          "emptyDocuments": "Son sənədlər yoxdur",
          "emptyDocumentsDescription": "iş vərəqləri yaradıldıqca görünəcək.",
          "emptyEvidence": "Yox [[DƏLİL]]",
          "emptyEvidenceDescription": "Dəstək prosedurları üçün [[DƏLİL]] yükləyin.",
          "emptyTimeline": "Heç bir zaman qrafiki tədbirləri yoxdur",
          "emptyTimelineDescription": "Son tarixlər və fəaliyyət burada görünəcək.",
          "emptyReviewNotes": "yoxlama qeyd yoxdur",
          "emptyReviewNotesDescription": "yoxlama qeydlər rəsmiləşdirmə zamanı görünür.",
          "emptyComments": "Şərh yoxdur",
          "emptyCommentsDescription": "Daxili şərhlər sahə işi zamanı çəkilir.",
          "emptyActivity": "Fəaliyyət yoxdur",
          "emptyActivityDescription": "sahə işi hadisələri burada qeyd olunacaq."
        },
        "navGroups": {
          "overview": "İdarə paneli",
          "program": "Proqram",
          "execution": "İcra",
          "documentation": "Sənədləşdirmə",
          "governance": "Nəzarət",
          "admin": "İdarəetmə"
        },
        "heroEyebrow": "Audit sahə işi",
        "sections": {
          "overview": {
            "title": "Sahə işi idarə paneli",
            "description": "Gedişat, təyinatlar və icra göstəriciləri."
          },
          "program": {
            "title": "Audit proqramı",
            "description": "Prosedur icrasını idarə edən təsdiqlənmiş proqram versiyası."
          },
          "procedure-groups": {
            "title": "Prosedur qrupları",
            "description": "Qruplaşdırılmış audit sahələri və tamamlanma gedişatı."
          },
          "procedures": {
            "title": "Audit prosedurları",
            "description": "Status izləmə ilə audit işinin təyin edilə bilən vahidləri."
          },
          "working-papers": {
            "title": "İş vərəqləri",
            "description": "Sənədləşdirmə, işarələr və nəticələr."
          },
          "evidence": {
            "title": "Sübut reyestri",
            "description": "İndekslənmiş audit sübutları və əlavələr."
          },
          "findings": {
            "title": "Nəticələr",
            "description": "Səhv göstərmələr, çatışmazlıqlar və tövsiyələr."
          },
          "notes": {
            "title": "Auditor qeydləri",
            "description": "Hazırlayan sənədləşdirməsi və peşəkar mühakimə."
          },
          "review-notes": {
            "title": "Yoxlama qeydləri",
            "description": "Yoxlayıcı şərhləri və təmizləmə izləməsi."
          },
          "comments": {
            "title": "Daxili şərhlər",
            "description": "Sahə işi zamanı qeydə alınan komanda müzakirəsi."
          },
          "history": {
            "title": "Sahə işi tarixçəsi",
            "description": "Xronoloji fəaliyyət və audit izi."
          },
          "settings": {
            "title": "Sahə işi parametrləri",
            "description": "Bu sahə işi paketini arxivləyin və ya bərpa edin."
          }
        }
      }
    },
    "riskAssessment": {
      "workspace": {
        "commandCenter": {
          "heroTitle": "Müəssisə riski komanda mərkəzi",
          "executiveTitle": "Risk reytinqləri",
          "summaryTitle": "Risk xülasəsi",
          "metricsTitle": "Qiymətləndirmə ölçüləri",
          "kpisTitle": "Risk KPI-ləri",
          "workflowTitle": "[[TƏSDİQ]] iş axını",
          "workflowDescription": "İnteqrasiya edilmiş qaralama — cari addım vurğulanıb.",
          "reviewQueueTitle": "yoxlama növbə",
          "reviewQueueDescription": "risk qiymətləndirilməsis partnyor və ya menecerin qeydiyyatdan çıxmasını gözləyir.",
          "heatmapTitle": "Risk istilik xəritəsi",
          "heatmapDescription": "Təsdiq səviyyəli risk reytinqlərinin paylanması.",
          "matrixTitle": "Risk matrisi",
          "matrixDescription": "Hesab və təsdiqləmə riski reytinqləri pyoxlama.",
          "distributionTitle": "Kateqoriya paylanması",
          "distributionDescription": "Konfiqurasiya edilmiş kateqoriyalara görə qruplaşdırılmış risk elementləri.",
          "significantTitle": "Əhəmiyyətli risklər",
          "significantDescription": "Fokuslanmış audit reaksiyası tələb edən yüksək prioritet risklər.",
          "openResponsesTitle": "Açıq cavablar",
          "openResponsesDescription": "Sənədləşdirilmiş cavablar olmadan risk maddələri.",
          "outstandingProceduresTitle": "Görkəmli prosedurlar",
          "outstandingProceduresDescription": "Əlaqədar prosedurlar olmadan əhəmiyyətli risklər.",
          "responsesTitle": "Risk cavabları",
          "responsesDescription": "Müəyyən edilmiş risklərə sənədləşdirilmiş cavablar.",
          "proceduresTitle": "Əlaqədar prosedurlar",
          "proceduresDescription": "Risk maddələri ilə əlaqəli audit prosedurları.",
          "reviewNotesTitle": "yoxlama qeydlər",
          "reviewNotesDescription": "Tərəfdaş və menecer yoxlama şərhi.",
          "commentsTitle": "Şərhlər",
          "commentsDescription": "risk qiymətləndirilməsi üzrə daxili əməkdaşlıq qeydləri.",
          "recentChangesTitle": "Son dəyişikliklər",
          "recentChangesDescription": "Təqdimatlar, [[TƏQDİL]]lər və yeniləmələri qeydiyyatdan keçirin.",
          "activityTitle": "Fəaliyyət lenti",
          "activityDescription": "Ən son risk qiymətləndirilməsi iş məkanı hadisələri.",
          "stepDraft": "Qaralama",
          "stepSubmitted": "Təqdim edildi",
          "stepUnderReview": "yoxlama altında",
          "stepReturned": "Qayıtdı",
          "stepApproved": "Təsdiq edildi",
          "stepIntegrated": "İnteqrasiya edilmiş",
          "packageVersion": "Versiya",
          "lastUpdate": "Son yeniləmə",
          "openWorkflow": "yoxlama iş axını",
          "viewHistory": "Tam tarixçəyə baxın",
          "viewMatrix": "Tam matrisi açın",
          "viewReviewNotes": "yoxlama qeydlərinə baxın",
          "significant": "Əhəmiyyətli",
          "unrated": "Qiymətləndirilməmiş",
          "notSet": "Qurulmayıb",
          "notLinked": "Əlaqədar deyil",
          "uncategorized": "Kateqoriyasız",
          "accountColumn": "Hesab",
          "assertionColumn": "Təsdiq",
          "ratingColumn": "Reytinq",
          "kpiOverall": "Ümumi risk reytinqi",
          "kpiInherent": "Doğma risk",
          "kpiControl": "Nəzarət riski",
          "kpiDetection": "Aşkarlanma riski",
          "kpiResidual": "Qalıq risk",
          "kpiFraud": "Fırıldaqçılıq riskləri",
          "kpiIt": "İT riskləri",
          "kpiCompliance": "Uyğunluq riskləri",
          "kpiFinancial": "Maliyyə hesabatı riskləri",
          "kpiSignificant": "Əhəmiyyətli risklər",
          "kpiAssertionCoverage": "Təsdiqləmə əhatəsi",
          "kpiWorkflow": "İş axını vəziyyəti",
          "kpiApproval": "[[TƏSDİQ]] statusu",
          "kpiPendingReview": "Gözlənir [[yoxlama]]",
          "kpiOpenItems": "Açıq riskli maddələr",
          "kpiOwners": "Təyin edilmiş sahiblər",
          "kpiLastUpdate": "Son yeniləmə",
          "kpiHealth": "Risk sağlamlıq",
          "kpiProgress": "Tərəqqi",
          "kpiCategories": "Kateqoriyalar",
          "kpiResponses": "Cavablar",
          "kpiProcedures": "Prosedurlar",
          "kpiComments": "Şərhlər",
          "hintOverall": "Ən yüksək qalıq reytinqi",
          "hintInherent": "Maksimum xas reytinq",
          "hintControl": "Maksimum nəzarət reytinqi",
          "hintDetection": "Maksimum aşkarlama reytinqi",
          "hintResidual": "Maksimum qalıq reytinqi",
          "hintFraud": "Sənədləşdirilmiş fırıldaqçılıq riskləri",
          "hintIt": "Texnologiya riskləri",
          "hintCompliance": "Tənzimləyici risklər",
          "hintFinancial": "FSL riskləri",
          "hintSignificant": "Fokuslanmış cavab tələb edir",
          "hintAssertionCoverage": "Qiymətləndirilmiş təsdiq xanaları",
          "hintWorkflow": "[[TƏSQİQ]] vəziyyəti",
          "hintPendingReview": "İmzalanmanı gözləyir",
          "hintOpenItems": "Natamam sənədlər",
          "hintOwners": "Unikal risk sahibləri",
          "hintLastUpdate": "Ən son dəyişiklik",
          "hintHealth": "Qiymətləndirmə duruşu",
          "hintProgress": "Ümumi tamamlama",
          "hintCategories": "Konfiqurasiya edilmiş kateqoriyalar",
          "hintResponses": "Sənədləşdirilmiş cavablar",
          "hintProcedures": "Əlaqədar prosedurlar",
          "hintComments": "Əməkdaşlıq qeydləri",
          "healthOnTrack": "Yolda",
          "healthMonitor": "Monitorinq",
          "healthAttention": "Diqqət lazımdır",
          "changeApproved": "risk qiymətləndirilməsi təsdiq edildi",
          "changeApprovedDescription": "Qiymətləndirmə sahə işi istifadəsi üçün təsdiq edilmişdir.",
          "changeSubmitted": "yoxlama üçün təqdim edildi",
          "changeSubmittedDescription": "Qiymətləndirmə müsadirə yoxlamaə təqdim edildi.",
          "emptyMatrix": "Matris datası yoxdur",
          "emptyMatrixDescription": "Matris doldurulduqca təsdiq reytinqləri görünəcək.",
          "emptyCategories": "Kateqoriya yoxdur",
          "emptyCategoriesDescription": "Riskli maddələri təşkil etmək üçün kateqoriyaları konfiqurasiya edin.",
          "emptySignificant": "Əhəmiyyətli risklər yoxdur",
          "emptySignificantDescription": "Əhəmiyyətli risklər müəyyən edildikdə ortaya çıxacaq.",
          "emptyOpenResponses": "Bütün risklər cavablandırıldı",
          "emptyOpenResponsesDescription": "Hər bir risk elementinin sənədləşdirilmiş cavabı var.",
          "emptyProcedures": "Gözlənilməmiş prosedurlar yoxdur",
          "emptyProceduresDescription": "Bütün əhəmiyyətli risklərin əlaqəli prosedurları var.",
          "emptyResponsesList": "Cavab yoxdur",
          "emptyResponsesListDescription": "Müəyyən edilmiş risklərə cavabları sənədləşdirin.",
          "emptyProceduresList": "Əlaqəli prosedurlar yoxdur",
          "emptyProceduresListDescription": "Audit prosedurlarını əhəmiyyətli risklərlə əlaqələndirin.",
          "emptyReviewNotes": "yoxlama qeyd yoxdur",
          "emptyReviewNotesDescription": "yoxlama qeydlər [[TƏSQİQ]] iş prosesi zamanı görünür.",
          "emptyComments": "Şərh yoxdur",
          "emptyCommentsDescription": "Şərhlər əməkdaşlıq zamanı qeyd olunur.",
          "emptyChanges": "Son dəyişikliklər yoxdur",
          "emptyChangesDescription": "İş axını hadisələri burada görünəcək.",
          "emptyActivity": "Fəaliyyət yoxdur",
          "emptyActivityDescription": "risk qiymətləndirilməsi hadisələr burada qeydə alınacaq."
        },
        "navGroups": {
          "overview": "İdarə paneli",
          "register": "Risk reyestri",
          "analysis": "Təhlil",
          "response": "Cavab",
          "governance": "Nəzarət",
          "admin": "İdarəetmə"
        },
        "heroEyebrow": "Riskin qiymətləndirilməsi",
        "sections": {
          "overview": {
            "title": "Risk tablosu",
            "description": "Vəziyyət, tərəqqi və nəzərdən keçirmə hazırlığı göstəriciləri."
          },
          "inherent-risks": {
            "title": "Təbii risklər",
            "description": "Müvafiq nəzarəti nəzərdən keçirməzdən əvvəl risklər."
          },
          "control-risks": {
            "title": "Risklərə nəzarət",
            "description": "Nəzarət vasitələrinin dizaynı və istismarı ilə bağlı risklər."
          },
          "detection-risks": {
            "title": "Aşkarlanma riskləri",
            "description": "Prosedurların təhrifləri aşkar edə bilməməsi riskləri."
          },
          "fraud-risks": {
            "title": "Fırıldaqçılıq riskləri",
            "description": "Fırıldaqçılıq risk faktorları və rəhbərlik mülahizələri üstələyir."
          },
          "it-risks": {
            "title": "İT riskləri",
            "description": "Texnologiya, sistemə giriş və məlumatların bütövlüyü riskləri."
          },
          "compliance-risks": {
            "title": "Uyğunluq riskləri",
            "description": "Tənzimləyici və hüquqi uyğunluq riskləri."
          },
          "financial-statement-risks": {
            "title": "Maliyyə hesabatı riskləri",
            "description": "Maliyyə hesabatı səviyyəsində əhəmiyyətli təhrif riskləri."
          },
          "assertion-risks": {
            "title": "Təsdiq riskləri",
            "description": "Müvafiq hesablarla əlaqəli təsdiq səviyyəli risklər."
          },
          "significant-risks": {
            "title": "Əhəmiyyətli risklər",
            "description": "Fokuslanmış audit reaksiyası tələb edən yüksək prioritet risklər."
          },
          "categories": {
            "title": "Risk kateqoriyaları",
            "description": "Risk elementlərini təşkil etmək üçün istifadə edilən konfiqurasiya edilmiş kateqoriyalar."
          },
          "scoring": {
            "title": "Qiymətləndirmə",
            "description": "Müəyyən edilmiş risklər üzrə qiymətləndirmə göstəricilərini birləşdirin."
          },
          "heatmap": {
            "title": "İstilik xəritəsi",
            "description": "Risk reytinqlərinin vizual paylanması."
          },
          "matrix": {
            "title": "Təsdiq matrisi",
            "description": "Hesab və təsdiq reytinqlərinin icmalı."
          },
          "responses": {
            "title": "Risk cavabları",
            "description": "Müəyyən edilmiş risklər üçün planlaşdırılmış cavab tədbirləri."
          },
          "procedures": {
            "title": "Prosedur bağlantıları",
            "description": "Qiymətləndirilmiş riskləri həll etmək üçün əlaqəli prosedurlar."
          },
          "owners": {
            "title": "Risk sahibləri",
            "description": "Hər bir risk elementi üçün təyin edilmiş sahiblər."
          },
          "review-notes": {
            "title": "Qeydləri nəzərdən keçirin",
            "description": "Risklərin qiymətləndirilməsi dövrləri zamanı əldə edilən rəyçi qeydləri."
          },
          "comments": {
            "title": "Şərhlər",
            "description": "Daxili şərhlər və əməkdaşlıq qeydləri."
          },
          "history": {
            "title": "Tarix",
            "description": "Riskin qiymətləndirilməsi dəyişiklikləri və təsdiqlərinin qrafiki."
          },
          "settings": {
            "title": "Parametrlər",
            "description": "Bu risk qiymətləndirməsi üçün nəzarətləri arxivləşdirin və bərpa edin."
          }
        }
      }
    },
    "materiality": {
      "workspace": {
        "commandCenter": {
          "heroTitle": "ISA 320 mahiyyətlilik komanda mərkəzi",
          "executiveTitle": "mahiyyətlilik həddi",
          "summaryTitle": "mahiyyətlilik xülasə",
          "metricsTitle": "Paket ölçüləri",
          "workflowTitle": "[[TƏSDİQ]] iş axını",
          "workflowDescription": "İnteqrasiya edilmiş qaralama — cari addım vurğulanıb.",
          "approvalQueueTitle": "[[TƏSDİQ]] növbəsi",
          "approvalQueueDescription": "mahiyyətlilik paketləri partnyor və ya menecerin qeydiyyatdan keçməsini gözləyən.",
          "calculationBreakdownTitle": "Hesablama bölgüsü",
          "calculationBreakdownDescription": "Ümumilikdə, performans və əhəmiyyətsiz hesablama axını.",
          "benchmarkComparisonTitle": "Benchmark müqayisəsi",
          "benchmarkComparisonDescription": "Reytinq göstəriciləri və hesablanmış [[MATERİALİYET]].",
          "calculationHistoryTitle": "Hesablama tarixi",
          "calculationHistoryDescription": "Qeydə alınmış hesablamalar və əl ilə ləğvetmələr.",
          "selectedBenchmarkTitle": "Seçilmiş meyar",
          "selectedBenchmarkDescription": "Ümumi mahiyyətlilik təyini üçün əsas.",
          "versionTimelineTitle": "Versiya qrafiki",
          "versionTimelineDescription": "Paket versiyası snapshots və dəyişiklik xülasəsi.",
          "reviewNotesTitle": "yoxlama qeydlər",
          "reviewNotesDescription": "Tərəfdaş və menecer yoxlama şərhləri.",
          "commentsTitle": "Şərhlər",
          "commentsDescription": "yoxlama və mahiyyətlilik üzrə daxili müzakirə.",
          "recentChangesTitle": "Son dəyişikliklər",
          "recentChangesDescription": "Təqdimatlar, geri qaytarmalar, [[TƏQDİL]]lər və versiya yeniləmələri.",
          "activityTitle": "Fəaliyyət lenti",
          "activityDescription": "Ən son mahiyyətlilik iş məkanı hadisələri.",
          "stepDraft": "Qaralama",
          "stepSubmitted": "Təqdim edildi",
          "stepUnderReview": "yoxlama altında",
          "stepReturned": "Qayıtdı",
          "stepApproved": "Təsdiq edildi",
          "stepIntegrated": "İnteqrasiya edilmiş",
          "packageVersion": "Versiya",
          "lastUpdate": "Son yeniləmə",
          "openWorkflow": "yoxlama iş axını",
          "viewHistory": "Tam tarixçəyə baxın",
          "viewComments": "Bütün şərhlərə baxın",
          "selected": "Seçildi",
          "override": "Üstündən yazın",
          "benchmarkColumn": "Müqayisə göstəricisi",
          "amountColumn": "Məbləğ",
          "percentageColumn": "Faiz",
          "calculatedColumn": "Hesablanmış",
          "versionLabel": "Versiya",
          "ofOverall": "ümumi",
          "moreItems": "daha çox",
          "specificItems": "maddələr",
          "notSet": "Qurulmayıb",
          "kpiOverall": "Ümumilikdə mahiyyətlilik",
          "kpiPerformance": "Performans mahiyyətlilik",
          "kpiSpecific": "Xüsusi mahiyyətlilik",
          "kpiTrivial": "Açıqca mənasız hədd",
          "kpiBenchmark": "Seçilmiş meyar",
          "kpiPercentage": "Seçilmiş faiz",
          "kpiMethod": "Hesablama üsulu",
          "kpiStatus": "[[TƏSDİQ]] statusu",
          "kpiWorkflow": "İş axını vəziyyəti",
          "kpiVersion": "Versiya",
          "kpiPendingReview": "Gözlənir yoxlama",
          "kpiOpenItems": "Açıq maddələr",
          "kpiLastUpdate": "Son yeniləmə",
          "kpiReviewer": "yoxlamaer təyin edildi",
          "hintOverall": "ISA 320 ümumi həddi",
          "hintPerformance": "İşləyir mahiyyətlilik",
          "hintSpecific": "Hesab səviyyəli həddlər",
          "hintTrivial": "Açıqca əhəmiyyətsiz məbləğ",
          "hintBenchmark": "Seçilmiş əsas",
          "hintPercentage": "Tətbiq olunan dərəcə",
          "hintMethod": "Qərarlı yanaşma",
          "hintWorkflow": "[[TƏSQİQ]] vəziyyəti",
          "hintVersion": "Paket versiyası",
          "hintPendingReview": "İmzalanmanı gözləyir",
          "hintOpenItems": "Natamam sənədlər",
          "hintLastUpdate": "Ən son dəyişiklik",
          "hintReviewer": "yoxlama tapşırığı",
          "reviewerNotAssigned": "Təyin olunmayıb",
          "methodNotSet": "Müəyyən deyil",
          "methodManualOverride": "Əllə əvəzləmə",
          "methodBenchmarkPct": "Benchmark × faiz",
          "changeApproved": "mahiyyətlilik təsdiq edildi",
          "changeApprovedDescription": "Paket sahə işi istifadəsi üçün təsdiqləndi.",
          "changeReturned": "Təftiş üçün geri qaytarıldı",
          "changeReturnedDescription": "Paket yoxlama qeydləri ilə qaytarıldı.",
          "changeSubmitted": "yoxlama üçün təqdim edildi",
          "changeSubmittedDescription": "Paket müsadirə yoxlamaə təqdim edildi.",
          "versionCreated": "Versiya snapshot yaradıldı",
          "emptyBenchmarks": "Benchmark yoxdur",
          "emptyBenchmarksDescription": "mahiyyətlilik əsaslarını müqayisə etmək üçün meyarlar əlavə edin.",
          "emptyCalculations": "Hesablamalar yoxdur",
          "emptyCalculationsDescription": "Benchmarks bölməsindən hesablamaları qeyd edin.",
          "emptyVersions": "Versiya yoxdur",
          "emptyVersionsDescription": "Paketə yenidən baxıldıqda versiya anlıq görüntüləri görünür.",
          "emptyReviewNotes": "yoxlama qeyd yoxdur",
          "emptyReviewNotesDescription": "yoxlama qeydlər [[TƏSQİQ]] iş prosesi zamanı görünür.",
          "emptyComments": "Şərh yoxdur",
          "emptyCommentsDescription": "Şərhlər yoxlama zamanı qeydə alınır.",
          "emptyChanges": "Son dəyişikliklər yoxdur",
          "emptyChangesDescription": "İş axını hadisələri və versiyaları burada görünəcək.",
          "emptyActivity": "Fəaliyyət yoxdur",
          "emptyActivityDescription": "mahiyyətlilik hadisələr burada qeydə alınacaq."
        },
        "navGroups": {
          "overview": "İdarə paneli",
          "thresholds": "Həddlər",
          "analysis": "Təhlil",
          "governance": "Nəzarət",
          "admin": "İdarəetmə"
        }
      }
    }
  },
  "ru": {
    "companies": {
      "workspace": {
        "commandCenter": {
          "heroTitle": "Центр управления компанией",
          "heroSubtitle": "Состояние проектов, комплаенс и прогресс аудита для этой организации.",
          "healthTitle": "Состояние компании",
          "executiveTitle": "Исполнительная сводка",
          "moduleProgressTitle": "Прогресс аудиторских модулей",
          "moduleProgressDescription": "Планирование, существенность, риски и полевые работы по проектам компании.",
          "activeEngagementsTitle": "Активные проекты",
          "activeEngagementsDescription": "Текущие аудиторские и обзорные работы для этой компании.",
          "recentActivityTitle": "Недавняя активность",
          "recentActivityDescription": "Последние изменения, зафиксированные для этой компании.",
          "recentDocumentsTitle": "Недавние документы",
          "recentDocumentsDescription": "Документы планирования, прикреплённые к проектам компании.",
          "recentCommentsTitle": "Недавние комментарии",
          "recentCommentsDescription": "Заметки проверки из рабочих областей существенности и рисков.",
          "financialTitle": "Финансовая сводка",
          "financialDescription": "Стандарт отчётности, валюта и настройки финансового года.",
          "complianceTitle": "Статус комплаенса",
          "complianceDescription": "Регуляторное положение и готовность к валидации.",
          "deadlinesTitle": "Предстоящие сроки",
          "deadlinesDescription": "Окончания отчётных периодов для активных проектов.",
          "teamTitle": "Назначенная команда",
          "teamDescription": "Участники проектных команд по аудитам компании.",
          "pendingReviewsTitle": "Ожидающие проверки",
          "pendingReviewsHint": "Планирование, существенность, риски и полевые работы, ожидающие утверждения.",
          "kpiHealth": "Состояние",
          "kpiActiveEngagements": "Активные проекты",
          "kpiPendingReviews": "Ожидающие проверки",
          "kpiOpenFindings": "Открытые выявления",
          "kpiOverdue": "Просрочено",
          "kpiPlanningProgress": "Планирование",
          "kpiFieldworkProgress": "Полевые работы",
          "kpiTeamMembers": "Участники команды",
          "hintHealth": "Общее состояние рабочей области",
          "hintEngagements": "В работе для этой компании",
          "hintReviews": "Ожидает утверждения",
          "hintFindings": "Неразрешённые выявления полевых работ",
          "hintOverdue": "После окончания периода",
          "hintPlanning": "Средний прогресс контрольного списка",
          "hintFieldwork": "Средний прогресс выполнения",
          "hintTeam": "По проектам",
          "healthOnTrack": "В норме",
          "healthMonitor": "Мониторинг",
          "healthAttention": "Требует внимания",
          "modulePlanning": "Планирование",
          "moduleMateriality": "Существенность",
          "moduleRisk": "Риск",
          "moduleFieldwork": "Полевые работы",
          "statusActive": "Активен",
          "statusReview": "На проверке",
          "statusNotStarted": "Не начато",
          "pendingReview": "Ожидает проверки",
          "complianceValidated": "Валидировано",
          "compliancePending": "Ожидает валидации",
          "complianceStatus": "Статус",
          "jurisdiction": "Юрисдикция",
          "activeEngagementsLabel": "Активные проекты",
          "framework": "Стандарт",
          "currency": "Валюта",
          "fiscalYear": "Конец финансового года",
          "entityType": "Тип организации",
          "industry": "Отрасль",
          "viewFinancial": "Открыть финансовый профиль",
          "viewCompliance": "Открыть комплаенс",
          "overdue": "Просрочено",
          "engagementCount": "{count} проектов",
          "actionViewEngagements": "Просмотреть проекты",
          "actionCreateEngagement": "Создать проект",
          "actionOpenPlanning": "Открыть планирование",
          "actionOpenRisk": "Открыть риски",
          "actionOpenFieldwork": "Открыть полевые работы",
          "actionOpenMateriality": "Открыть существенность",
          "emptyEngagements": "Нет проектов",
          "emptyEngagementsDescription": "Создайте проект, чтобы начать аудиторскую работу для этой компании.",
          "emptyActivity": "Нет недавней активности",
          "emptyActivityDescription": "Изменения компании появятся в хронологии активности.",
          "emptyDocuments": "Нет документов",
          "emptyDocumentsDescription": "Документы планирования появятся по мере добавления.",
          "emptyComments": "Нет комментариев",
          "emptyCommentsDescription": "Комментарии проверки появятся из существенности и рисков.",
          "emptyDeadlines": "Нет предстоящих сроков",
          "emptyDeadlinesDescription": "Окончания периодов проектов появятся здесь.",
          "emptyTeam": "Команда не назначена",
          "emptyTeamDescription": "Участники появятся при добавлении в проекты компании.",
          "activityCreated": "Компания создана",
          "activityUpdated": "Компания обновлена",
          "activitySettings": "Настройки обновлены",
          "activityArchived": "Компания архивирована",
          "activityRestored": "Компания восстановлена",
          "activityGeneric": "Записано в аудиторском следе компании"
        },
        "heroEyebrow": "Рабочая область компании",
        "sections": {
          "overview": {
            "title": "Обзор",
            "description": "Спокойный обзор отчётной идентичности этой компании.",
            "highlightsTitle": "Основное",
            "highlightsDescription": "Контекст и классификация с первого взгляда.",
            "noDescription": "Описание компании ещё не добавлено."
          },
          "identity": {
            "title": "Идентификация"
          },
          "financial": {
            "title": "Финансы",
            "description": "Стандарт отчётности, валюта и настройки финансового года.",
            "cardTitle": "Профиль финансовой отчётности",
            "cardDescription": "Просмотр финансовых настроек организации только для чтения."
          },
          "compliance": {
            "title": "Комплаенс",
            "description": "Проекты, отчётность и регуляторное положение.",
            "emptyTitle": "Комплаенс не настроен",
            "emptyDescription": "Отслеживание комплаенса появится после настройки проектов и обязательств."
          },
          "contacts": {
            "title": "Контакты",
            "description": "Контакты финансовой службы и внешнего аудитора для этой организации.",
            "emptyTitle": "Контакты не указаны",
            "emptyDescription": "Основные контакты появятся после добавления.",
            "financeEmptyTitle": "Нет финансового контакта",
            "financeEmptyDescription": "Основной финансовый контакт для этой компании не записан.",
            "auditorEmptyTitle": "Нет контакта аудитора",
            "auditorEmptyDescription": "Контакт внешнего аудитора для этой компании не записан."
          },
          "history": {
            "title": "История",
            "description": "Хронологическая активность и аудиторский след этой компании.",
            "emptyTitle": "Активности пока нет",
            "emptyDescription": "История активности появится по мере фиксации изменений на платформе."
          },
          "settings": {
            "title": "Настройки",
            "description": "Снимок конфигурации рабочей области этой компании.",
            "configurationTitle": "Конфигурация",
            "configurationDescription": "Предпочтения и версионирование для этой организации.",
            "addressesTitle": "Адреса",
            "addressesDescription": "Юридический и фактический адреса в системе.",
            "registeredAddress": "Юридический адрес",
            "operatingAddress": "Фактический адрес",
            "defaultLocale": "Язык по умолчанию",
            "dataImportSource": "Источник импорта данных",
            "roundingConvention": "Правило округления",
            "recordVersion": "Версия записи",
            "settingsVersion": "Версия настроек",
            "validationTitle": "Валидация",
            "validationDescription": "Метаданные валидации схемы настроек компании.",
            "schemaVersion": "Версия схемы",
            "validatedAt": "Последняя валидация"
          }
        }
      }
    },
    "engagements": {
      "workspace": {
        "commandCenter": {
          "heroTitle": "Аудит командного центра",
          "overallCompletion": "Полное завершение",
          "executiveTitle": "Управляющее резюме",
          "auditHealthTitle": "Аудит работоспособности",
          "auditMetricsTitle": "Метрики аудита",
          "pipelineTitle": "Конвейер этапа аудита",
          "pipelineDescription": "[[ПЛАНИРОВАНИЕ]] до завершения — статус, прогресс и навигация по каждому этапу.",
          "reviewQueueTitle": "[[ОБЗОР]] очередь",
          "reviewQueueDescription": "Элементы, ожидающие утверждения партнером или менеджером.",
          "outstandingTitle": "Нерешенные вопросы",
          "outstandingDescription": "Выводы и открытые вопросы, требующие разрешения.",
          "activityTitle": "Недавняя активность",
          "activityDescription": "Последние изменения в этом [[ВОВЛЕЧЕНИИ]].",
          "timelineTitle": "График аудита",
          "timelineDescription": "Хронологические события [[ВЗАИМОДЕЙСТВИЕ]].",
          "documentsTitle": "Последние документы",
          "documentsDescription": "Документы [[ПЛАНИРОВАНИЕ]] прилагаются к данному [[ВЗАИМОДЕЙСТВИЮ]].",
          "teamTitle": "Назначенная команда",
          "teamDescription": "[[ВОВЛЕЧЕНИЕ]] члены команды и роли.",
          "decisionsTitle": "Недавние решения",
          "decisionsDescription": "[[ОДЕРЖАНИЕ]] и подписания записаны для этого [[ВЗАИМОДЕЙСТВИЯ]].",
          "commentsTitle": "Последние комментарии",
          "commentsDescription": "[[ОБЗОР]] примечания из [[МАТЕРИАЛЬНОСТИ]] и рабочих областей рисков.",
          "companyHealthTitle": "Здоровье компании",
          "companyHealthDescription": "Проверка сущности клиента и состояние отчетности.",
          "phaseReview": "[[ОБЗОР]]",
          "phaseCompletion": "Завершение",
          "statusReview": "В [[ОБЗОР]]",
          "statusClear": "Прозрачный",
          "openReviewQueue": "Открыть очередь [[ОБЗОР]]",
          "openSettings": "Настройки [[ВОВЛЕЧЕНИЕ]]",
          "owner": "Владелец",
          "lastUpdate": "Обновлено",
          "overdue": "Просрочено",
          "deadline": "Крайний срок",
          "reportingPeriod": "Отчетный период",
          "plannedSchedule": "Планируемый график",
          "validationStatus": "Валидация",
          "framework": "Рамки",
          "jurisdiction": "Юрисдикция",
          "viewHistory": "Посмотреть полную историю",
          "kpiAuditHealth": "Аудит работоспособности",
          "kpiCompletion": "Завершение",
          "kpiPendingReviews": "В ожидании [[[[ОБЗОР]]]]",
          "kpiOpenFindings": "Открытые выводы",
          "kpiLifecycle": "Жизненный цикл",
          "kpiPlanning": "[[ПЛАНИРОВАНИЕ]]",
          "kpiFieldwork": "[[ПОЛЕВЫЕ РАБОТЫ]]",
          "kpiTeam": "Команда",
          "kpiMateriality": "[[МАТЕРИАЛЬНОСТЬ]]",
          "kpiRisk": "Риск",
          "kpiProcedures": "Процедуры",
          "kpiSignificantRisks": "Значительные риски",
          "hintAuditHealth": "[[ОБРУЧЕНИЕ]] поза",
          "hintCompletion": "Взвешивается на всех этапах",
          "hintReviews": "Ожидание подписания",
          "hintFindings": "Открыть результаты полевые работы",
          "hintLifecycle": "Текущий этап",
          "hintPlanning": "Контрольный список прогресса",
          "hintFieldwork": "Ход выполнения",
          "hintTeam": "Назначенные участники",
          "hintMateriality": "Прогресс ISA 320",
          "hintRisk": "Ход оценки",
          "hintProcedures": "Всего процедур",
          "hintSignificant": "Выявлены существенные риски",
          "healthOnTrack": "На ходу",
          "healthMonitor": "Мониторинг",
          "healthAttention": "Требует внимания",
          "modulePlanning": "[[ПЛАНИРОВАНИЕ]]",
          "moduleMateriality": "[[МАТЕРИАЛЬНОСТЬ]]",
          "moduleRisk": "Риск",
          "issueFindings": "Открытые выводы",
          "issueRiskItems": "Объекты открытого риска",
          "issueMaterialityItems": "Открыть предметы [[МАТЕРИАЛИЗАЦИЯ]]",
          "companyValidated": "проверено",
          "companyPending": "Ожидает проверки",
          "decisionPlanningApproved": "[[ПЛАНИРОВАНИЕ]] одобрено",
          "decisionMaterialityApproved": "[[МАТЕРИАЛЬНОСТЬ]] одобрено",
          "decisionRiskApproved": "оценка рисков одобрено",
          "emptyActivity": "Нет недавней активности",
          "emptyActivityDescription": "Здесь будут появляться события задание.",
          "emptyTimeline": "Нет событий временной шкалы",
          "emptyTimelineDescription": "Действия будут записываться по мере продвижения работы.",
          "emptyDocuments": "Нет документов",
          "emptyDocumentsDescription": "Здесь появятся документы [[ПЛАНИРОВАНИЕ]].",
          "emptyTeam": "Команда не назначена",
          "emptyTeamDescription": "Добавьте участников, чтобы начать комплектование этого [[ВОВЛЕЧЕНИЯ]].",
          "emptyDecisions": "Решения не зафиксированы",
          "emptyDecisionsDescription": "Сообщения утверждение появятся после выхода из системы.",
          "emptyComments": "Без комментариев",
          "emptyCommentsDescription": "Комментарии [[ОБЗОР]] появятся в рабочих областях модуля."
        },
        "heroEyebrow": "Рабочая область проекта",
        "sections": {
          "overview": {
            "title": "Обзор",
            "description": "Спокойный обзор этого проекта.",
            "highlightsTitle": "Основное",
            "highlightsDescription": "Контекст и статус с первого взгляда.",
            "noDescription": "Описание проекта ещё не добавлено."
          },
          "members": {
            "title": "Участники"
          },
          "history": {
            "title": "История",
            "description": "Хронологическая активность и аудиторский след этого проекта.",
            "emptyTitle": "Активности пока нет",
            "emptyDescription": "История активности появится по мере фиксации изменений."
          },
          "settings": {
            "title": "Настройки",
            "description": "Конфигурация и управление жизненным циклом этого проекта."
          }
        }
      }
    },
    "planning": {
      "workspace": {
        "commandCenter": {
          "heroTitle": "[[ПЛАНИРОВАНИЕ]] командный центр",
          "executiveTitle": "Управляющее резюме",
          "healthTitle": "[[ПЛАНИРОВАНИЕ]] здоровье",
          "metricsTitle": "[[ПЛАНИРОВАНИЕ]] показатели",
          "workflowTitle": "[[УТВЕРЖДЕНИЕ]] рабочий процесс",
          "workflowDescription": "Черновой вариант интегрированного — выделен текущий этап.",
          "reviewQueueTitle": "[[ОБЗОР]] очередь",
          "reviewQueueDescription": "Пакеты [[ПЛАНИРОВАНИЕ]] ожидают утверждения партнером или менеджером.",
          "checklistTitle": "[[ПЛАНИРОВАНИЕ]] контрольный список",
          "checklistDescription": "Основные результаты, необходимые до [[ПОЛЕВЫХ РАБОТ]].",
          "outstandingTitle": "Выдающиеся задачи",
          "outstandingDescription": "Откройте пункты контрольного списка, требующие выполнения.",
          "activityTitle": "Недавняя активность",
          "activityDescription": "Последние изменения в этом плане аудита.",
          "changesTitle": "Недавние изменения",
          "changesDescription": "Обновления, материалы и [[УТВЕРЖДЕНИЕ]].",
          "calendarTitle": "[[ПЛАНИРОВАНИЕ]] календарь",
          "calendarDescription": "Даты вех в рамках [[ВЗАИМОДЕЙСТВИЯ]].",
          "documentsTitle": "[[ПЛАНИРОВАНИЕ]] документов",
          "documentsDescription": "Меморандумы и подтверждающие ссылки.",
          "notesTitle": "[[ПЛАНИРОВАНИЕ]] примечания",
          "notesDescription": "Внутренний контекст и суждение [[ПЛАНИРОВАНИЕ]].",
          "teamTitle": "Назначенная команда",
          "teamDescription": "[[ВОВЛЕЧЕНИЕ]] состав и вместимость.",
          "stepDraft": "Черновик",
          "stepSubmitted": "Поданный",
          "stepUnderReview": "В разделе [[ОБЗОР]]",
          "stepReturned": "Вернулся",
          "stepApproved": "Одобренный",
          "stepIntegrated": "Интегрированный",
          "overdue": "Просрочено",
          "deadline": "Крайний срок",
          "complete": "Сделанный",
          "open": "Открыть",
          "openWorkflow": "[[ОБЗОР]] рабочий процесс",
          "viewHistory": "Посмотреть полную историю",
          "viewNotes": "Просмотр заметок [[ПЛАНИРОВАНИЕ]]",
          "estimatedHours": "Расчетное время",
          "planVersion": "Версия",
          "kpiHealth": "Здоровье",
          "kpiProgress": "Прогресс",
          "kpiChecklist": "Контрольный список",
          "kpiWorkflow": "Рабочий процесс",
          "kpiStatus": "Статус",
          "kpiFramework": "Рамки",
          "kpiOpenItems": "Открытые позиции",
          "kpiDocuments": "Документы",
          "kpiMateriality": "[[МАТЕРИАЛЬНОСТЬ]]",
          "kpiRisk": "Риск",
          "kpiComments": "Комментарии",
          "kpiTeam": "Команда",
          "hintHealth": "[[ПЛАНИРОВАНИЕ]] поза",
          "hintProgress": "Полное завершение",
          "hintChecklist": "Контрольный список результатов",
          "hintWorkflow": "[[УТВЕРЖДЕНИЕ]] состояние",
          "hintFramework": "Стандарт отчетности",
          "hintOpenItems": "Неполный контрольный список",
          "hintDocuments": "В файле",
          "hintMateriality": "Готовность к интеграции",
          "hintRisk": "Готовность к интеграции",
          "hintComments": "[[ОБЗОР]] примечания",
          "hintTeam": "Назначенные участники",
          "healthOnTrack": "На ходу",
          "healthMonitor": "Мониторинг",
          "healthAttention": "Требует внимания",
          "emptyChecklist": "Нет пунктов контрольного списка",
          "emptyChecklistDescription": "Элементы контрольного списка появятся после создания [[ПЛАНИРОВАНИЯ]].",
          "emptyOutstanding": "Нет невыполненных задач",
          "emptyOutstandingDescription": "Все пункты контрольного списка выполнены.",
          "emptyActivity": "Нет недавней активности",
          "emptyActivityDescription": "Здесь будут появляться события [[ПЛАНИРОВАНИЕ]].",
          "emptyChanges": "Нет недавних изменений",
          "emptyChangesDescription": "Обновления будут записываться в журнал активности.",
          "emptyTimeline": "Нет вех",
          "emptyTimelineDescription": "Добавьте даты временной шкалы в раздел временной шкалы.",
          "emptyDocuments": "Нет документов",
          "emptyDocumentsDescription": "Добавьте ссылки на документ [[ПЛАНИРОВАНИЕ]].",
          "emptyNotes": "Нет примечаний к [[ПЛАНИРОВАНИЮ]]",
          "emptyNotesDescription": "Задокументируйте решение [[ПЛАНИРОВАНИЕ]] в разделе примечаний.",
          "emptyTeam": "Команда не назначена",
          "emptyTeamDescription": "Назначьте участников задание для начала набора персонала."
        },
        "navGroups": {
          "content": "Содержание планирования",
          "integrations": "Интеграции",
          "execution": "Исполнение",
          "admin": "Администрирование"
        },
        "heroEyebrow": "Аудиторское планирование",
        "sections": {
          "overview": {
            "title": "Панель планирования",
            "description": "Обзор статуса планирования, готовности и ключевых показателей."
          },
          "strategy": {
            "title": "Аудиторская стратегия",
            "description": "Задокументируйте общий подход к аудиту и существенные вопросы."
          },
          "objectives": {
            "title": "Цели проекта",
            "description": "Укажите основную цель обеспечения и объём заключения."
          },
          "scope": {
            "title": "Объём аудита",
            "description": "Определите финансовые периоды, организации и отчётность в объёме."
          },
          "framework": {
            "title": "Стандарт финансовой отчётности",
            "description": "Подтвердите применимый стандарт отчётности для этого проекта."
          },
          "materiality": {
            "title": "Существенность",
            "description": "Заглушка, готовая к интеграции, для управления существенностью."
          },
          "risk": {
            "title": "Оценка рисков",
            "description": "Заглушка, готовая к интеграции, для оценки рисков."
          },
          "team": {
            "title": "Планирование команды",
            "description": "Просмотрите состав команды проекта и планирование загрузки."
          },
          "timeline": {
            "title": "График",
            "description": "Запланируйте контрольные даты планирования, полевых работ и проверки."
          },
          "notes": {
            "title": "Заметки по планированию",
            "description": "Внутренние заметки по планированию и рабочий контекст."
          },
          "checklist": {
            "title": "Контрольный список планирования",
            "description": "Отслеживайте выполнение основных результатов планирования."
          },
          "documents": {
            "title": "Документы планирования",
            "description": "Меморандумы по планированию и сопроводительная документация."
          },
          "history": {
            "title": "История планирования",
            "description": "Активность и история версий этого аудиторского плана."
          },
          "settings": {
            "title": "Настройки планирования",
            "description": "Архивируйте или восстанавливайте эту запись планирования."
          }
        }
      }
    },
    "fieldwork": {
      "workspace": {
        "commandCenter": {
          "heroTitle": "Центр управления выполнением аудита",
          "executiveTitle": "Управляющее резюме",
          "executionTitle": "Ход выполнения",
          "kpisTitle": "[[ПОЛЕВЫЕ РАБОТЫ]] Ключевые показатели эффективности",
          "workflowTitle": "Рабочий процесс выполнения",
          "workflowDescription": "Не начато, завершено — текущий шаг выделен.",
          "reviewQueueTitle": "[[ОБЗОР]] очередь",
          "reviewQueueDescription": "Процедуры, ожидающие [[ПРОСМОТР]] или разрешения.",
          "procedureProgressTitle": "Ход процедуры",
          "procedureProgressDescription": "Процедура считается по статусу выполнения.",
          "paperProgressTitle": "рабочий документ прогресс",
          "paperProgressDescription": "рабочий документ учитывается по статусу документации.",
          "evidenceStatusTitle": "Статус [[ДОКАЗАТЕЛЬСТВА]]",
          "evidenceStatusDescription": "доказательство элементы по статусу проверки.",
          "outstandingTitle": "Выдающиеся процедуры",
          "outstandingDescription": "Процедуры еще не завершены или не очищены.",
          "findingsTitle": "Открытые выводы",
          "findingsDescription": "Искажения и недостатки, требующие устранения.",
          "severityTitle": "Распределение серьезности",
          "severityDescription": "Результаты сгруппированы по степени тяжести.",
          "assignedWorkTitle": "Порученная работа",
          "assignedWorkDescription": "Процедуры с назначенными аудиторами и сроками выполнения.",
          "workingPapersTitle": "[[РАБОЧИЕ_ДОКУМЕНТЫ]]",
          "workingPapersDescription": "Документация, галочки и выводы.",
          "recentDocumentsTitle": "Последние документы",
          "recentDocumentsDescription": "Последний рабочие документы в файле.",
          "evidenceTitle": "[[ДОКАЗАТЕЛЬСТВА]] регистр",
          "evidenceDescription": "Индексированный аудит [[ДОКАЗАТЕЛЬСТВА]] и вложений.",
          "timelineTitle": "График выполнения",
          "timelineDescription": "Сроки выполнения и недавние этапы [[ПОЛЕВЫЕ РАБОТЫ]].",
          "reviewNotesTitle": "[[ОБЗОР]] примечания",
          "reviewNotesDescription": "[[ОБЗОР]] комментариев и отслеживание разрешений.",
          "commentsTitle": "Внутренние комментарии",
          "commentsDescription": "Командное обсуждение во время выполнения полевые работы.",
          "activityTitle": "Недавняя активность",
          "activityDescription": "Последние события рабочей области полевые работы.",
          "stepNotStarted": "Не запущено",
          "stepInProgress": "В ходе выполнения",
          "stepSubmitted": "Поданный",
          "stepReturned": "Вернулся",
          "stepReviewCleared": "[[ОБЗОР]] удален",
          "stepCompleted": "Завершенный",
          "programVersion": "Версия программы",
          "lastUpdate": "Последнее обновление",
          "viewHistory": "Посмотреть полную историю",
          "complete": "полный",
          "coverage": "покрытие",
          "assigned": "Назначенный",
          "unassigned": "Неназначенный",
          "unspecified": "Не указано",
          "notSet": "Не установлено",
          "kpiHealth": "[[ПОЛЕВАЯ РАБОТА]] здоровье",
          "kpiProgress": "Ход выполнения",
          "kpiProcedures": "Процедуры",
          "kpiWorkingPapers": "[[РАБОЧИЕ_ДОКУМЕНТЫ]]",
          "kpiEvidence": "[[ДОКАЗАТЕЛЬСТВО]]",
          "kpiOpenFindings": "Открытые выводы",
          "kpiResolvedFindings": "Решенные выводы",
          "kpiPendingReview": "В ожидании [[[[ОБЗОР]]]]",
          "kpiOutstanding": "Выдающиеся процедуры",
          "kpiAuditors": "Назначенные аудиторы",
          "kpiOpenNotes": "Открыть заметки",
          "kpiReviewNotes": "[[ОБЗОР]] примечания",
          "kpiStatus": "Статус пакета",
          "kpiTickmarks": "Засечки",
          "kpiComments": "Комментарии",
          "kpiProgram": "Программа аудита",
          "kpiGroups": "Группы процедур",
          "kpiLastUpdate": "Последнее обновление",
          "hintHealth": "Поза казни",
          "hintProgress": "Полное завершение",
          "hintProcedures": "Полный против общего",
          "hintOpenFindings": "Требуется разрешение",
          "hintResolvedFindings": "Закрыто или решено",
          "hintPendingReview": "Ожидание разрешения",
          "hintOutstanding": "Неполные процедуры",
          "hintAuditors": "Уникальные правопреемники",
          "hintOpenNotes": "Подготовительная документация",
          "hintReviewNotes": "[[ОБЗОР]] комментарий",
          "hintTickmarks": "Примененные отметки",
          "hintComments": "Командное обсуждение",
          "hintProgram": "Жизненный цикл программы",
          "hintGroups": "Области аудита",
          "hintLastUpdate": "Самое последнее изменение",
          "healthOnTrack": "На ходу",
          "healthMonitor": "Мониторинг",
          "healthAttention": "Требует внимания",
          "emptyReviewQueue": "[[ОБЗОР]] очередь пуста",
          "emptyReviewQueueDescription": "Никаких процедур, ожидающих рассмотрения [[ОБЗОР]].",
          "emptyOutstanding": "Никаких невыполненных процедур",
          "emptyOutstandingDescription": "Все процедуры завершены или очищены.",
          "emptyFindings": "Нет открытых выводов",
          "emptyFindingsDescription": "Открытые результаты появятся после их документирования.",
          "emptySeverity": "Нет результатов",
          "emptySeverityDescription": "Распределение тяжести появляется при наличии результатов.",
          "emptyAssigned": "Нет назначенной работы",
          "emptyAssignedDescription": "Назначьте аудиторов для процедур, чтобы начать выполнение.",
          "emptyPapers": "Нет [[РАБОЧИЕ_ДОКУМЕНТЫ]]",
          "emptyPapersDescription": "Добавьте рабочие документы к документированию работы по аудиту.",
          "emptyDocuments": "Нет недавних документов",
          "emptyDocumentsDescription": "рабочие документы будут появляться по мере их создания.",
          "emptyEvidence": "Нет [[ДОКАЗАТЕЛЬСТВА]]",
          "emptyEvidenceDescription": "Загрузите [[ДОКАЗАТЕЛЬСТВА]] для поддержки процедур.",
          "emptyTimeline": "Нет событий временной шкалы",
          "emptyTimelineDescription": "Здесь будут отображаться сроки выполнения и действия.",
          "emptyReviewNotes": "Нет [[ОБЗОР]] примечаний",
          "emptyReviewNotesDescription": "[[ОБЗОР]] примечания появляются во время очистки.",
          "emptyComments": "Без комментариев",
          "emptyCommentsDescription": "Внутренние комментарии фиксируются во время [[ПОЛЕВОЙ РАБОТЫ]].",
          "emptyActivity": "Нет активности",
          "emptyActivityDescription": "Здесь будут записываться события полевые работы."
        },
        "navGroups": {
          "overview": "Панель",
          "program": "Программа",
          "execution": "Исполнение",
          "documentation": "Документация",
          "governance": "Управление",
          "admin": "Администрирование"
        },
        "heroEyebrow": "Полевые аудиторские работы",
        "sections": {
          "overview": {
            "title": "Панель полевых работ",
            "description": "Прогресс, назначения и показатели выполнения."
          },
          "program": {
            "title": "Аудиторская программа",
            "description": "Утверждённая версия программы, управляющая выполнением процедур."
          },
          "procedure-groups": {
            "title": "Группы процедур",
            "description": "Сгруппированные области аудита и прогресс завершения."
          },
          "procedures": {
            "title": "Аудиторские процедуры",
            "description": "Назначаемые единицы аудиторской работы с отслеживанием статуса."
          },
          "working-papers": {
            "title": "Рабочие документы",
            "description": "Документация, метки и выводы."
          },
          "evidence": {
            "title": "Реестр доказательств",
            "description": "Индексированные аудиторские доказательства и вложения."
          },
          "findings": {
            "title": "Выявления",
            "description": "Искажения, недостатки и рекомендации."
          },
          "notes": {
            "title": "Заметки аудитора",
            "description": "Документация исполнителя и профессиональное суждение."
          },
          "review-notes": {
            "title": "Заметки проверки",
            "description": "Комментарии рецензента и отслеживание завершения проверки."
          },
          "comments": {
            "title": "Внутренние комментарии",
            "description": "Обсуждение команды, зафиксированное во время полевых работ."
          },
          "history": {
            "title": "История полевых работ",
            "description": "Хронологическая активность и аудиторский след."
          },
          "settings": {
            "title": "Настройки полевых работ",
            "description": "Архивируйте или восстанавливайте этот пакет полевых работ."
          }
        }
      }
    },
    "riskAssessment": {
      "workspace": {
        "commandCenter": {
          "heroTitle": "Центр управления рисками предприятия",
          "executiveTitle": "Рейтинги рисков",
          "summaryTitle": "Сводка рисков",
          "metricsTitle": "Метрики оценки",
          "kpisTitle": "Ключевые показатели эффективности рисков",
          "workflowTitle": "[[УТВЕРЖДЕНИЕ]] рабочий процесс",
          "workflowDescription": "Черновой вариант интегрированного — выделен текущий этап.",
          "reviewQueueTitle": "[[ОБЗОР]] очередь",
          "reviewQueueDescription": "оценка рисков ожидает утверждения партнера или менеджера.",
          "heatmapTitle": "Тепловая карта рисков",
          "heatmapDescription": "Распределение рейтингов риска на уровне утверждений.",
          "matrixTitle": "Матрица рисков",
          "matrixDescription": "Рейтинги риска аккаунтов и утверждений p[[ОБЗОР]].",
          "distributionTitle": "Распределение по категориям",
          "distributionDescription": "Элементы риска сгруппированы по настроенным категориям.",
          "significantTitle": "Значительные риски",
          "significantDescription": "Высокоприоритетные риски, требующие целенаправленного аудиторского реагирования.",
          "openResponsesTitle": "Открытые ответы",
          "openResponsesDescription": "Элементы риска без документированных ответов.",
          "outstandingProceduresTitle": "Выдающиеся процедуры",
          "outstandingProceduresDescription": "Значительные риски без связанных процедур.",
          "responsesTitle": "Реагирование на риски",
          "responsesDescription": "Документированные меры реагирования на выявленные риски.",
          "proceduresTitle": "Связанные процедуры",
          "proceduresDescription": "Аудиторские процедуры, связанные с элементами риска.",
          "reviewNotesTitle": "[[ОБЗОР]] примечания",
          "reviewNotesDescription": "Комментарий партнера и менеджера [[ОБЗОР]].",
          "commentsTitle": "Комментарии",
          "commentsDescription": "Примечания для внутреннего сотрудничества по оценка рисков.",
          "recentChangesTitle": "Недавние изменения",
          "recentChangesDescription": "Публикации, [[ОДОБРАЖЕНИЯ]] и обновления регистров.",
          "activityTitle": "Лента активности",
          "activityDescription": "Последние события в рабочей области оценка рисков.",
          "stepDraft": "Черновик",
          "stepSubmitted": "Поданный",
          "stepUnderReview": "В разделе [[ОБЗОР]]",
          "stepReturned": "Вернулся",
          "stepApproved": "Одобренный",
          "stepIntegrated": "Интегрированный",
          "packageVersion": "Версия",
          "lastUpdate": "Последнее обновление",
          "openWorkflow": "[[ОБЗОР]] рабочий процесс",
          "viewHistory": "Посмотреть полную историю",
          "viewMatrix": "Открыть полную матрицу",
          "viewReviewNotes": "Просмотреть заметки [[ОБЗОР]]",
          "significant": "Значительный",
          "unrated": "Без рейтинга",
          "notSet": "Не установлено",
          "notLinked": "Не связано",
          "uncategorized": "Без категории",
          "accountColumn": "Счет",
          "assertionColumn": "Утверждение",
          "ratingColumn": "Рейтинг",
          "kpiOverall": "Общий рейтинг риска",
          "kpiInherent": "Неотъемлемый риск",
          "kpiControl": "Контролировать риск",
          "kpiDetection": "Риск обнаружения",
          "kpiResidual": "Остаточный риск",
          "kpiFraud": "Риски мошенничества",
          "kpiIt": "ИТ-риски",
          "kpiCompliance": "Комплаенс-риски",
          "kpiFinancial": "Риски финансовой отчетности",
          "kpiSignificant": "Значительные риски",
          "kpiAssertionCoverage": "Покрытие утверждений",
          "kpiWorkflow": "Статус рабочего процесса",
          "kpiApproval": "Статус [[УТВЕРЖДЕНИЕ]]",
          "kpiPendingReview": "В ожидании [[[[ОБЗОР]]]]",
          "kpiOpenItems": "Объекты открытого риска",
          "kpiOwners": "Назначенные владельцы",
          "kpiLastUpdate": "Последнее обновление",
          "kpiHealth": "Риск для здоровья",
          "kpiProgress": "Прогресс",
          "kpiCategories": "Категории",
          "kpiResponses": "Ответы",
          "kpiProcedures": "Процедуры",
          "kpiComments": "Комментарии",
          "hintOverall": "Самый высокий остаточный рейтинг",
          "hintInherent": "Максимальный собственный рейтинг",
          "hintControl": "Максимальный рейтинг управления",
          "hintDetection": "Максимальный рейтинг обнаружения",
          "hintResidual": "Максимальный остаточный рейтинг",
          "hintFraud": "Документированные риски мошенничества",
          "hintIt": "Технологические риски",
          "hintCompliance": "Регуляторные риски",
          "hintFinancial": "Риски FSL",
          "hintSignificant": "Требует целенаправленного ответа",
          "hintAssertionCoverage": "Номинальные ячейки утверждений",
          "hintWorkflow": "[[УТВЕРЖДЕНИЕ]] состояние",
          "hintPendingReview": "Ожидание подписания",
          "hintOpenItems": "Неполная документация",
          "hintOwners": "Уникальные владельцы риска",
          "hintLastUpdate": "Самое последнее изменение",
          "hintHealth": "Оценочная поза",
          "hintProgress": "Полное завершение",
          "hintCategories": "Настроенные категории",
          "hintResponses": "Документированные ответы",
          "hintProcedures": "Связанные процедуры",
          "hintComments": "Примечания о сотрудничестве",
          "healthOnTrack": "На ходу",
          "healthMonitor": "Мониторинг",
          "healthAttention": "Требует внимания",
          "changeApproved": "оценка рисков одобрено",
          "changeApprovedDescription": "Оценка одобрена для использования в [[ПОЛЕВЫХ РАБОТАХ]].",
          "changeSubmitted": "Отправлено для [[ОБЗОР]]",
          "changeSubmittedDescription": "Оценка отправлена ​​задание проверкаer.",
          "emptyMatrix": "Нет матричных данных",
          "emptyMatrixDescription": "Рейтинги утверждений появятся по мере заполнения матрицы.",
          "emptyCategories": "Нет категорий",
          "emptyCategoriesDescription": "Настройте категории для организации элементов риска.",
          "emptySignificant": "Никаких существенных рисков",
          "emptySignificantDescription": "При выявлении появятся значительные риски.",
          "emptyOpenResponses": "Все риски отреагировали",
          "emptyOpenResponsesDescription": "Каждый элемент риска имеет документированное реагирование.",
          "emptyProcedures": "Никаких невыполненных процедур",
          "emptyProceduresDescription": "Все существенные риски связаны с процедурами.",
          "emptyResponsesList": "Нет ответов",
          "emptyResponsesListDescription": "Документируйте меры реагирования на выявленные риски.",
          "emptyProceduresList": "Нет связанных процедур",
          "emptyProceduresListDescription": "Свяжите аудиторские процедуры со значительными рисками.",
          "emptyReviewNotes": "Нет [[ОБЗОР]] примечаний",
          "emptyReviewNotesDescription": "Примечания [[ПРОСМОТР]] появляются во время рабочего процесса [[УТВЕРЖДЕНИЕ]].",
          "emptyComments": "Без комментариев",
          "emptyCommentsDescription": "Комментарии записываются во время совместной работы.",
          "emptyChanges": "Нет недавних изменений",
          "emptyChangesDescription": "Здесь будут появляться события рабочего процесса.",
          "emptyActivity": "Нет активности",
          "emptyActivityDescription": "Здесь будут записываться события оценка рисков."
        },
        "navGroups": {
          "overview": "Панель",
          "register": "Реестр рисков",
          "analysis": "Анализ",
          "response": "Реагирование",
          "governance": "Управление",
          "admin": "Администрирование"
        },
        "heroEyebrow": "Оценка риска",
        "sections": {
          "overview": {
            "title": "Панель управления рисками",
            "description": "Индикаторы статуса, прогресса и готовности к обзору."
          },
          "inherent-risks": {
            "title": "Неотъемлемые риски",
            "description": "Риски, прежде чем рассматривать соответствующие меры контроля."
          },
          "control-risks": {
            "title": "Контролируйте риски",
            "description": "Риски, связанные с разработкой и функционированием средств контроля."
          },
          "detection-risks": {
            "title": "Риски обнаружения",
            "description": "Риски того, что процедуры не смогут обнаружить искажения."
          },
          "fraud-risks": {
            "title": "Риски мошенничества",
            "description": "Факторы риска мошенничества и руководство имеют приоритет над соображениями."
          },
          "it-risks": {
            "title": "ИТ-риски",
            "description": "Риски, связанные с технологиями, доступом к системе и целостностью данных."
          },
          "compliance-risks": {
            "title": "Комплаенс-риски",
            "description": "Риски, связанные с соблюдением нормативных требований и законодательства."
          },
          "financial-statement-risks": {
            "title": "Риски финансовой отчетности",
            "description": "Риски существенного искажения на уровне финансовой отчетности."
          },
          "assertion-risks": {
            "title": "Риски утверждений",
            "description": "Риски уровня утверждений, связанные с соответствующими учетными записями."
          },
          "significant-risks": {
            "title": "Значительные риски",
            "description": "Высокоприоритетные риски, требующие целенаправленного аудиторского реагирования."
          },
          "categories": {
            "title": "Категории рисков",
            "description": "Настроенные категории, используемые для организации элементов риска."
          },
          "scoring": {
            "title": "Подсчет очков",
            "description": "Совокупные скоринговые показатели по выявленным рискам."
          },
          "heatmap": {
            "title": "Тепловая карта",
            "description": "Визуальное распределение рейтингов риска."
          },
          "matrix": {
            "title": "Матрица утверждений",
            "description": "Обзор рейтингов аккаунтов и утверждений."
          },
          "responses": {
            "title": "Реагирование на риски",
            "description": "Запланированные меры реагирования на выявленные риски."
          },
          "procedures": {
            "title": "Ссылки на процедуры",
            "description": "Связанные процедуры устранения оцененных рисков."
          },
          "owners": {
            "title": "Владельцы риска",
            "description": "Назначены владельцы для каждого элемента риска."
          },
          "review-notes": {
            "title": "Обзор примечаний",
            "description": "Заметки рецензента, сделанные во время циклов оценки рисков."
          },
          "comments": {
            "title": "Комментарии",
            "description": "Внутренние комментарии и заметки о сотрудничестве."
          },
          "history": {
            "title": "История",
            "description": "График внесения изменений и утверждений в оценку рисков."
          },
          "settings": {
            "title": "Настройки",
            "description": "Архивируйте и восстанавливайте элементы управления для этой оценки риска."
          }
        }
      }
    },
    "materiality": {
      "workspace": {
        "commandCenter": {
          "heroTitle": "ISA 320 [[МАТЕРИАЛЬНОСТЬ]] командный центр",
          "executiveTitle": "[[МАТЕРИАЛЬНОСТЬ]] пороговые значения",
          "summaryTitle": "[[МАТЕРИАЛЬНОСТЬ]] резюме",
          "metricsTitle": "Метрики пакета",
          "workflowTitle": "[[УТВЕРЖДЕНИЕ]] рабочий процесс",
          "workflowDescription": "Черновой вариант интегрированного — выделен текущий этап.",
          "approvalQueueTitle": "[[УТВЕРЖДЕНИЕ]] очередь",
          "approvalQueueDescription": "Пакеты существенность ожидают утверждения партнером или менеджером.",
          "calculationBreakdownTitle": "Разбивка расчета",
          "calculationBreakdownDescription": "В целом, производительность и тривиальные вычисления идут гладко.",
          "benchmarkComparisonTitle": "Сравнительное сравнение",
          "benchmarkComparisonDescription": "Ранжированы контрольные суммы и рассчитана [[МАТЕРИАЛЬНОСТЬ]].",
          "calculationHistoryTitle": "История расчетов",
          "calculationHistoryDescription": "Записанные расчеты и ручные корректировки.",
          "selectedBenchmarkTitle": "Выбранный тест",
          "selectedBenchmarkDescription": "Основа для общего определения [[МАТЕРИАЛЬНОСТИ]].",
          "versionTimelineTitle": "Хронология версий",
          "versionTimelineDescription": "Снимки версий пакетов и сводки изменений.",
          "reviewNotesTitle": "[[ОБЗОР]] примечания",
          "reviewNotesDescription": "Комментарии партнера и менеджера [[ОБЗОР]].",
          "commentsTitle": "Комментарии",
          "commentsDescription": "[[ОБЗОР]] и внутреннее обсуждение [[МАТЕРИАЛЬНОСТИ]].",
          "recentChangesTitle": "Недавние изменения",
          "recentChangesDescription": "Отправки, возвраты, [[УТВЕРЖДЕНИЯ]] и обновления версий.",
          "activityTitle": "Лента активности",
          "activityDescription": "Последние события в рабочей области существенность.",
          "stepDraft": "Черновик",
          "stepSubmitted": "Поданный",
          "stepUnderReview": "В разделе [[ОБЗОР]]",
          "stepReturned": "Вернулся",
          "stepApproved": "Одобренный",
          "stepIntegrated": "Интегрированный",
          "packageVersion": "Версия",
          "lastUpdate": "Последнее обновление",
          "openWorkflow": "[[ОБЗОР]] рабочий процесс",
          "viewHistory": "Посмотреть полную историю",
          "viewComments": "Посмотреть все комментарии",
          "selected": "Выбрано",
          "override": "Переопределить",
          "benchmarkColumn": "Контрольный показатель",
          "amountColumn": "Количество",
          "percentageColumn": "Процент",
          "calculatedColumn": "Рассчитано",
          "versionLabel": "Версия",
          "ofOverall": "общего числа",
          "moreItems": "более",
          "specificItems": "предметы",
          "notSet": "Не установлено",
          "kpiOverall": "Общая [[МАТЕРИАЛЬНОСТЬ]]",
          "kpiPerformance": "Производительность [[МАТЕРИАЛЬНОСТЬ]]",
          "kpiSpecific": "Конкретный [[МАТЕРИАЛЬНОСТЬ]]",
          "kpiTrivial": "Явно тривиальный порог",
          "kpiBenchmark": "Выбранный тест",
          "kpiPercentage": "Выбранный процент",
          "kpiMethod": "Метод расчета",
          "kpiStatus": "Статус [[УТВЕРЖДЕНИЕ]]",
          "kpiWorkflow": "Статус рабочего процесса",
          "kpiVersion": "Версия",
          "kpiPendingReview": "Ожидается [[ОБЗОР]]",
          "kpiOpenItems": "Открытые позиции",
          "kpiLastUpdate": "Последнее обновление",
          "kpiReviewer": "Назначен [[ОБЗОР]]er",
          "hintOverall": "Общий порог ISA 320",
          "hintPerformance": "Рабочая [[МАТЕРИАЛЬНОСТЬ]]",
          "hintSpecific": "Пороговые значения на уровне аккаунта",
          "hintTrivial": "Явно мизерная сумма",
          "hintBenchmark": "Выбранная основа",
          "hintPercentage": "Применяемая ставка",
          "hintMethod": "Подход к определению",
          "hintWorkflow": "[[УТВЕРЖДЕНИЕ]] состояние",
          "hintVersion": "Версия пакета",
          "hintPendingReview": "Ожидание подписания",
          "hintOpenItems": "Неполная документация",
          "hintLastUpdate": "Самое последнее изменение",
          "hintReviewer": "[[ОБЗОР]] задание",
          "reviewerNotAssigned": "Не назначено",
          "methodNotSet": "Не определено",
          "methodManualOverride": "Ручное переопределение",
          "methodBenchmarkPct": "Контрольный показатель × процент",
          "changeApproved": "[[МАТЕРИАЛЬНОСТЬ]] одобрено",
          "changeApprovedDescription": "Пакет одобрен для использования в полевые работы.",
          "changeReturned": "Вернулся на доработку",
          "changeReturnedDescription": "Посылка возвращена с примечаниями к [[ОБЗОР]].",
          "changeSubmitted": "Отправлено для [[ОБЗОР]]",
          "changeSubmittedDescription": "Пакет отправлен задание проверкаer.",
          "versionCreated": "Снимок версии создан.",
          "emptyBenchmarks": "Нет тестов",
          "emptyBenchmarksDescription": "Добавьте тесты для сравнения баз существенность.",
          "emptyCalculations": "Никаких расчетов",
          "emptyCalculationsDescription": "Запишите расчеты из раздела тестов.",
          "emptyVersions": "Нет версий",
          "emptyVersionsDescription": "Снимки версий появляются при изменении пакета.",
          "emptyReviewNotes": "Нет [[ОБЗОР]] примечаний",
          "emptyReviewNotesDescription": "Примечания [[ПРОСМОТР]] появляются во время рабочего процесса [[УТВЕРЖДЕНИЕ]].",
          "emptyComments": "Без комментариев",
          "emptyCommentsDescription": "Комментарии записываются во время [[ОБЗОР]].",
          "emptyChanges": "Нет недавних изменений",
          "emptyChangesDescription": "Здесь будут отображаться события и версии рабочего процесса.",
          "emptyActivity": "Нет активности",
          "emptyActivityDescription": "Здесь будут записываться события существенность."
        },
        "navGroups": {
          "overview": "Панель",
          "thresholds": "Пороги",
          "analysis": "Анализ",
          "governance": "Управление",
          "admin": "Администрирование"
        }
      }
    }
  },
  "tr": {
    "companies": {
      "workspace": {
        "commandCenter": {
          "heroTitle": "Şirket komuta merkezi",
          "heroSubtitle": "Bu varlık için görev sağlığı, uyum durumu ve denetim ilerlemesi.",
          "healthTitle": "Şirket sağlığı",
          "executiveTitle": "Yönetici özeti",
          "moduleProgressTitle": "Denetim modülü ilerlemesi",
          "moduleProgressDescription": "Şirket görevlerinde planlama, önemlilik, risk ve saha çalışması.",
          "activeEngagementsTitle": "Aktif görevler",
          "activeEngagementsDescription": "Bu şirket için devam eden denetim ve güvence çalışmaları.",
          "recentActivityTitle": "Son etkinlik",
          "recentActivityDescription": "Bu şirket için kaydedilen son değişiklikler.",
          "recentDocumentsTitle": "Son belgeler",
          "recentDocumentsDescription": "Şirket görevlerine eklenen planlama belgeleri.",
          "recentCommentsTitle": "Son yorumlar",
          "recentCommentsDescription": "Önemlilik ve risk çalışma alanlarından inceleme notları.",
          "financialTitle": "Finansal özet",
          "financialDescription": "Raporlama çerçevesi, para birimi ve mali yıl yapılandırması.",
          "complianceTitle": "Uyum durumu",
          "complianceDescription": "Düzenleyici durum ve doğrulama hazırlığı.",
          "deadlinesTitle": "Yaklaşan son tarihler",
          "deadlinesDescription": "Aktif görevler için raporlama dönemi sonları.",
          "teamTitle": "Atanan ekip",
          "teamDescription": "Şirket denetimlerindeki görev ekip üyeleri.",
          "pendingReviewsTitle": "Bekleyen incelemeler",
          "pendingReviewsHint": "Onay bekleyen planlama, önemlilik, risk ve saha çalışması.",
          "kpiHealth": "Sağlık",
          "kpiActiveEngagements": "Aktif görevler",
          "kpiPendingReviews": "Bekleyen incelemeler",
          "kpiOpenFindings": "Açık bulgular",
          "kpiOverdue": "Gecikmiş",
          "kpiPlanningProgress": "Planlama",
          "kpiFieldworkProgress": "Saha çalışması",
          "kpiTeamMembers": "Ekip üyeleri",
          "hintHealth": "Genel çalışma alanı durumu",
          "hintEngagements": "Bu şirket için devam eden",
          "hintReviews": "Onay bekliyor",
          "hintFindings": "Çözülmemiş saha çalışması maddeleri",
          "hintOverdue": "Dönem sonu geçti",
          "hintPlanning": "Ortalama kontrol listesi ilerlemesi",
          "hintFieldwork": "Ortalama yürütme ilerlemesi",
          "hintTeam": "Görevler genelinde",
          "healthOnTrack": "Yolunda",
          "healthMonitor": "İzleme",
          "healthAttention": "Dikkat gerekiyor",
          "modulePlanning": "Planlama",
          "moduleMateriality": "Önemlilik",
          "moduleRisk": "Risk değerlendirmesi",
          "moduleFieldwork": "Saha çalışması",
          "statusActive": "Aktif",
          "statusReview": "İncelemede",
          "statusNotStarted": "Başlamadı",
          "pendingReview": "İnceleme bekliyor",
          "complianceValidated": "Doğrulandı",
          "compliancePending": "Doğrulama bekliyor",
          "complianceStatus": "Durum",
          "jurisdiction": "Yargı alanı",
          "activeEngagementsLabel": "Aktif görevler",
          "framework": "Çerçeve",
          "currency": "Para birimi",
          "fiscalYear": "Mali yıl sonu",
          "entityType": "Varlık türü",
          "industry": "Sektör",
          "viewFinancial": "Finansal profile bak",
          "viewCompliance": "Uyuma bak",
          "overdue": "Gecikmiş",
          "engagementCount": "{count} görev",
          "actionViewEngagements": "Görevleri görüntüle",
          "actionCreateEngagement": "Görev oluştur",
          "actionOpenPlanning": "Planlamayı aç",
          "actionOpenRisk": "Riski aç",
          "actionOpenFieldwork": "Saha çalışmasını aç",
          "actionOpenMateriality": "Önemliliği aç",
          "emptyEngagements": "Görev yok",
          "emptyEngagementsDescription": "Bu şirket için denetim çalışmasına başlamak üzere bir görev oluşturun.",
          "emptyActivity": "Son etkinlik yok",
          "emptyActivityDescription": "Şirket değişiklikleri etkinlik zaman çizelgesinde görünecek.",
          "emptyDocuments": "Belge yok",
          "emptyDocumentsDescription": "Planlama belgeleri eklendikçe görünecek.",
          "emptyComments": "Yorum yok",
          "emptyCommentsDescription": "İnceleme yorumları önemlilik ve riskten görünecek.",
          "emptyDeadlines": "Yaklaşan son tarih yok",
          "emptyDeadlinesDescription": "Görev dönem sonları burada görünecek.",
          "emptyTeam": "Ekip atanmadı",
          "emptyTeamDescription": "Ekip üyeleri şirket görevlerine eklendiğinde görünür.",
          "activityCreated": "Şirket oluşturuldu",
          "activityUpdated": "Şirket güncellendi",
          "activitySettings": "Ayarlar güncellendi",
          "activityArchived": "Şirket arşivlendi",
          "activityRestored": "Şirket geri yüklendi",
          "activityGeneric": "Şirket denetim izinde kaydedildi"
        },
        "heroEyebrow": "Şirket çalışma alanı",
        "sections": {
          "overview": {
            "title": "Genel bakış",
            "description": "Bu şirketin raporlama kimliğinin sakin bir özeti.",
            "highlightsTitle": "Öne çıkanlar",
            "highlightsDescription": "Bağlam ve sınıflandırma bir bakışta.",
            "noDescription": "Henüz şirket açıklaması eklenmedi."
          },
          "identity": {
            "title": "Kimlik"
          },
          "financial": {
            "title": "Finansal",
            "description": "Raporlama çerçevesi, para birimi ve mali yıl yapılandırması.",
            "cardTitle": "Finansal raporlama profili",
            "cardDescription": "Varlığın finansal ayarlarının salt okunur görünümü."
          },
          "compliance": {
            "title": "Uyum",
            "description": "Görevler, beyanlar ve düzenleyici durum.",
            "emptyTitle": "Uyum yapılandırılmadı",
            "emptyDescription": "Görevler ve yükümlülükler yapılandırıldığında uyum takibi burada görünecek."
          },
          "contacts": {
            "title": "İletişim",
            "description": "Bu varlık için finans ve dış denetçi iletişim bilgileri.",
            "emptyTitle": "Kayıtlı iletişim yok",
            "emptyDescription": "Birincil finans ve denetçi iletişimleri eklendiğinde burada görünecek.",
            "financeEmptyTitle": "Finans iletişimi yok",
            "financeEmptyDescription": "Bu şirket için birincil finans iletişimi kaydedilmedi.",
            "auditorEmptyTitle": "Denetçi iletişimi yok",
            "auditorEmptyDescription": "Bu şirket için dış denetçi iletişimi kaydedilmedi."
          },
          "history": {
            "title": "Geçmiş",
            "description": "Bu şirket için kronolojik etkinlik ve denetim izi.",
            "emptyTitle": "Henüz etkinlik yok",
            "emptyDescription": "Platformda değişiklikler kaydedildikçe etkinlik geçmişi burada görünecek."
          },
          "settings": {
            "title": "Ayarlar",
            "description": "Bu şirket çalışma alanı için yapılandırma özeti.",
            "configurationTitle": "Yapılandırma",
            "configurationDescription": "Bu varlık için tercihler ve sürümleme.",
            "addressesTitle": "Adresler",
            "addressesDescription": "Kayıtlı tescil ve faaliyet adresleri.",
            "registeredAddress": "Tescil adresi",
            "operatingAddress": "Faaliyet adresi",
            "defaultLocale": "Varsayılan dil",
            "dataImportSource": "Veri içe aktarma kaynağı",
            "roundingConvention": "Yuvarlama kuralı",
            "recordVersion": "Kayıt sürümü",
            "settingsVersion": "Ayar sürümü",
            "validationTitle": "Doğrulama",
            "validationDescription": "Şirket ayarları için şema doğrulama meta verileri.",
            "schemaVersion": "Şema sürümü",
            "validatedAt": "Son doğrulama"
          }
        }
      }
    },
    "engagements": {
      "workspace": {
        "commandCenter": {
          "heroTitle": "Denetim komuta merkezi",
          "overallCompletion": "Genel tamamlanma",
          "executiveTitle": "Yönetici Özeti",
          "auditHealthTitle": "Denetim durumunu",
          "auditMetricsTitle": "Denetim metrikleri",
          "pipelineTitle": "Denetim aşaması hattı",
          "pipelineDescription": "Tamamlama boyunca [[PLANLAMA]] - her aşama için durum, ilerleme ve gezinme.",
          "reviewQueueTitle": "[[İNCELEME]] kuyruğu",
          "reviewQueueDescription": "İş ortağının veya yöneticinin imzasını bekleyen öğeler.",
          "outstandingTitle": "Öne çıkan sorunlar",
          "outstandingDescription": "Bulgular ve çözüm gerektiren açık öğeler.",
          "activityTitle": "Son etkinlik",
          "activityDescription": "Bu görev genelindeki son değişiklikler.",
          "timelineTitle": "Denetim zaman çizelgesi",
          "timelineDescription": "Kronolojik görev olaylar.",
          "documentsTitle": "Son belgeler",
          "documentsDescription": "Bu [[İNŞAAT]]'a eklenen [[PLANLAMA]] belgeleri.",
          "teamTitle": "Atanan ekip",
          "teamDescription": "[[KATILIM]] ekip üyeleri ve rolleri.",
          "decisionsTitle": "Son kararlar",
          "decisionsDescription": "Bu görev için kaydedilen [[ONAY]]'lar ve imzalar.",
          "commentsTitle": "Son yorumlar",
          "commentsDescription": "önemlilik ve risk çalışma alanlarından inceleme notları.",
          "companyHealthTitle": "Şirket sağlığı",
          "companyHealthDescription": "Müşteri varlık doğrulaması ve raporlama duruşu.",
          "phaseReview": "[[GÖZDEN GEÇİRMEK]]",
          "phaseCompletion": "Tamamlama",
          "statusReview": "[[İNCELEME]] içinde",
          "statusClear": "Temizlemek",
          "openReviewQueue": "[[İNCELEME]] sırasını aç",
          "openSettings": "[[KATILIM]] ayarları",
          "owner": "Mal sahibi",
          "lastUpdate": "Güncellendi",
          "overdue": "vadesi geçmiş",
          "deadline": "Son teslim tarihi",
          "reportingPeriod": "Raporlama dönemi",
          "plannedSchedule": "Planlanan program",
          "validationStatus": "Doğrulama",
          "framework": "Çerçeve",
          "jurisdiction": "Yargı yetkisi",
          "viewHistory": "Tüm geçmişi görüntüle",
          "kpiAuditHealth": "Denetim durumunu",
          "kpiCompletion": "Tamamlama",
          "kpiPendingReviews": "Beklemede [[[[İNCELEME]]]]",
          "kpiOpenFindings": "Bulguları aç",
          "kpiLifecycle": "Yaşam döngüsü",
          "kpiPlanning": "[[PLANLAMA]]",
          "kpiFieldwork": "[[SAHA ÇALIŞMASI]]",
          "kpiTeam": "Takım",
          "kpiMateriality": "[[MALZEME]]",
          "kpiRisk": "Risk değerlendirmesi",
          "kpiProcedures": "Prosedürler",
          "kpiSignificantRisks": "Önemli riskler",
          "hintAuditHealth": "[[KATILIM]] duruşu",
          "hintCompletion": "Tüm aşamalarda ağırlıklı",
          "hintReviews": "İmza bekleniyor",
          "hintFindings": "saha çalışması bulgularını aç",
          "hintLifecycle": "Mevcut aşama",
          "hintPlanning": "Kontrol listesi ilerlemesi",
          "hintFieldwork": "Yürütme ilerlemesi",
          "hintTeam": "Atanan üyeler",
          "hintMateriality": "ISA 320 ilerlemesi",
          "hintRisk": "Değerlendirme ilerlemesi",
          "hintProcedures": "Toplam prosedürler",
          "hintSignificant": "Belirlenen önemli riskler",
          "healthOnTrack": "Yolda",
          "healthMonitor": "İzleme",
          "healthAttention": "Dikkat edilmesi gerekiyor",
          "modulePlanning": "[[PLANLAMA]]",
          "moduleMateriality": "[[MALZEME]]",
          "moduleRisk": "Risk değerlendirmesi",
          "issueFindings": "Bulguları aç",
          "issueRiskItems": "Riskli öğeleri aç",
          "issueMaterialityItems": "önemlilik öğeyi aç",
          "companyValidated": "Doğrulandı",
          "companyPending": "Doğrulama bekleniyor",
          "decisionPlanningApproved": "[[PLANLAMA]] onaylandı",
          "decisionMaterialityApproved": "önemlilik onaylandı",
          "decisionRiskApproved": "risk değerlendirmesi onaylandı",
          "emptyActivity": "Yakın zamanda etkinlik yok",
          "emptyActivityDescription": "görev etkinlikleri burada görünecek.",
          "emptyTimeline": "Zaman çizelgesi etkinliği yok",
          "emptyTimelineDescription": "Çalışma ilerledikçe etkinlik kaydedilecektir.",
          "emptyDocuments": "Belge yok",
          "emptyDocumentsDescription": "[[PLANLAMA]] dokümanları burada görünecek.",
          "emptyTeam": "Hiçbir ekip atanmadı",
          "emptyTeamDescription": "Bu görev'a personel alımına başlamak için üyeleri ekleyin.",
          "emptyDecisions": "Hiçbir karar kaydedilmedi",
          "emptyDecisionsDescription": "Oturum kapatıldıktan sonra onay'lar görünecektir.",
          "emptyComments": "Yorum yok",
          "emptyCommentsDescription": "Modül çalışma alanlarından inceleme yorum görünecek."
        },
        "heroEyebrow": "Görev çalışma alanı",
        "sections": {
          "overview": {
            "title": "Genel bakış",
            "description": "Bu görevin sakin bir genel bakış görüntüsü.",
            "highlightsTitle": "Öne çıkanlar",
            "highlightsDescription": "Bağlam ve durum bir bakışta.",
            "noDescription": "Henüz görev açıklaması eklenmedi."
          },
          "members": {
            "title": "Üyeler"
          },
          "history": {
            "title": "Geçmiş",
            "description": "Bu görev için kronolojik etkinlik ve denetim izi.",
            "emptyTitle": "Henüz etkinlik yok",
            "emptyDescription": "Değişiklikler kaydedildikçe etkinlik geçmişi burada görünecek."
          },
          "settings": {
            "title": "Ayarlar",
            "description": "Bu görev için yapılandırma ve yaşam döngüsü kontrolleri."
          }
        }
      }
    },
    "planning": {
      "workspace": {
        "commandCenter": {
          "heroTitle": "[[PLANLAMA]] komuta merkezi",
          "executiveTitle": "Yönetici Özeti",
          "healthTitle": "[[PLANLAMA]] sağlık",
          "metricsTitle": "[[PLANLAMA]] metrikleri",
          "workflowTitle": "[[ONAY]] iş akışı",
          "workflowDescription": "Entegre edilmiş taslak — mevcut adım vurgulanmıştır.",
          "reviewQueueTitle": "[[İNCELEME]] kuyruğu",
          "reviewQueueDescription": "İş ortağının veya yöneticinin onayını bekleyen [[PLANLAMA]] paketler.",
          "checklistTitle": "[[PLANLAMA]] kontrol listesi",
          "checklistDescription": "saha çalışması öncesinde gerekli olan temel teslimatlar.",
          "outstandingTitle": "Olağanüstü görevler",
          "outstandingDescription": "Tamamlanması gereken kontrol listesi öğelerini açın.",
          "activityTitle": "Son etkinlik",
          "activityDescription": "Bu denetim planındaki son değişiklikler.",
          "changesTitle": "Son değişiklikler",
          "changesDescription": "Güncellemeler, gönderimler ve [[ONAY]]'lar.",
          "calendarTitle": "[[PLANLAMA]] takvim",
          "calendarDescription": "görev boyunca kilometre taşı tarihleri.",
          "documentsTitle": "[[PLANLAMA]] dokümanları",
          "documentsDescription": "Memorandum ve destekleyici referanslar.",
          "notesTitle": "[[PLANLAMA]] notları",
          "notesDescription": "Dahili [[PLANLAMA]] bağlamı ve yargısı.",
          "teamTitle": "Atanan ekip",
          "teamDescription": "görev kadrosu ve kapasitesi.",
          "stepDraft": "Taslak",
          "stepSubmitted": "Gönderildi",
          "stepUnderReview": "[[İNCELEME]] altında",
          "stepReturned": "İade edildi",
          "stepApproved": "Onaylı",
          "stepIntegrated": "Entegre",
          "overdue": "vadesi geçmiş",
          "deadline": "Son teslim tarihi",
          "complete": "Tamamlamak",
          "open": "Açık",
          "openWorkflow": "[[İNCELEME]] iş akışı",
          "viewHistory": "Tüm geçmişi görüntüle",
          "viewNotes": "[[PLANLAMA]] notlarını görüntüle",
          "estimatedHours": "Tahmini saatler",
          "planVersion": "Sürüm",
          "kpiHealth": "Sağlık",
          "kpiProgress": "İlerlemek",
          "kpiChecklist": "Kontrol listesi",
          "kpiWorkflow": "İş akışı",
          "kpiStatus": "Durum",
          "kpiFramework": "Çerçeve",
          "kpiOpenItems": "Öğeleri aç",
          "kpiDocuments": "Belgeler",
          "kpiMateriality": "[[MALZEME]]",
          "kpiRisk": "Risk değerlendirmesi",
          "kpiComments": "Yorumlar",
          "kpiTeam": "Takım",
          "hintHealth": "[[PLANLAMA]] duruşu",
          "hintProgress": "Genel tamamlanma",
          "hintChecklist": "Teslim edilebilir kontrol listesi",
          "hintWorkflow": "[[ONAY]] durumu",
          "hintFramework": "Raporlama standardı",
          "hintOpenItems": "Eksik kontrol listesi",
          "hintDocuments": "Dosyada",
          "hintMateriality": "Entegrasyon hazırlığı",
          "hintRisk": "Entegrasyon hazırlığı",
          "hintComments": "[[İNCELEME]] notlar",
          "hintTeam": "Atanan üyeler",
          "healthOnTrack": "Yolda",
          "healthMonitor": "İzleme",
          "healthAttention": "Dikkat edilmesi gerekiyor",
          "emptyChecklist": "Kontrol listesi öğesi yok",
          "emptyChecklistDescription": "[[PLANLAMA]] oluşturulduğunda kontrol listesi öğeleri görünecektir.",
          "emptyOutstanding": "Bekleyen görev yok",
          "emptyOutstandingDescription": "Tüm kontrol listesi öğeleri tamamlandı.",
          "emptyActivity": "Yakın zamanda etkinlik yok",
          "emptyActivityDescription": "[[PLANLAMA]] etkinlikleri burada görünecek.",
          "emptyChanges": "Yakın zamanda değişiklik yok",
          "emptyChangesDescription": "Güncellemeler aktivite takibine kaydedilecektir.",
          "emptyTimeline": "Kilometre taşı yok",
          "emptyTimelineDescription": "Zaman çizelgesi bölümüne zaman çizelgesi tarihlerini ekleyin.",
          "emptyDocuments": "Belge yok",
          "emptyDocumentsDescription": "[[PLANLAMA]] belge referanslarını ekleyin.",
          "emptyNotes": "[[PLANLAMA]] notu yok",
          "emptyNotesDescription": "Notlar bölümünde [[PLANLAMA]] kararını belgeleyin.",
          "emptyTeam": "Hiçbir ekip atanmadı",
          "emptyTeamDescription": "Personel alımına başlamak için görev üyeyi atayın."
        },
        "navGroups": {
          "content": "Planlama içeriği",
          "integrations": "Entegrasyonlar",
          "execution": "Yürütme",
          "admin": "Yönetim"
        },
        "heroEyebrow": "Denetim planlaması",
        "sections": {
          "overview": {
            "title": "Planlama kontrol paneli",
            "description": "Planlama durumu, hazırlık ve temel göstergelere genel bakış."
          },
          "strategy": {
            "title": "Denetim stratejisi",
            "description": "Genel denetim yaklaşımını ve önemli konuları belgeleyin."
          },
          "objectives": {
            "title": "Görev hedefleri",
            "description": "Birincil güvence hedefini ve görüş kapsamını bildirin."
          },
          "scope": {
            "title": "Denetim kapsamı",
            "description": "Mali dönemleri, işletmeleri ve kapsamdaki tabloları tanımlayın."
          },
          "framework": {
            "title": "Finansal raporlama çerçevesi",
            "description": "Bu görev için geçerli raporlama çerçevesini onaylayın."
          },
          "materiality": {
            "title": "Önemlilik",
            "description": "Önemlilik yönetimi için entegrasyona hazır yer tutucu."
          },
          "risk": {
            "title": "Risk değerlendirmesi",
            "description": "Risk değerlendirmesi için entegrasyona hazır yer tutucu."
          },
          "team": {
            "title": "Ekip planlaması",
            "description": "Görev ekibi listesini ve kapasite planlamasını inceleyin."
          },
          "timeline": {
            "title": "Zaman çizelgesi",
            "description": "Planlama, saha çalışması ve inceleme boyunca kilometre taşı tarihlerini planlayın."
          },
          "notes": {
            "title": "Planlama notları",
            "description": "Dahili planlama notları ve çalışma bağlamı."
          },
          "checklist": {
            "title": "Planlama kontrol listesi",
            "description": "Temel planlama çıktılarının tamamlanmasını izleyin."
          },
          "documents": {
            "title": "Planlama belgeleri",
            "description": "Planlama memorandumları ve destekleyici belgeler."
          },
          "history": {
            "title": "Planlama geçmişi",
            "description": "Bu denetim planı için etkinlik ve sürüm geçmişi."
          },
          "settings": {
            "title": "Planlama ayarları",
            "description": "Bu planlama kaydını arşivleyin veya geri yükleyin."
          }
        }
      }
    },
    "fieldwork": {
      "workspace": {
        "commandCenter": {
          "heroTitle": "Denetim yürütme komuta merkezi",
          "executiveTitle": "Yönetici Özeti",
          "executionTitle": "Yürütme ilerlemesi",
          "kpisTitle": "[[SAHA ÇALIŞMASI]] KPI'lar",
          "workflowTitle": "Yürütme iş akışı",
          "workflowDescription": "Başlamadan tamamlanana kadar — mevcut adım vurgulanmıştır.",
          "reviewQueueTitle": "[[İNCELEME]] kuyruğu",
          "reviewQueueDescription": "[[GÖZDEN GEÇİRME]] veya onay bekleyen prosedürler.",
          "procedureProgressTitle": "Prosedür ilerlemesi",
          "procedureProgressDescription": "Prosedür yürütme durumuna göre sayılır.",
          "paperProgressTitle": "çalışma kağıdı ilerleme",
          "paperProgressDescription": "çalışma kağıdı dokümantasyon durumuna göre sayılır.",
          "evidenceStatusTitle": "[[KANIT]] durumu",
          "evidenceStatusDescription": "Doğrulama durumuna göre kanıt öğeler.",
          "outstandingTitle": "Olağanüstü prosedürler",
          "outstandingDescription": "Prosedürler henüz tamamlanmadı veya netleşmedi.",
          "findingsTitle": "Bulguları aç",
          "findingsDescription": "Çözülmesi gereken yanlış beyanlar ve eksiklikler.",
          "severityTitle": "Şiddet dağılımı",
          "severityDescription": "Şiddet sınıflandırmasına göre gruplandırılmış bulgular.",
          "assignedWorkTitle": "Atanan iş",
          "assignedWorkDescription": "Atanan denetçilere ve vade tarihlerine ilişkin prosedürler.",
          "workingPapersTitle": "çalışma kağıtları",
          "workingPapersDescription": "Belgeler, onay işaretleri ve sonuçlar.",
          "recentDocumentsTitle": "Son belgeler",
          "recentDocumentsDescription": "Kayıttaki en son çalışma kağıtları.",
          "evidenceTitle": "[[KANIT]] kaydı",
          "evidenceDescription": "Dizinlenmiş denetim [[KANIT]] ve ekler.",
          "timelineTitle": "Yürütme zaman çizelgesi",
          "timelineDescription": "Son tarihler ve son saha çalışması kilometre taşları.",
          "reviewNotesTitle": "[[İNCELEME]] notlar",
          "reviewNotesDescription": "incelemeyorumlar ve izin takibi.",
          "commentsTitle": "Dahili yorumlar",
          "commentsDescription": "saha çalışması yürütme sırasında ekip tartışması.",
          "activityTitle": "Son etkinlik",
          "activityDescription": "En son saha çalışması çalışma alanı olayları.",
          "stepNotStarted": "Başlatılmadı",
          "stepInProgress": "Devam etmekte",
          "stepSubmitted": "Gönderildi",
          "stepReturned": "İade edildi",
          "stepReviewCleared": "[[İNCELEME]] temizlendi",
          "stepCompleted": "Tamamlanmış",
          "programVersion": "Programın sürümü",
          "lastUpdate": "Son güncelleme",
          "viewHistory": "Tüm geçmişi görüntüle",
          "complete": "tamamlamak",
          "coverage": "kapsama",
          "assigned": "Atandı",
          "unassigned": "Atanmamış",
          "unspecified": "belirtilmemiş",
          "notSet": "Ayarlanmadı",
          "kpiHealth": "[[SAHA ÇALIŞMASI]] sağlık",
          "kpiProgress": "Yürütme ilerlemesi",
          "kpiProcedures": "Prosedürler",
          "kpiWorkingPapers": "çalışma kağıtları",
          "kpiEvidence": "[[KANIT]]",
          "kpiOpenFindings": "Bulguları aç",
          "kpiResolvedFindings": "Çözümlenen bulgular",
          "kpiPendingReview": "Beklemede [[[[İNCELEME]]]]",
          "kpiOutstanding": "Olağanüstü prosedürler",
          "kpiAuditors": "Atanan denetçiler",
          "kpiOpenNotes": "Notları aç",
          "kpiReviewNotes": "[[İNCELEME]] notlar",
          "kpiStatus": "Paket durumu",
          "kpiTickmarks": "Onay işaretleri",
          "kpiComments": "Yorumlar",
          "kpiProgram": "Denetim programı",
          "kpiGroups": "Prosedür grupları",
          "kpiLastUpdate": "Son güncelleme",
          "hintHealth": "Yürütme duruşu",
          "hintProgress": "Genel tamamlanma",
          "hintProcedures": "Tamamlanmış ve toplam",
          "hintOpenFindings": "Çözünürlük gerektiren",
          "hintResolvedFindings": "Kapalı veya çözüldü",
          "hintPendingReview": "İzin bekleniyor",
          "hintOutstanding": "Eksik prosedürler",
          "hintAuditors": "Benzersiz atananlar",
          "hintOpenNotes": "Hazırlayıcı belgeleri",
          "hintReviewNotes": "incelemeyorum",
          "hintTickmarks": "Uygulanan onay işaretleri",
          "hintComments": "Takım tartışması",
          "hintProgram": "Program yaşam döngüsü",
          "hintGroups": "Denetim alanları",
          "hintLastUpdate": "En son değişiklik",
          "healthOnTrack": "Yolda",
          "healthMonitor": "İzleme",
          "healthAttention": "Dikkat edilmesi gerekiyor",
          "emptyReviewQueue": "inceleme sıra boş",
          "emptyReviewQueueDescription": "Bekleyen hiçbir prosedür yok [[İNCELEME]].",
          "emptyOutstanding": "Olağanüstü prosedür yok",
          "emptyOutstandingDescription": "Tüm prosedürler tamamlandı veya temizlendi.",
          "emptyFindings": "Açık bulgu yok",
          "emptyFindingsDescription": "Açık bulgular belgelendiğinde ortaya çıkacaktır.",
          "emptySeverity": "Bulgu yok",
          "emptySeverityDescription": "Bulgular mevcut olduğunda şiddet dağılımı ortaya çıkar.",
          "emptyAssigned": "Atanan iş yok",
          "emptyAssignedDescription": "Yürütmeye başlamak için prosedürlere denetçiler atayın.",
          "emptyPapers": "Hayır çalışma kağıtları",
          "emptyPapersDescription": "Denetim çalışmasını belgelemek için çalışma kağıtları ekleyin.",
          "emptyDocuments": "Yeni belge yok",
          "emptyDocumentsDescription": "çalışma kağıtları oluşturuldukça görünecek.",
          "emptyEvidence": "Hayır [[KANIT]]",
          "emptyEvidenceDescription": "Destek prosedürlerine [[KANIT]] yükleyin.",
          "emptyTimeline": "Zaman çizelgesi etkinliği yok",
          "emptyTimelineDescription": "Son tarihler ve etkinlik burada görünecektir.",
          "emptyReviewNotes": "[[İNCELEME]] notu yok",
          "emptyReviewNotesDescription": "Temizleme sırasında [[İNCELEME]] notları görünüyor.",
          "emptyComments": "Yorum yok",
          "emptyCommentsDescription": "Dahili yorumlar [[SAHA ÇALIŞMASI]] sırasında yakalanır.",
          "emptyActivity": "Etkinlik yok",
          "emptyActivityDescription": "saha çalışması olaylar buraya kaydedilecek."
        },
        "navGroups": {
          "overview": "Kontrol paneli",
          "program": "Program",
          "execution": "Yürütme",
          "documentation": "Belgeleme",
          "governance": "Yönetişim",
          "admin": "Yönetim"
        },
        "heroEyebrow": "Denetim saha çalışması",
        "sections": {
          "overview": {
            "title": "Saha çalışması kontrol paneli",
            "description": "İlerleme, atamalar ve yürütme göstergeleri."
          },
          "program": {
            "title": "Denetim programı",
            "description": "Prosedür yürütmeyi yöneten onaylanmış program sürümü."
          },
          "procedure-groups": {
            "title": "Prosedür grupları",
            "description": "Gruplanmış denetim alanları ve tamamlanma ilerlemesi."
          },
          "procedures": {
            "title": "Denetim prosedürleri",
            "description": "Durum izlemeli atanabilir denetim iş birimleri."
          },
          "working-papers": {
            "title": "Çalışma kağıtları",
            "description": "Belgeleme, işaretler ve sonuçlar."
          },
          "evidence": {
            "title": "Kanıt kaydı",
            "description": "Dizinlenmiş denetim kanıtları ve ekler."
          },
          "findings": {
            "title": "Bulgular",
            "description": "Yanlışlıklar, eksiklikler ve öneriler."
          },
          "notes": {
            "title": "Denetçi notları",
            "description": "Hazırlayan belgelemesi ve mesleki muhakeme."
          },
          "review-notes": {
            "title": "İnceleme notları",
            "description": "İnceleyici yorumları ve onay izleme."
          },
          "comments": {
            "title": "Dahili yorumlar",
            "description": "Saha çalışması sırasında kaydedilen ekip tartışması."
          },
          "history": {
            "title": "Saha çalışması geçmişi",
            "description": "Kronolojik etkinlik ve denetim izi."
          },
          "settings": {
            "title": "Saha çalışması ayarları",
            "description": "Bu saha çalışması paketini arşivleyin veya geri yükleyin."
          }
        }
      }
    },
    "riskAssessment": {
      "workspace": {
        "commandCenter": {
          "heroTitle": "Kurumsal risk komuta merkezi",
          "executiveTitle": "Risk derecelendirmeleri",
          "summaryTitle": "Risk özeti",
          "metricsTitle": "Değerlendirme metrikleri",
          "kpisTitle": "Risk KPI'ları",
          "workflowTitle": "[[ONAY]] iş akışı",
          "workflowDescription": "Entegre edilmiş taslak — mevcut adım vurgulanmıştır.",
          "reviewQueueTitle": "[[İNCELEME]] kuyruğu",
          "reviewQueueDescription": "risk değerlendirmesiiş ortağının veya yöneticinin imzasını bekliyor.",
          "heatmapTitle": "Risk ısı haritası",
          "heatmapDescription": "İddia düzeyindeki risk derecelendirmelerinin dağılımı.",
          "matrixTitle": "Risk matrisi",
          "matrixDescription": "Hesap ve iddia risk derecelendirmeleri p[[İNCELEME]].",
          "distributionTitle": "Kategori dağılımı",
          "distributionDescription": "Yapılandırılmış kategorilere göre gruplandırılmış risk öğeleri.",
          "significantTitle": "Önemli riskler",
          "significantDescription": "Odaklanmış denetim yanıtı gerektiren yüksek öncelikli riskler.",
          "openResponsesTitle": "Yanıtları aç",
          "openResponsesDescription": "Belgelenmiş yanıtları olmayan risk öğeleri.",
          "outstandingProceduresTitle": "Olağanüstü prosedürler",
          "outstandingProceduresDescription": "Bağlantılı prosedürler olmadan önemli riskler.",
          "responsesTitle": "Risk yanıtları",
          "responsesDescription": "Tanımlanan risklere belgelenmiş yanıtlar.",
          "proceduresTitle": "Bağlantılı prosedürler",
          "proceduresDescription": "Risk kalemleriyle bağlantılı denetim prosedürleri.",
          "reviewNotesTitle": "[[İNCELEME]] notlar",
          "reviewNotesDescription": "Ortak ve yönetici [[İNCELEME]] yorumu.",
          "commentsTitle": "Yorumlar",
          "commentsDescription": "risk değerlendirmesi ile ilgili dahili işbirliği notları.",
          "recentChangesTitle": "Son değişiklikler",
          "recentChangesDescription": "Gönderimler, [[ONAY]]lar ve kayıt güncellemeleri.",
          "activityTitle": "Etkinlik feed'i",
          "activityDescription": "En son risk değerlendirmesi çalışma alanı olayı.",
          "stepDraft": "Taslak",
          "stepSubmitted": "Gönderildi",
          "stepUnderReview": "[[İNCELEME]] altında",
          "stepReturned": "İade edildi",
          "stepApproved": "Onaylı",
          "stepIntegrated": "Entegre",
          "packageVersion": "Sürüm",
          "lastUpdate": "Son güncelleme",
          "openWorkflow": "[[İNCELEME]] iş akışı",
          "viewHistory": "Tüm geçmişi görüntüle",
          "viewMatrix": "Tam matrisi aç",
          "viewReviewNotes": "[[İNCELEME]] notlarını görüntüle",
          "significant": "Önemli",
          "unrated": "Derecelendirilmemiş",
          "notSet": "Ayarlanmadı",
          "notLinked": "Bağlantılı değil",
          "uncategorized": "Kategorize edilmemiş",
          "accountColumn": "Hesap",
          "assertionColumn": "İddia",
          "ratingColumn": "Derecelendirme",
          "kpiOverall": "Genel risk derecelendirmesi",
          "kpiInherent": "Doğal risk",
          "kpiControl": "Riski kontrol edin",
          "kpiDetection": "Tespit riski",
          "kpiResidual": "Artık risk",
          "kpiFraud": "Dolandırıcılık riskleri",
          "kpiIt": "BT riskleri",
          "kpiCompliance": "Uyumluluk riskleri",
          "kpiFinancial": "Finansal tablo riskleri",
          "kpiSignificant": "Önemli riskler",
          "kpiAssertionCoverage": "İddia kapsamı",
          "kpiWorkflow": "İş akışı durumu",
          "kpiApproval": "[[ONAY]] durumu",
          "kpiPendingReview": "Beklemede [[[[İNCELEME]]]]",
          "kpiOpenItems": "Riskli öğeleri aç",
          "kpiOwners": "Atanan sahipler",
          "kpiLastUpdate": "Son güncelleme",
          "kpiHealth": "Risk sağlığı",
          "kpiProgress": "İlerlemek",
          "kpiCategories": "Kategoriler",
          "kpiResponses": "Yanıtlar",
          "kpiProcedures": "Prosedürler",
          "kpiComments": "Yorumlar",
          "hintOverall": "En yüksek kalıntı derecesi",
          "hintInherent": "Maksimum doğal derecelendirme",
          "hintControl": "Maksimum kontrol derecesi",
          "hintDetection": "Maksimum algılama derecesi",
          "hintResidual": "Maksimum artık derecesi",
          "hintFraud": "Belgelenmiş dolandırıcılık riskleri",
          "hintIt": "Teknoloji riskleri",
          "hintCompliance": "Mevzuat riskleri",
          "hintFinancial": "FSL riskleri",
          "hintSignificant": "Odaklanmış yanıt gerektirir",
          "hintAssertionCoverage": "Derecelendirilmiş onay hücreleri",
          "hintWorkflow": "[[ONAY]] durumu",
          "hintPendingReview": "İmza bekleniyor",
          "hintOpenItems": "Eksik belgeler",
          "hintOwners": "Benzersiz risk sahipleri",
          "hintLastUpdate": "En son değişiklik",
          "hintHealth": "Değerlendirme duruşu",
          "hintProgress": "Genel tamamlanma",
          "hintCategories": "Yapılandırılmış kategoriler",
          "hintResponses": "Belgelenmiş yanıtlar",
          "hintProcedures": "Bağlantılı prosedürler",
          "hintComments": "İşbirliği notları",
          "healthOnTrack": "Yolda",
          "healthMonitor": "İzleme",
          "healthAttention": "Dikkat edilmesi gerekiyor",
          "changeApproved": "risk değerlendirmesi onaylandı",
          "changeApprovedDescription": "Değerlendirme saha çalışması kullanımı için onaylandı.",
          "changeSubmitted": "[[İNCELEME]] için gönderildi",
          "changeSubmittedDescription": "Değerlendirme görev incelemeer'e gönderildi.",
          "emptyMatrix": "Matris verisi yok",
          "emptyMatrixDescription": "Matris dolduruldukça iddia derecelendirmeleri görünecektir.",
          "emptyCategories": "Kategori yok",
          "emptyCategoriesDescription": "Risk öğelerini düzenlemek için kategorileri yapılandırın.",
          "emptySignificant": "Önemli risk yok",
          "emptySignificantDescription": "Belirlendiğinde önemli riskler ortaya çıkacaktır.",
          "emptyOpenResponses": "Tüm risklere yanıt verildi",
          "emptyOpenResponsesDescription": "Her risk öğesinin belgelenmiş bir yanıtı vardır.",
          "emptyProcedures": "Olağanüstü prosedür yok",
          "emptyProceduresDescription": "Tüm önemli risklerin birbiriyle bağlantılı prosedürleri vardır.",
          "emptyResponsesList": "Yanıt yok",
          "emptyResponsesListDescription": "Tanımlanan risklere verilen yanıtları belgeleyin.",
          "emptyProceduresList": "Bağlantılı prosedür yok",
          "emptyProceduresListDescription": "Denetim prosedürlerini önemli risklerle ilişkilendirin.",
          "emptyReviewNotes": "[[İNCELEME]] notu yok",
          "emptyReviewNotesDescription": "inceleme notları, onay iş akışı sırasında görünüyor.",
          "emptyComments": "Yorum yok",
          "emptyCommentsDescription": "Yorumlar işbirliği sırasında kaydedilir.",
          "emptyChanges": "Yakın zamanda değişiklik yok",
          "emptyChangesDescription": "İş akışı etkinlikleri burada görünecektir.",
          "emptyActivity": "Etkinlik yok",
          "emptyActivityDescription": "risk değerlendirmesi olaylar buraya kaydedilecek."
        },
        "navGroups": {
          "overview": "Kontrol paneli",
          "register": "Risk kaydı",
          "analysis": "Analiz",
          "response": "Yanıt",
          "governance": "Yönetişim",
          "admin": "Yönetim"
        },
        "heroEyebrow": "Risk değerlendirmesi",
        "sections": {
          "overview": {
            "title": "Risk kontrol paneli",
            "description": "Durum, ilerleme ve incelemeye hazırlık göstergeleri."
          },
          "inherent-risks": {
            "title": "Doğal riskler",
            "description": "İlgili kontrolleri dikkate almadan önce riskler."
          },
          "control-risks": {
            "title": "Riskleri kontrol edin",
            "description": "Kontrollerin tasarımı ve işleyişine ilişkin riskler."
          },
          "detection-risks": {
            "title": "Tespit riskleri",
            "description": "Prosedürlerin yanlış beyanları tespit edememesi riskleri."
          },
          "fraud-risks": {
            "title": "Dolandırıcılık riskleri",
            "description": "Dolandırıcılık risk faktörleri ve yönetimi, dikkate alınması gereken hususları geçersiz kılar."
          },
          "it-risks": {
            "title": "BT riskleri",
            "description": "Teknoloji, sistem erişimi ve veri bütünlüğü riskleri."
          },
          "compliance-risks": {
            "title": "Uyumluluk riskleri",
            "description": "Mevzuat ve yasal uyumluluk riskleri."
          },
          "financial-statement-risks": {
            "title": "Finansal tablo riskleri",
            "description": "Mali tablo düzeyinde önemli yanlış bildirim riskleri."
          },
          "assertion-risks": {
            "title": "İddia riskleri",
            "description": "İlgili hesaplarla bağlantılı iddia düzeyindeki riskler."
          },
          "significant-risks": {
            "title": "Önemli riskler",
            "description": "Odaklanmış denetim yanıtı gerektiren yüksek öncelikli riskler."
          },
          "categories": {
            "title": "Risk kategorileri",
            "description": "Risk öğelerini düzenlemek için kullanılan yapılandırılmış kategoriler."
          },
          "scoring": {
            "title": "Puanlama",
            "description": "Belirlenen riskler genelinde puanlama göstergelerini toplu hale getirin."
          },
          "heatmap": {
            "title": "Isı haritası",
            "description": "Risk derecelendirmelerinin görsel dağılımı."
          },
          "matrix": {
            "title": "İddia matrisi",
            "description": "Hesap ve iddia derecelendirmelerine genel bakış."
          },
          "responses": {
            "title": "Risk yanıtları",
            "description": "Tanımlanan riskler için planlanan yanıtlar."
          },
          "procedures": {
            "title": "Prosedür bağlantıları",
            "description": "Değerlendirilen risklerin ele alınmasına yönelik bağlantılı prosedürler."
          },
          "owners": {
            "title": "Risk sahipleri",
            "description": "Her risk öğesi için atanmış sahipler."
          },
          "review-notes": {
            "title": "Notları inceleyin",
            "description": "Risk değerlendirme döngüleri sırasında alınan gözden geçiren notları."
          },
          "comments": {
            "title": "Yorumlar",
            "description": "Dahili yorumlar ve işbirliği notları."
          },
          "history": {
            "title": "Tarih",
            "description": "Risk değerlendirmesi değişikliklerinin ve onaylarının zaman çizelgesi."
          },
          "settings": {
            "title": "Ayarlar",
            "description": "Bu risk değerlendirmesi için kontrolleri arşivleyin ve geri yükleyin."
          }
        }
      }
    },
    "materiality": {
      "workspace": {
        "commandCenter": {
          "heroTitle": "ISA 320 önemlilik komuta merkezi",
          "executiveTitle": "önemlilik eşikleri",
          "summaryTitle": "önemlilik özeti",
          "metricsTitle": "Paket metrikleri",
          "workflowTitle": "[[ONAY]] iş akışı",
          "workflowDescription": "Entegre edilmiş taslak — mevcut adım vurgulanmıştır.",
          "approvalQueueTitle": "[[ONAY]] sırası",
          "approvalQueueDescription": "İş ortağının veya yöneticinin onayını bekleyen önemlilik paket.",
          "calculationBreakdownTitle": "Hesaplama dökümü",
          "calculationBreakdownDescription": "Genel olarak performans ve önemsiz hesaplama akışı.",
          "benchmarkComparisonTitle": "Karşılaştırma karşılaştırması",
          "benchmarkComparisonDescription": "Sıralanmış karşılaştırma tutarları ve hesaplanan önemlilik.",
          "calculationHistoryTitle": "Hesaplama geçmişi",
          "calculationHistoryDescription": "Kaydedilen hesaplamalar ve manuel geçersiz kılmalar.",
          "selectedBenchmarkTitle": "Seçilen kıyaslama",
          "selectedBenchmarkDescription": "Genel önemlilik belirlemesinin temeli.",
          "versionTimelineTitle": "Sürüm zaman çizelgesi",
          "versionTimelineDescription": "Paket sürümü anlık görüntüleri ve değişiklik özetleri.",
          "reviewNotesTitle": "[[İNCELEME]] notlar",
          "reviewNotesDescription": "Ortak ve yönetici [[İNCELEME]] yorumları.",
          "commentsTitle": "Yorumlar",
          "commentsDescription": "[[İNCELEME]] ve önemlilik ile ilgili dahili tartışma.",
          "recentChangesTitle": "Son değişiklikler",
          "recentChangesDescription": "Gönderimler, geri dönüşler, [[ONAY]]'lar ve sürüm güncellemeleri.",
          "activityTitle": "Etkinlik feed'i",
          "activityDescription": "En son önemlilik çalışma alanı olayları.",
          "stepDraft": "Taslak",
          "stepSubmitted": "Gönderildi",
          "stepUnderReview": "[[İNCELEME]] altında",
          "stepReturned": "İade edildi",
          "stepApproved": "Onaylı",
          "stepIntegrated": "Entegre",
          "packageVersion": "Sürüm",
          "lastUpdate": "Son güncelleme",
          "openWorkflow": "[[İNCELEME]] iş akışı",
          "viewHistory": "Tüm geçmişi görüntüle",
          "viewComments": "Tüm yorumları görüntüle",
          "selected": "Seçildi",
          "override": "Geçersiz kıl",
          "benchmarkColumn": "Kıyas ölçütü",
          "amountColumn": "Miktar",
          "percentageColumn": "Yüzde",
          "calculatedColumn": "Hesaplanmış",
          "versionLabel": "Sürüm",
          "ofOverall": "genel olarak",
          "moreItems": "Daha",
          "specificItems": "öğeler",
          "notSet": "Ayarlanmadı",
          "kpiOverall": "Genel olarak [[Malzeme]]",
          "kpiPerformance": "Performans önemlilik",
          "kpiSpecific": "Spesifik [[MALZEME]]",
          "kpiTrivial": "Açıkça önemsiz eşik",
          "kpiBenchmark": "Seçilen kıyaslama",
          "kpiPercentage": "Seçilen yüzde",
          "kpiMethod": "Hesaplama yöntemi",
          "kpiStatus": "[[ONAY]] durumu",
          "kpiWorkflow": "İş akışı durumu",
          "kpiVersion": "Sürüm",
          "kpiPendingReview": "Beklemede [[İNCELEME]]",
          "kpiOpenItems": "Öğeleri aç",
          "kpiLastUpdate": "Son güncelleme",
          "kpiReviewer": "Atanan incelemeer",
          "hintOverall": "ISA 320 genel eşiği",
          "hintPerformance": "Çalışıyor önemlilik",
          "hintSpecific": "Hesap düzeyinde eşikler",
          "hintTrivial": "Açıkça önemsiz miktar",
          "hintBenchmark": "Seçilen temel",
          "hintPercentage": "Uygulanan oran",
          "hintMethod": "Kararlılık yaklaşımı",
          "hintWorkflow": "[[ONAY]] durumu",
          "hintVersion": "Paket sürümü",
          "hintPendingReview": "İmza bekleniyor",
          "hintOpenItems": "Eksik belgeler",
          "hintLastUpdate": "En son değişiklik",
          "hintReviewer": "[[İNCELEME]] ödev",
          "reviewerNotAssigned": "Atanmadı",
          "methodNotSet": "Belirlenmedi",
          "methodManualOverride": "Manuel geçersiz kılma",
          "methodBenchmarkPct": "Karşılaştırma × yüzde",
          "changeApproved": "önemlilik onaylandı",
          "changeApprovedDescription": "Paket saha çalışması kullanımı için onaylanmıştır.",
          "changeReturned": "Revizyon için geri gönderildi",
          "changeReturnedDescription": "Paket [[İNCELEME]] notlarıyla birlikte iade edildi.",
          "changeSubmitted": "[[İNCELEME]] için gönderildi",
          "changeSubmittedDescription": "Paket görev incelemeer'e gönderildi.",
          "versionCreated": "Sürüm anlık görüntüsü oluşturuldu",
          "emptyBenchmarks": "Karşılaştırma yok",
          "emptyBenchmarksDescription": "önemlilik tabanlarını karşılaştırmak için kıyaslamalar ekleyin.",
          "emptyCalculations": "Hesaplama yok",
          "emptyCalculationsDescription": "Karşılaştırmalar bölümünden hesaplamaları kaydedin.",
          "emptyVersions": "Sürüm yok",
          "emptyVersionsDescription": "Paket revize edildiğinde sürüm anlık görüntüleri görünür.",
          "emptyReviewNotes": "[[İNCELEME]] notu yok",
          "emptyReviewNotesDescription": "inceleme notları, onay iş akışı sırasında görünüyor.",
          "emptyComments": "Yorum yok",
          "emptyCommentsDescription": "Yorumlar [[İNCELEME]] sırasında kaydedilir.",
          "emptyChanges": "Yakın zamanda değişiklik yok",
          "emptyChangesDescription": "İş akışı etkinlikleri ve versiyonları burada görünecektir.",
          "emptyActivity": "Etkinlik yok",
          "emptyActivityDescription": "önemlilik olaylar buraya kaydedilecek."
        },
        "navGroups": {
          "overview": "Kontrol paneli",
          "thresholds": "Eşikler",
          "analysis": "Analiz",
          "governance": "Yönetişim",
          "admin": "Yönetim"
        }
      }
    }
  }
};


/** Embedded professional audit translations for module namespace keys (workflow, history, etc.). */
const EMBEDDED_NAMESPACE_PATCHES = {
  "az": {
    "planning": {
      "workflow": {
        "eyebrow": "Təsdiq iş axını",
        "lockedBadge": "Kilidlənib",
        "submitAction": "Yoxlamaya təqdim et",
        "returnAction": "Düzəlişə qaytar",
        "returnConfirmAction": "Qaytarmanı təsdiqlə",
        "approveAction": "Planlaşdırmanı təsdiqlə",
        "reviseAction": "Düzəliş yarat",
        "reviseConfirmAction": "Düzəlişi təsdiqlə",
        "cancelAction": "Ləğv et",
        "returnNotesTitle": "Qaytarma qeydləri",
        "returnNotesLabel": "Düzəliş qeydləri",
        "returnNotesPlaceholder": "Yenidən təqdim etməzdən əvvəl nəyin həll edilməli olduğunu təsvir edin…",
        "reviseNotesLabel": "Düzəliş icmalı",
        "reviseNotesPlaceholder": "Təsdiqlənmiş planın niyə düzəldildiyinə dair istəyə bağlı icmal…",
        "pendingReviewNotice": "Bu plan tərəfdaş və ya menecer yoxlamasını gözləyir.",
        "errorGeneric": "Planlaşdırma iş axını əməliyyatı tamamlana bilmədi."
      },
      "history": {
        "title": "Planlaşdırma tarixçəsi",
        "description": "Planlaşdırma dəyişikliklərinin və audit icmalının yalnız oxuma zaman xətti.",
        "emptyTitle": "Planlaşdırma fəaliyyəti yoxdur",
        "emptyDescription": "Dəyişikliklər qeydə alındıqca planlaşdırma fəaliyyəti burada görünəcək.",
        "actions": {
          "created": "Planlaşdırma yaradılıb",
          "updated": "Planlaşdırma yenilənib",
          "statusChanged": "Status dəyişib",
          "archived": "Planlaşdırma arxivlənib",
          "restored": "Planlaşdırma bərpa edilib",
          "checklistUpdated": "Yoxlama siyahısı yenilənib",
          "timelineUpdated": "Zaman xətti yenilənib",
          "submitted": "Yoxlamaya təqdim edilib",
          "returned": "Düzəlişə qaytarılıb",
          "approved": "Planlaşdırma təsdiqlənib",
          "revised": "Plan düzəldilib",
          "commentAdded": "Şərh əlavə edilib",
          "documentAdded": "Sənəd əlavə edilib",
          "documentRemoved": "Sənəd silinib"
        },
        "revision": {
          "title": "Düzəliş tarixçəsi",
          "description": "Düzəlişlə əvəz edilmiş əvvəlki təsdiqlənmiş plan versiyaları.",
          "entryTitle": "Plan versiyası {version}"
        },
        "version": {
          "title": "Versiya məlumatı",
          "description": "Cari plan versiyaları və həyat dövrü vaxt möhürləri.",
          "cardTitle": "Plan metadatası",
          "recordVersion": "Qeyd versiyası",
          "planVersion": "Plan versiyası",
          "submitted": "Təqdim edilmə vaxtı",
          "approved": "Təsdiq vaxtı",
          "notSubmitted": "Təqdim edilməyib",
          "notApproved": "Təsdiqlənməyib",
          "created": "Yaradılıb",
          "updated": "Yenilənib",
          "archived": "Arxivlənmə vaxtı",
          "notArchived": "Arxivlənməyib"
        }
      },
      "comments": {
        "title": "Planlaşdırma şərhləri",
        "description": "Planlaşdırma təsdiqi zamanı qeydə alınan yoxlama qeydləri və müzakirə.",
        "emptyDescription": "Hələ planlaşdırma şərhi yoxdur. Yoxlayıcılar qeyd əlavə etdikdə və ya planı qaytardıqda şərhlər görünür.",
        "addLabel": "Şərh əlavə et",
        "addPlaceholder": "Planlaşdırma qeydi və ya yoxlama şərhi sənədləşdirin…",
        "addAction": "Şərh əlavə et",
        "reviewModeNotice": "Plan düzəlişə qaytarıldıqda şərhlər qeydə alınır.",
        "types": {
          "review": "Yoxlama",
          "general": "Ümumi",
          "return": "Qaytarma qeydi"
        }
      },
      "settings": {
        "title": "Planlaşdırma parametrləri",
        "description": "Bu audit planlaşdırma qeydini arxivləyin və ya bərpa edin.",
        "readOnlyNotice": "Planlaşdırma parametrlərinə yalnız baxış girişiniz var.",
        "lifecycle": {
          "archivedBannerTitle": "Planlaşdırma arxivlənib",
          "archivedBannerDescription": "Planlaşdırma iş sahəsi yalnız oxuma rejimindədir. Dəyişiklik etmək üçün planlaşdırmanı bərpa edin.",
          "archivePrompt": "Arxivləmə bu planlaşdırma qeydini tarixçəsini qoruyaraq yalnız oxuma rejiminə keçirir.",
          "archiveAction": "Planlaşdırmanı arxivlə",
          "archiveReasonPlaceholder": "Arxivləmə üçün istəyə bağlı səbəb",
          "archiveConfirmAction": "Arxivləməni təsdiqlə",
          "restorePrompt": "Sənədləşdirmə və yoxlamaya davam etmək üçün planlaşdırmanı bərpa edin.",
          "restoreAction": "Planlaşdırmanı bərpa et",
          "restoreConfirmAction": "Bərpanı təsdiqlə",
          "reasonLabel": "Səbəb",
          "cancelAction": "Ləğv et"
        }
      },
      "documents": {
        "title": "Planlaşdırma sənədləri",
        "description": "Planlaşdırma memorandumları və dəstək sənədləri.",
        "emptyTitle": "Planlaşdırma sənədi yoxdur",
        "emptyDescription": "Bu audit planı üçün planlaşdırma memorandumları və dəstək istinadları əlavə edin.",
        "addTitle": "Sənəd istinadı əlavə et",
        "nameLabel": "Sənəd adı",
        "namePlaceholder": "Planlaşdırma memorandumu",
        "typeLabel": "Sənəd növü",
        "addAction": "Sənəd əlavə et",
        "metadataNotice": "Fayl saxlama inteqrasiyası gələcək buraxılışda ikili faylları əlavə edəcək. İstinadlar indi audit planında qeydə alınır.",
        "documentTypes": {
          "planning_memorandum": "Planlaşdırma memorandumu",
          "risk_assessment": "Risk qiymətləndirilməsi",
          "materiality_worksheet": "Mahiyyətllik vərəqi",
          "other": "Digər"
        },
        "statuses": {
          "uploaded": "Qeydə alınıb",
          "pending": "Gözləyir",
          "archived": "Arxivlənib"
        }
      },
      "checklist": {
        "title": "Planlaşdırma yoxlama siyahısı",
        "description": "Sahə işindən əvvəl əsas planlaşdırma nəticələrinin tamamlanmasını izləyin.",
        "progress": "Gedişat",
        "saveLabel": "Saxla",
        "savingLabel": "Saxlanılır…",
        "items": {
          "objectives": "Müsadirə məqsədləri sənədləşdirilib",
          "scope": "Audit əhatə dairəsi müəyyən edilib",
          "strategy": "Audit strategiyası sənədləşdirilib",
          "framework": "Hesabat çərçivəsi təsdiqlənib",
          "materiality": "Mahiyyətllik müvəqqəti yeri nəzərdən keçirilib",
          "risk": "Risk müvəqqəti yeri nəzərdən keçirilib",
          "team": "Komanda planlaşdırması tamamlanıb",
          "timeline": "Zaman xətti müəyyən edilib"
        }
      },
      "editor": {
        "readOnlyNotice": "Bu planlaşdırma bölməsinə yalnız baxış girişiniz var.",
        "saveLabel": "Saxla",
        "savingLabel": "Saxlanılır…",
        "discardLabel": "Ləğv et",
        "placeholder": "Peşəkar mühakiməni və müsadirəyə xas konteksti sənədləşdirin…"
      },
      "team": {
        "title": "Komanda planlaşdırması",
        "description": "Bu audit üçün müsadirə siyahısı və tutum planlaşdırması.",
        "rosterTitle": "Müsadirə komandası",
        "rosterEmpty": "Bu müsadirəyə hələ komanda üzvü təyin edilməyib.",
        "capacityTitle": "Tutum planlaşdırması",
        "estimatedHours": "Təxmini saatlar",
        "notes": "Planlaşdırma qeydləri",
        "saveLabel": "Saxla",
        "savingLabel": "Saxlanılır…"
      },
      "timeline": {
        "title": "Planlaşdırma zaman xətti",
        "description": "Planlaşdırma, sahə işi, yoxlama və tamamlanma üçün mərhələ tarixləri.",
        "startDate": "Başlanğıc",
        "endDate": "Son",
        "saveLabel": "Saxla",
        "savingLabel": "Saxlanılır…",
        "milestones": {
          "planning": "Planlaşdırma",
          "fieldwork": "Sahə işi",
          "review": "Yoxlama",
          "completion": "Tamamlanma"
        }
      },
      "integration": {
        "integrationReady": "İnteqrasiyaya hazırdır",
        "currentStatus": "Cari status",
        "statuses": {
          "not_configured": "Konfiqurasiya edilməyib",
          "placeholder": "Müvəqqəti yer hazırdır",
          "integrated": "İnteqrasiya edilib"
        },
        "materiality": {
          "title": "Mahiyyətllik",
          "description": "Mahiyyətllik həddləri xüsusi modulda sənədləşdiriləcək.",
          "placeholderTitle": "Mahiyyətllik modulu müvəqqəti yeri",
          "placeholderDescription": "Ümumi, icra və xüsusi mahiyyətllik vərəqləri Mahiyyətllik modulu tətbiq olunduqda buraya qoşulacaq."
        },
        "risk": {
          "title": "Risk qiymətləndirilməsi",
          "description": "Planlaşdırmadan müsadirə risk qiymətləndirilməsi iş sahəsini açın.",
          "placeholderTitle": "Risk qiymətləndirilməsi inteqrasiya edilib",
          "placeholderDescription": "Planlaşdırma xüsusi risk qiymətləndirilməsi iş sahəsinə bağlanır. Müsadirə yan panelindən Risk qiymətləndirilməsini istifadə edin və ya planlaşdırma risk bölməsindən davam edin."
        }
      }
    },
    "materiality": {
      "workflow": {
        "title": "Mahiyyətllik workflow",
        "description": "ISA 320 mahiyyətlilik sənədlərini təqdim edin, geri qaytarın və təsdiqləyin.",
        "submitAction": "Nəzərdən keçirməyə təqdim et",
        "returnAction": "Düzəliş üçün geri qaytar",
        "returnConfirmAction": "Geri qaytarmanı təsdiqlə",
        "approveAction": "Mahiyyətlliyi təsdiqlə",
        "cancelAction": "Ləğv et",
        "returnNotesLabel": "Geri qaytarma qeydləri",
        "returnNotesPlaceholder": "Yenidən təqdim etmədən əvvəl nəyin düzəldilməli olduğunu təsvir edin.",
        "readOnlyNotice": "Bu mahiyyətlilik paketi arxivlənib və yalnız oxuma üçündür.",
        "submittedNotice": "Bu mahiyyətlilik paketi təqdim edilib və yoxlama gözləyir.",
        "approvedNotice": "Bu mahiyyətlilik paketi təsdiqlənib.",
        "returnedNotice": "Bu mahiyyətlilik paketi reviziya üçün geri qaytarılıb.",
        "errorGeneric": "Mahiyyətlilik iş axını əməliyyatını tamamlamaq mümkün olmadı."
      },
      "history": {
        "title": "Tarixçə",
        "description": "Mahiyyətlilik fəaliyyətinin yalnız oxuma üçün xronologiyası.",
        "emptyTitle": "Mahiyyətlilik fəaliyyəti yoxdur",
        "emptyDescription": "Mahiyyətllik activity will appear here as changes are recorded.",
        "versionLabel": "Paket versiyası",
        "updatedLabel": "Yenilənib",
        "actions": {
          "materiality.benchmark.added": "Müqayisə göstəricisi əlavə edildi",
          "materiality.benchmark.updated": "Müqayisə göstəricisi yeniləndi",
          "materiality.calculation.recorded": "Hesablama qeydə alındı",
          "materiality.threshold.updated": "Hədd yeniləndi",
          "materiality.comment.added": "Şərh əlavə edildi",
          "materiality.version.created": "Versiya yaradıldı"
        }
      },
      "comments": {
        "title": "Şərhlər",
        "description": "Mahiyyətliliklə bağlı yoxlama və daxili şərhləri qeydə alın.",
        "emptyTitle": "Şərh yoxdur",
        "emptyDescription": "Şərhlər appear here once added.",
        "bodyPlaceholder": "Şərh əlavə et",
        "addAction": "Şərh əlavə et"
      },
      "settings": {
        "title": "Parametrlər",
        "description": "Bu mahiyyətlilik paketini arxivləşdirin və ya bərpa edin.",
        "archiveAction": "Mahiyyətllik paketini arxivləşdir",
        "archiveConfirmAction": "Arxivləşdirməni təsdiqləyin",
        "restoreAction": "Mahiyyətllik paketini bərpa et",
        "restoreConfirmAction": "Bərpanı təsdiqləyin",
        "cancelAction": "Ləğv et",
        "archivedBanner": "Bu mahiyyətlilik paketi arxivlənib.",
        "readOnlyNotice": "Mahiyyətlilik parametrlərinə yalnız baxış hüququnuz var."
      },
      "versions": {
        "title": "Versiyalar",
        "description": "Mahiyyətlilik paketinin versiya anlıq görüntülərinə baxın.",
        "emptyTitle": "Versiya yoxdur",
        "emptyDescription": "Mahiyyətlilik reviziya edildikdə və ya təsdiqləndikdə versiya anlıq görüntüləri yaradılır."
      }
    },
    "riskAssessment": {
      "workflow": {
        "title": "Risk iş axını",
        "description": "Risk qiymətləndirməsini təqdim et, qaytar və təsdiqlə.",
        "submitAction": "Yoxlamaya təqdim et",
        "returnAction": "Düzəliş üçün qaytar",
        "returnConfirmAction": "Qaytarmanı təsdiqlə",
        "approveAction": "Risk qiymətləndirməsini təsdiqlə",
        "acknowledgeAction": "Əhəmiyyətli riskləri təsdiqlə",
        "cancelAction": "Ləğv et",
        "returnNotesLabel": "Qaytarma qeydi",
        "returnNotesPlaceholder": "Yenidən təqdimatdan əvvəl nəyi düzəltmək lazım olduğunu yazın.",
        "readOnlyNotice": "Bu risk qiymətləndirməsi arxivdədir və yalnız oxunur.",
        "submittedNotice": "Bu risk qiymətləndirməsi təqdim olunub və yoxlama gözləyir.",
        "approvedNotice": "Bu risk qiymətləndirməsi təsdiqlənib.",
        "acknowledgedNotice": "Əhəmiyyətli risklər təsdiqlənib.",
        "pendingAcknowledgmentNotice": "Təsdiqdən əvvəl əhəmiyyətli risklər təsdiqlənməlidir.",
        "errorGeneric": "Risk iş axını əməliyyatını tamamlamaq mümkün olmadı."
      },
      "history": {
        "title": "Tarixçə",
        "description": "Risk qiymətləndirməsi fəaliyyətinin yalnız oxunan xronologiyası.",
        "emptyTitle": "Risk fəaliyyəti yoxdur",
        "emptyDescription": "Dəyişikliklər qeydə alındıqca risk fəaliyyəti burada görünəcək.",
        "versionLabel": "Qiymətləndirmə versiyası",
        "updatedLabel": "Yenilənib",
        "actions": {
          "risk_assessment.created": "Risk qiymətləndirməsi yaradıldı",
          "risk_assessment.updated": "Risk qiymətləndirməsi yeniləndi",
          "risk_assessment.archived": "Risk qiymətləndirməsi arxivləndi",
          "risk_assessment.restored": "Risk qiymətləndirməsi bərpa edildi",
          "risk_assessment.submitted": "Risk qiymətləndirməsi təqdim olundu",
          "risk_assessment.returned": "Risk qiymətləndirməsi qaytarıldı",
          "risk_assessment.approved": "Risk qiymətləndirməsi təsdiqləndi",
          "risk_assessment.category.added": "Kateqoriya əlavə edildi",
          "risk_assessment.risk_item.added": "Risk maddəsi əlavə edildi",
          "risk_assessment.risk_item.updated": "Risk maddəsi yeniləndi",
          "risk_assessment.assertion_rating.updated": "İddia reytinqi yeniləndi",
          "risk_assessment.response.added": "Cavab əlavə edildi",
          "risk_assessment.procedure.linked": "Prosedur bağlandı",
          "risk_assessment.note.added": "Qeyd əlavə edildi",
          "risk_assessment.significant.acknowledged": "Əhəmiyyətli risklər təsdiqləndi"
        }
      },
      "comments": {
        "title": "Şərhlər",
        "description": "Risklərlə bağlı daxili şərhləri qeydə alın.",
        "emptyTitle": "Şərh yoxdur",
        "emptyDescription": "Şərhlər əlavə edildikdən sonra burada görünür.",
        "bodyPlaceholder": "Daxili şərh əlavə et",
        "addAction": "Şərh əlavə et"
      },
      "settings": {
        "title": "Parametrlər",
        "description": "Bu risk qiymətləndirməsini arxivləyin və ya bərpa edin.",
        "archiveAction": "Risk qiymətləndirməsini arxivlə",
        "archiveConfirmAction": "Arxivləməni təsdiqlə",
        "restoreAction": "Risk qiymətləndirməsini bərpa et",
        "restoreConfirmAction": "Bərpanı təsdiqlə",
        "cancelAction": "Ləğv et",
        "archivedBanner": "Bu risk qiymətləndirməsi arxivlənib.",
        "readOnlyNotice": "Risk qiymətləndirməsi parametrlərinə yalnız baxış icazəniz var."
      },
      "procedures": {
        "title": "Prosedurlar",
        "description": "Planlaşdırılmış prosedurları risk maddələrinə bağlayın.",
        "emptyTitle": "Bağlı prosedur yoxdur",
        "emptyDescription": "Cavab icrasını xəritələmək üçün prosedur bağlantıları əlavə edin.",
        "riskItemLabel": "Risk maddəsini seçin",
        "referencePlaceholder": "Prosedur istinadı",
        "addAction": "Prosedur bağlantısı əlavə et"
      }
    },
    "fieldwork": {
      "workflow": {
        "queueTitle": "Yoxlama növbəsi",
        "queueDescription": "Yoxlama və ya təmizləmə gözləyən prosedurlar.",
        "queueEmpty": "Yoxlama gözləyən prosedur yoxdur.",
        "pendingReviewCount": "Yoxlama gözləyir",
        "openProcedureAction": "Proseduru aç",
        "submitAction": "Yoxlamaya təqdim et",
        "returnAction": "Düzəlişə qaytar",
        "returnConfirmAction": "Qaytarmanı təsdiqlə",
        "clearAction": "Yoxlamanı təmizlə",
        "clearConfirmAction": "Təmizləməni təsdiqlə",
        "cancelAction": "Ləğv et",
        "returnNotesTitle": "Qaytarma qeydləri",
        "returnNotesPlaceholder": "Nəyin düzəldilməli olduğunu təsvir edin",
        "clearanceNotesPlaceholder": "Yoxlama təmizləməsini sənədləşdirin",
        "errorGeneric": "Prosedur iş axını yenilənə bilmədi"
      },
      "history": {
        "title": "Sahə işi tarixçəsi",
        "description": "Sahə işi dəyişikliklərinin yalnız oxuma zaman xətti.",
        "emptyTitle": "Sahə işi fəaliyyəti yoxdur",
        "emptyDescription": "Sahə işi irəlilədikcə fəaliyyət görünəcək.",
        "versionLabel": "Proqram versiyası",
        "actions": {
          "created": "Sahə işi yaradılıb",
          "updated": "Sahə işi yenilənib",
          "archived": "Sahə işi arxivlənib",
          "restored": "Sahə işi bərpa edilib",
          "programUpdated": "Proqram yenilənib",
          "procedureAssigned": "Prosedur təyin edilib",
          "procedureUpdated": "Prosedur yenilənib",
          "procedureCompleted": "Prosedur tamamlanıb",
          "procedureSubmitted": "Prosedur təqdim edilib",
          "procedureReturned": "Prosedur qaytarılıb",
          "procedureCleared": "Prosedur təmizlənib",
          "workingPaperAdded": "İş vərəqi əlavə edilib",
          "workingPaperUpdated": "İş vərəqi yenilənib",
          "workingPaperSubmitted": "İş vərəqi təqdim edilib",
          "workingPaperReturned": "İş vərəqi qaytarılıb",
          "workingPaperCleared": "İş vərəqi təmizlənib",
          "evidenceAdded": "Sübut əlavə edilib",
          "findingAdded": "Nəticə əlavə edilib",
          "noteAdded": "Qeyd əlavə edilib"
        }
      },
      "comments": {
        "title": "Daxili şərhlər",
        "description": "Sahə işi məsələləri üzrə daxili komanda müzakirəsi.",
        "emptyTitle": "Daxili şərh yoxdur",
        "emptyDescription": "Daxili şərhlər burada görünəcək."
      },
      "settings": {
        "title": "Sahə işi parametrləri",
        "description": "Bu sahə işi paketini arxivləyin və ya bərpa edin.",
        "readOnlyNotice": "Sahə işi parametrlərinə yalnız baxış girişiniz var.",
        "tickmarkLibraryTitle": "İşarə kitabxanası",
        "tickmarkLibraryDescription": "İş vərəqləri üçün təkrar istifadə olunan işarələri idarə edin.",
        "tickmarkSymbol": "Simvol",
        "tickmarkMeaning": "Mənası",
        "addTickmark": "Kitabxanaya əlavə et",
        "lifecycle": {
          "archivedBannerTitle": "Sahə işi arxivlənib",
          "archivedBannerDescription": "Sahə işi iş sahəsi yalnız oxuma rejimindədir. İcraya davam etmək üçün sahə işini bərpa edin.",
          "archivePrompt": "Arxivləmə bu sahə işi paketini tarixçəsini qoruyaraq yalnız oxuma rejiminə keçirir.",
          "archiveAction": "Sahə işini arxivlə",
          "archiveConfirmAction": "Arxivləməni təsdiqlə",
          "restorePrompt": "Prosedur icrasına davam etmək üçün sahə işini bərpa edin.",
          "restoreAction": "Sahə işini bərpa et",
          "restoreConfirmAction": "Bərpanı təsdiqlə",
          "cancelAction": "Ləğv et"
        }
      },
      "procedures": {
        "title": "Audit prosedurları",
        "description": "Təyinat, son tarixlər və tamamlanmanı izləyin.",
        "emptyTitle": "Prosedur yoxdur",
        "emptyDescription": "Sahə işi başladıldıqda prosedurlar yaradılır.",
        "assignAuditor": "Təyin edilmiş auditor",
        "unassigned": "Təyin edilməyib",
        "dueDate": "Son tarix",
        "assignedTo": "Təyin edilib"
      },
      "findings": {
        "title": "Nəticələr",
        "description": "Sahə işi zamanı aşkar edilmiş audit nəticələrini sənədləşdirin.",
        "emptyTitle": "Nəticə yoxdur",
        "emptyDescription": "Nəticələr sənədləşdirildikcə görünəcək.",
        "titlePlaceholder": "Nəticə başlığı"
      },
      "evidence": {
        "title": "Sübut reyestri",
        "description": "Sübut istinadları və əlavə metadatası.",
        "emptyTitle": "Sübut yoxdur",
        "emptyDescription": "Prosedurlar icra olunarkən sübut istinadlarını qeydə alın.",
        "fileLabel": "Əlavə",
        "procedureLabel": "Bağlı prosedur",
        "uploadedBadge": "Fayl əlavə edilib",
        "namePlaceholder": "Sübut istinad adı",
        "downloadAction": "Yüklə",
        "downloadError": "Sübut faylı yüklənə bilmədi"
      }
    },
    "engagements": {
      "history": {
        "title": "Fəaliyyət və audit",
        "description": "Müsadirə dəyişikliklərinin və audit icmalının yalnız oxuma zaman xətti.",
        "errorTitle": "Fəaliyyət yüklənə bilmədi",
        "errorDescription": "Müsadirə fəaliyyəti yüklənərkən xəta baş verdi.",
        "summary": {
          "title": "Audit icmalı",
          "description": "Bu müsadirə üçün qeydə alınmış hadisələrin sayı.",
          "total": "Ümumi hadisələr",
          "created": "Yaradılıb",
          "updated": "Yenilənib",
          "statusChanged": "Status dəyişib",
          "archived": "Arxivlənib",
          "restored": "Bərpa edilib"
        },
        "timeline": {
          "title": "Fəaliyyət zaman xətti",
          "description": "Bu müsadirə üçün xronoloji audit izi.",
          "emptyTitle": "Qeydə alınmış fəaliyyət yoxdur",
          "emptyDescription": "Bu müsadirədəki dəyişikliklər audita alındıqca burada görünəcək.",
          "reasonArchive": "Arxivləmə səbəbi",
          "reasonRestore": "Bərpa səbəbi",
          "fieldsChanged": "Dəyişdirilmiş sahələr",
          "actions": {
            "engagement.created": "Müsadirə yaradılıb",
            "engagement.updated": "Müsadirə yenilənib",
            "engagement.status.changed": "Status dəyişib",
            "engagement.archived": "Müsadirə arxivlənib",
            "engagement.restored": "Müsadirə bərpa edilib"
          }
        },
        "version": {
          "title": "Versiya məlumatı",
          "description": "Cari qeyd versiyaları və həyat dövrü vaxt möhürləri.",
          "cardTitle": "Qeyd metadatası",
          "recordVersion": "Qeyd versiyası",
          "created": "Yaradılıb",
          "archived": "Arxivlənmə vaxtı",
          "notArchived": "Arxivlənməyib",
          "restored": "Bərpa edilib",
          "restoredHint": "Bərpa hadisələri üçün zaman xəttinə baxın"
        }
      },
      "settings": {
        "title": "Parametrlər",
        "description": "Müsadirə məlumatlarını, hesabatı və həyat dövrü statusunu konfiqurasiya edin.",
        "readOnlyNotice": "Müsadirə parametrlərinə yalnız baxış girişiniz var.",
        "saveLabel": "Saxla",
        "savingLabel": "Saxlanılır…",
        "discardLabel": "Ləğv et",
        "sections": {
          "general": {
            "title": "Ümumi",
            "description": "Ad, kod, növ və həyat dövrü statusu."
          },
          "client": {
            "title": "Müştəri",
            "description": "Bu müsadirənin xidmət etdiyi hüquqi şəxs."
          },
          "reporting": {
            "title": "Hesabat",
            "description": "Çərçivə və hesabat dövrü."
          },
          "dates": {
            "title": "Tarixlər",
            "description": "Bu müsadirə üçün planlaşdırılmış cədvəl."
          },
          "notes": {
            "title": "Qeydlər",
            "description": "Təsvir və daxili qeydlər."
          }
        },
        "lifecycle": {
          "title": "Həyat dövrü",
          "description": "Status dəyişdikdə bu müsadirəni arxivləyin və ya bərpa edin.",
          "archivedBannerTitle": "Bu müsadirə arxivlənib",
          "archivedBannerDescription": "İş sahəsi yalnız oxuma rejimindədir. Yenidən dəyişiklik etmək üçün müsadirəni bərpa edin.",
          "archivePrompt": "Arxivləmə bu müsadirəni tarixçəsini qoruyaraq yalnız oxuma rejiminə keçirir.",
          "archiveAction": "Müsadirəni arxivlə",
          "archiveConfirmTitle": "Bu müsadirə arxivlənsin?",
          "archiveConfirmDescription": "Müsadirə yalnız oxuma rejiminə keçəcək. Lazım olsa, sonra bərpa edə bilərsiniz.",
          "archiveReasonPlaceholder": "Arxivləmə üçün istəyə bağlı səbəb",
          "archiveConfirmAction": "Arxivləməni təsdiqlə",
          "restorePrompt": "Konfiqurasiya və sahə işini davam etdirmək üçün bu müsadirəni bərpa edin.",
          "restoreAction": "Müsadirəni bərpa et",
          "restoreConfirmTitle": "Bu müsadirə bərpa edilsin?",
          "restoreConfirmDescription": "Müsadirə yenidən aktiv olacaq və səlahiyyətli istifadəçilər üçün redaktə edilə biləcək.",
          "restoreConfirmAction": "Bərpanı təsdiqlə",
          "reasonLabel": "Səbəb",
          "cancelAction": "Ləğv et"
        }
      },
      "members": {
        "title": "Komanda üzvləri",
        "description": "Bu müsadirəyə təyin edilmiş şəxslər.",
        "emptyTitle": "Təyin edilmiş üzv yoxdur",
        "emptyDescription": "Komanda üzvləri bu müsadirəyə təyin edildikdən sonra burada görünəcək.",
        "joinedLabel": "Qoşulub",
        "forbiddenTitle": "Giriş məhdudlaşdırılıb",
        "forbiddenDescription": "Müsadirə üzvlərinə baxmaq üçün icazəniz yoxdur.",
        "roles": {
          "engagement_partner": "Müsadirə tərəfdaşı",
          "engagement_manager": "Müsadirə meneceri",
          "senior": "Baş mütəxəssis",
          "staff": "İşçi heyət",
          "reviewer": "Yoxlayıcı",
          "observer": "Müşahidəçi"
        }
      }
    },
    "companies": {
      "history": {
        "title": "Fəaliyyət və audit",
        "description": "Şirkət dəyişikliklərinin yalnız oxunan xronologiyası və audit icmalı.",
        "errorTitle": "Fəaliyyət yüklənə bilmədi",
        "errorDescription": "Şirkət fəaliyyəti yüklənərkən xəta baş verdi.",
        "summary": {
          "title": "Audit icmalı",
          "description": "Bu şirkət üçün qeydə alınmış hadisələrin sayı.",
          "total": "Ümumi hadisələr",
          "created": "Yaradılıb",
          "updated": "Yenilənib",
          "settingsUpdated": "Parametrlər yenilənib",
          "archived": "Arxivlənib",
          "restored": "Bərpa edilib"
        },
        "timeline": {
          "title": "Fəaliyyət xətti",
          "description": "Bu şirkət üçün xronoloji audit izi.",
          "emptyTitle": "Fəaliyyət qeydə alınmayıb",
          "emptyDescription": "Bu şirkətə edilən dəyişikliklər audit edildikcə burada görünəcək.",
          "reasonArchive": "Arxiv səbəbi",
          "reasonRestore": "Bərpa səbəbi",
          "fieldsChanged": "Dəyişən sahələr",
          "actions": {
            "company.created": "Şirkət yaradılıb",
            "company.updated": "Şirkət yenilənib",
            "company.settings.updated": "Parametrlər yenilənib",
            "company.archived": "Şirkət arxivlənib",
            "company.restored": "Şirkət bərpa edilib"
          }
        },
        "version": {
          "title": "Versiya məlumatı",
          "description": "Cari qeyd versiyaları və həyat dövrü vaxt damğaları.",
          "cardTitle": "Qeyd metadatası",
          "recordVersion": "Qeyd versiyası",
          "settingsVersion": "Parametr versiyası",
          "created": "Yaradılıb",
          "archived": "Arxivlənib",
          "notArchived": "Arxivlənməyib",
          "restored": "Bərpa edilib",
          "restoredHint": "Bərpa hadisələri üçün xəttə baxın"
        }
      },
      "settings": {
        "title": "Parametrlər",
        "description": "Bu şirkət üçün hesabat, maliyyə və əməliyyat seçimlərini konfiqurasiya edin.",
        "navAriaLabel": "Şirkət parametrləri bölmələri",
        "navGeneral": "Ümumi",
        "navReporting": "Hesabat",
        "navFinancial": "Maliyyə",
        "navContacts": "Əlaqələr",
        "navPreferences": "Seçimlər",
        "navValidation": "Təsdiqləmə",
        "readOnlyBadge": "Yalnız baxış",
        "saveIdle": "Bütün dəyişikliklər saxlanılıb",
        "saveSaving": "Dəyişikliklər saxlanılır…",
        "saveSaved": "Dəyişikliklər saxlanıldı",
        "saveError": "Dəyişikliklər saxlanıla bilmədi",
        "unsavedMessage": "Saxlanmamış dəyişiklikləriniz var",
        "discardLabel": "Ləğv et",
        "saveLabel": "Saxla",
        "savingLabel": "Saxlanılır…",
        "conflictTitle": "Parametrlər başqa yerdə yeniləndi",
        "conflictDescription": "Başqa sessiya bu parametrləri dəyişdi. Ən son versiyanı yükləmək üçün yeniləyin və ya dəyişikliklərinizi ləğv edin.",
        "conflictRefresh": "Yenilə",
        "conflictDiscard": "Dəyişiklikləri ləğv et",
        "loading": "Şirkət parametrləri yüklənir",
        "errorTitle": "Parametrlər yüklənə bilmədi",
        "errorDescription": "Şirkət parametrləri yüklənərkən xəta baş verdi.",
        "sections": {
          "general": {
            "title": "Ümumi",
            "description": "Bu subyekt üçün yurisdiksiya, təsnifat və ünvanlar.",
            "classificationTitle": "Təsnifat",
            "registeredAddressTitle": "Qeydiyyat ünvanı",
            "operatingAddressTitle": "Fəaliyyət ünvanı",
            "addressHint": "İstəyə bağlı — təqdimatlar və yazışmalar üçün istifadə olunur."
          },
          "reporting": {
            "title": "Hesabat",
            "description": "Qanuni və idarəetmə hesabatları üçün çərçivə.",
            "groupTitle": "Hesabat çərçivəsi",
            "groupDescription": "Bu subyektə tətbiq olunan uçot standartlarını müəyyən edir."
          },
          "financial": {
            "title": "Maliyyə",
            "description": "Valyuta və maliyyə ili konfiqurasiyası.",
            "groupTitle": "Maliyyə konfiqurasiyası",
            "groupDescription": "Funksional valyuta və maliyyə dövrü sərhədləri.",
            "currencyHint": "ISO 4217 üç hərfli kod, məs. USD"
          },
          "contacts": {
            "title": "Əlaqələr",
            "description": "Maliyyə və xarici audit koordinasiyasından məsul şəxslər."
          },
          "preferences": {
            "title": "Seçimlər",
            "description": "Əməliyyat standartları və göstərmə seçimləri.",
            "groupTitle": "İş mühiti seçimləri",
            "groupDescription": "İdxal, dil və yuvarlaqlaşdırma üçün istəyə bağlı standartlar.",
            "defaultLocale": "Varsayılan dil",
            "dataImportSource": "Məlumat idxalı mənbəyi",
            "roundingConvention": "Yuvarlaqlaşdırma qaydası",
            "tradeNameHint": "İstəyə bağlı ticarət adı — hüquqi ad deyil."
          },
          "validation": {
            "title": "Təsdiqləmə",
            "description": "Şirkət parametrləri üçün sxem təsdiqləmə statusu.",
            "groupTitle": "Təsdiqləmə icmalı",
            "readOnlyNotice": "Təsdiqləmə metadatası platforma tərəfindən idarə olunur və burada redaktə edilə bilməz."
          }
        }
      }
    }
  },
  "ru": {
    "planning": {
      "workflow": {
        "eyebrow": "Процесс утверждения",
        "lockedBadge": "Заблокировано",
        "submitAction": "Отправить на проверку",
        "returnAction": "Вернуть на доработку",
        "returnConfirmAction": "Подтвердить возврат",
        "approveAction": "Утвердить планирование",
        "reviseAction": "Создать редакцию",
        "reviseConfirmAction": "Подтвердить редакцию",
        "cancelAction": "Отмена",
        "returnNotesTitle": "Заметки о возврате",
        "returnNotesLabel": "Заметки о доработке",
        "returnNotesPlaceholder": "Опишите, что нужно исправить перед повторной отправкой…",
        "reviseNotesLabel": "Сводка редакции",
        "reviseNotesPlaceholder": "Необязательная сводка причин пересмотра утверждённого плана…",
        "pendingReviewNotice": "Этот план ожидает проверки партнёром или руководителем.",
        "errorGeneric": "Не удалось выполнить действие процесса планирования."
      },
      "history": {
        "title": "История планирования",
        "description": "Хронология изменений планирования и сводка аудита только для чтения.",
        "emptyTitle": "Нет активности планирования",
        "emptyDescription": "Активность планирования появится здесь по мере фиксации изменений.",
        "actions": {
          "created": "Планирование создано",
          "updated": "Планирование обновлено",
          "statusChanged": "Статус изменён",
          "archived": "Планирование архивировано",
          "restored": "Планирование восстановлено",
          "checklistUpdated": "Контрольный список обновлён",
          "timelineUpdated": "График обновлён",
          "submitted": "Отправлено на проверку",
          "returned": "Возвращено на доработку",
          "approved": "Планирование утверждено",
          "revised": "План пересмотрен",
          "commentAdded": "Комментарий добавлен",
          "documentAdded": "Документ добавлен",
          "documentRemoved": "Документ удалён"
        },
        "revision": {
          "title": "История редакций",
          "description": "Предыдущие утверждённые версии плана, заменённые редакцией.",
          "entryTitle": "Версия плана {version}"
        },
        "version": {
          "title": "Информация о версии",
          "description": "Текущие версии плана и метки времени жизненного цикла.",
          "cardTitle": "Метаданные плана",
          "recordVersion": "Версия записи",
          "planVersion": "Версия плана",
          "submitted": "Отправлено",
          "approved": "Утверждено",
          "notSubmitted": "Не отправлено",
          "notApproved": "Не утверждено",
          "created": "Создано",
          "updated": "Обновлено",
          "archived": "Архивировано",
          "notArchived": "Не в архиве"
        }
      },
      "comments": {
        "title": "Комментарии к планированию",
        "description": "Заметки проверки и обсуждение, зафиксированные при утверждении планирования.",
        "emptyDescription": "Комментариев к планированию пока нет. Они появляются, когда рецензенты добавляют заметки или возвращают план.",
        "addLabel": "Добавить комментарий",
        "addPlaceholder": "Задокументируйте заметку по планированию или комментарий проверки…",
        "addAction": "Добавить комментарий",
        "reviewModeNotice": "Комментарии фиксируются, когда план возвращается на доработку.",
        "types": {
          "review": "Проверка",
          "general": "Общее",
          "return": "Заметка о возврате"
        }
      },
      "settings": {
        "title": "Настройки планирования",
        "description": "Архивируйте или восстанавливайте эту запись аудиторского планирования.",
        "readOnlyNotice": "У вас доступ только для просмотра настроек планирования.",
        "lifecycle": {
          "archivedBannerTitle": "Планирование в архиве",
          "archivedBannerDescription": "Рабочее пространство планирования доступно только для чтения. Восстановите планирование для внесения изменений.",
          "archivePrompt": "Архивация переводит запись планирования в режим только для чтения, сохраняя историю.",
          "archiveAction": "Архивировать планирование",
          "archiveReasonPlaceholder": "Необязательная причина архивации",
          "archiveConfirmAction": "Подтвердить архивацию",
          "restorePrompt": "Восстановите планирование для продолжения документирования и проверки.",
          "restoreAction": "Восстановить планирование",
          "restoreConfirmAction": "Подтвердить восстановление",
          "reasonLabel": "Причина",
          "cancelAction": "Отмена"
        }
      },
      "documents": {
        "title": "Документы планирования",
        "description": "Меморандумы по планированию и сопроводительная документация.",
        "emptyTitle": "Нет документов планирования",
        "emptyDescription": "Добавьте меморандумы по планированию и сопроводительные ссылки для этого аудиторского плана.",
        "addTitle": "Добавить ссылку на документ",
        "nameLabel": "Название документа",
        "namePlaceholder": "Меморандум по планированию",
        "typeLabel": "Тип документа",
        "addAction": "Добавить документ",
        "metadataNotice": "Интеграция хранения файлов прикрепит двоичные файлы в будущем релизе. Ссылки сейчас записываются в аудиторский план.",
        "documentTypes": {
          "planning_memorandum": "Меморандум по планированию",
          "risk_assessment": "Оценка рисков",
          "materiality_worksheet": "Рабочий лист существенности",
          "other": "Другое"
        },
        "statuses": {
          "uploaded": "Записано",
          "pending": "Ожидает",
          "archived": "В архиве"
        }
      },
      "checklist": {
        "title": "Контрольный список планирования",
        "description": "Отслеживайте выполнение основных результатов планирования перед полевыми работами.",
        "progress": "Прогресс",
        "saveLabel": "Сохранить",
        "savingLabel": "Сохранение…",
        "items": {
          "objectives": "Цели проекта задокументированы",
          "scope": "Объём аудита определён",
          "strategy": "Аудиторская стратегия задокументирована",
          "framework": "Стандарт отчётности подтверждён",
          "materiality": "Заглушка существенности проверена",
          "risk": "Заглушка рисков проверена",
          "team": "Планирование команды завершено",
          "timeline": "График установлен"
        }
      },
      "editor": {
        "readOnlyNotice": "У вас доступ только для просмотра этого раздела планирования.",
        "saveLabel": "Сохранить",
        "savingLabel": "Сохранение…",
        "discardLabel": "Отменить",
        "placeholder": "Задокументируйте профессиональное суждение и контекст проекта…"
      },
      "team": {
        "title": "Планирование команды",
        "description": "Состав проекта и планирование загрузки для этого аудита.",
        "rosterTitle": "Команда проекта",
        "rosterEmpty": "Участники команды для этого проекта ещё не назначены.",
        "capacityTitle": "Планирование загрузки",
        "estimatedHours": "Оценочные часы",
        "notes": "Заметки по планированию",
        "saveLabel": "Сохранить",
        "savingLabel": "Сохранение…"
      },
      "timeline": {
        "title": "График планирования",
        "description": "Контрольные даты планирования, полевых работ, проверки и завершения.",
        "startDate": "Начало",
        "endDate": "Окончание",
        "saveLabel": "Сохранить",
        "savingLabel": "Сохранение…",
        "milestones": {
          "planning": "Планирование",
          "fieldwork": "Полевые работы",
          "review": "Проверка",
          "completion": "Завершение"
        }
      },
      "integration": {
        "integrationReady": "Готово к интеграции",
        "currentStatus": "Текущий статус",
        "statuses": {
          "not_configured": "Не настроено",
          "placeholder": "Заглушка готова",
          "integrated": "Интегрировано"
        },
        "materiality": {
          "title": "Существенность",
          "description": "Пороги существенности будут задокументированы в отдельном модуле.",
          "placeholderTitle": "Заглушка модуля существенности",
          "placeholderDescription": "Рабочие листы общей, исполнительской и специфической существенности будут подключены здесь после реализации модуля существенности."
        },
        "risk": {
          "title": "Оценка рисков",
          "description": "Откройте рабочее пространство оценки рисков проекта из планирования.",
          "placeholderTitle": "Оценка рисков интегрирована",
          "placeholderDescription": "Планирование связано с отдельным рабочим пространством оценки рисков. Используйте Оценку рисков в боковой панели проекта или продолжите из раздела рисков планирования."
        }
      }
    },
    "materiality": {
      "workflow": {
        "title": "Существенность workflow",
        "description": "Подача, возврат и утверждение документации по существенности ISA 320.",
        "submitAction": "Отправить на проверку",
        "returnAction": "Вернуть на доработку",
        "returnConfirmAction": "Подтвердить возврат",
        "approveAction": "Утвердить существенность",
        "cancelAction": "Отмена",
        "returnNotesLabel": "Примечания к возврату",
        "returnNotesPlaceholder": "Опишите, что необходимо исправить перед повторной подачей.",
        "readOnlyNotice": "Этот пакет существенности архивирован и доступен только для чтения.",
        "submittedNotice": "Этот пакет существенности подан и ожидает проверки.",
        "approvedNotice": "Этот пакет существенности утверждён.",
        "returnedNotice": "Этот пакет существенности возвращён на доработку.",
        "errorGeneric": "Не удалось выполнить действие рабочего процесса существенности."
      },
      "history": {
        "title": "История",
        "description": "Хронология активности по существенности (только для чтения).",
        "emptyTitle": "Нет активности по существенности",
        "emptyDescription": "Существенность activity will appear here as changes are recorded.",
        "versionLabel": "Версия пакета",
        "updatedLabel": "Обновлено",
        "actions": {
          "materiality.benchmark.added": "Добавлен контрольный показатель",
          "materiality.benchmark.updated": "Контрольный показатель обновлён",
          "materiality.calculation.recorded": "Расчёт зафиксирован",
          "materiality.threshold.updated": "Порог обновлён",
          "materiality.comment.added": "Добавлен комментарий",
          "materiality.version.created": "Создана версия"
        }
      },
      "comments": {
        "title": "Комментарии",
        "description": "Фиксация комментариев проверки и внутренних заметок по существенности.",
        "emptyTitle": "Нет комментариев",
        "emptyDescription": "Комментарии appear here once added.",
        "bodyPlaceholder": "Добавить комментарий",
        "addAction": "Добавить комментарий"
      },
      "settings": {
        "title": "Настройки",
        "description": "Архивирование или восстановление этого пакета существенности.",
        "archiveAction": "Архивировать пакет существенности",
        "archiveConfirmAction": "Подтвердить архивирование",
        "restoreAction": "Восстановить пакет существенности",
        "restoreConfirmAction": "Подтвердить восстановление",
        "cancelAction": "Отмена",
        "archivedBanner": "Этот пакет существенности архивирован.",
        "readOnlyNotice": "У вас доступ только для просмотра настроек существенности."
      },
      "versions": {
        "title": "Версии",
        "description": "Просмотр снимков версий пакета существенности.",
        "emptyTitle": "Нет версий",
        "emptyDescription": "Снимки версий создаются при пересмотре или утверждении существенности."
      }
    },
    "riskAssessment": {
      "workflow": {
        "title": "Рабочий процесс рисков",
        "description": "Отправка, возврат и утверждение документации оценки рисков.",
        "submitAction": "Отправить на проверку",
        "returnAction": "Вернуть на доработку",
        "returnConfirmAction": "Подтвердить возврат",
        "approveAction": "Утвердить оценку рисков",
        "acknowledgeAction": "Подтвердить значимые риски",
        "cancelAction": "Отмена",
        "returnNotesLabel": "Примечание при возврате",
        "returnNotesPlaceholder": "Опишите, что нужно исправить перед повторной отправкой.",
        "readOnlyNotice": "Эта оценка рисков архивирована и доступна только для чтения.",
        "submittedNotice": "Эта оценка рисков отправлена и ожидает проверки.",
        "approvedNotice": "Эта оценка рисков утверждена.",
        "acknowledgedNotice": "Значимые риски подтверждены.",
        "pendingAcknowledgmentNotice": "Перед утверждением необходимо подтвердить значимые риски.",
        "errorGeneric": "Не удалось выполнить действие рабочего процесса оценки рисков."
      },
      "history": {
        "title": "История",
        "description": "Хронология активности оценки рисков только для чтения.",
        "emptyTitle": "Активности по рискам нет",
        "emptyDescription": "Активность по рискам появится здесь по мере записи изменений.",
        "versionLabel": "Версия оценки",
        "updatedLabel": "Обновлено",
        "actions": {
          "risk_assessment.created": "Оценка рисков создана",
          "risk_assessment.updated": "Оценка рисков обновлена",
          "risk_assessment.archived": "Оценка рисков архивирована",
          "risk_assessment.restored": "Оценка рисков восстановлена",
          "risk_assessment.submitted": "Оценка рисков отправлена",
          "risk_assessment.returned": "Оценка рисков возвращена",
          "risk_assessment.approved": "Оценка рисков утверждена",
          "risk_assessment.category.added": "Категория добавлена",
          "risk_assessment.risk_item.added": "Элемент риска добавлен",
          "risk_assessment.risk_item.updated": "Элемент риска обновлён",
          "risk_assessment.assertion_rating.updated": "Рейтинг предпосылки обновлён",
          "risk_assessment.response.added": "Ответная мера добавлена",
          "risk_assessment.procedure.linked": "Процедура связана",
          "risk_assessment.note.added": "Заметка добавлена",
          "risk_assessment.significant.acknowledged": "Значимые риски подтверждены"
        }
      },
      "comments": {
        "title": "Комментарии",
        "description": "Фиксируйте внутренние комментарии, связанные с рисками.",
        "emptyTitle": "Комментариев нет",
        "emptyDescription": "Комментарии появятся здесь после добавления.",
        "bodyPlaceholder": "Добавить внутренний комментарий",
        "addAction": "Добавить комментарий"
      },
      "settings": {
        "title": "Настройки",
        "description": "Архивируйте или восстановите эту оценку рисков.",
        "archiveAction": "Архивировать оценку рисков",
        "archiveConfirmAction": "Подтвердить архивирование",
        "restoreAction": "Восстановить оценку рисков",
        "restoreConfirmAction": "Подтвердить восстановление",
        "cancelAction": "Отмена",
        "archivedBanner": "Эта оценка рисков архивирована.",
        "readOnlyNotice": "У вас доступ только для просмотра настроек оценки рисков."
      },
      "procedures": {
        "title": "Процедуры",
        "description": "Свяжите запланированные процедуры с элементами риска.",
        "emptyTitle": "Связанных процедур нет",
        "emptyDescription": "Добавьте связи с процедурами для отображения выполнения ответных мер.",
        "riskItemLabel": "Выберите элемент риска",
        "referencePlaceholder": "Ссылка на процедуру",
        "addAction": "Добавить связь с процедурой"
      }
    },
    "fieldwork": {
      "workflow": {
        "queueTitle": "Очередь проверки",
        "queueDescription": "Процедуры, ожидающие проверки или завершения.",
        "queueEmpty": "Нет процедур, ожидающих проверки.",
        "pendingReviewCount": "Ожидает проверки",
        "openProcedureAction": "Открыть процедуру",
        "submitAction": "Отправить на проверку",
        "returnAction": "Вернуть на доработку",
        "returnConfirmAction": "Подтвердить возврат",
        "clearAction": "Завершить проверку",
        "clearConfirmAction": "Подтвердить завершение",
        "cancelAction": "Отмена",
        "returnNotesTitle": "Заметки о возврате",
        "returnNotesPlaceholder": "Опишите, что нужно исправить",
        "clearanceNotesPlaceholder": "Задокументируйте завершение проверки",
        "errorGeneric": "Не удалось обновить процесс процедуры"
      },
      "history": {
        "title": "История полевых работ",
        "description": "Хронология изменений полевых работ только для чтения.",
        "emptyTitle": "Нет активности полевых работ",
        "emptyDescription": "Активность появится по мере выполнения полевых работ.",
        "versionLabel": "Версия программы",
        "actions": {
          "created": "Полевые работы созданы",
          "updated": "Полевые работы обновлены",
          "archived": "Полевые работы архивированы",
          "restored": "Полевые работы восстановлены",
          "programUpdated": "Программа обновлена",
          "procedureAssigned": "Процедура назначена",
          "procedureUpdated": "Процедура обновлена",
          "procedureCompleted": "Процедура завершена",
          "procedureSubmitted": "Процедура отправлена",
          "procedureReturned": "Процедура возвращена",
          "procedureCleared": "Процедура очищена",
          "workingPaperAdded": "Рабочий документ добавлен",
          "workingPaperUpdated": "Рабочий документ обновлён",
          "workingPaperSubmitted": "Рабочий документ отправлен",
          "workingPaperReturned": "Рабочий документ возвращён",
          "workingPaperCleared": "Рабочий документ очищен",
          "evidenceAdded": "Доказательство добавлено",
          "findingAdded": "Выявление добавлено",
          "noteAdded": "Заметка добавлена"
        }
      },
      "comments": {
        "title": "Внутренние комментарии",
        "description": "Внутреннее обсуждение команды по вопросам полевых работ.",
        "emptyTitle": "Нет внутренних комментариев",
        "emptyDescription": "Внутренние комментарии появятся здесь."
      },
      "settings": {
        "title": "Настройки полевых работ",
        "description": "Архивируйте или восстанавливайте этот пакет полевых работ.",
        "readOnlyNotice": "У вас доступ только для просмотра настроек полевых работ.",
        "tickmarkLibraryTitle": "Библиотека меток",
        "tickmarkLibraryDescription": "Управляйте повторно используемыми метками для рабочих документов.",
        "tickmarkSymbol": "Символ",
        "tickmarkMeaning": "Значение",
        "addTickmark": "Добавить в библиотеку",
        "lifecycle": {
          "archivedBannerTitle": "Полевые работы в архиве",
          "archivedBannerDescription": "Рабочее пространство полевых работ доступно только для чтения. Восстановите полевые работы для продолжения выполнения.",
          "archivePrompt": "Архивация переводит пакет полевых работ в режим только для чтения, сохраняя историю.",
          "archiveAction": "Архивировать полевые работы",
          "archiveConfirmAction": "Подтвердить архивацию",
          "restorePrompt": "Восстановите полевые работы для возобновления выполнения процедур.",
          "restoreAction": "Восстановить полевые работы",
          "restoreConfirmAction": "Подтвердить восстановление",
          "cancelAction": "Отмена"
        }
      },
      "procedures": {
        "title": "Аудиторские процедуры",
        "description": "Отслеживайте назначение, сроки и завершение.",
        "emptyTitle": "Нет процедур",
        "emptyDescription": "Процедуры создаются при инициации полевых работ.",
        "assignAuditor": "Назначенный аудитор",
        "unassigned": "Не назначено",
        "dueDate": "Срок",
        "assignedTo": "Назначено"
      },
      "findings": {
        "title": "Выявления",
        "description": "Задокументируйте аудиторские выявления, обнаруженные во время полевых работ.",
        "emptyTitle": "Нет выявлений",
        "emptyDescription": "Выявления появятся по мере документирования.",
        "titlePlaceholder": "Название выявления"
      },
      "evidence": {
        "title": "Реестр доказательств",
        "description": "Ссылки на доказательства и метаданные вложений.",
        "emptyTitle": "Нет доказательств",
        "emptyDescription": "Записывайте ссылки на доказательства по мере выполнения процедур.",
        "fileLabel": "Вложение",
        "procedureLabel": "Связанная процедура",
        "uploadedBadge": "Файл прикреплён",
        "namePlaceholder": "Название ссылки на доказательство",
        "downloadAction": "Скачать",
        "downloadError": "Не удалось скачать файл доказательства"
      }
    },
    "engagements": {
      "history": {
        "title": "Активность и аудит",
        "description": "Хронология изменений проекта и сводка аудита только для чтения.",
        "errorTitle": "Не удалось загрузить активность",
        "errorDescription": "При загрузке активности проекта произошла ошибка.",
        "summary": {
          "title": "Сводка аудита",
          "description": "Количество зафиксированных событий для этого проекта.",
          "total": "Всего событий",
          "created": "Создано",
          "updated": "Обновлено",
          "statusChanged": "Статус изменён",
          "archived": "В архиве",
          "restored": "Восстановлено"
        },
        "timeline": {
          "title": "Хронология активности",
          "description": "Хронологический аудиторский след для этого проекта.",
          "emptyTitle": "Активность не зафиксирована",
          "emptyDescription": "Изменения в этом проекте появятся здесь по мере аудита.",
          "reasonArchive": "Причина архивации",
          "reasonRestore": "Причина восстановления",
          "fieldsChanged": "Изменённые поля",
          "actions": {
            "engagement.created": "Проект создан",
            "engagement.updated": "Проект обновлён",
            "engagement.status.changed": "Статус изменён",
            "engagement.archived": "Проект архивирован",
            "engagement.restored": "Проект восстановлен"
          }
        },
        "version": {
          "title": "Информация о версии",
          "description": "Текущие версии записи и метки времени жизненного цикла.",
          "cardTitle": "Метаданные записи",
          "recordVersion": "Версия записи",
          "created": "Создано",
          "archived": "Архивировано",
          "notArchived": "Не в архиве",
          "restored": "Восстановлено",
          "restoredHint": "См. хронологию для событий восстановления"
        }
      },
      "settings": {
        "title": "Настройки",
        "description": "Настройте сведения о проекте, отчётность и статус жизненного цикла.",
        "readOnlyNotice": "У вас доступ только для просмотра настроек проекта.",
        "saveLabel": "Сохранить",
        "savingLabel": "Сохранение…",
        "discardLabel": "Отменить",
        "sections": {
          "general": {
            "title": "Общее",
            "description": "Название, код, тип и статус жизненного цикла."
          },
          "client": {
            "title": "Клиент",
            "description": "Юридическое лицо, для которого выполняется этот проект."
          },
          "reporting": {
            "title": "Отчётность",
            "description": "Стандарт и отчётный период."
          },
          "dates": {
            "title": "Даты",
            "description": "Плановый график для этого проекта."
          },
          "notes": {
            "title": "Заметки",
            "description": "Описание и внутренние заметки."
          }
        },
        "lifecycle": {
          "title": "Жизненный цикл",
          "description": "Архивируйте или восстанавливайте этот проект при изменении статуса.",
          "archivedBannerTitle": "Этот проект в архиве",
          "archivedBannerDescription": "Рабочее пространство доступно только для чтения. Восстановите проект, чтобы снова вносить изменения.",
          "archivePrompt": "Архивация переводит проект в режим только для чтения, сохраняя историю.",
          "archiveAction": "Архивировать проект",
          "archiveConfirmTitle": "Архивировать этот проект?",
          "archiveConfirmDescription": "Проект станет доступен только для чтения. При необходимости вы сможете восстановить его позже.",
          "archiveReasonPlaceholder": "Необязательная причина архивации",
          "archiveConfirmAction": "Подтвердить архивацию",
          "restorePrompt": "Восстановите проект, чтобы продолжить настройку и полевые работы.",
          "restoreAction": "Восстановить проект",
          "restoreConfirmTitle": "Восстановить этот проект?",
          "restoreConfirmDescription": "Проект снова станет активным и доступным для редактирования уполномоченными пользователями.",
          "restoreConfirmAction": "Подтвердить восстановление",
          "reasonLabel": "Причина",
          "cancelAction": "Отмена"
        }
      },
      "members": {
        "title": "Участники команды",
        "description": "Люди, назначенные на этот проект.",
        "emptyTitle": "Участники не назначены",
        "emptyDescription": "Участники команды появятся здесь после назначения на проект.",
        "joinedLabel": "Присоединился",
        "forbiddenTitle": "Доступ ограничен",
        "forbiddenDescription": "У вас нет прав на просмотр участников проекта.",
        "roles": {
          "engagement_partner": "Партнёр проекта",
          "engagement_manager": "Руководитель проекта",
          "senior": "Старший",
          "staff": "Исполнитель",
          "reviewer": "Рецензент",
          "observer": "Наблюдатель"
        }
      }
    },
    "companies": {
      "history": {
        "title": "Активность и аудит",
        "description": "Хронология изменений компании и сводка аудита (только чтение).",
        "errorTitle": "Не удалось загрузить активность",
        "errorDescription": "При загрузке активности компании произошла ошибка.",
        "summary": {
          "title": "Сводка аудита",
          "description": "Количество зарегистрированных событий для этой компании.",
          "total": "Всего событий",
          "created": "Создано",
          "updated": "Обновлено",
          "settingsUpdated": "Настройки обновлены",
          "archived": "Архивировано",
          "restored": "Восстановлено"
        },
        "timeline": {
          "title": "Хронология активности",
          "description": "Хронологический аудиторский след компании.",
          "emptyTitle": "Активность не записана",
          "emptyDescription": "Изменения компании появятся здесь после аудита.",
          "reasonArchive": "Причина архивации",
          "reasonRestore": "Причина восстановления",
          "fieldsChanged": "Изменённые поля",
          "actions": {
            "company.created": "Компания создана",
            "company.updated": "Компания обновлена",
            "company.settings.updated": "Настройки обновлены",
            "company.archived": "Компания архивирована",
            "company.restored": "Компания восстановлена"
          }
        },
        "version": {
          "title": "Информация о версиях",
          "description": "Текущие версии записей и метки жизненного цикла.",
          "cardTitle": "Метаданные записи",
          "recordVersion": "Версия записи",
          "settingsVersion": "Версия настроек",
          "created": "Создано",
          "archived": "Архивировано",
          "notArchived": "Не в архиве",
          "restored": "Восстановлено",
          "restoredHint": "См. хронологию для событий восстановления"
        }
      },
      "settings": {
        "title": "Настройки",
        "description": "Настройте отчётность, финансы и операционные параметры для этой компании.",
        "navAriaLabel": "Разделы настроек компании",
        "navGeneral": "Общие",
        "navReporting": "Отчётность",
        "navFinancial": "Финансы",
        "navContacts": "Контакты",
        "navPreferences": "Предпочтения",
        "navValidation": "Проверка",
        "readOnlyBadge": "Только просмотр",
        "saveIdle": "Все изменения сохранены",
        "saveSaving": "Сохранение изменений…",
        "saveSaved": "Изменения сохранены",
        "saveError": "Не удалось сохранить изменения",
        "unsavedMessage": "Есть несохранённые изменения",
        "discardLabel": "Отменить",
        "saveLabel": "Сохранить",
        "savingLabel": "Сохранение…",
        "conflictTitle": "Настройки обновлены в другом месте",
        "conflictDescription": "Другая сессия изменила эти настройки. Обновите страницу или отмените свои изменения.",
        "conflictRefresh": "Обновить",
        "conflictDiscard": "Отменить изменения",
        "loading": "Загрузка настроек компании",
        "errorTitle": "Не удалось загрузить настройки",
        "errorDescription": "При загрузке настроек компании произошла ошибка.",
        "sections": {
          "general": {
            "title": "Общие",
            "description": "Юрисдикция, классификация и адреса для этого субъекта.",
            "classificationTitle": "Классификация",
            "registeredAddressTitle": "Юридический адрес",
            "operatingAddressTitle": "Операционный адрес",
            "addressHint": "Необязательно — для отчётности и корреспонденции."
          },
          "reporting": {
            "title": "Отчётность",
            "description": "База для статутной и управленческой отчётности.",
            "groupTitle": "Отчётная база",
            "groupDescription": "Определяет применяемые стандарты учёта для этого субъекта."
          },
          "financial": {
            "title": "Финансы",
            "description": "Валюта и настройки финансового года.",
            "groupTitle": "Финансовая конфигурация",
            "groupDescription": "Функциональная валюта и границы финансового периода.",
            "currencyHint": "Трёхбуквенный код ISO 4217, напр. USD"
          },
          "contacts": {
            "title": "Контакты",
            "description": "Ответственные за финансы и внешний аудит."
          },
          "preferences": {
            "title": "Предпочтения",
            "description": "Операционные значения по умолчанию и параметры отображения.",
            "groupTitle": "Параметры рабочего пространства",
            "groupDescription": "Необязательные значения для импорта, языка и округления.",
            "defaultLocale": "Язык по умолчанию",
            "dataImportSource": "Источник импорта данных",
            "roundingConvention": "Правило округления",
            "tradeNameHint": "Необязательное торговое наименование — не юридическое имя."
          },
          "validation": {
            "title": "Проверка",
            "description": "Статус проверки схемы настроек компании.",
            "groupTitle": "Сводка проверки",
            "readOnlyNotice": "Метаданные проверки поддерживаются платформой и не редактируются здесь."
          }
        }
      }
    }
  },
  "tr": {
    "planning": {
      "workflow": {
        "eyebrow": "Onay iş akışı",
        "lockedBadge": "Kilitli",
        "submitAction": "İncelemeye gönder",
        "returnAction": "Revizyona iade et",
        "returnConfirmAction": "İadeyi onayla",
        "approveAction": "Planlamayı onayla",
        "reviseAction": "Revizyon oluştur",
        "reviseConfirmAction": "Revizyonu onayla",
        "cancelAction": "İptal",
        "returnNotesTitle": "İade notları",
        "returnNotesLabel": "Revizyon notları",
        "returnNotesPlaceholder": "Yeniden göndermeden önce ele alınması gerekenleri açıklayın…",
        "reviseNotesLabel": "Revizyon özeti",
        "reviseNotesPlaceholder": "Onaylanmış planın neden revize edildiğine dair isteğe bağlı özet…",
        "pendingReviewNotice": "Bu plan ortak veya yönetici incelemesini bekliyor.",
        "errorGeneric": "Planlama iş akışı eylemi tamamlanamadı."
      },
      "history": {
        "title": "Planlama geçmişi",
        "description": "Planlama değişikliklerinin salt okunur zaman çizelgesi ve denetim özeti.",
        "emptyTitle": "Planlama etkinliği yok",
        "emptyDescription": "Değişiklikler kaydedildikçe planlama etkinliği burada görünecek.",
        "actions": {
          "created": "Planlama oluşturuldu",
          "updated": "Planlama güncellendi",
          "statusChanged": "Durum değişti",
          "archived": "Planlama arşivlendi",
          "restored": "Planlama geri yüklendi",
          "checklistUpdated": "Kontrol listesi güncellendi",
          "timelineUpdated": "Zaman çizelgesi güncellendi",
          "submitted": "İncelemeye gönderildi",
          "returned": "Revizyona iade edildi",
          "approved": "Planlama onaylandı",
          "revised": "Plan revize edildi",
          "commentAdded": "Yorum eklendi",
          "documentAdded": "Belge eklendi",
          "documentRemoved": "Belge kaldırıldı"
        },
        "revision": {
          "title": "Revizyon geçmişi",
          "description": "Revizyonla yerini alan önceki onaylanmış plan sürümleri.",
          "entryTitle": "Plan sürümü {version}"
        },
        "version": {
          "title": "Sürüm bilgileri",
          "description": "Mevcut plan sürümleri ve yaşam döngüsü zaman damgaları.",
          "cardTitle": "Plan meta verileri",
          "recordVersion": "Kayıt sürümü",
          "planVersion": "Plan sürümü",
          "submitted": "Gönderilme zamanı",
          "approved": "Onay zamanı",
          "notSubmitted": "Gönderilmedi",
          "notApproved": "Onaylanmadı",
          "created": "Oluşturuldu",
          "updated": "Güncellendi",
          "archived": "Arşivlenme zamanı",
          "notArchived": "Arşivlenmedi"
        }
      },
      "comments": {
        "title": "Planlama yorumları",
        "description": "Planlama onayı sırasında kaydedilen inceleme notları ve tartışma.",
        "emptyDescription": "Henüz planlama yorumu yok. İnceleyiciler not eklediğinde veya planı iade ettiğinde yorumlar görünür.",
        "addLabel": "Yorum ekle",
        "addPlaceholder": "Bir planlama notu veya inceleme yorumu belgeleyin…",
        "addAction": "Yorum ekle",
        "reviewModeNotice": "Plan revizyona iade edildiğinde yorumlar kaydedilir.",
        "types": {
          "review": "İnceleme",
          "general": "Genel",
          "return": "İade notu"
        }
      },
      "settings": {
        "title": "Planlama ayarları",
        "description": "Bu denetim planlama kaydını arşivleyin veya geri yükleyin.",
        "readOnlyNotice": "Planlama ayarlarına yalnızca görüntüleme erişiminiz var.",
        "lifecycle": {
          "archivedBannerTitle": "Planlama arşivlendi",
          "archivedBannerDescription": "Planlama çalışma alanı salt okunurdur. Değişiklik yapmak için planlamayı geri yükleyin.",
          "archivePrompt": "Arşivleme, geçmişi koruyarak bu planlama kaydını salt okunur yapar.",
          "archiveAction": "Planlamayı arşivle",
          "archiveReasonPlaceholder": "Arşivleme için isteğe bağlı neden",
          "archiveConfirmAction": "Arşivlemeyi onayla",
          "restorePrompt": "Belgelemeye ve incelemeye devam etmek için planlamayı geri yükleyin.",
          "restoreAction": "Planlamayı geri yükle",
          "restoreConfirmAction": "Geri yüklemeyi onayla",
          "reasonLabel": "Neden",
          "cancelAction": "İptal"
        }
      },
      "documents": {
        "title": "Planlama belgeleri",
        "description": "Planlama memorandumları ve destekleyici belgeler.",
        "emptyTitle": "Planlama belgesi yok",
        "emptyDescription": "Bu denetim planı için planlama memorandumları ve destekleyici referanslar ekleyin.",
        "addTitle": "Belge referansı ekle",
        "nameLabel": "Belge adı",
        "namePlaceholder": "Planlama memorandumu",
        "typeLabel": "Belge türü",
        "addAction": "Belge ekle",
        "metadataNotice": "Dosya depolama entegrasyonu gelecek sürümde ikili dosyaları ekleyecek. Referanslar şimdilik denetim planına kaydedilir.",
        "documentTypes": {
          "planning_memorandum": "Planlama memorandumu",
          "risk_assessment": "Risk değerlendirmesi",
          "materiality_worksheet": "Önemlilik çalışma sayfası",
          "other": "Diğer"
        },
        "statuses": {
          "uploaded": "Kaydedildi",
          "pending": "Bekliyor",
          "archived": "Arşivlendi"
        }
      },
      "checklist": {
        "title": "Planlama kontrol listesi",
        "description": "Saha çalışmasından önce temel planlama çıktılarının tamamlanmasını izleyin.",
        "progress": "İlerleme",
        "saveLabel": "Kaydet",
        "savingLabel": "Kaydediliyor…",
        "items": {
          "objectives": "Görev hedefleri belgelendi",
          "scope": "Denetim kapsamı tanımlandı",
          "strategy": "Denetim stratejisi belgelendi",
          "framework": "Raporlama çerçevesi onaylandı",
          "materiality": "Önemlilik yer tutucusu incelendi",
          "risk": "Risk yer tutucusu incelendi",
          "team": "Ekip planlaması tamamlandı",
          "timeline": "Zaman çizelgesi oluşturuldu"
        }
      },
      "editor": {
        "readOnlyNotice": "Bu planlama bölümüne yalnızca görüntüleme erişiminiz var.",
        "saveLabel": "Kaydet",
        "savingLabel": "Kaydediliyor…",
        "discardLabel": "Vazgeç",
        "placeholder": "Mesleki muhakeme ve göreve özel bağlamı belgeleyin…"
      },
      "team": {
        "title": "Ekip planlaması",
        "description": "Bu denetim için görev listesi ve kapasite planlaması.",
        "rosterTitle": "Görev ekibi",
        "rosterEmpty": "Bu göreve henüz ekip üyesi atanmadı.",
        "capacityTitle": "Kapasite planlaması",
        "estimatedHours": "Tahmini saatler",
        "notes": "Planlama notları",
        "saveLabel": "Kaydet",
        "savingLabel": "Kaydediliyor…"
      },
      "timeline": {
        "title": "Planlama zaman çizelgesi",
        "description": "Planlama, saha çalışması, inceleme ve tamamlama için kilometre taşı tarihleri.",
        "startDate": "Başlangıç",
        "endDate": "Bitiş",
        "saveLabel": "Kaydet",
        "savingLabel": "Kaydediliyor…",
        "milestones": {
          "planning": "Planlama",
          "fieldwork": "Saha çalışması",
          "review": "İnceleme",
          "completion": "Tamamlanma"
        }
      },
      "integration": {
        "integrationReady": "Entegrasyona hazır",
        "currentStatus": "Mevcut durum",
        "statuses": {
          "not_configured": "Yapılandırılmadı",
          "placeholder": "Yer tutucu hazır",
          "integrated": "Entegre edildi"
        },
        "materiality": {
          "title": "Önemlilik",
          "description": "Önemlilik eşikleri ayrı bir modülde belgelenecek.",
          "placeholderTitle": "Önemlilik modülü yer tutucusu",
          "placeholderDescription": "Genel, performans ve özel önemlilik çalışma sayfaları Önemlilik modülü uygulandığında buraya bağlanacak."
        },
        "risk": {
          "title": "Risk değerlendirmesi",
          "description": "Planlamadan görev risk değerlendirmesi çalışma alanını açın.",
          "placeholderTitle": "Risk değerlendirmesi entegre edildi",
          "placeholderDescription": "Planlama, ayrılmış risk değerlendirmesi çalışma alanına bağlanır. Görev kenar çubuğundan Risk değerlendirmesini kullanın veya planlama risk bölümünden devam edin."
        }
      }
    },
    "materiality": {
      "workflow": {
        "title": "Önemlilik workflow",
        "description": "ISA 320 önemlilik dokümantasyonunu gönderin, iade edin ve onaylayın.",
        "submitAction": "İncelemeye gönder",
        "returnAction": "Revizyon için iade et",
        "returnConfirmAction": "İadeyi onayla",
        "approveAction": "Önemliliği onayla",
        "cancelAction": "İptal",
        "returnNotesLabel": "İade notları",
        "returnNotesPlaceholder": "Yeniden gönderimden önce nelerin revize edilmesi gerektiğini açıklayın.",
        "readOnlyNotice": "Bu önemlilik paketi arşivlendi ve salt okunurdur.",
        "submittedNotice": "Bu önemlilik paketi gönderildi ve inceleme bekliyor.",
        "approvedNotice": "Bu önemlilik paketi onaylandı.",
        "returnedNotice": "Bu önemlilik paketi revizyon için iade edildi.",
        "errorGeneric": "Önemlilik iş akışı eylemi tamamlanamadı."
      },
      "history": {
        "title": "Geçmiş",
        "description": "Önemlilik faaliyetinin salt okunur zaman çizelgesi.",
        "emptyTitle": "Önemlilik faaliyeti yok",
        "emptyDescription": "Önemlilik activity will appear here as changes are recorded.",
        "versionLabel": "Paket sürümü",
        "updatedLabel": "Güncellendi",
        "actions": {
          "materiality.benchmark.added": "Kıyaslama eklendi",
          "materiality.benchmark.updated": "Kıyaslama güncellendi",
          "materiality.calculation.recorded": "Hesaplama kaydedildi",
          "materiality.threshold.updated": "Eşik güncellendi",
          "materiality.comment.added": "Yorum eklendi",
          "materiality.version.created": "Sürüm oluşturuldu"
        }
      },
      "comments": {
        "title": "Yorumlar",
        "description": "Önemlilikle ilgili inceleme ve dahili yorumları kaydedin.",
        "emptyTitle": "Yorum yok",
        "emptyDescription": "Yorumlar appear here once added.",
        "bodyPlaceholder": "Yorum ekle",
        "addAction": "Yorum ekle"
      },
      "settings": {
        "title": "Ayarlar",
        "description": "Bu önemlilik paketini arşivleyin veya geri yükleyin.",
        "archiveAction": "Önemlilik paketini arşivle",
        "archiveConfirmAction": "Arşivlemeyi onayla",
        "restoreAction": "Önemlilik paketini geri yükle",
        "restoreConfirmAction": "Geri yüklemeyi onayla",
        "cancelAction": "İptal",
        "archivedBanner": "Bu önemlilik paketi arşivlendi.",
        "readOnlyNotice": "Önemlilik ayarlarına yalnızca görüntüleme erişiminiz var."
      },
      "versions": {
        "title": "Sürümler",
        "description": "Önemlilik paketinin sürüm anlık görüntülerini inceleyin.",
        "emptyTitle": "Sürüm yok",
        "emptyDescription": "Önemlilik revize edildiğinde veya onaylandığında sürüm anlık görüntüleri oluşturulur."
      }
    },
    "riskAssessment": {
      "workflow": {
        "title": "Risk iş akışı",
        "description": "Risk değerlendirmesi dokümantasyonunu gönder, iade et ve onayla.",
        "submitAction": "İncelemeye gönder",
        "returnAction": "Revizyon için iade et",
        "returnConfirmAction": "İadeyi onayla",
        "approveAction": "Risk değerlendirmesini onayla",
        "acknowledgeAction": "Önemli riskleri onayla",
        "cancelAction": "İptal",
        "returnNotesLabel": "İade notu",
        "returnNotesPlaceholder": "Yeniden göndermeden önce neyin revize edilmesi gerektiğini yazın.",
        "readOnlyNotice": "Bu risk değerlendirmesi arşivlenmiştir ve salt okunurdur.",
        "submittedNotice": "Bu risk değerlendirmesi gönderildi ve inceleme bekliyor.",
        "approvedNotice": "Bu risk değerlendirmesi onaylandı.",
        "acknowledgedNotice": "Önemli riskler onaylandı.",
        "pendingAcknowledgmentNotice": "Onaydan önce önemli riskler onaylanmalıdır.",
        "errorGeneric": "Risk iş akışı işlemi tamamlanamadı."
      },
      "history": {
        "title": "Geçmiş",
        "description": "Risk değerlendirmesi etkinliğinin salt okunur zaman çizelgesi.",
        "emptyTitle": "Risk etkinliği yok",
        "emptyDescription": "Değişiklikler kaydedildikçe risk etkinliği burada görünecek.",
        "versionLabel": "Değerlendirme sürümü",
        "updatedLabel": "Güncellendi",
        "actions": {
          "risk_assessment.created": "Risk değerlendirmesi oluşturuldu",
          "risk_assessment.updated": "Risk değerlendirmesi güncellendi",
          "risk_assessment.archived": "Risk değerlendirmesi arşivlendi",
          "risk_assessment.restored": "Risk değerlendirmesi geri yüklendi",
          "risk_assessment.submitted": "Risk değerlendirmesi gönderildi",
          "risk_assessment.returned": "Risk değerlendirmesi iade edildi",
          "risk_assessment.approved": "Risk değerlendirmesi onaylandı",
          "risk_assessment.category.added": "Kategori eklendi",
          "risk_assessment.risk_item.added": "Risk kalemi eklendi",
          "risk_assessment.risk_item.updated": "Risk kalemi güncellendi",
          "risk_assessment.assertion_rating.updated": "İddia derecelendirmesi güncellendi",
          "risk_assessment.response.added": "Yanıt eklendi",
          "risk_assessment.procedure.linked": "Prosedür bağlandı",
          "risk_assessment.note.added": "Not eklendi",
          "risk_assessment.significant.acknowledged": "Önemli riskler onaylandı"
        }
      },
      "comments": {
        "title": "Yorumlar",
        "description": "Risklerle ilgili dahili yorumları kaydedin.",
        "emptyTitle": "Yorum yok",
        "emptyDescription": "Yorumlar eklendikten sonra burada görünür.",
        "bodyPlaceholder": "Dahili yorum ekle",
        "addAction": "Yorum ekle"
      },
      "settings": {
        "title": "Ayarlar",
        "description": "Bu risk değerlendirmesini arşivleyin veya geri yükleyin.",
        "archiveAction": "Risk değerlendirmesini arşivle",
        "archiveConfirmAction": "Arşivlemeyi onayla",
        "restoreAction": "Risk değerlendirmesini geri yükle",
        "restoreConfirmAction": "Geri yüklemeyi onayla",
        "cancelAction": "İptal",
        "archivedBanner": "Bu risk değerlendirmesi arşivlenmiştir.",
        "readOnlyNotice": "Risk değerlendirmesi ayarlarına yalnızca görüntüleme erişiminiz var."
      },
      "procedures": {
        "title": "Prosedürler",
        "description": "Planlanan prosedürleri risk kalemlerine bağlayın.",
        "emptyTitle": "Bağlı prosedür yok",
        "emptyDescription": "Yanıt yürütmesini eşlemek için prosedür bağlantıları ekleyin.",
        "riskItemLabel": "Risk kalemi seçin",
        "referencePlaceholder": "Prosedür referansı",
        "addAction": "Prosedür bağlantısı ekle"
      }
    },
    "fieldwork": {
      "workflow": {
        "queueTitle": "İnceleme kuyruğu",
        "queueDescription": "İnceleme veya onay bekleyen prosedürler.",
        "queueEmpty": "İnceleme bekleyen prosedür yok.",
        "pendingReviewCount": "İnceleme bekliyor",
        "openProcedureAction": "Prosedürü aç",
        "submitAction": "İncelemeye gönder",
        "returnAction": "Revizyona iade et",
        "returnConfirmAction": "İadeyi onayla",
        "clearAction": "İncelemeyi tamamla",
        "clearConfirmAction": "Onayı doğrula",
        "cancelAction": "İptal",
        "returnNotesTitle": "İade notları",
        "returnNotesPlaceholder": "Neyin revize edilmesi gerektiğini açıklayın",
        "clearanceNotesPlaceholder": "İnceleme onayını belgeleyin",
        "errorGeneric": "Prosedür iş akışı güncellenemedi"
      },
      "history": {
        "title": "Saha çalışması geçmişi",
        "description": "Saha çalışması değişikliklerinin salt okunur zaman çizelgesi.",
        "emptyTitle": "Saha çalışması etkinliği yok",
        "emptyDescription": "Saha çalışması ilerledikçe etkinlik görünecek.",
        "versionLabel": "Program sürümü",
        "actions": {
          "created": "Saha çalışması oluşturuldu",
          "updated": "Saha çalışması güncellendi",
          "archived": "Saha çalışması arşivlendi",
          "restored": "Saha çalışması geri yüklendi",
          "programUpdated": "Program güncellendi",
          "procedureAssigned": "Prosedür atandı",
          "procedureUpdated": "Prosedür güncellendi",
          "procedureCompleted": "Prosedür tamamlandı",
          "procedureSubmitted": "Prosedür gönderildi",
          "procedureReturned": "Prosedür iade edildi",
          "procedureCleared": "Prosedür onaylandı",
          "workingPaperAdded": "Çalışma kağıdı eklendi",
          "workingPaperUpdated": "Çalışma kağıdı güncellendi",
          "workingPaperSubmitted": "Çalışma kağıdı gönderildi",
          "workingPaperReturned": "Çalışma kağıdı iade edildi",
          "workingPaperCleared": "Çalışma kağıdı onaylandı",
          "evidenceAdded": "Kanıt eklendi",
          "findingAdded": "Bulgu eklendi",
          "noteAdded": "Not eklendi"
        }
      },
      "comments": {
        "title": "Dahili yorumlar",
        "description": "Saha çalışması konularında dahili ekip tartışması.",
        "emptyTitle": "Dahili yorum yok",
        "emptyDescription": "Dahili yorumlar burada görünecek."
      },
      "settings": {
        "title": "Saha çalışması ayarları",
        "description": "Bu saha çalışması paketini arşivleyin veya geri yükleyin.",
        "readOnlyNotice": "Saha çalışması ayarlarına yalnızca görüntüleme erişiminiz var.",
        "tickmarkLibraryTitle": "İşaret kütüphanesi",
        "tickmarkLibraryDescription": "Çalışma kağıtları için yeniden kullanılabilir işaretleri yönetin.",
        "tickmarkSymbol": "Sembol",
        "tickmarkMeaning": "Anlam",
        "addTickmark": "Kütüphaneye ekle",
        "lifecycle": {
          "archivedBannerTitle": "Saha çalışması arşivlendi",
          "archivedBannerDescription": "Saha çalışması çalışma alanı salt okunurdur. Yürütmeye devam etmek için saha çalışmasını geri yükleyin.",
          "archivePrompt": "Arşivleme, geçmişi koruyarak bu saha çalışması paketini salt okunur yapar.",
          "archiveAction": "Saha çalışmasını arşivle",
          "archiveConfirmAction": "Arşivlemeyi onayla",
          "restorePrompt": "Prosedür yürütmeye devam etmek için saha çalışmasını geri yükleyin.",
          "restoreAction": "Saha çalışmasını geri yükle",
          "restoreConfirmAction": "Geri yüklemeyi onayla",
          "cancelAction": "İptal"
        }
      },
      "procedures": {
        "title": "Denetim prosedürleri",
        "description": "Atama, son tarihler ve tamamlanmayı izleyin.",
        "emptyTitle": "Prosedür yok",
        "emptyDescription": "Saha çalışması başlatıldığında prosedürler oluşturulur.",
        "assignAuditor": "Atanan denetçi",
        "unassigned": "Atanmadı",
        "dueDate": "Son tarih",
        "assignedTo": "Atanan"
      },
      "findings": {
        "title": "Bulgular",
        "description": "Saha çalışması sırasında keşfedilen denetim bulgularını belgeleyin.",
        "emptyTitle": "Bulgu yok",
        "emptyDescription": "Bulgular belgelendikçe görünecek.",
        "titlePlaceholder": "Bulgu başlığı"
      },
      "evidence": {
        "title": "Kanıt kaydı",
        "description": "Kanıt referansları ve ek meta verileri.",
        "emptyTitle": "Kanıt yok",
        "emptyDescription": "Prosedürler yürütülürken kanıt referanslarını kaydedin.",
        "fileLabel": "Ek",
        "procedureLabel": "Bağlı prosedür",
        "uploadedBadge": "Dosya eklendi",
        "namePlaceholder": "Kanıt referans adı",
        "downloadAction": "İndir",
        "downloadError": "Kanıt dosyası indirilemedi"
      }
    },
    "engagements": {
      "history": {
        "title": "Etkinlik ve denetim",
        "description": "Görev değişikliklerinin salt okunur zaman çizelgesi ve denetim özeti.",
        "errorTitle": "Etkinlik yüklenemedi",
        "errorDescription": "Görev etkinliği yüklenirken bir hata oluştu.",
        "summary": {
          "title": "Denetim özeti",
          "description": "Bu görev için kayıtlı olay sayıları.",
          "total": "Toplam olay",
          "created": "Oluşturuldu",
          "updated": "Güncellendi",
          "statusChanged": "Durum değişti",
          "archived": "Arşivlendi",
          "restored": "Geri yüklendi"
        },
        "timeline": {
          "title": "Etkinlik zaman çizelgesi",
          "description": "Bu görev için kronolojik denetim izi.",
          "emptyTitle": "Kayıtlı etkinlik yok",
          "emptyDescription": "Bu görevdeki değişiklikler denetlendikçe burada görünecek.",
          "reasonArchive": "Arşivleme nedeni",
          "reasonRestore": "Geri yükleme nedeni",
          "fieldsChanged": "Değiştirilen alanlar",
          "actions": {
            "engagement.created": "Görev oluşturuldu",
            "engagement.updated": "Görev güncellendi",
            "engagement.status.changed": "Durum değişti",
            "engagement.archived": "Görev arşivlendi",
            "engagement.restored": "Görev geri yüklendi"
          }
        },
        "version": {
          "title": "Sürüm bilgileri",
          "description": "Mevcut kayıt sürümleri ve yaşam döngüsü zaman damgaları.",
          "cardTitle": "Kayıt meta verileri",
          "recordVersion": "Kayıt sürümü",
          "created": "Oluşturuldu",
          "archived": "Arşivlenme zamanı",
          "notArchived": "Arşivlenmedi",
          "restored": "Geri yüklendi",
          "restoredHint": "Geri yükleme olayları için zaman çizelgesine bakın"
        }
      },
      "settings": {
        "title": "Ayarlar",
        "description": "Görev ayrıntılarını, raporlamayı ve yaşam döngüsü durumunu yapılandırın.",
        "readOnlyNotice": "Görev ayarlarına yalnızca görüntüleme erişiminiz var.",
        "saveLabel": "Kaydet",
        "savingLabel": "Kaydediliyor…",
        "discardLabel": "Vazgeç",
        "sections": {
          "general": {
            "title": "Genel",
            "description": "Ad, kod, tür ve yaşam döngüsü durumu."
          },
          "client": {
            "title": "Müşteri",
            "description": "Bu görevin hizmet verdiği tüzel kişi."
          },
          "reporting": {
            "title": "Raporlama",
            "description": "Çerçeve ve raporlama dönemi."
          },
          "dates": {
            "title": "Tarihler",
            "description": "Bu görev için planlanan takvim."
          },
          "notes": {
            "title": "Notlar",
            "description": "Açıklama ve dahili notlar."
          }
        },
        "lifecycle": {
          "title": "Yaşam döngüsü",
          "description": "Durum değiştiğinde bu görevi arşivleyin veya geri yükleyin.",
          "archivedBannerTitle": "Bu görev arşivlendi",
          "archivedBannerDescription": "Çalışma alanı salt okunurdur. Değişiklik yapmak için görevi geri yükleyin.",
          "archivePrompt": "Arşivleme, geçmişi koruyarak bu görevi salt okunur yapar.",
          "archiveAction": "Görevi arşivle",
          "archiveConfirmTitle": "Bu görev arşivlensin mi?",
          "archiveConfirmDescription": "Görev salt okunur olacak. Gerekirse daha sonra geri yükleyebilirsiniz.",
          "archiveReasonPlaceholder": "Arşivleme için isteğe bağlı neden",
          "archiveConfirmAction": "Arşivlemeyi onayla",
          "restorePrompt": "Yapılandırma ve saha çalışmasına devam etmek için bu görevi geri yükleyin.",
          "restoreAction": "Görevi geri yükle",
          "restoreConfirmTitle": "Bu görev geri yüklensin mi?",
          "restoreConfirmDescription": "Görev yeniden etkin olacak ve yetkili kullanıcılar tarafından düzenlenebilecek.",
          "restoreConfirmAction": "Geri yüklemeyi onayla",
          "reasonLabel": "Neden",
          "cancelAction": "İptal"
        }
      },
      "members": {
        "title": "Ekip üyeleri",
        "description": "Bu göreve atanan kişiler.",
        "emptyTitle": "Atanmış üye yok",
        "emptyDescription": "Ekip üyeleri bu göreve atandıktan sonra burada görünecek.",
        "joinedLabel": "Katıldı",
        "forbiddenTitle": "Erişim kısıtlı",
        "forbiddenDescription": "Görev üyelerini görüntüleme izniniz yok.",
        "roles": {
          "engagement_partner": "Görev ortağı",
          "engagement_manager": "Görev yöneticisi",
          "senior": "Kıdemli",
          "staff": "Personel",
          "reviewer": "İnceleyici",
          "observer": "Gözlemci"
        }
      }
    },
    "companies": {
      "history": {
        "title": "Aktivite ve denetim",
        "description": "Şirket değişikliklerinin salt okunur zaman çizelgesi ve denetim özeti.",
        "errorTitle": "Aktivite yüklenemedi",
        "errorDescription": "Şirket aktivitesi yüklenirken bir hata oluştu.",
        "summary": {
          "title": "Denetim özeti",
          "description": "Bu şirket için kayıtlı olay sayıları.",
          "total": "Toplam olay",
          "created": "Oluşturuldu",
          "updated": "Güncellendi",
          "settingsUpdated": "Ayarlar güncellendi",
          "archived": "Arşivlendi",
          "restored": "Geri yüklendi"
        },
        "timeline": {
          "title": "Aktivite zaman çizelgesi",
          "description": "Bu şirket için kronolojik denetim izi.",
          "emptyTitle": "Aktivite kaydedilmedi",
          "emptyDescription": "Bu şirketteki değişiklikler denetlendikçe burada görünecek.",
          "reasonArchive": "Arşiv nedeni",
          "reasonRestore": "Geri yükleme nedeni",
          "fieldsChanged": "Değişen alanlar",
          "actions": {
            "company.created": "Şirket oluşturuldu",
            "company.updated": "Şirket güncellendi",
            "company.settings.updated": "Ayarlar güncellendi",
            "company.archived": "Şirket arşivlendi",
            "company.restored": "Şirket geri yüklendi"
          }
        },
        "version": {
          "title": "Sürüm bilgisi",
          "description": "Güncel kayıt sürümleri ve yaşam döngüsü zaman damgaları.",
          "cardTitle": "Kayıt meta verileri",
          "recordVersion": "Kayıt sürümü",
          "settingsVersion": "Ayar sürümü",
          "created": "Oluşturulma",
          "archived": "Arşivlenme",
          "notArchived": "Arşivlenmedi",
          "restored": "Geri yüklendi",
          "restoredHint": "Geri yükleme olayları için zaman çizelgesine bakın"
        }
      },
      "settings": {
        "title": "Ayarlar",
        "description": "Bu şirket için raporlama, finansal ve operasyonel tercihleri yapılandırın.",
        "navAriaLabel": "Şirket ayarları bölümleri",
        "navGeneral": "Genel",
        "navReporting": "Raporlama",
        "navFinancial": "Finansal",
        "navContacts": "İletişim",
        "navPreferences": "Tercihler",
        "navValidation": "Doğrulama",
        "readOnlyBadge": "Salt okunur",
        "saveIdle": "Tüm değişiklikler kaydedildi",
        "saveSaving": "Değişiklikler kaydediliyor…",
        "saveSaved": "Değişiklikler kaydedildi",
        "saveError": "Değişiklikler kaydedilemedi",
        "unsavedMessage": "Kaydedilmemiş değişiklikleriniz var",
        "discardLabel": "Vazgeç",
        "saveLabel": "Kaydet",
        "savingLabel": "Kaydediliyor…",
        "conflictTitle": "Ayarlar başka bir oturumda güncellendi",
        "conflictDescription": "Başka bir oturum bu ayarları değiştirdi. En son sürümü yüklemek için yenileyin veya değişikliklerinizi vazgeçin.",
        "conflictRefresh": "Yenile",
        "conflictDiscard": "Değişiklikleri vazgeç",
        "loading": "Şirket ayarları yükleniyor",
        "errorTitle": "Ayarlar yüklenemedi",
        "errorDescription": "Şirket ayarları yüklenirken bir hata oluştu.",
        "sections": {
          "general": {
            "title": "Genel",
            "description": "Bu tüzel kişilik için yargı alanı, sınıflandırma ve adresler.",
            "classificationTitle": "Sınıflandırma",
            "registeredAddressTitle": "Kayıtlı adres",
            "operatingAddressTitle": "Faaliyet adresi",
            "addressHint": "İsteğe bağlı — bildirimler ve yazışmalar için kullanılır."
          },
          "reporting": {
            "title": "Raporlama",
            "description": "Yasal ve yönetim raporlaması için çerçeve.",
            "groupTitle": "Raporlama çerçevesi",
            "groupDescription": "Bu tüzel kişiliğe uygulanan muhasebe standartlarını tanımlar."
          },
          "financial": {
            "title": "Finansal",
            "description": "Para birimi ve mali yıl yapılandırması.",
            "groupTitle": "Finansal yapılandırma",
            "groupDescription": "Fonksiyonel para birimi ve mali dönem sınırları.",
            "currencyHint": "ISO 4217 üç harfli kod, örn. USD"
          },
          "contacts": {
            "title": "İletişim",
            "description": "Finans ve dış denetim koordinasyonundan sorumlu kişiler."
          },
          "preferences": {
            "title": "Tercihler",
            "description": "Operasyonel varsayılanlar ve görüntüleme tercihleri.",
            "groupTitle": "Çalışma alanı tercihleri",
            "groupDescription": "İçe aktarma, dil ve yuvarlama için isteğe bağlı varsayılanlar.",
            "defaultLocale": "Varsayılan dil",
            "dataImportSource": "Veri içe aktarma kaynağı",
            "roundingConvention": "Yuvarlama kuralı",
            "tradeNameHint": "İsteğe bağlı ticari unvan — yasal ad değil."
          },
          "validation": {
            "title": "Doğrulama",
            "description": "Şirket ayarları için şema doğrulama durumu.",
            "groupTitle": "Doğrulama özeti",
            "readOnlyNotice": "Doğrulama meta verileri platform tarafından yönetilir ve burada düzenlenemez."
          }
        }
      }
    }
  }
};

const NAMESPACE_NAMES = [
  "workflow", "history", "comments", "settings", "documents", "checklist",
  "procedures", "findings", "evidence", "versions", "members", "editor",
  "team", "timeline", "integration",
];

function applyConditionalNamespaceKeys(localeObj, enObj, patchObj) {
  let updated = 0;
  if (!patchObj || !enObj || !localeObj) return updated;
  for (const [key, patchValue] of Object.entries(patchObj)) {
    const enValue = enObj[key];
    const localeValue = localeObj[key];
    if (typeof patchValue === "string") {
      if (typeof enValue === "string" && localeValue === enValue) {
        localeObj[key] = patchValue;
        updated++;
      }
    } else if (patchValue && typeof patchValue === "object" && !Array.isArray(patchValue)) {
      if (!localeObj[key] || typeof localeObj[key] !== "object") localeObj[key] = {};
      if (!enObj[key] || typeof enObj[key] !== "object") continue;
      updated += applyConditionalNamespaceKeys(localeObj[key], enObj[key], patchValue);
    }
  }
  return updated;
}

function applyNamespacePatches(localeCode, locale, en) {
  const patches = EMBEDDED_NAMESPACE_PATCHES[localeCode];
  if (!patches) return 0;
  let updated = 0;
  for (const moduleName of MODULES) {
    const modulePatch = patches[moduleName];
    const enModule = en[moduleName];
    const localeModule = locale[moduleName];
    if (!modulePatch || !enModule || !localeModule) continue;
    for (const ns of NAMESPACE_NAMES) {
      const patchNs = modulePatch[ns];
      const enNs = enModule[ns];
      const localeNs = localeModule[ns];
      if (!patchNs || !enNs || !localeNs) continue;
      updated += applyConditionalNamespaceKeys(localeNs, enNs, patchNs);
    }
  }
  return updated;
}

const MODULES = ["companies", "engagements", "planning", "fieldwork", "riskAssessment", "materiality"];
const NAV_GROUP_MODULES = new Set(["planning", "fieldwork", "riskAssessment", "materiality"]);
const CONDITIONAL_MODULES = new Set(["planning", "fieldwork", "riskAssessment", "materiality"]);

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      if (!target[key] || typeof target[key] !== "object") target[key] = {};
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }
  return target;
}

function countStringLeaves(obj) {
  let n = 0;
  for (const v of Object.values(obj)) {
    if (typeof v === "string") n++;
    else if (v && typeof v === "object") n += countStringLeaves(v);
  }
  return n;
}

function applyConditionalWorkspaceKeys(localeObj, enWs, patchWs, enRoot) {
  let updated = 0;
  if (patchWs.heroEyebrow && localeObj.heroEyebrow === enWs.heroEyebrow) {
    localeObj.heroEyebrow = patchWs.heroEyebrow;
    updated++;
  }
  if (patchWs.navGroups) {
    for (const [key, translated] of Object.entries(patchWs.navGroups)) {
      if (localeObj.navGroups?.[key] === enWs.navGroups?.[key]) {
        localeObj.navGroups[key] = translated;
        updated++;
      }
    }
  }
  if (patchWs.sections) {
    for (const [sectionKey, sectionPatch] of Object.entries(patchWs.sections)) {
      const localeSection = localeObj.sections?.[sectionKey];
      const enSection = enWs.sections?.[sectionKey];
      if (!localeSection || !enSection) continue;
      for (const field of ["title", "description"]) {
        if (sectionPatch[field] && localeSection[field] === enSection[field]) {
          localeSection[field] = sectionPatch[field];
          updated++;
        }
      }
    }
  }
  return updated;
}

function applyPatches(localeCode) {
  const localePath = path.join(messagesDir, `${localeCode}.json`);
  const enPath = path.join(messagesDir, "en.json");
  const locale = JSON.parse(fs.readFileSync(localePath, "utf8"));
  const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
  const patches = EMBEDDED_PATCHES[localeCode];
  let updated = 0;

  for (const moduleName of MODULES) {
    const patch = patches[moduleName]?.workspace;
    const enWs = en[moduleName]?.workspace;
    const localeWs = locale[moduleName]?.workspace;
    if (!patch || !enWs || !localeWs) continue;

    if (patch.commandCenter) {
      const before = JSON.stringify(localeWs.commandCenter ?? {});
      localeWs.commandCenter = structuredClone(patch.commandCenter);
      if (JSON.stringify(localeWs.commandCenter) !== before) {
        updated += countStringLeaves(patch.commandCenter);
      }
    }

    if (NAV_GROUP_MODULES.has(moduleName) && patch.navGroups) {
      if (!localeWs.navGroups) localeWs.navGroups = {};
      const before = JSON.stringify(localeWs.navGroups);
      localeWs.navGroups = { ...localeWs.navGroups, ...structuredClone(patch.navGroups) };
      if (JSON.stringify(localeWs.navGroups) !== before) {
        updated += countStringLeaves(patch.navGroups);
      }
    }

    if (CONDITIONAL_MODULES.has(moduleName)) {
      updated += applyConditionalWorkspaceKeys(localeWs, enWs, patch, en);
    }
  }

  updated += applyNamespacePatches(localeCode, locale, en);

  fs.writeFileSync(localePath, `${JSON.stringify(locale, null, 2)}\n`, "utf8");
  return updated;
}

const locales = ["az", "ru", "tr"];
const results = { workspace: {}, namespaces: {}, total: {} };
let hadError = false;

for (const code of locales) {
  try {
    const localePath = path.join(messagesDir, `${code}.json`);
    const enPath = path.join(messagesDir, "en.json");
    const localeBefore = JSON.parse(fs.readFileSync(localePath, "utf8"));
    const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
    const beforeStr = JSON.stringify(localeBefore);
    const totalUpdated = applyPatches(code);
    const localeSnap = JSON.parse(beforeStr);
    const nsUpdated = applyNamespacePatches(code, localeSnap, en);
    results.total[code] = totalUpdated;
    results.namespaces[code] = nsUpdated;
    results.workspace[code] = totalUpdated - nsUpdated;
    console.log(`${code}.json: updated ${totalUpdated} strings (workspace: ${results.workspace[code]}, namespaces: ${results.namespaces[code]})`);
  } catch (err) {
    hadError = true;
    console.error(`${code}.json: ERROR`, err.message);
  }
}

if (hadError) process.exit(1);
console.log("Done.");

