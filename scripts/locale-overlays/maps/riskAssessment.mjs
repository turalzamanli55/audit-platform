/** @type {Record<'az'|'ru'|'tr', object>} */
export const riskAssessment = {
  az: {
    notFoundTitle: "Risk qiymətləndirməsi tapılmadı",
    notFoundDescription: "Tələb etdiyiniz risklərin qiymətləndirilməsi iş sahəsini bu tapşırıq üçün tapmaq mümkün olmadı.",
    forbiddenTitle: "İcazə tələb olunur",
    forbiddenDescription: "Bu iş sahəsinə daxil olmaq üçün risk qiymətləndirməsi icazəniz lazımdır.",
    noWorkspaceTitle: "İş sahəsi tələb olunur",
    noWorkspaceDescription: "Risk qiymətləndirməsini açmadan əvvəl iş yerini seçin.",
    statuses: {
      not_started: "Başlanmayıb",
      in_progress: "Davam edir",
      submitted: "Təqdim edildi",
      under_review: "Nəzərdən keçirilir",
      approved: "Təsdiq edildi",
      archived: "Arxivləşdirilib"
    },
    riskTypes: {
      inherent: "Doğma risk",
      control: "Nəzarət riski",
      detection: "Aşkarlanma riski",
      fraud: "Fırıldaqçılıq riski",
      it: "İT riski",
      compliance: "Uyğunluq riski",
      financial_statement: "Maliyyə hesabatı riski",
      assertion: "Təsdiq riski",
      significant: "Əhəmiyyətli risk"
    },
    ratingLevels: {
      low: "Aşağı",
      moderate: "Orta",
      high: "Yüksək",
      significant: "Əhəmiyyətli"
    },
    likelihoods: {
      low: "Aşağı",
      moderate: "Orta",
      high: "Yüksək"
    },
    impacts: {
      low: "Aşağı",
      moderate: "Orta",
      high: "Yüksək"
    },
    responseTypes: {
      accept: "Qəbul edin",
      reduce: "Azaltmaq",
      transfer: "Transfer",
      avoid: "çəkinin",
      substantive_procedures: "Əhəmiyyətli prosedurlar",
      test_of_controls: "Nəzarət vasitələrinin sınağı"
    },
    assertions: {
      existence: "Varlıq",
      completeness: "Tamlıq",
      accuracy: "Dəqiqlik",
      cutoff: "Kəsmə",
      classification: "Təsnifat",
      presentation: "Təqdimat"
    },
    noteTypes: {
      review: "Qeydi nəzərdən keçirin",
      internal: "Daxili qeyd"
    },
    actions: {
      add: "əlavə et",
      update: "Yeniləyin",
      archive: "Arxiv",
      restore: "Bərpa et",
      submit: "Təqdim et",
      approve: "Təsdiq edin",
      return: "Qayıt"
    },
    workflow: {
      title: "Risk iş axını",
      description: "Risk qiymətləndirmə sənədlərini təqdim edin, qaytarın və təsdiq edin.",
      submitAction: "Nəzərdən keçirilməsi üçün təqdim edin",
      returnAction: "Təftiş üçün qayıdın",
      returnConfirmAction: "Qayıtmağı təsdiqləyin",
      approveAction: "Risk qiymətləndirməsini təsdiqləyin",
      acknowledgeAction: "Əhəmiyyətli riskləri qəbul edin",
      cancelAction: "Ləğv et",
      returnNotesLabel: "Qeydləri qaytarın",
      returnNotesPlaceholder: "Yenidən təqdim etməzdən əvvəl nəyə yenidən baxılmalı olduğunu təsvir edin.",
      readOnlyNotice: "Bu risk qiymətləndirməsi arxivləşdirilir və yalnız oxunur.",
      submittedNotice: "Bu risk qiymətləndirməsi təqdim olunur və nəzərdən keçirilməsini gözləyir.",
      approvedNotice: "Bu risk qiymətləndirməsi təsdiq edilmişdir.",
      acknowledgedNotice: "Əhəmiyyətli risklər etiraf edilmişdir.",
      pendingAcknowledgmentNotice: "Təsdiqdən əvvəl əhəmiyyətli risklər etiraf edilməlidir.",
      errorGeneric: "Risk qiymətləndirilməsi iş axını əməliyyatını tamamlamaq mümkün deyil."
    },
    empty: {
      title: "Riskin qiymətləndirilməsinə başlanılmayıb",
      description: "Əhəmiyyətli riskləri, cavabları və nəzərdən keçirməyə hazırlığı sənədləşdirmək üçün risk qiymətləndirməsi yaradın.",
      createAction: "Risk qiymətləndirməsini yaradın",
      creating: "Risk qiymətləndirməsi yaradılır...",
      forbiddenDescription: "Bu iş sahəsini işə salmaq üçün sizə risk qiymətləndirməsinin yaradılması icazəsi lazımdır."
    },
    workspace: {
      title: "Riskin qiymətləndirilməsinə ümumi baxış",
      description: "Cari risklərin qiymətləndirilməsi vəziyyəti və əsas göstəricilərin icmalı.",
      statusTitle: "Statusun xülasəsi",
      statusDescription: "Bu riskin qiymətləndirilməsi üçün hazırkı tamamlama və hazırlıq göstəriciləri.",
      progress: "Ümumi tərəqqi",
      workflowTitle: "İş axını",
      workflowDescription: "Risklərin qiymətləndirilməsi üçün təqdimat və təsdiq iş axını.",
      heatmapPreviewTitle: "İstilik xəritəsinin önizləməsi",
      heatmapPreviewDescription: "Risk reytinqlərinin cari qiymətləndirmə nəticələrinə görə bölgüsü.",
      heroEyebrow: "Riskin qiymətləndirilməsi",
      breadcrumbRiskAssessment: "Riskin qiymətləndirilməsi",
      backToEngagement: "Nişan səhifəsinə qayıt",
      planningGateTitle: "Planlaşdırmanın təsdiqi tələb olunur",
      planningGateDescription: "Riskin qiymətləndirilməsinə başlamazdan əvvəl auditin planlaşdırılması təsdiqlənməlidir.",
      navAriaLabel: "Riskin qiymətləndirilməsi iş sahəsi bölmələri",
      navOverview: "İdarə paneli",
      navInherentRisks: "Təbii risklər",
      navControlRisks: "Risklərə nəzarət",
      navDetectionRisks: "Aşkarlanma riskləri",
      navFraudRisks: "Fırıldaqçılıq riskləri",
      navItRisks: "İT riskləri",
      navComplianceRisks: "Uyğunluq riskləri",
      navFinancialStatementRisks: "Maliyyə hesabatı riskləri",
      navAssertionRisks: "Təsdiq riskləri",
      navSignificantRisks: "Əhəmiyyətli risklər",
      navCategories: "Kateqoriyalar",
      navScoring: "Qiymətləndirmə",
      navHeatmap: "İstilik xəritəsi",
      navMatrix: "Matris",
      navResponses: "Cavablar",
      navProcedures: "Prosedurlar",
      navOwners: "Sahiblər",
      navReviewNotes: "Qeydləri nəzərdən keçirin",
      navComments: "Şərhlər",
      navHistory: "Tarix",
      navSettings: "Parametrlər",
      loading: "Risk qiymətləndirilməsi iş sahəsi yüklənir",
      errorTitle: "Risk qiymətləndirilməsi iş sahəsini yükləmək mümkün deyil",
      errorDescription: "Bu risk qiymətləndirməsini yükləyərkən xəta baş verdi.",
      archivedTitle: "Risk qiymətləndirilməsi arxivləşdirildi",
      archivedDescription: "Bu risk qiymətləndirməsi yalnız oxumaq üçündür. Yeniləmələri davam etdirmək üçün onu bərpa edin.",
      summaryStatus: "Risk statusu",
      summaryVersion: "Qiymətləndirmə versiyası",
      summaryProgress: "Ümumi tərəqqi",
      summarySignificant: "Əhəmiyyətli risklər",
      summaryPendingReview: "Baxış gözlənilir",
      summaryOpenItems: "Açıq maddələr",
      sections: {
        overview: {
          title: "Risk tablosu",
          description: "Vəziyyət, tərəqqi və nəzərdən keçirmə hazırlığı göstəriciləri."
        },
        "inherent-risks": {
          title: "Təbii risklər",
          description: "Müvafiq nəzarəti nəzərdən keçirməzdən əvvəl risklər."
        },
        "control-risks": {
          title: "Risklərə nəzarət",
          description: "Nəzarət vasitələrinin dizaynı və istismarı ilə bağlı risklər."
        },
        "detection-risks": {
          title: "Aşkarlanma riskləri",
          description: "Prosedurların təhrifləri aşkar edə bilməməsi riskləri."
        },
        "fraud-risks": {
          title: "Fırıldaqçılıq riskləri",
          description: "Fırıldaqçılıq risk faktorları və rəhbərlik mülahizələri üstələyir."
        },
        "it-risks": {
          title: "İT riskləri",
          description: "Texnologiya, sistemə giriş və məlumatların bütövlüyü riskləri."
        },
        "compliance-risks": {
          title: "Uyğunluq riskləri",
          description: "Tənzimləyici və hüquqi uyğunluq riskləri."
        },
        "financial-statement-risks": {
          title: "Maliyyə hesabatı riskləri",
          description: "Maliyyə hesabatı səviyyəsində əhəmiyyətli təhrif riskləri."
        },
        "assertion-risks": {
          title: "Təsdiq riskləri",
          description: "Müvafiq hesablarla əlaqəli təsdiq səviyyəli risklər."
        },
        "significant-risks": {
          title: "Əhəmiyyətli risklər",
          description: "Fokuslanmış audit reaksiyası tələb edən yüksək prioritet risklər."
        },
        categories: {
          title: "Risk kateqoriyaları",
          description: "Risk elementlərini təşkil etmək üçün istifadə edilən konfiqurasiya edilmiş kateqoriyalar."
        },
        scoring: {
          title: "Qiymətləndirmə",
          description: "Müəyyən edilmiş risklər üzrə qiymətləndirmə göstəricilərini birləşdirin."
        },
        heatmap: {
          title: "İstilik xəritəsi",
          description: "Risk reytinqlərinin vizual paylanması."
        },
        matrix: {
          title: "Təsdiq matrisi",
          description: "Hesab və təsdiq reytinqlərinin icmalı."
        },
        responses: {
          title: "Risk cavabları",
          description: "Müəyyən edilmiş risklər üçün planlaşdırılmış cavab tədbirləri."
        },
        procedures: {
          title: "Prosedur bağlantıları",
          description: "Qiymətləndirilmiş riskləri həll etmək üçün əlaqəli prosedurlar."
        },
        owners: {
          title: "Risk sahibləri",
          description: "Hər bir risk elementi üçün təyin edilmiş sahiblər."
        },
        "review-notes": {
          title: "Qeydləri nəzərdən keçirin",
          description: "Risklərin qiymətləndirilməsi dövrləri zamanı əldə edilən rəyçi qeydləri."
        },
        comments: {
          title: "Şərhlər",
          description: "Daxili şərhlər və əməkdaşlıq qeydləri."
        },
        history: {
          title: "Tarix",
          description: "Riskin qiymətləndirilməsi dəyişiklikləri və təsdiqlərinin qrafiki."
        },
        settings: {
          title: "Parametrlər",
          description: "Bu risk qiymətləndirməsi üçün nəzarətləri arxivləşdirin və bərpa edin."
        }
      }
    },
    inherentRisks: {
      title: "Təbii risklər",
      description: "Xas olan risk maddələrini sənədləşdirin.",
      emptyTitle: "Heç bir xas risk yoxdur",
      emptyDescription: "Qeydiyyata başlamaq üçün xas riskləri əlavə edin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Riskin təsviri",
      addAction: "Risk elementi əlavə edin",
      categoryLabel: "Kateqoriya seçin",
      riskTypeLabel: "Risk növü",
      likelihoodLabel: "Ehtimal",
      impactLabel: "Təsir",
      inherentRatingLabel: "Doğma reytinq",
      auditAreaLabel: "Audit sahəsi",
      auditAreaPlaceholder: "Audit sahəsini seçin",
      significantBadge: "Əhəmiyyətli",
      procedureLinkedBadge: "Prosedur bağlandı",
      procedureUnlinkedBadge: "Prosedur tələb olunur"
    },
    controlRisks: {
      title: "Risklərə nəzarət",
      description: "Sənədə nəzarət risk maddələri.",
      emptyTitle: "Nəzarət riskləri yoxdur",
      emptyDescription: "Bu bölməyə başlamaq üçün nəzarət riskləri əlavə edin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Riskin təsviri",
      addAction: "Risk elementi əlavə edin",
      categoryLabel: "Kateqoriya seçin",
      riskTypeLabel: "Risk növü",
      likelihoodLabel: "Ehtimal",
      impactLabel: "Təsir",
      inherentRatingLabel: "Doğma reytinq",
      auditAreaLabel: "Audit sahəsi",
      auditAreaPlaceholder: "Audit sahəsini seçin",
      significantBadge: "Əhəmiyyətli",
      procedureLinkedBadge: "Prosedur bağlandı",
      procedureUnlinkedBadge: "Prosedur tələb olunur"
    },
    detectionRisks: {
      title: "Aşkarlanma riskləri",
      description: "Sənədin aşkarlanması risk elementləri.",
      emptyTitle: "Aşkarlama riski yoxdur",
      emptyDescription: "Bu bölməyə başlamaq üçün aşkarlama riskləri əlavə edin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Riskin təsviri",
      addAction: "Risk elementi əlavə edin",
      categoryLabel: "Kateqoriya seçin",
      riskTypeLabel: "Risk növü",
      likelihoodLabel: "Ehtimal",
      impactLabel: "Təsir",
      inherentRatingLabel: "Doğma reytinq",
      auditAreaLabel: "Audit sahəsi",
      auditAreaPlaceholder: "Audit sahəsini seçin",
      significantBadge: "Əhəmiyyətli",
      procedureLinkedBadge: "Prosedur bağlandı",
      procedureUnlinkedBadge: "Prosedur tələb olunur"
    },
    fraudRisks: {
      title: "Fırıldaqçılıq riskləri",
      description: "Sənəd fırıldaqçılıq riski maddələri.",
      emptyTitle: "Fırıldaqçılıq riski yoxdur",
      emptyDescription: "Bu bölməyə başlamaq üçün fırıldaqçılıq riskləri əlavə edin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Riskin təsviri",
      addAction: "Risk elementi əlavə edin",
      categoryLabel: "Kateqoriya seçin",
      riskTypeLabel: "Risk növü",
      likelihoodLabel: "Ehtimal",
      impactLabel: "Təsir",
      inherentRatingLabel: "Doğma reytinq",
      auditAreaLabel: "Audit sahəsi",
      auditAreaPlaceholder: "Audit sahəsini seçin",
      significantBadge: "Əhəmiyyətli",
      procedureLinkedBadge: "Prosedur bağlandı",
      procedureUnlinkedBadge: "Prosedur tələb olunur"
    },
    itRisks: {
      title: "İT riskləri",
      description: "İT risk elementlərini sənədləşdirin.",
      emptyTitle: "İT riskləri yoxdur",
      emptyDescription: "Bu bölməyə başlamaq üçün İT risklərini əlavə edin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Riskin təsviri",
      addAction: "Risk elementi əlavə edin",
      categoryLabel: "Kateqoriya seçin",
      riskTypeLabel: "Risk növü",
      likelihoodLabel: "Ehtimal",
      impactLabel: "Təsir",
      inherentRatingLabel: "Doğma reytinq",
      auditAreaLabel: "Audit sahəsi",
      auditAreaPlaceholder: "Audit sahəsini seçin",
      significantBadge: "Əhəmiyyətli",
      procedureLinkedBadge: "Prosedur bağlandı",
      procedureUnlinkedBadge: "Prosedur tələb olunur"
    },
    complianceRisks: {
      title: "Uyğunluq riskləri",
      description: "Sənədlərə uyğunluq riski maddələri.",
      emptyTitle: "Uyğunluq riski yoxdur",
      emptyDescription: "Bu bölməyə başlamaq üçün uyğunluq riskləri əlavə edin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Riskin təsviri",
      addAction: "Risk elementi əlavə edin",
      categoryLabel: "Kateqoriya seçin",
      riskTypeLabel: "Risk növü",
      likelihoodLabel: "Ehtimal",
      impactLabel: "Təsir",
      inherentRatingLabel: "Doğma reytinq",
      auditAreaLabel: "Audit sahəsi",
      auditAreaPlaceholder: "Audit sahəsini seçin",
      significantBadge: "Əhəmiyyətli",
      procedureLinkedBadge: "Prosedur bağlandı",
      procedureUnlinkedBadge: "Prosedur tələb olunur"
    },
    financialStatementRisks: {
      title: "Maliyyə hesabatı riskləri",
      description: "Maliyyə hesabatı səviyyəsində riskləri sənədləşdirin.",
      emptyTitle: "Maliyyə hesabatı riskləri yoxdur",
      emptyDescription: "Bu bölməyə başlamaq üçün maliyyə hesabatı risklərini əlavə edin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Riskin təsviri",
      addAction: "Risk elementi əlavə edin",
      categoryLabel: "Kateqoriya seçin",
      riskTypeLabel: "Risk növü",
      likelihoodLabel: "Ehtimal",
      impactLabel: "Təsir",
      inherentRatingLabel: "Doğma reytinq",
      auditAreaLabel: "Audit sahəsi",
      auditAreaPlaceholder: "Audit sahəsini seçin",
      significantBadge: "Əhəmiyyətli",
      procedureLinkedBadge: "Prosedur bağlandı",
      procedureUnlinkedBadge: "Prosedur tələb olunur"
    },
    assertionRisks: {
      title: "Təsdiq riskləri",
      description: "Təsdiq səviyyəli risk maddələrini sənədləşdirin.",
      emptyTitle: "Təsdiq riskləri yoxdur",
      emptyDescription: "Bu bölməyə başlamaq üçün təsdiq riskləri əlavə edin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Riskin təsviri",
      addAction: "Risk elementi əlavə edin",
      categoryLabel: "Kateqoriya seçin",
      riskTypeLabel: "Risk növü",
      likelihoodLabel: "Ehtimal",
      impactLabel: "Təsir",
      inherentRatingLabel: "Doğma reytinq",
      auditAreaLabel: "Audit sahəsi",
      auditAreaPlaceholder: "Audit sahəsini seçin",
      significantBadge: "Əhəmiyyətli",
      procedureLinkedBadge: "Prosedur bağlandı",
      procedureUnlinkedBadge: "Prosedur tələb olunur"
    },
    significantRisks: {
      title: "Əhəmiyyətli risklər",
      description: "Fokuslanmış cavab tələb edən əhəmiyyətli riskləri sənədləşdirin.",
      emptyTitle: "Əhəmiyyətli risklər yoxdur",
      emptyDescription: "Bu bölməyə başlamaq üçün əhəmiyyətli risklər əlavə edin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Riskin təsviri",
      addAction: "Risk elementi əlavə edin",
      categoryLabel: "Kateqoriya seçin",
      riskTypeLabel: "Risk növü",
      likelihoodLabel: "Ehtimal",
      impactLabel: "Təsir",
      inherentRatingLabel: "Doğma reytinq",
      auditAreaLabel: "Audit sahəsi",
      auditAreaPlaceholder: "Audit sahəsini seçin",
      significantBadge: "Əhəmiyyətli",
      procedureLinkedBadge: "Prosedur bağlandı",
      procedureUnlinkedBadge: "Prosedur tələb olunur"
    },
    categories: {
      title: "Risk kateqoriyaları",
      description: "Risk kateqoriyasının təriflərini idarə edin.",
      emptyTitle: "Kateqoriya yoxdur",
      emptyDescription: "Risk elementlərini təşkil etmək üçün kateqoriyalar əlavə edin.",
      namePlaceholder: "Kateqoriya adı",
      descriptionPlaceholder: "Kateqoriya təsviri",
      addAction: "Kateqoriya əlavə edin"
    },
    scoring: {
      title: "Qiymətləndirmə",
      description: "Risk reyestri üzrə qiymətləndirmə nəticələrinin xülasəsi.",
      emptyTitle: "Qiymətləndirmə məlumatları yoxdur",
      emptyDescription: "Risk elementləri əlavə edildikdə, qiymətləndirmə göstəriciləri görünür.",
      ratedItems: "Qiymətləndirilmiş maddələr",
      significant: "Əhəmiyyətli",
      likelihood: "Yüksək ehtimal",
      impact: "Yüksək təsir",
      residual: "Əhəmiyyətli qalıq"
    },
    heatmap: {
      title: "İstilik xəritəsi",
      description: "Reyestr üzrə risk reytinqinin paylanması.",
      emptyTitle: "İstilik xəritəsi məlumatı yoxdur",
      emptyDescription: "Reytinqlər qeydə alındıqda istilik xəritəsi vedrələri görünür.",
      unratedLabel: "Qiymətləndirilməmiş",
      accountLabel: "Hesab",
      assertionLabel: "Təsdiq",
      ratingLabel: "Reytinq",
      significantLabel: "Əhəmiyyətli risk",
      emptyDetail: "Detallara baxmaq üçün istilik xəritəsi hüceyrəsini seçin.",
      filterSignificant: "Yalnız əhəmiyyətli və qiymətləndirilmiş xanaları göstərin"
    },
    matrix: {
      title: "Təsdiq matrisi",
      description: "Hesabla təsdiqləmə reytinqlərini idarə edin.",
      emptyTitle: "Təsdiq reytinqi yoxdur",
      emptyDescription: "Matrisi doldurmaq üçün təsdiq reytinqləri əlavə edin.",
      accountPlaceholder: "Hesab adı",
      addAction: "Təsdiq reytinqi əlavə edin",
      accountLabel: "Hesab",
      assertionLabel: "Təsdiq",
      ratingLabel: "Reytinq",
      significantLabel: "Əhəmiyyətli risk",
      emptyDetail: "Reytinqlərə baxmaq və ya yeniləmək üçün matris xanasını seçin.",
      selectRating: "Reytinq seçin"
    },
    responses: {
      title: "Cavablar",
      description: "Müəyyən edilmiş risk maddələri üçün cavabları sənədləşdirin.",
      emptyTitle: "Cavab yoxdur",
      emptyDescription: "Planlaşdırılmış tədbirləri ələ keçirmək üçün risk cavabları əlavə edin.",
      riskItemLabel: "Risk elementini seçin",
      descriptionPlaceholder: "Cavab təsviri",
      addAction: "Cavab əlavə edin"
    },
    procedures: {
      title: "Prosedurlar",
      description: "Planlaşdırılmış prosedurları riskli maddələrlə əlaqələndirin.",
      emptyTitle: "Əlaqəli prosedurlar yoxdur",
      emptyDescription: "Xəritə cavabının icrasına prosedur bağlantıları əlavə edin.",
      riskItemLabel: "Risk elementini seçin",
      referencePlaceholder: "Prosedur arayışı",
      addAction: "Prosedur linki əlavə edin"
    },
    owners: {
      title: "Sahiblər",
      description: "Sahibləri risk reyestrinə maddələr təyin edin.",
      emptyTitle: "Risk elementləri yoxdur",
      emptyDescription: "Risk elementləri yaradıldıqdan sonra burada görünəcək.",
      ownerPlaceholder: "Sahib identifikatoru",
      updateAction: "Sahibini yeniləyin",
      unassignedLabel: "Təyin edilmədi"
    },
    reviewNotes: {
      title: "Qeydləri nəzərdən keçirin",
      description: "Rəyçi qeydlərini və təqib nöqtələrini çəkin.",
      emptyTitle: "Baxış qeydləri yoxdur",
      emptyDescription: "Baxış qeydləri nəzərdən keçirmə dövrləri zamanı görünür.",
      bodyPlaceholder: "Baxış qeydi əlavə edin",
      addAction: "Qeyd əlavə edin"
    },
    comments: {
      title: "Şərhlər",
      description: "Risklərlə bağlı daxili şərhləri çəkin.",
      emptyTitle: "Şərh yoxdur",
      emptyDescription: "Şərhlər əlavə edildikdən sonra burada görünür.",
      bodyPlaceholder: "Daxili şərh əlavə edin",
      addAction: "Şərh əlavə edin"
    },
    history: {
      title: "Tarix",
      description: "Risklərin qiymətləndirilməsi fəaliyyətinin yalnız oxunan qrafiki.",
      emptyTitle: "Risk fəaliyyəti yoxdur",
      emptyDescription: "Dəyişikliklər qeydə alındıqca risk fəaliyyəti burada görünəcək.",
      versionLabel: "Qiymətləndirmə versiyası",
      updatedLabel: "Yenilənib",
      actions: {
        "risk_assessment.created": "Risk qiymətləndirməsi yaradılmışdır",
        "risk_assessment.updated": "Risk qiymətləndirməsi yeniləndi",
        "risk_assessment.archived": "Risk qiymətləndirilməsi arxivləşdirildi",
        "risk_assessment.restored": "Riskin qiymətləndirilməsi bərpa edildi",
        "risk_assessment.submitted": "Risk qiymətləndirməsi təqdim edildi",
        "risk_assessment.returned": "Risk qiymətləndirməsi qaytarıldı",
        "risk_assessment.approved": "Riskin qiymətləndirilməsi təsdiq edilmişdir",
        "risk_assessment.category.added": "Kateqoriya əlavə edildi",
        "risk_assessment.risk_item.added": "Risk elementi əlavə edildi",
        "risk_assessment.risk_item.updated": "Risk elementi yeniləndi",
        "risk_assessment.assertion_rating.updated": "Təsdiq reytinqi yeniləndi",
        "risk_assessment.response.added": "Cavab əlavə edildi",
        "risk_assessment.procedure.linked": "Prosedur bağlandı",
        "risk_assessment.note.added": "Qeyd əlavə edildi",
        "risk_assessment.significant.acknowledged": "Əhəmiyyətli risklər qəbul edilir"
      }
    },
    settings: {
      title: "Parametrlər",
      description: "Bu risk qiymətləndirməsini arxivləşdirin və ya bərpa edin.",
      archiveAction: "Arxiv riskinin qiymətləndirilməsi",
      archiveConfirmAction: "Arxivi təsdiqləyin",
      restoreAction: "Risk qiymətləndirməsini bərpa edin",
      restoreConfirmAction: "Bərpanı təsdiqləyin",
      cancelAction: "Ləğv et",
      archivedBanner: "Bu risk qiymətləndirməsi arxivdədir.",
      readOnlyNotice: "Risk qiymətləndirmə parametrlərinə yalnız baxış üçün girişiniz var."
    }
  },
  ru: {
    notFoundTitle: "Оценка риска не найдена",
    notFoundDescription: "Запрошенное вами рабочее пространство по оценке рисков не найдено для этого задания.",
    forbiddenTitle: "Требуется разрешение",
    forbiddenDescription: "Для доступа к этому рабочему пространству вам необходимо разрешение на оценку рисков.",
    noWorkspaceTitle: "Требуется рабочее место",
    noWorkspaceDescription: "Прежде чем открыть оценку рисков, выберите рабочую область.",
    statuses: {
      not_started: "Не запущено",
      in_progress: "В ходе выполнения",
      submitted: "Поданный",
      under_review: "На рассмотрении",
      approved: "Одобренный",
      archived: "В архиве"
    },
    riskTypes: {
      inherent: "Неотъемлемый риск",
      control: "Контролировать риск",
      detection: "Риск обнаружения",
      fraud: "Риск мошенничества",
      it: "ИТ-риск",
      compliance: "Комплаенс-риск",
      financial_statement: "Риск финансовой отчетности",
      assertion: "Риск утверждения",
      significant: "Значительный риск"
    },
    ratingLevels: {
      low: "Низкий",
      moderate: "Умеренный",
      high: "Высокий",
      significant: "Значительный"
    },
    likelihoods: {
      low: "Низкий",
      moderate: "Умеренный",
      high: "Высокий"
    },
    impacts: {
      low: "Низкий",
      moderate: "Умеренный",
      high: "Высокий"
    },
    responseTypes: {
      accept: "Принимать",
      reduce: "Уменьшать",
      transfer: "Передача",
      avoid: "Избегать",
      substantive_procedures: "Материальные процедуры",
      test_of_controls: "Проверка средств управления"
    },
    assertions: {
      existence: "Существование",
      completeness: "Полнота",
      accuracy: "Точность",
      cutoff: "Отрезать",
      classification: "Классификация",
      presentation: "Презентация"
    },
    noteTypes: {
      review: "Обзор примечания",
      internal: "Внутреннее примечание"
    },
    actions: {
      add: "Добавлять",
      update: "Обновлять",
      archive: "Архив",
      restore: "Восстановить",
      submit: "Представлять на рассмотрение",
      approve: "Утвердить",
      return: "Возвращаться"
    },
    workflow: {
      title: "Рабочий процесс управления рисками",
      description: "Отправьте, возвратите и утвердите документацию по оценке рисков.",
      submitAction: "Отправить на рассмотрение",
      returnAction: "Вернуть на доработку",
      returnConfirmAction: "Подтвердить возврат",
      approveAction: "Утвердить оценку рисков",
      acknowledgeAction: "Признайте значительные риски",
      cancelAction: "Отмена",
      returnNotesLabel: "Примечания к возврату",
      returnNotesPlaceholder: "Опишите, что необходимо исправить перед повторной отправкой.",
      readOnlyNotice: "Эта оценка риска архивируется и доступна только для чтения.",
      submittedNotice: "Эта оценка риска представлена ​​и ожидает рассмотрения.",
      approvedNotice: "Данная оценка риска одобрена.",
      acknowledgedNotice: "Были признаны значительные риски.",
      pendingAcknowledgmentNotice: "Перед утверждением необходимо признать значительные риски.",
      errorGeneric: "Невозможно выполнить действие рабочего процесса оценки рисков."
    },
    empty: {
      title: "Оценка риска не начата",
      description: "Создайте оценку рисков, чтобы документировать значительные риски, меры реагирования и проверку готовности.",
      createAction: "Создать оценку риска",
      creating: "Создание оценки риска...",
      forbiddenDescription: "Чтобы запустить это рабочее пространство, вам необходимо разрешение на создание оценки риска."
    },
    workspace: {
      title: "Обзор оценки рисков",
      description: "Обзор текущего статуса оценки рисков и ключевых показателей.",
      statusTitle: "Сводка статуса",
      statusDescription: "Текущие показатели завершения и готовности к данной оценке рисков.",
      progress: "Общий прогресс",
      workflowTitle: "Рабочий процесс",
      workflowDescription: "Рабочий процесс подачи и утверждения оценки рисков.",
      heatmapPreviewTitle: "Предварительный просмотр тепловой карты",
      heatmapPreviewDescription: "Распределение рейтингов риска по текущим результатам оценки.",
      heroEyebrow: "Оценка риска",
      breadcrumbRiskAssessment: "Оценка риска",
      backToEngagement: "Вернемся к помолвке",
      planningGateTitle: "Требуется одобрение планирования",
      planningGateDescription: "План аудита должен быть утвержден до начала оценки рисков.",
      navAriaLabel: "Разделы рабочей области оценки рисков",
      navOverview: "Панель управления",
      navInherentRisks: "Неотъемлемые риски",
      navControlRisks: "Контролируйте риски",
      navDetectionRisks: "Риски обнаружения",
      navFraudRisks: "Риски мошенничества",
      navItRisks: "ИТ-риски",
      navComplianceRisks: "Комплаенс-риски",
      navFinancialStatementRisks: "Риски финансовой отчетности",
      navAssertionRisks: "Риски утверждений",
      navSignificantRisks: "Значительные риски",
      navCategories: "Категории",
      navScoring: "Подсчет очков",
      navHeatmap: "Тепловая карта",
      navMatrix: "Матрица",
      navResponses: "Ответы",
      navProcedures: "Процедуры",
      navOwners: "Владельцы",
      navReviewNotes: "Обзор примечаний",
      navComments: "Комментарии",
      navHistory: "История",
      navSettings: "Настройки",
      loading: "Загрузка рабочей области оценки рисков",
      errorTitle: "Невозможно загрузить рабочую область оценки рисков.",
      errorDescription: "Что-то пошло не так при загрузке этой оценки риска.",
      archivedTitle: "Оценка риска заархивирована",
      archivedDescription: "Эта оценка риска доступна только для чтения. Восстановите его, чтобы продолжить обновления.",
      summaryStatus: "Статус риска",
      summaryVersion: "Оценочная версия",
      summaryProgress: "Общий прогресс",
      summarySignificant: "Значительные риски",
      summaryPendingReview: "Ожидает рассмотрения",
      summaryOpenItems: "Открытые позиции",
      sections: {
        overview: {
          title: "Панель управления рисками",
          description: "Индикаторы статуса, прогресса и готовности к обзору."
        },
        "inherent-risks": {
          title: "Неотъемлемые риски",
          description: "Риски, прежде чем рассматривать соответствующие меры контроля."
        },
        "control-risks": {
          title: "Контролируйте риски",
          description: "Риски, связанные с разработкой и функционированием средств контроля."
        },
        "detection-risks": {
          title: "Риски обнаружения",
          description: "Риски того, что процедуры не смогут обнаружить искажения."
        },
        "fraud-risks": {
          title: "Риски мошенничества",
          description: "Факторы риска мошенничества и руководство имеют приоритет над соображениями."
        },
        "it-risks": {
          title: "ИТ-риски",
          description: "Риски, связанные с технологиями, доступом к системе и целостностью данных."
        },
        "compliance-risks": {
          title: "Комплаенс-риски",
          description: "Риски, связанные с соблюдением нормативных требований и законодательства."
        },
        "financial-statement-risks": {
          title: "Риски финансовой отчетности",
          description: "Риски существенного искажения на уровне финансовой отчетности."
        },
        "assertion-risks": {
          title: "Риски утверждений",
          description: "Риски уровня утверждений, связанные с соответствующими учетными записями."
        },
        "significant-risks": {
          title: "Значительные риски",
          description: "Высокоприоритетные риски, требующие целенаправленного аудиторского реагирования."
        },
        categories: {
          title: "Категории рисков",
          description: "Настроенные категории, используемые для организации элементов риска."
        },
        scoring: {
          title: "Подсчет очков",
          description: "Совокупные скоринговые показатели по выявленным рискам."
        },
        heatmap: {
          title: "Тепловая карта",
          description: "Визуальное распределение рейтингов риска."
        },
        matrix: {
          title: "Матрица утверждений",
          description: "Обзор рейтингов аккаунтов и утверждений."
        },
        responses: {
          title: "Реагирование на риски",
          description: "Запланированные меры реагирования на выявленные риски."
        },
        procedures: {
          title: "Ссылки на процедуры",
          description: "Связанные процедуры устранения оцененных рисков."
        },
        owners: {
          title: "Владельцы риска",
          description: "Назначены владельцы для каждого элемента риска."
        },
        "review-notes": {
          title: "Обзор примечаний",
          description: "Заметки рецензента, сделанные во время циклов оценки рисков."
        },
        comments: {
          title: "Комментарии",
          description: "Внутренние комментарии и заметки о сотрудничестве."
        },
        history: {
          title: "История",
          description: "График внесения изменений и утверждений в оценку рисков."
        },
        settings: {
          title: "Настройки",
          description: "Архивируйте и восстанавливайте элементы управления для этой оценки риска."
        }
      }
    },
    inherentRisks: {
      title: "Неотъемлемые риски",
      description: "Документируйте элементы неотъемлемого риска.",
      emptyTitle: "Отсутствие присущих рисков",
      emptyDescription: "Добавьте неотъемлемые риски, чтобы начать реестр.",
      titlePlaceholder: "Название риска",
      descriptionPlaceholder: "Описание риска",
      addAction: "Добавить элемент риска",
      categoryLabel: "Выберите категорию",
      riskTypeLabel: "Тип риска",
      likelihoodLabel: "Вероятность",
      impactLabel: "Влияние",
      inherentRatingLabel: "Собственный рейтинг",
      auditAreaLabel: "Область аудита",
      auditAreaPlaceholder: "Выберите область аудита",
      significantBadge: "Значительный",
      procedureLinkedBadge: "Процедура связана",
      procedureUnlinkedBadge: "Требуется процедура"
    },
    controlRisks: {
      title: "Контролируйте риски",
      description: "Элементы риска документационного контроля.",
      emptyTitle: "Отсутствие рисков контроля",
      emptyDescription: "Добавьте риски контроля, чтобы начать этот раздел.",
      titlePlaceholder: "Название риска",
      descriptionPlaceholder: "Описание риска",
      addAction: "Добавить элемент риска",
      categoryLabel: "Выберите категорию",
      riskTypeLabel: "Тип риска",
      likelihoodLabel: "Вероятность",
      impactLabel: "Влияние",
      inherentRatingLabel: "Собственный рейтинг",
      auditAreaLabel: "Область аудита",
      auditAreaPlaceholder: "Выберите область аудита",
      significantBadge: "Значительный",
      procedureLinkedBadge: "Процедура связана",
      procedureUnlinkedBadge: "Требуется процедура"
    },
    detectionRisks: {
      title: "Риски обнаружения",
      description: "Элементы риска обнаружения документов.",
      emptyTitle: "Отсутствие рисков обнаружения",
      emptyDescription: "Добавьте риски обнаружения, чтобы начать этот раздел.",
      titlePlaceholder: "Название риска",
      descriptionPlaceholder: "Описание риска",
      addAction: "Добавить элемент риска",
      categoryLabel: "Выберите категорию",
      riskTypeLabel: "Тип риска",
      likelihoodLabel: "Вероятность",
      impactLabel: "Влияние",
      inherentRatingLabel: "Собственный рейтинг",
      auditAreaLabel: "Область аудита",
      auditAreaPlaceholder: "Выберите область аудита",
      significantBadge: "Значительный",
      procedureLinkedBadge: "Процедура связана",
      procedureUnlinkedBadge: "Требуется процедура"
    },
    fraudRisks: {
      title: "Риски мошенничества",
      description: "Элементы риска мошенничества с документами.",
      emptyTitle: "Никаких рисков мошенничества",
      emptyDescription: "Добавьте риски мошенничества, чтобы начать этот раздел.",
      titlePlaceholder: "Название риска",
      descriptionPlaceholder: "Описание риска",
      addAction: "Добавить элемент риска",
      categoryLabel: "Выберите категорию",
      riskTypeLabel: "Тип риска",
      likelihoodLabel: "Вероятность",
      impactLabel: "Влияние",
      inherentRatingLabel: "Собственный рейтинг",
      auditAreaLabel: "Область аудита",
      auditAreaPlaceholder: "Выберите область аудита",
      significantBadge: "Значительный",
      procedureLinkedBadge: "Процедура связана",
      procedureUnlinkedBadge: "Требуется процедура"
    },
    itRisks: {
      title: "ИТ-риски",
      description: "Документируйте элементы ИТ-рисков.",
      emptyTitle: "Никаких ИТ-рисков",
      emptyDescription: "Добавьте ИТ-риски, чтобы начать этот раздел.",
      titlePlaceholder: "Название риска",
      descriptionPlaceholder: "Описание риска",
      addAction: "Добавить элемент риска",
      categoryLabel: "Выберите категорию",
      riskTypeLabel: "Тип риска",
      likelihoodLabel: "Вероятность",
      impactLabel: "Влияние",
      inherentRatingLabel: "Собственный рейтинг",
      auditAreaLabel: "Область аудита",
      auditAreaPlaceholder: "Выберите область аудита",
      significantBadge: "Значительный",
      procedureLinkedBadge: "Процедура связана",
      procedureUnlinkedBadge: "Требуется процедура"
    },
    complianceRisks: {
      title: "Комплаенс-риски",
      description: "Документировать элементы комплаенс-риска.",
      emptyTitle: "Отсутствие комплаенс-рисков",
      emptyDescription: "Добавьте риски соответствия требованиям, чтобы начать этот раздел.",
      titlePlaceholder: "Название риска",
      descriptionPlaceholder: "Описание риска",
      addAction: "Добавить элемент риска",
      categoryLabel: "Выберите категорию",
      riskTypeLabel: "Тип риска",
      likelihoodLabel: "Вероятность",
      impactLabel: "Влияние",
      inherentRatingLabel: "Собственный рейтинг",
      auditAreaLabel: "Область аудита",
      auditAreaPlaceholder: "Выберите область аудита",
      significantBadge: "Значительный",
      procedureLinkedBadge: "Процедура связана",
      procedureUnlinkedBadge: "Требуется процедура"
    },
    financialStatementRisks: {
      title: "Риски финансовой отчетности",
      description: "Документируйте риски на уровне финансовой отчетности.",
      emptyTitle: "Отсутствие рисков финансовой отчетности",
      emptyDescription: "Добавьте риски финансовой отчетности, чтобы начать этот раздел.",
      titlePlaceholder: "Название риска",
      descriptionPlaceholder: "Описание риска",
      addAction: "Добавить элемент риска",
      categoryLabel: "Выберите категорию",
      riskTypeLabel: "Тип риска",
      likelihoodLabel: "Вероятность",
      impactLabel: "Влияние",
      inherentRatingLabel: "Собственный рейтинг",
      auditAreaLabel: "Область аудита",
      auditAreaPlaceholder: "Выберите область аудита",
      significantBadge: "Значительный",
      procedureLinkedBadge: "Процедура связана",
      procedureUnlinkedBadge: "Требуется процедура"
    },
    assertionRisks: {
      title: "Риски утверждений",
      description: "Документируйте элементы риска на уровне утверждений.",
      emptyTitle: "Никаких рисков утверждения",
      emptyDescription: "Добавьте риски утверждения, чтобы начать этот раздел.",
      titlePlaceholder: "Название риска",
      descriptionPlaceholder: "Описание риска",
      addAction: "Добавить элемент риска",
      categoryLabel: "Выберите категорию",
      riskTypeLabel: "Тип риска",
      likelihoodLabel: "Вероятность",
      impactLabel: "Влияние",
      inherentRatingLabel: "Собственный рейтинг",
      auditAreaLabel: "Область аудита",
      auditAreaPlaceholder: "Выберите область аудита",
      significantBadge: "Значительный",
      procedureLinkedBadge: "Процедура связана",
      procedureUnlinkedBadge: "Требуется процедура"
    },
    significantRisks: {
      title: "Значительные риски",
      description: "Документируйте значительные риски, требующие целенаправленного реагирования.",
      emptyTitle: "Никаких существенных рисков",
      emptyDescription: "Добавьте существенные риски, чтобы начать этот раздел.",
      titlePlaceholder: "Название риска",
      descriptionPlaceholder: "Описание риска",
      addAction: "Добавить элемент риска",
      categoryLabel: "Выберите категорию",
      riskTypeLabel: "Тип риска",
      likelihoodLabel: "Вероятность",
      impactLabel: "Влияние",
      inherentRatingLabel: "Собственный рейтинг",
      auditAreaLabel: "Область аудита",
      auditAreaPlaceholder: "Выберите область аудита",
      significantBadge: "Значительный",
      procedureLinkedBadge: "Процедура связана",
      procedureUnlinkedBadge: "Требуется процедура"
    },
    categories: {
      title: "Категории рисков",
      description: "Управляйте определениями категорий риска.",
      emptyTitle: "Нет категорий",
      emptyDescription: "Добавляйте категории для организации элементов риска.",
      namePlaceholder: "Название категории",
      descriptionPlaceholder: "Описание категории",
      addAction: "Добавить категорию"
    },
    scoring: {
      title: "Подсчет очков",
      description: "Сводная информация о результатах оценки по реестру рисков.",
      emptyTitle: "Нет данных о баллах",
      emptyDescription: "Индикаторы оценки появляются при добавлении элементов риска.",
      ratedItems: "Рейтинговые товары",
      significant: "Значительный",
      likelihood: "Высокая вероятность",
      impact: "Высокое воздействие",
      residual: "Значительный остаток"
    },
    heatmap: {
      title: "Тепловая карта",
      description: "Распределение рейтинга риска по реестру.",
      emptyTitle: "Нет данных тепловой карты",
      emptyDescription: "Сегменты тепловой карты появляются при записи рейтингов.",
      unratedLabel: "Без рейтинга",
      accountLabel: "Счет",
      assertionLabel: "Утверждение",
      ratingLabel: "Рейтинг",
      significantLabel: "Значительный риск",
      emptyDetail: "Выберите ячейку тепловой карты, чтобы просмотреть подробности.",
      filterSignificant: "Показывать только значимые и оцененные ячейки"
    },
    matrix: {
      title: "Матрица утверждений",
      description: "Управляйте рейтингами утверждений по аккаунтам.",
      emptyTitle: "Нет рейтингов утверждений",
      emptyDescription: "Добавьте рейтинги утверждений, чтобы заполнить матрицу.",
      accountPlaceholder: "Имя учетной записи",
      addAction: "Добавить рейтинг утверждений",
      accountLabel: "Счет",
      assertionLabel: "Утверждение",
      ratingLabel: "Рейтинг",
      significantLabel: "Значительный риск",
      emptyDetail: "Выберите ячейку матрицы, чтобы просмотреть или обновить рейтинги.",
      selectRating: "Выберите рейтинг"
    },
    responses: {
      title: "Ответы",
      description: "Документируйте ответы на выявленные элементы риска.",
      emptyTitle: "Нет ответов",
      emptyDescription: "Добавьте меры реагирования на риски, чтобы фиксировать запланированные действия.",
      riskItemLabel: "Выберите элемент риска",
      descriptionPlaceholder: "Описание ответа",
      addAction: "Добавить ответ"
    },
    procedures: {
      title: "Процедуры",
      description: "Свяжите запланированные процедуры с элементами риска.",
      emptyTitle: "Нет связанных процедур",
      emptyDescription: "Добавьте ссылки на процедуры для выполнения ответа на карту.",
      riskItemLabel: "Выберите элемент риска",
      referencePlaceholder: "Ссылка на процедуру",
      addAction: "Добавить ссылку на процедуру"
    },
    owners: {
      title: "Владельцы",
      description: "Назначьте владельцев по статьям реестра рисков.",
      emptyTitle: "Нет предметов риска",
      emptyDescription: "Элементы риска появятся здесь после создания.",
      ownerPlaceholder: "Идентификатор владельца",
      updateAction: "Обновить владельца",
      unassignedLabel: "Неназначенный"
    },
    reviewNotes: {
      title: "Обзор примечаний",
      description: "Записывайте заметки рецензента и последующие замечания.",
      emptyTitle: "Нет примечаний к отзыву",
      emptyDescription: "Примечания к рецензированию появляются во время циклов рецензирования.",
      bodyPlaceholder: "Добавить примечание к отзыву",
      addAction: "Добавить примечание"
    },
    comments: {
      title: "Комментарии",
      description: "Собирайте внутренние комментарии, связанные с рисками.",
      emptyTitle: "Без комментариев",
      emptyDescription: "Комментарии появляются здесь после добавления.",
      bodyPlaceholder: "Добавить внутренний комментарий",
      addAction: "Добавить комментарий"
    },
    history: {
      title: "История",
      description: "Доступная только для чтения временная шкала деятельности по оценке рисков.",
      emptyTitle: "Никакой рискованной деятельности",
      emptyDescription: "Рисковая активность будет появляться здесь по мере регистрации изменений.",
      versionLabel: "Оценочная версия",
      updatedLabel: "Обновлено",
      actions: {
        "risk_assessment.created": "Оценка риска создана",
        "risk_assessment.updated": "Обновлена ​​оценка рисков",
        "risk_assessment.archived": "Оценка риска заархивирована",
        "risk_assessment.restored": "Оценка риска восстановлена",
        "risk_assessment.submitted": "Оценка риска отправлена",
        "risk_assessment.returned": "Оценка риска возвращена",
        "risk_assessment.approved": "Оценка риска одобрена",
        "risk_assessment.category.added": "Категория добавлена",
        "risk_assessment.risk_item.added": "Добавлен элемент риска",
        "risk_assessment.risk_item.updated": "Элемент риска обновлен.",
        "risk_assessment.assertion_rating.updated": "Рейтинг утверждений обновлен.",
        "risk_assessment.response.added": "Ответ добавлен",
        "risk_assessment.procedure.linked": "Процедура связана",
        "risk_assessment.note.added": "Примечание добавлено",
        "risk_assessment.significant.acknowledged": "Признаны значительные риски"
      }
    },
    settings: {
      title: "Настройки",
      description: "Архивируйте или восстановите эту оценку риска.",
      archiveAction: "Оценка рисков архива",
      archiveConfirmAction: "Подтвердить архив",
      restoreAction: "Восстановить оценку риска",
      restoreConfirmAction: "Подтвердить восстановление",
      cancelAction: "Отмена",
      archivedBanner: "Эта оценка риска заархивирована.",
      readOnlyNotice: "У вас есть доступ только для просмотра к настройкам оценки рисков."
    }
  },
  tr: {
    notFoundTitle: "Risk değerlendirmesi bulunamadı",
    notFoundDescription: "Bu etkileşim için talep ettiğiniz risk değerlendirmesi çalışma alanı bulunamadı.",
    forbiddenTitle: "İzin gerekli",
    forbiddenDescription: "Bu çalışma alanına erişmek için risk değerlendirmesi iznine ihtiyacınız var.",
    noWorkspaceTitle: "Çalışma alanı gerekli",
    noWorkspaceDescription: "Risk değerlendirmesini açmadan önce bir çalışma alanı seçin.",
    statuses: {
      not_started: "Başlatılmadı",
      in_progress: "Devam etmekte",
      submitted: "Gönderildi",
      under_review: "İnceleniyor",
      approved: "Onaylı",
      archived: "Arşivlendi"
    },
    riskTypes: {
      inherent: "Doğal risk",
      control: "Riski kontrol edin",
      detection: "Tespit riski",
      fraud: "Dolandırıcılık riski",
      it: "BT riski",
      compliance: "Uyumluluk riski",
      financial_statement: "Finansal tablo riski",
      assertion: "İddia riski",
      significant: "Önemli risk"
    },
    ratingLevels: {
      low: "Düşük",
      moderate: "Ilıman",
      high: "Yüksek",
      significant: "Önemli"
    },
    likelihoods: {
      low: "Düşük",
      moderate: "Ilıman",
      high: "Yüksek"
    },
    impacts: {
      low: "Düşük",
      moderate: "Ilıman",
      high: "Yüksek"
    },
    responseTypes: {
      accept: "Kabul etmek",
      reduce: "Azaltmak",
      transfer: "Aktarım",
      avoid: "Kaçınmak",
      substantive_procedures: "Maddi prosedürler",
      test_of_controls: "Kontrol testi"
    },
    assertions: {
      existence: "Varoluş",
      completeness: "Tamlık",
      accuracy: "Kesinlik",
      cutoff: "Ayırmak",
      classification: "sınıflandırma",
      presentation: "Sunum"
    },
    noteTypes: {
      review: "Notu inceleyin",
      internal: "Dahili not"
    },
    actions: {
      add: "Eklemek",
      update: "Güncelleme",
      archive: "Arşiv",
      restore: "Eski haline getirmek",
      submit: "Göndermek",
      approve: "Onaylamak",
      return: "Geri dönmek"
    },
    workflow: {
      title: "Risk iş akışı",
      description: "Risk değerlendirmesi belgelerini gönderin, iade edin ve onaylayın.",
      submitAction: "İnceleme için gönder",
      returnAction: "Revizyon için geri dön",
      returnConfirmAction: "İadeyi onayla",
      approveAction: "Risk değerlendirmesini onayla",
      acknowledgeAction: "Önemli riskleri kabul edin",
      cancelAction: "İptal etmek",
      returnNotesLabel: "Notları döndür",
      returnNotesPlaceholder: "Yeniden göndermeden önce neyin revize edilmesi gerektiğini açıklayın.",
      readOnlyNotice: "Bu risk değerlendirmesi arşivlenir ve salt okunurdur.",
      submittedNotice: "Bu risk değerlendirmesi gönderildi ve incelenmeyi bekliyor.",
      approvedNotice: "Bu risk değerlendirmesi onaylanmıştır.",
      acknowledgedNotice: "Önemli riskler kabul edildi.",
      pendingAcknowledgmentNotice: "Onaylanmadan önce önemli risklerin kabul edilmesi gerekir.",
      errorGeneric: "Risk değerlendirmesi iş akışı eylemi tamamlanamıyor."
    },
    empty: {
      title: "Risk değerlendirmesi başlatılmadı",
      description: "Önemli riskleri, yanıtları ve hazırlık durumunu gözden geçirmek için bir risk değerlendirmesi oluşturun.",
      createAction: "Risk değerlendirmesi oluşturun",
      creating: "Risk değerlendirmesi oluşturuluyor...",
      forbiddenDescription: "Bu çalışma alanını başlatmak için risk değerlendirmesi oluşturma iznine ihtiyacınız var."
    },
    workspace: {
      title: "Risk değerlendirmesine genel bakış",
      description: "Mevcut risk değerlendirme durumuna ve temel göstergelere genel bakış.",
      statusTitle: "Durum özeti",
      statusDescription: "Bu risk değerlendirmesi için mevcut tamamlanma ve hazırlık göstergeleri.",
      progress: "Genel ilerleme",
      workflowTitle: "İş akışı",
      workflowDescription: "Risk değerlendirmesi için gönderim ve onay iş akışı.",
      heatmapPreviewTitle: "Isı haritası önizlemesi",
      heatmapPreviewDescription: "Risk derecelendirmelerinin mevcut değerlendirme sonuçlarına göre dağılımı.",
      heroEyebrow: "Risk değerlendirmesi",
      breadcrumbRiskAssessment: "Risk değerlendirmesi",
      backToEngagement: "Nişana geri dön",
      planningGateTitle: "Planlama onayı gerekli",
      planningGateDescription: "Risk değerlendirmesinin başlayabilmesi için denetim planlamasının onaylanması gerekir.",
      navAriaLabel: "Risk değerlendirmesi çalışma alanı bölümleri",
      navOverview: "Kontrol Paneli",
      navInherentRisks: "Doğal riskler",
      navControlRisks: "Riskleri kontrol edin",
      navDetectionRisks: "Tespit riskleri",
      navFraudRisks: "Dolandırıcılık riskleri",
      navItRisks: "BT riskleri",
      navComplianceRisks: "Uyumluluk riskleri",
      navFinancialStatementRisks: "Finansal tablo riskleri",
      navAssertionRisks: "İddia riskleri",
      navSignificantRisks: "Önemli riskler",
      navCategories: "Kategoriler",
      navScoring: "Puanlama",
      navHeatmap: "Isı haritası",
      navMatrix: "Matris",
      navResponses: "Yanıtlar",
      navProcedures: "Prosedürler",
      navOwners: "Sahipler",
      navReviewNotes: "Notları inceleyin",
      navComments: "Yorumlar",
      navHistory: "Tarih",
      navSettings: "Ayarlar",
      loading: "Risk değerlendirmesi çalışma alanı yükleniyor",
      errorTitle: "Risk değerlendirmesi çalışma alanı yüklenemiyor",
      errorDescription: "Bu risk değerlendirmesi yüklenirken bir şeyler ters gitti.",
      archivedTitle: "Risk değerlendirmesi arşivlendi",
      archivedDescription: "Bu risk değerlendirmesi salt okunurdur. Güncellemelere devam etmek için geri yükleyin.",
      summaryStatus: "Risk durumu",
      summaryVersion: "Değerlendirme sürümü",
      summaryProgress: "Genel ilerleme",
      summarySignificant: "Önemli riskler",
      summaryPendingReview: "İnceleme bekleniyor",
      summaryOpenItems: "Öğeleri aç",
      sections: {
        overview: {
          title: "Risk kontrol paneli",
          description: "Durum, ilerleme ve incelemeye hazırlık göstergeleri."
        },
        "inherent-risks": {
          title: "Doğal riskler",
          description: "İlgili kontrolleri dikkate almadan önce riskler."
        },
        "control-risks": {
          title: "Riskleri kontrol edin",
          description: "Kontrollerin tasarımı ve işleyişine ilişkin riskler."
        },
        "detection-risks": {
          title: "Tespit riskleri",
          description: "Prosedürlerin yanlış beyanları tespit edememesi riskleri."
        },
        "fraud-risks": {
          title: "Dolandırıcılık riskleri",
          description: "Dolandırıcılık risk faktörleri ve yönetimi, dikkate alınması gereken hususları geçersiz kılar."
        },
        "it-risks": {
          title: "BT riskleri",
          description: "Teknoloji, sistem erişimi ve veri bütünlüğü riskleri."
        },
        "compliance-risks": {
          title: "Uyumluluk riskleri",
          description: "Mevzuat ve yasal uyumluluk riskleri."
        },
        "financial-statement-risks": {
          title: "Finansal tablo riskleri",
          description: "Mali tablo düzeyinde önemli yanlış bildirim riskleri."
        },
        "assertion-risks": {
          title: "İddia riskleri",
          description: "İlgili hesaplarla bağlantılı iddia düzeyindeki riskler."
        },
        "significant-risks": {
          title: "Önemli riskler",
          description: "Odaklanmış denetim yanıtı gerektiren yüksek öncelikli riskler."
        },
        categories: {
          title: "Risk kategorileri",
          description: "Risk öğelerini düzenlemek için kullanılan yapılandırılmış kategoriler."
        },
        scoring: {
          title: "Puanlama",
          description: "Belirlenen riskler genelinde puanlama göstergelerini toplu hale getirin."
        },
        heatmap: {
          title: "Isı haritası",
          description: "Risk derecelendirmelerinin görsel dağılımı."
        },
        matrix: {
          title: "İddia matrisi",
          description: "Hesap ve iddia derecelendirmelerine genel bakış."
        },
        responses: {
          title: "Risk yanıtları",
          description: "Tanımlanan riskler için planlanan yanıtlar."
        },
        procedures: {
          title: "Prosedür bağlantıları",
          description: "Değerlendirilen risklerin ele alınmasına yönelik bağlantılı prosedürler."
        },
        owners: {
          title: "Risk sahipleri",
          description: "Her risk öğesi için atanmış sahipler."
        },
        "review-notes": {
          title: "Notları inceleyin",
          description: "Risk değerlendirme döngüleri sırasında alınan gözden geçiren notları."
        },
        comments: {
          title: "Yorumlar",
          description: "Dahili yorumlar ve işbirliği notları."
        },
        history: {
          title: "Tarih",
          description: "Risk değerlendirmesi değişikliklerinin ve onaylarının zaman çizelgesi."
        },
        settings: {
          title: "Ayarlar",
          description: "Bu risk değerlendirmesi için kontrolleri arşivleyin ve geri yükleyin."
        }
      }
    },
    inherentRisks: {
      title: "Doğal riskler",
      description: "Doğal risk öğelerini belgeleyin.",
      emptyTitle: "Doğal risk yok",
      emptyDescription: "Kaydı başlatmak için doğal riskleri ekleyin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk açıklaması",
      addAction: "Risk öğesi ekle",
      categoryLabel: "Kategori seç",
      riskTypeLabel: "Risk türü",
      likelihoodLabel: "olasılık",
      impactLabel: "Darbe",
      inherentRatingLabel: "Doğal derecelendirme",
      auditAreaLabel: "Denetim alanı",
      auditAreaPlaceholder: "Denetim alanını seçin",
      significantBadge: "Önemli",
      procedureLinkedBadge: "Prosedür bağlantılı",
      procedureUnlinkedBadge: "Prosedür gerekli"
    },
    controlRisks: {
      title: "Riskleri kontrol edin",
      description: "Belge kontrolü risk öğeleri.",
      emptyTitle: "Kontrol riski yok",
      emptyDescription: "Bu bölüme başlamak için kontrol risklerini ekleyin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk açıklaması",
      addAction: "Risk öğesi ekle",
      categoryLabel: "Kategori seç",
      riskTypeLabel: "Risk türü",
      likelihoodLabel: "olasılık",
      impactLabel: "Darbe",
      inherentRatingLabel: "Doğal derecelendirme",
      auditAreaLabel: "Denetim alanı",
      auditAreaPlaceholder: "Denetim alanını seçin",
      significantBadge: "Önemli",
      procedureLinkedBadge: "Prosedür bağlantılı",
      procedureUnlinkedBadge: "Prosedür gerekli"
    },
    detectionRisks: {
      title: "Tespit riskleri",
      description: "Belge algılama risk öğeleri.",
      emptyTitle: "Tespit riski yok",
      emptyDescription: "Bu bölüme başlamak için algılama risklerini ekleyin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk açıklaması",
      addAction: "Risk öğesi ekle",
      categoryLabel: "Kategori seç",
      riskTypeLabel: "Risk türü",
      likelihoodLabel: "olasılık",
      impactLabel: "Darbe",
      inherentRatingLabel: "Doğal derecelendirme",
      auditAreaLabel: "Denetim alanı",
      auditAreaPlaceholder: "Denetim alanını seçin",
      significantBadge: "Önemli",
      procedureLinkedBadge: "Prosedür bağlantılı",
      procedureUnlinkedBadge: "Prosedür gerekli"
    },
    fraudRisks: {
      title: "Dolandırıcılık riskleri",
      description: "Dolandırıcılık risk öğelerini belgeleyin.",
      emptyTitle: "Dolandırıcılık riski yok",
      emptyDescription: "Bu bölüme başlamak için dolandırıcılık risklerini ekleyin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk açıklaması",
      addAction: "Risk öğesi ekle",
      categoryLabel: "Kategori seç",
      riskTypeLabel: "Risk türü",
      likelihoodLabel: "olasılık",
      impactLabel: "Darbe",
      inherentRatingLabel: "Doğal derecelendirme",
      auditAreaLabel: "Denetim alanı",
      auditAreaPlaceholder: "Denetim alanını seçin",
      significantBadge: "Önemli",
      procedureLinkedBadge: "Prosedür bağlantılı",
      procedureUnlinkedBadge: "Prosedür gerekli"
    },
    itRisks: {
      title: "BT riskleri",
      description: "BT risk öğelerini belgeleyin.",
      emptyTitle: "BT riski yok",
      emptyDescription: "Bu bölüme başlamak için BT risklerini ekleyin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk açıklaması",
      addAction: "Risk öğesi ekle",
      categoryLabel: "Kategori seç",
      riskTypeLabel: "Risk türü",
      likelihoodLabel: "olasılık",
      impactLabel: "Darbe",
      inherentRatingLabel: "Doğal derecelendirme",
      auditAreaLabel: "Denetim alanı",
      auditAreaPlaceholder: "Denetim alanını seçin",
      significantBadge: "Önemli",
      procedureLinkedBadge: "Prosedür bağlantılı",
      procedureUnlinkedBadge: "Prosedür gerekli"
    },
    complianceRisks: {
      title: "Uyumluluk riskleri",
      description: "Uyumluluk riski öğelerini belgeleyin.",
      emptyTitle: "Uyumluluk riski yok",
      emptyDescription: "Bu bölüme başlamak için uyumluluk risklerini ekleyin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk açıklaması",
      addAction: "Risk öğesi ekle",
      categoryLabel: "Kategori seç",
      riskTypeLabel: "Risk türü",
      likelihoodLabel: "olasılık",
      impactLabel: "Darbe",
      inherentRatingLabel: "Doğal derecelendirme",
      auditAreaLabel: "Denetim alanı",
      auditAreaPlaceholder: "Denetim alanını seçin",
      significantBadge: "Önemli",
      procedureLinkedBadge: "Prosedür bağlantılı",
      procedureUnlinkedBadge: "Prosedür gerekli"
    },
    financialStatementRisks: {
      title: "Finansal tablo riskleri",
      description: "Mali tablo düzeyindeki riskleri belgeleyin.",
      emptyTitle: "Mali tablo riski yok",
      emptyDescription: "Bu bölüme başlamak için mali tablo risklerini ekleyin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk açıklaması",
      addAction: "Risk öğesi ekle",
      categoryLabel: "Kategori seç",
      riskTypeLabel: "Risk türü",
      likelihoodLabel: "olasılık",
      impactLabel: "Darbe",
      inherentRatingLabel: "Doğal derecelendirme",
      auditAreaLabel: "Denetim alanı",
      auditAreaPlaceholder: "Denetim alanını seçin",
      significantBadge: "Önemli",
      procedureLinkedBadge: "Prosedür bağlantılı",
      procedureUnlinkedBadge: "Prosedür gerekli"
    },
    assertionRisks: {
      title: "İddia riskleri",
      description: "İddia düzeyindeki risk öğelerini belgeleyin.",
      emptyTitle: "İddia riski yok",
      emptyDescription: "Bu bölümü başlatmak için iddia risklerini ekleyin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk açıklaması",
      addAction: "Risk öğesi ekle",
      categoryLabel: "Kategori seç",
      riskTypeLabel: "Risk türü",
      likelihoodLabel: "olasılık",
      impactLabel: "Darbe",
      inherentRatingLabel: "Doğal derecelendirme",
      auditAreaLabel: "Denetim alanı",
      auditAreaPlaceholder: "Denetim alanını seçin",
      significantBadge: "Önemli",
      procedureLinkedBadge: "Prosedür bağlantılı",
      procedureUnlinkedBadge: "Prosedür gerekli"
    },
    significantRisks: {
      title: "Önemli riskler",
      description: "Odaklanmış yanıt gerektiren önemli riskleri belgeleyin.",
      emptyTitle: "Önemli risk yok",
      emptyDescription: "Bu bölüme başlamak için önemli riskleri ekleyin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk açıklaması",
      addAction: "Risk öğesi ekle",
      categoryLabel: "Kategori seç",
      riskTypeLabel: "Risk türü",
      likelihoodLabel: "olasılık",
      impactLabel: "Darbe",
      inherentRatingLabel: "Doğal derecelendirme",
      auditAreaLabel: "Denetim alanı",
      auditAreaPlaceholder: "Denetim alanını seçin",
      significantBadge: "Önemli",
      procedureLinkedBadge: "Prosedür bağlantılı",
      procedureUnlinkedBadge: "Prosedür gerekli"
    },
    categories: {
      title: "Risk kategorileri",
      description: "Risk kategorisi tanımlarını yönetin.",
      emptyTitle: "Kategori yok",
      emptyDescription: "Risk öğelerini düzenlemek için kategoriler ekleyin.",
      namePlaceholder: "Kategori adı",
      descriptionPlaceholder: "Kategori açıklaması",
      addAction: "Kategori ekle"
    },
    scoring: {
      title: "Puanlama",
      description: "Risk listesi genelinde puanlama sonuçlarının özeti.",
      emptyTitle: "Puanlama verisi yok",
      emptyDescription: "Risk öğeleri eklendiğinde puanlama göstergeleri görünür.",
      ratedItems: "Derecelendirilen öğeler",
      significant: "Önemli",
      likelihood: "Yüksek olasılık",
      impact: "Yüksek etki",
      residual: "Önemli kalıntı"
    },
    heatmap: {
      title: "Isı haritası",
      description: "Kayıt genelinde risk derecelendirmesi dağılımı.",
      emptyTitle: "Isı haritası verisi yok",
      emptyDescription: "Derecelendirmeler kaydedildiğinde ısı haritası grupları görünür.",
      unratedLabel: "Derecelendirilmemiş",
      accountLabel: "Hesap",
      assertionLabel: "İddia",
      ratingLabel: "Derecelendirme",
      significantLabel: "Önemli risk",
      emptyDetail: "Ayrıntıları görüntülemek için bir ısı haritası hücresi seçin.",
      filterSignificant: "Yalnızca önemli ve derecelendirilmiş hücreleri göster"
    },
    matrix: {
      title: "İddia matrisi",
      description: "İddia derecelendirmelerini hesaba göre yönetin.",
      emptyTitle: "İddia derecelendirmesi yok",
      emptyDescription: "Matrisin doldurulması için iddia derecelendirmeleri ekleyin.",
      accountPlaceholder: "Hesap adı",
      addAction: "Onay derecelendirmesi ekle",
      accountLabel: "Hesap",
      assertionLabel: "İddia",
      ratingLabel: "Derecelendirme",
      significantLabel: "Önemli risk",
      emptyDetail: "Derecelendirmeleri görüntülemek veya güncellemek için bir matris hücresi seçin.",
      selectRating: "Derecelendirmeyi seçin"
    },
    responses: {
      title: "Yanıtlar",
      description: "Tanımlanan risk öğelerine yönelik yanıtları belgeleyin.",
      emptyTitle: "Yanıt yok",
      emptyDescription: "Planlanan eylemleri yakalamak için risk yanıtlarını ekleyin.",
      riskItemLabel: "Risk öğesini seçin",
      descriptionPlaceholder: "Yanıt açıklaması",
      addAction: "Yanıt ekle"
    },
    procedures: {
      title: "Prosedürler",
      description: "Planlanan prosedürleri risk öğelerine bağlayın.",
      emptyTitle: "Bağlantılı prosedür yok",
      emptyDescription: "Harita yanıtı yürütmesine prosedür bağlantıları ekleyin.",
      riskItemLabel: "Risk öğesini seçin",
      referencePlaceholder: "Prosedür referansı",
      addAction: "Prosedür bağlantısı ekle"
    },
    owners: {
      title: "Sahipler",
      description: "Sahipleri risk kaydı öğelerine atayın.",
      emptyTitle: "Riskli öğe yok",
      emptyDescription: "Risk öğeleri oluşturulduktan sonra burada görünecektir.",
      ownerPlaceholder: "Sahip tanımlayıcı",
      updateAction: "Sahibi güncelle",
      unassignedLabel: "Atanmamış"
    },
    reviewNotes: {
      title: "Notları inceleyin",
      description: "Gözden geçirenlerin notlarını ve takip noktalarını yakalayın.",
      emptyTitle: "İnceleme notu yok",
      emptyDescription: "İnceleme notları inceleme döngüleri sırasında görünür.",
      bodyPlaceholder: "İnceleme notu ekle",
      addAction: "Not ekle"
    },
    comments: {
      title: "Yorumlar",
      description: "Risklerle ilgili dahili yorumları yakalayın.",
      emptyTitle: "Yorum yok",
      emptyDescription: "Yorumlar eklendikten sonra burada görünür.",
      bodyPlaceholder: "Dahili yorum ekle",
      addAction: "Yorum ekle"
    },
    history: {
      title: "Tarih",
      description: "Risk değerlendirme faaliyetinin salt okunur zaman çizelgesi.",
      emptyTitle: "Risk faaliyeti yok",
      emptyDescription: "Değişiklikler kaydedildikçe risk etkinliği burada görünecektir.",
      versionLabel: "Değerlendirme sürümü",
      updatedLabel: "Güncellendi",
      actions: {
        "risk_assessment.created": "Risk değerlendirmesi oluşturuldu",
        "risk_assessment.updated": "Risk değerlendirmesi güncellendi",
        "risk_assessment.archived": "Risk değerlendirmesi arşivlendi",
        "risk_assessment.restored": "Risk değerlendirmesi geri yüklendi",
        "risk_assessment.submitted": "Risk değerlendirmesi gönderildi",
        "risk_assessment.returned": "Risk değerlendirmesi geri döndü",
        "risk_assessment.approved": "Risk değerlendirmesi onaylandı",
        "risk_assessment.category.added": "Kategori eklendi",
        "risk_assessment.risk_item.added": "Risk öğesi eklendi",
        "risk_assessment.risk_item.updated": "Risk öğesi güncellendi",
        "risk_assessment.assertion_rating.updated": "Onay derecelendirmesi güncellendi",
        "risk_assessment.response.added": "Yanıt eklendi",
        "risk_assessment.procedure.linked": "Prosedür bağlantılı",
        "risk_assessment.note.added": "Not eklendi",
        "risk_assessment.significant.acknowledged": "Önemli riskler kabul edildi"
      }
    },
    settings: {
      title: "Ayarlar",
      description: "Bu risk değerlendirmesini arşivleyin veya geri yükleyin.",
      archiveAction: "Arşiv risk değerlendirmesi",
      archiveConfirmAction: "Arşivi onayla",
      restoreAction: "Risk değerlendirmesini geri yükleyin",
      restoreConfirmAction: "Geri yüklemeyi onayla",
      cancelAction: "İptal etmek",
      archivedBanner: "Bu risk değerlendirmesi arşivlendi.",
      readOnlyNotice: "Risk değerlendirmesi ayarlarına salt görüntüleme erişiminiz vardır."
    }
  },
};
