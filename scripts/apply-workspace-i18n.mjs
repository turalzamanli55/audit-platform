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

  for (const module of MODULES) {
    const patch = patches[module]?.workspace;
    const enWs = en[module]?.workspace;
    const localeWs = locale[module]?.workspace;
    if (!patch || !enWs || !localeWs) continue;

    if (patch.commandCenter) {
      const before = JSON.stringify(localeWs.commandCenter ?? {});
      localeWs.commandCenter = structuredClone(patch.commandCenter);
      if (JSON.stringify(localeWs.commandCenter) !== before) {
        updated += countStringLeaves(patch.commandCenter);
      }
    }

    if (NAV_GROUP_MODULES.has(module) && patch.navGroups) {
      if (!localeWs.navGroups) localeWs.navGroups = {};
      const before = JSON.stringify(localeWs.navGroups);
      localeWs.navGroups = { ...localeWs.navGroups, ...structuredClone(patch.navGroups) };
      if (JSON.stringify(localeWs.navGroups) !== before) {
        updated += countStringLeaves(patch.navGroups);
      }
    }

    if (CONDITIONAL_MODULES.has(module)) {
      updated += applyConditionalWorkspaceKeys(localeWs, enWs, patch, en);
    }
  }

  fs.writeFileSync(localePath, `${JSON.stringify(locale, null, 2)}\n`, "utf8");
  return updated;
}

const locales = ["az", "ru", "tr"];
const results = {};
let hadError = false;

for (const code of locales) {
  try {
    results[code] = applyPatches(code);
    console.log(`${code}.json: updated ${results[code]} strings`);
  } catch (err) {
    hadError = true;
    console.error(`${code}.json: ERROR`, err.message);
  }
}

if (hadError) process.exit(1);
console.log("Done.");
