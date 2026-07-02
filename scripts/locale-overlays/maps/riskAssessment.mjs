/** @type {Record<'az'|'ru'|'tr', object>} */
export const riskAssessment = {
  az: {
    notFoundTitle: "Risk qiymətləndirməsi tapılmadı",
    notFoundDescription: "İstədiyiniz risk qiymətləndirməsi bu tapşırıq üçün tapılmadı.",
    forbiddenTitle: "İcazə tələb olunur",
    forbiddenDescription: "Bu bölməyə daxil olmaq üçün risk qiymətləndirməsi icazəsi lazımdır.",
    noWorkspaceTitle: "İş sahəsi tələb olunur",
    noWorkspaceDescription: "Risk qiymətləndirməsinə keçməzdən əvvəl iş sahəsi seçin.",
    statuses: {
      not_started: "Başlanmayıb",
      in_progress: "Davam edir",
      submitted: "Təqdim olunub",
      under_review: "Yoxlama altında",
      approved: "Təsdiqlənib",
      archived: "Arxivlənib"
    },
    riskTypes: {
      inherent: "Təbii risk",
      control: "Nəzarət riski",
      detection: "Aşkarlama riski",
      fraud: "Fırıldaq riski",
      it: "IT riski",
      compliance: "Uyğunluq riski",
      financial_statement: "Maliyyə hesabatı riski",
      assertion: "İddia riski",
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
      accept: "Qəbul et",
      reduce: "Azalt",
      transfer: "Ötür",
      avoid: "Qaçın",
      substantive_procedures: "Substantiv prosedurlar",
      test_of_controls: "Nəzarətlərin sınağı"
    },
    assertions: {
      existence: "Mövcudluq",
      completeness: "Tamlıq",
      accuracy: "Dəqiqlik",
      cutoff: "Kəsilmə tarixi",
      classification: "Təsnifat",
      presentation: "Təqdimat"
    },
    noteTypes: {
      review: "Yoxlama qeydi",
      internal: "Daxili qeyd"
    },
    actions: {
      add: "Əlavə et",
      update: "Yenilə",
      archive: "Arxivlə",
      restore: "Bərpa et",
      submit: "Təqdim et",
      approve: "Təsdiqlə",
      return: "Qaytar"
    },
    workflow: {
      title: "Risk iş axını",
      description: "Risk qiymətləndirməsini təqdim et, qaytar və təsdiqlə.",
      submitAction: "Yoxlamaya təqdim et",
      returnAction: "Düzəliş üçün qaytar",
      returnConfirmAction: "Qaytarmanı təsdiqlə",
      approveAction: "Risk qiymətləndirməsini təsdiqlə",
      acknowledgeAction: "Əhəmiyyətli riskləri təsdiqlə",
      cancelAction: "Ləğv et",
      returnNotesLabel: "Qaytarma qeydi",
      returnNotesPlaceholder: "Yenidən təqdimatdan əvvəl nəyi düzəltmək lazım olduğunu yazın.",
      readOnlyNotice: "Bu risk qiymətləndirməsi arxivdədir və yalnız oxunur.",
      submittedNotice: "Bu risk qiymətləndirməsi təqdim olunub və yoxlama gözləyir.",
      approvedNotice: "Bu risk qiymətləndirməsi təsdiqlənib.",
      acknowledgedNotice: "Əhəmiyyətli risklər təsdiqlənib.",
      pendingAcknowledgmentNotice: "Təsdiqdən əvvəl əhəmiyyətli risklər təsdiqlənməlidir.",
      errorGeneric: "Risk iş axını əməliyyatını tamamlamaq mümkün olmadı."
    },
    empty: {
      title: "Risk qiymətləndirməsi başlanmayıb",
      description: "Əhəmiyyətli riskləri, cavabları və yoxlama hazırlığını sənədləşdirmək üçün risk qiymətləndirməsi yaradın.",
      createAction: "Risk qiymətləndirməsi yarat",
      creating: "Risk qiymətləndirməsi yaradılır...",
      forbiddenDescription: "Bu bölməni başlatmaq üçün risk qiymətləndirməsi yaratma icazəsi lazımdır."
    },
    workspace: {
      title: "Risk qiymətləndirməsinə icmal",
      description: "Cari risk qiymətləndirməsi statusu və əsas göstəricilərin icmalı.",
      statusTitle: "Status icmalı",
      statusDescription: "Bu risk qiymətləndirməsi üçün cari tamamlanma və hazırlıq göstəriciləri.",
      progress: "Ümumi irəliləyiş",
      workflowTitle: "İş axını",
      workflowDescription: "Risk qiymətləndirməsi üçün təqdimat və təsdiq iş axını.",
      heatmapPreviewTitle: "İstilik xəritəsinə ön baxış",
      heatmapPreviewDescription: "Cari qiymətləndirmə nəticələrinə görə risk reytinqlərinin paylanması.",
      heroEyebrow: "Risk qiymətləndirməsi",
      breadcrumbRiskAssessment: "Risk qiymətləndirməsi",
      backToEngagement: "Tapşırığa qayıt",
      planningGateTitle: "Planlaşdırma təsdiqi tələb olunur",
      planningGateDescription: "Risk qiymətləndirməsinə başlamazdan əvvəl audit planlaşdırması təsdiqlənməlidir.",
      navAriaLabel: "Risk qiymətləndirməsi bölmələri",
      navOverview: "Panel",
      navInherentRisks: "Təbii risklər",
      navControlRisks: "Nəzarət riskləri",
      navDetectionRisks: "Aşkarlama riskləri",
      navFraudRisks: "Fırıldaq riskləri",
      navItRisks: "IT riskləri",
      navComplianceRisks: "Uyğunluq riskləri",
      navFinancialStatementRisks: "Maliyyə hesabatı riskləri",
      navAssertionRisks: "İddia riskləri",
      navSignificantRisks: "Əhəmiyyətli risklər",
      navCategories: "Kateqoriyalar",
      navScoring: "Qiymətləndirmə",
      navHeatmap: "İstilik xəritəsi",
      navMatrix: "Matris",
      navResponses: "Cavablar",
      navProcedures: "Prosedurlar",
      navOwners: "Məsul şəxslər",
      navReviewNotes: "Yoxlama qeydləri",
      navComments: "Şərhlər",
      navHistory: "Tarixçə",
      navSettings: "Parametrlər",
      loading: "Risk qiymətləndirməsi iş sahəsi yüklənir",
      errorTitle: "Risk qiymətləndirməsi iş sahəsi yüklənə bilmədi",
      errorDescription: "Bu risk qiymətləndirməsi yüklənərkən xəta baş verdi.",
      archivedTitle: "Risk qiymətləndirməsi arxivləndi",
      archivedDescription: "Bu risk qiymətləndirməsi yalnız oxunur. Yeniləməyə davam etmək üçün bərpa edin.",
      summaryStatus: "Risk statusu",
      summaryVersion: "Qiymətləndirmə versiyası",
      summaryProgress: "Ümumi irəliləyiş",
      summarySignificant: "Əhəmiyyətli risklər",
      summaryPendingReview: "Yoxlama gözləyir",
      summaryOpenItems: "Açıq maddələr",
      sections: {
        overview: {
          title: "Risk paneli",
          description: "Status, irəliləyiş və yoxlama hazırlığı göstəriciləri."
        },
        "inherent-risks": {
          title: "Təbii risklər",
          description: "Əlaqəli nəzarətlər nəzərə alınmazdan əvvəlki risklər."
        },
        "control-risks": {
          title: "Nəzarət riskləri",
          description: "Nəzarətlərin dizaynı və fəaliyyəti ilə bağlı risklər."
        },
        "detection-risks": {
          title: "Aşkarlama riskləri",
          description: "Prosedurların səhvləri aşkar edə bilməməsi riskləri."
        },
        "fraud-risks": {
          title: "Fırıldaq riskləri",
          description: "Fırıldaq risk amilləri və rəhbərliyin nəzarəti üstündən keçməsi."
        },
        "it-risks": {
          title: "IT riskləri",
          description: "Texnologiya, sistem girişi və məlumat bütövlüyü riskləri."
        },
        "compliance-risks": {
          title: "Uyğunluq riskləri",
          description: "Normativ və hüquqi uyğunluq riskləri."
        },
        "financial-statement-risks": {
          title: "Maliyyə hesabatı riskləri",
          description: "Maliyyə hesabatı səviyyəsində əhəmiyyətli səhv riskləri."
        },
        "assertion-risks": {
          title: "İddia riskləri",
          description: "Müvafiq hesablara bağlı iddia səviyyəli risklər."
        },
        "significant-risks": {
          title: "Əhəmiyyətli risklər",
          description: "Mərkəzləşdirilmiş audit cavabı tələb edən yüksək prioritetli risklər."
        },
        categories: {
          title: "Risk kateqoriyaları",
          description: "Risk maddələrini təşkil etmək üçün konfiqurasiya edilmiş kateqoriyalar."
        },
        scoring: {
          title: "Qiymətləndirmə",
          description: "Müəyyən edilmiş risklər üzrə yığılmış qiymətləndirmə göstəriciləri."
        },
        heatmap: {
          title: "İstilik xəritəsi",
          description: "Risk reytinqlərinin vizual paylanması."
        },
        matrix: {
          title: "İddia matrisi",
          description: "Hesab və iddia reytinqlərinin icmalı."
        },
        responses: {
          title: "Risk cavabları",
          description: "Müəyyən edilmiş risklər üçün planlaşdırılmış cavablar."
        },
        procedures: {
          title: "Prosedur bağlantıları",
          description: "Qiymətləndirilmiş risklərə cavab vermək üçün bağlı prosedurlar."
        },
        owners: {
          title: "Risk məsul şəxsləri",
          description: "Hər risk maddəsi üçün təyin edilmiş məsul şəxslər."
        },
        "review-notes": {
          title: "Yoxlama qeydləri",
          description: "Risk qiymətləndirməsi dövrələrində qeydə alınan yoxlayıcı qeydləri."
        },
        comments: {
          title: "Şərhlər",
          description: "Daxili şərhlər və əməkdaşlıq qeydləri."
        },
        history: {
          title: "Tarixçə",
          description: "Risk qiymətləndirməsi dəyişiklikləri və təsdiqlərinin xronologiyası."
        },
        settings: {
          title: "Parametrlər",
          description: "Bu risk qiymətləndirməsi üçün arxivləmə və bərpa idarəetməsi."
        }
      }
    },
    inherentRisks: {
      title: "Təbii risklər",
      description: "Təbii risk maddələrini sənədləşdirin.",
      emptyTitle: "Təbii risk yoxdur",
      emptyDescription: "Reyestri başlatmaq üçün təbii risklər əlavə edin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk təsviri",
      addAction: "Risk maddəsi əlavə et",
      categoryLabel: "Kateqoriya seçin",
      riskTypeLabel: "Risk növü",
      likelihoodLabel: "Ehtimal",
      impactLabel: "Təsir",
      inherentRatingLabel: "Təbii reytinq",
      auditAreaLabel: "Audit sahəsi",
      auditAreaPlaceholder: "Audit sahəsini seçin",
      significantBadge: "Əhəmiyyətli",
      procedureLinkedBadge: "Prosedur bağlıdır",
      procedureUnlinkedBadge: "Prosedur tələb olunur"
    },
    controlRisks: {
      title: "Nəzarət riskləri",
      description: "Nəzarət riski maddələrini sənədləşdirin.",
      emptyTitle: "Nəzarət riski yoxdur",
      emptyDescription: "Bu bölməni başlatmaq üçün nəzarət riskləri əlavə edin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk təsviri",
      addAction: "Risk maddəsi əlavə et",
      categoryLabel: "Kateqoriya seçin",
      riskTypeLabel: "Risk növü",
      likelihoodLabel: "Ehtimal",
      impactLabel: "Təsir",
      inherentRatingLabel: "Təbii reytinq",
      auditAreaLabel: "Audit sahəsi",
      auditAreaPlaceholder: "Audit sahəsini seçin",
      significantBadge: "Əhəmiyyətli",
      procedureLinkedBadge: "Prosedur bağlıdır",
      procedureUnlinkedBadge: "Prosedur tələb olunur"
    },
    detectionRisks: {
      title: "Aşkarlama riskləri",
      description: "Aşkarlama riski maddələrini sənədləşdirin.",
      emptyTitle: "Aşkarlama riski yoxdur",
      emptyDescription: "Bu bölməni başlatmaq üçün aşkarlama riskləri əlavə edin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk təsviri",
      addAction: "Risk maddəsi əlavə et",
      categoryLabel: "Kateqoriya seçin",
      riskTypeLabel: "Risk növü",
      likelihoodLabel: "Ehtimal",
      impactLabel: "Təsir",
      inherentRatingLabel: "Təbii reytinq",
      auditAreaLabel: "Audit sahəsi",
      auditAreaPlaceholder: "Audit sahəsini seçin",
      significantBadge: "Əhəmiyyətli",
      procedureLinkedBadge: "Prosedur bağlıdır",
      procedureUnlinkedBadge: "Prosedur tələb olunur"
    },
    fraudRisks: {
      title: "Fırıldaq riskləri",
      description: "Fırıldaq riski maddələrini sənədləşdirin.",
      emptyTitle: "Fırıldaq riski yoxdur",
      emptyDescription: "Bu bölməni başlatmaq üçün fırıldaq riskləri əlavə edin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk təsviri",
      addAction: "Risk maddəsi əlavə et",
      categoryLabel: "Kateqoriya seçin",
      riskTypeLabel: "Risk növü",
      likelihoodLabel: "Ehtimal",
      impactLabel: "Təsir",
      inherentRatingLabel: "Təbii reytinq",
      auditAreaLabel: "Audit sahəsi",
      auditAreaPlaceholder: "Audit sahəsini seçin",
      significantBadge: "Əhəmiyyətli",
      procedureLinkedBadge: "Prosedur bağlıdır",
      procedureUnlinkedBadge: "Prosedur tələb olunur"
    },
    itRisks: {
      title: "IT riskləri",
      description: "IT riski maddələrini sənədləşdirin.",
      emptyTitle: "IT riski yoxdur",
      emptyDescription: "Bu bölməni başlatmaq üçün IT riskləri əlavə edin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk təsviri",
      addAction: "Risk maddəsi əlavə et",
      categoryLabel: "Kateqoriya seçin",
      riskTypeLabel: "Risk növü",
      likelihoodLabel: "Ehtimal",
      impactLabel: "Təsir",
      inherentRatingLabel: "Təbii reytinq",
      auditAreaLabel: "Audit sahəsi",
      auditAreaPlaceholder: "Audit sahəsini seçin",
      significantBadge: "Əhəmiyyətli",
      procedureLinkedBadge: "Prosedur bağlıdır",
      procedureUnlinkedBadge: "Prosedur tələb olunur"
    },
    complianceRisks: {
      title: "Uyğunluq riskləri",
      description: "Uyğunluq riski maddələrini sənədləşdirin.",
      emptyTitle: "Uyğunluq riski yoxdur",
      emptyDescription: "Bu bölməni başlatmaq üçün uyğunluq riskləri əlavə edin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk təsviri",
      addAction: "Risk maddəsi əlavə et",
      categoryLabel: "Kateqoriya seçin",
      riskTypeLabel: "Risk növü",
      likelihoodLabel: "Ehtimal",
      impactLabel: "Təsir",
      inherentRatingLabel: "Təbii reytinq",
      auditAreaLabel: "Audit sahəsi",
      auditAreaPlaceholder: "Audit sahəsini seçin",
      significantBadge: "Əhəmiyyətli",
      procedureLinkedBadge: "Prosedur bağlıdır",
      procedureUnlinkedBadge: "Prosedur tələb olunur"
    },
    financialStatementRisks: {
      title: "Maliyyə hesabatı riskləri",
      description: "Maliyyə hesabatı səviyyəsində riskləri sənədləşdirin.",
      emptyTitle: "Maliyyə hesabatı riski yoxdur",
      emptyDescription: "Bu bölməni başlatmaq üçün maliyyə hesabatı riskləri əlavə edin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk təsviri",
      addAction: "Risk maddəsi əlavə et",
      categoryLabel: "Kateqoriya seçin",
      riskTypeLabel: "Risk növü",
      likelihoodLabel: "Ehtimal",
      impactLabel: "Təsir",
      inherentRatingLabel: "Təbii reytinq",
      auditAreaLabel: "Audit sahəsi",
      auditAreaPlaceholder: "Audit sahəsini seçin",
      significantBadge: "Əhəmiyyətli",
      procedureLinkedBadge: "Prosedur bağlıdır",
      procedureUnlinkedBadge: "Prosedur tələb olunur"
    },
    assertionRisks: {
      title: "İddia riskləri",
      description: "İddia səviyyəli risk maddələrini sənədləşdirin.",
      emptyTitle: "İddia riski yoxdur",
      emptyDescription: "Bu bölməni başlatmaq üçün iddia riskləri əlavə edin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk təsviri",
      addAction: "Risk maddəsi əlavə et",
      categoryLabel: "Kateqoriya seçin",
      riskTypeLabel: "Risk növü",
      likelihoodLabel: "Ehtimal",
      impactLabel: "Təsir",
      inherentRatingLabel: "Təbii reytinq",
      auditAreaLabel: "Audit sahəsi",
      auditAreaPlaceholder: "Audit sahəsini seçin",
      significantBadge: "Əhəmiyyətli",
      procedureLinkedBadge: "Prosedur bağlıdır",
      procedureUnlinkedBadge: "Prosedur tələb olunur"
    },
    significantRisks: {
      title: "Əhəmiyyətli risklər",
      description: "Mərkəzləşdirilmiş cavab tələb edən əhəmiyyətli riskləri sənədləşdirin.",
      emptyTitle: "Əhəmiyyətli risk yoxdur",
      emptyDescription: "Bu bölməni başlatmaq üçün əhəmiyyətli risklər əlavə edin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk təsviri",
      addAction: "Risk maddəsi əlavə et",
      categoryLabel: "Kateqoriya seçin",
      riskTypeLabel: "Risk növü",
      likelihoodLabel: "Ehtimal",
      impactLabel: "Təsir",
      inherentRatingLabel: "Təbii reytinq",
      auditAreaLabel: "Audit sahəsi",
      auditAreaPlaceholder: "Audit sahəsini seçin",
      significantBadge: "Əhəmiyyətli",
      procedureLinkedBadge: "Prosedur bağlıdır",
      procedureUnlinkedBadge: "Prosedur tələb olunur"
    },
    categories: {
      title: "Risk kateqoriyaları",
      description: "Risk kateqoriyası təriflərini idarə edin.",
      emptyTitle: "Kateqoriya yoxdur",
      emptyDescription: "Risk maddələrini təşkil etmək üçün kateqoriyalar əlavə edin.",
      namePlaceholder: "Kateqoriya adı",
      descriptionPlaceholder: "Kateqoriya təsviri",
      addAction: "Kateqoriya əlavə et"
    },
    scoring: {
      title: "Qiymətləndirmə",
      description: "Risk reyestri üzrə qiymətləndirmə nəticələrinin icmalı.",
      emptyTitle: "Qiymətləndirmə məlumatı yoxdur",
      emptyDescription: "Risk maddələri əlavə edildikdə qiymətləndirmə göstəriciləri görünür.",
      ratedItems: "Qiymətləndirilmiş maddələr",
      significant: "Əhəmiyyətli",
      likelihood: "Yüksək ehtimal",
      impact: "Yüksək təsir",
      residual: "Əhəmiyyətli qalıq"
    },
    heatmap: {
      title: "İstilik xəritəsi",
      description: "Reyestr üzrə risk reytinqlərinin paylanması.",
      emptyTitle: "İstilik xəritəsi məlumatı yoxdur",
      emptyDescription: "Reytinqlər qeydə alındıqda istilik xəritəsi xanaları görünür.",
      unratedLabel: "Qiymətləndirilməyib",
      accountLabel: "Hesab",
      assertionLabel: "İddia",
      ratingLabel: "Reytinq",
      significantLabel: "Əhəmiyyətli risk",
      emptyDetail: "Təfərrüatları görmək üçün istilik xəritəsi xanasını seçin.",
      filterSignificant: "Yalnız əhəmiyyətli və qiymətləndirilmiş xanaları göstər"
    },
    matrix: {
      title: "İddia matrisi",
      description: "Hesab üzrə iddia reytinqlərini idarə edin.",
      emptyTitle: "İddia reytinqi yoxdur",
      emptyDescription: "Matrisi doldurmaq üçün iddia reytinqləri əlavə edin.",
      accountPlaceholder: "Hesab adı",
      addAction: "İddia reytinqi əlavə et",
      accountLabel: "Hesab",
      assertionLabel: "İddia",
      ratingLabel: "Reytinq",
      significantLabel: "Əhəmiyyətli risk",
      emptyDetail: "Reytinqləri görmək və ya yeniləmək üçün matris xanasını seçin.",
      selectRating: "Reytinq seçin"
    },
    responses: {
      title: "Cavablar",
      description: "Müəyyən edilmiş risk maddələri üçün cavabları sənədləşdirin.",
      emptyTitle: "Cavab yoxdur",
      emptyDescription: "Planlaşdırılmış tədbirləri qeydə almaq üçün risk cavabları əlavə edin.",
      riskItemLabel: "Risk maddəsini seçin",
      descriptionPlaceholder: "Cavab təsviri",
      addAction: "Cavab əlavə et"
    },
    procedures: {
      title: "Prosedurlar",
      description: "Planlaşdırılmış prosedurları risk maddələrinə bağlayın.",
      emptyTitle: "Bağlı prosedur yoxdur",
      emptyDescription: "Cavab icrasını xəritələmək üçün prosedur bağlantıları əlavə edin.",
      riskItemLabel: "Risk maddəsini seçin",
      referencePlaceholder: "Prosedur istinadı",
      addAction: "Prosedur bağlantısı əlavə et"
    },
    owners: {
      title: "Məsul şəxslər",
      description: "Risk reyestri maddələrinə məsul şəxslər təyin edin.",
      emptyTitle: "Risk maddəsi yoxdur",
      emptyDescription: "Risk maddələri yaradıldıqdan sonra burada görünəcək.",
      ownerPlaceholder: "Məsul şəxs identifikatoru",
      updateAction: "Məsul şəxsi yenilə",
      unassignedLabel: "Təyin edilməyib"
    },
    reviewNotes: {
      title: "Yoxlama qeydləri",
      description: "Yoxlayıcı qeydlərini və izləmə məqamlarını qeydə alın.",
      emptyTitle: "Yoxlama qeydi yoxdur",
      emptyDescription: "Yoxlama qeydləri yoxlama dövrələrində görünür.",
      bodyPlaceholder: "Yoxlama qeydi əlavə et",
      addAction: "Qeyd əlavə et"
    },
    comments: {
      title: "Şərhlər",
      description: "Risklərlə bağlı daxili şərhləri qeydə alın.",
      emptyTitle: "Şərh yoxdur",
      emptyDescription: "Şərhlər əlavə edildikdən sonra burada görünür.",
      bodyPlaceholder: "Daxili şərh əlavə et",
      addAction: "Şərh əlavə et"
    },
    history: {
      title: "Tarixçə",
      description: "Risk qiymətləndirməsi fəaliyyətinin yalnız oxunan xronologiyası.",
      emptyTitle: "Risk fəaliyyəti yoxdur",
      emptyDescription: "Dəyişikliklər qeydə alındıqca risk fəaliyyəti burada görünəcək.",
      versionLabel: "Qiymətləndirmə versiyası",
      updatedLabel: "Yenilənib",
      actions: {
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
    settings: {
      title: "Parametrlər",
      description: "Bu risk qiymətləndirməsini arxivləyin və ya bərpa edin.",
      archiveAction: "Risk qiymətləndirməsini arxivlə",
      archiveConfirmAction: "Arxivləməni təsdiqlə",
      restoreAction: "Risk qiymətləndirməsini bərpa et",
      restoreConfirmAction: "Bərpanı təsdiqlə",
      cancelAction: "Ləğv et",
      archivedBanner: "Bu risk qiymətləndirməsi arxivlənib.",
      readOnlyNotice: "Risk qiymətləndirməsi parametrlərinə yalnız baxış icazəniz var."
    }
  },
  ru: {
    notFoundTitle: "Оценка рисков не найдена",
    notFoundDescription: "Запрошенное пространство оценки рисков для этого задания не найдено.",
    forbiddenTitle: "Требуется разрешение",
    forbiddenDescription: "Для доступа к этому разделу требуется разрешение на оценку рисков.",
    noWorkspaceTitle: "Требуется рабочее пространство",
    noWorkspaceDescription: "Выберите рабочее пространство перед открытием оценки рисков.",
    statuses: {
      not_started: "Не начато",
      in_progress: "В процессе",
      submitted: "Отправлено",
      under_review: "На проверке",
      approved: "Утверждено",
      archived: "В архиве"
    },
    riskTypes: {
      inherent: "Неотъемлемый риск",
      control: "Риск контроля",
      detection: "Риск необнаружения",
      fraud: "Риск мошенничества",
      it: "ИТ-риск",
      compliance: "Риск соответствия",
      financial_statement: "Риск финансовой отчётности",
      assertion: "Риск предпосылки",
      significant: "Значимый риск"
    },
    ratingLevels: {
      low: "Низкий",
      moderate: "Умеренный",
      high: "Высокий",
      significant: "Значимый"
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
      accept: "Принять",
      reduce: "Снизить",
      transfer: "Передать",
      avoid: "Избежать",
      substantive_procedures: "Существенные процедуры",
      test_of_controls: "Тестирование средств контроля"
    },
    assertions: {
      existence: "Существование",
      completeness: "Полнота",
      accuracy: "Точность",
      cutoff: "Отсечение",
      classification: "Классификация",
      presentation: "Представление"
    },
    noteTypes: {
      review: "Заметка проверки",
      internal: "Внутренняя заметка"
    },
    actions: {
      add: "Добавить",
      update: "Обновить",
      archive: "Архивировать",
      restore: "Восстановить",
      submit: "Отправить",
      approve: "Утвердить",
      return: "Вернуть"
    },
    workflow: {
      title: "Рабочий процесс рисков",
      description: "Отправка, возврат и утверждение документации оценки рисков.",
      submitAction: "Отправить на проверку",
      returnAction: "Вернуть на доработку",
      returnConfirmAction: "Подтвердить возврат",
      approveAction: "Утвердить оценку рисков",
      acknowledgeAction: "Подтвердить значимые риски",
      cancelAction: "Отмена",
      returnNotesLabel: "Примечание при возврате",
      returnNotesPlaceholder: "Опишите, что нужно исправить перед повторной отправкой.",
      readOnlyNotice: "Эта оценка рисков архивирована и доступна только для чтения.",
      submittedNotice: "Эта оценка рисков отправлена и ожидает проверки.",
      approvedNotice: "Эта оценка рисков утверждена.",
      acknowledgedNotice: "Значимые риски подтверждены.",
      pendingAcknowledgmentNotice: "Перед утверждением необходимо подтвердить значимые риски.",
      errorGeneric: "Не удалось выполнить действие рабочего процесса оценки рисков."
    },
    empty: {
      title: "Оценка рисков не инициирована",
      description: "Создайте оценку рисков для документирования значимых рисков, ответных мер и готовности к проверке.",
      createAction: "Создать оценку рисков",
      creating: "Создание оценки рисков...",
      forbiddenDescription: "Для инициации этого раздела требуется разрешение на создание оценки рисков."
    },
    workspace: {
      title: "Обзор оценки рисков",
      description: "Обзор текущего статуса оценки рисков и ключевых показателей.",
      statusTitle: "Сводка по статусу",
      statusDescription: "Текущие показатели завершённости и готовности для этой оценки рисков.",
      progress: "Общий прогресс",
      workflowTitle: "Рабочий процесс",
      workflowDescription: "Рабочий процесс отправки и утверждения оценки рисков.",
      heatmapPreviewTitle: "Предпросмотр тепловой карты",
      heatmapPreviewDescription: "Распределение рейтингов рисков по текущим результатам оценки.",
      heroEyebrow: "Оценка рисков",
      breadcrumbRiskAssessment: "Оценка рисков",
      backToEngagement: "Назад к заданию",
      planningGateTitle: "Требуется утверждение планирования",
      planningGateDescription: "Планирование аудита должно быть утверждено до начала оценки рисков.",
      navAriaLabel: "Разделы рабочей области оценки рисков",
      navOverview: "Панель",
      navInherentRisks: "Неотъемлемые риски",
      navControlRisks: "Риски контроля",
      navDetectionRisks: "Риски необнаружения",
      navFraudRisks: "Риски мошенничества",
      navItRisks: "ИТ-риски",
      navComplianceRisks: "Риски соответствия",
      navFinancialStatementRisks: "Риски финансовой отчетности",
      navAssertionRisks: "Риски предпосылок",
      navSignificantRisks: "Значимые риски",
      navCategories: "Категории",
      navScoring: "Оценка",
      navHeatmap: "Тепловая карта",
      navMatrix: "Матрица",
      navResponses: "Ответные меры",
      navProcedures: "Процедуры",
      navOwners: "Ответственные",
      navReviewNotes: "Заметки проверки",
      navComments: "Комментарии",
      navHistory: "История",
      navSettings: "Настройки",
      loading: "Загрузка рабочей области оценки рисков",
      errorTitle: "Не удалось загрузить рабочую область оценки рисков",
      errorDescription: "При загрузке этой оценки рисков произошла ошибка.",
      archivedTitle: "Оценка рисков архивирована",
      archivedDescription: "Эта оценка рисков доступна только для чтения. Восстановите её, чтобы продолжить обновления.",
      summaryStatus: "Статус рисков",
      summaryVersion: "Версия оценки",
      summaryProgress: "Общий прогресс",
      summarySignificant: "Значимые риски",
      summaryPendingReview: "Ожидает проверки",
      summaryOpenItems: "Открытые элементы",
      sections: {
        overview: {
          title: "Панель рисков",
          description: "Показатели статуса, прогресса и готовности к проверке."
        },
        "inherent-risks": {
          title: "Неотъемлемые риски",
          description: "Риски до учёта связанных средств контроля."
        },
        "control-risks": {
          title: "Риски контроля",
          description: "Риски, связанные с проектированием и функционированием средств контроля."
        },
        "detection-risks": {
          title: "Риски необнаружения",
          description: "Риски того, что процедуры не обнаружат искажения."
        },
        "fraud-risks": {
          title: "Риски мошенничества",
          description: "Факторы риска мошенничества и обход управления."
        },
        "it-risks": {
          title: "ИТ-риски",
          description: "Риски технологий, доступа к системам и целостности данных."
        },
        "compliance-risks": {
          title: "Риски соответствия",
          description: "Регуляторные и правовые риски соответствия."
        },
        "financial-statement-risks": {
          title: "Риски финансовой отчётности",
          description: "Риски существенного искажения на уровне финансовой отчётности."
        },
        "assertion-risks": {
          title: "Риски предпосылок",
          description: "Риски на уровне предпосылок, связанные с соответствующими счетами."
        },
        "significant-risks": {
          title: "Значимые риски",
          description: "Риски высокого приоритета, требующие целенаправленного аудиторского реагирования."
        },
        categories: {
          title: "Категории рисков",
          description: "Настроенные категории для организации элементов риска."
        },
        scoring: {
          title: "Оценка",
          description: "Сводные показатели оценки по выявленным рискам."
        },
        heatmap: {
          title: "Тепловая карта",
          description: "Визуальное распределение рейтингов рисков."
        },
        matrix: {
          title: "Матрица предпосылок",
          description: "Обзор рейтингов счетов и предпосылок."
        },
        responses: {
          title: "Ответные меры на риски",
          description: "Запланированные ответные меры на выявленные риски."
        },
        procedures: {
          title: "Связи с процедурами",
          description: "Связанные процедуры для реагирования на оцененные риски."
        },
        owners: {
          title: "Ответственные за риски",
          description: "Назначенные ответственные для каждого элемента риска."
        },
        "review-notes": {
          title: "Заметки проверки",
          description: "Заметки проверяющего, зафиксированные в циклах оценки рисков."
        },
        comments: {
          title: "Комментарии",
          description: "Внутренние комментарии и заметки для совместной работы."
        },
        history: {
          title: "История",
          description: "Хронология изменений и утверждений оценки рисков."
        },
        settings: {
          title: "Настройки",
          description: "Управление архивированием и восстановлением этой оценки рисков."
        }
      }
    },
    inherentRisks: {
      title: "Неотъемлемые риски",
      description: "Документируйте элементы неотъемлемого риска.",
      emptyTitle: "Неотъемлемых рисков нет",
      emptyDescription: "Добавьте неотъемлемые риски, чтобы начать реестр.",
      titlePlaceholder: "Название риска",
      descriptionPlaceholder: "Описание риска",
      addAction: "Добавить элемент риска",
      categoryLabel: "Выберите категорию",
      riskTypeLabel: "Тип риска",
      likelihoodLabel: "Вероятность",
      impactLabel: "Влияние",
      inherentRatingLabel: "Рейтинг неотъемлемого риска",
      auditAreaLabel: "Область аудита",
      auditAreaPlaceholder: "Выберите область аудита",
      significantBadge: "Существенный",
      procedureLinkedBadge: "Процедура связана",
      procedureUnlinkedBadge: "Требуется процедура"
    },
    controlRisks: {
      title: "Риски контроля",
      description: "Документируйте элементы риска контроля.",
      emptyTitle: "Рисков контроля нет",
      emptyDescription: "Добавьте риски контроля, чтобы начать этот раздел.",
      titlePlaceholder: "Название риска",
      descriptionPlaceholder: "Описание риска",
      addAction: "Добавить элемент риска",
      categoryLabel: "Выберите категорию",
      riskTypeLabel: "Тип риска",
      likelihoodLabel: "Вероятность",
      impactLabel: "Влияние",
      inherentRatingLabel: "Рейтинг неотъемлемого риска",
      auditAreaLabel: "Область аудита",
      auditAreaPlaceholder: "Выберите область аудита",
      significantBadge: "Существенный",
      procedureLinkedBadge: "Процедура связана",
      procedureUnlinkedBadge: "Требуется процедура"
    },
    detectionRisks: {
      title: "Риски необнаружения",
      description: "Документируйте элементы риска необнаружения.",
      emptyTitle: "Рисков необнаружения нет",
      emptyDescription: "Добавьте риски необнаружения, чтобы начать этот раздел.",
      titlePlaceholder: "Название риска",
      descriptionPlaceholder: "Описание риска",
      addAction: "Добавить элемент риска",
      categoryLabel: "Выберите категорию",
      riskTypeLabel: "Тип риска",
      likelihoodLabel: "Вероятность",
      impactLabel: "Влияние",
      inherentRatingLabel: "Рейтинг неотъемлемого риска",
      auditAreaLabel: "Область аудита",
      auditAreaPlaceholder: "Выберите область аудита",
      significantBadge: "Существенный",
      procedureLinkedBadge: "Процедура связана",
      procedureUnlinkedBadge: "Требуется процедура"
    },
    fraudRisks: {
      title: "Риски мошенничества",
      description: "Документируйте элементы риска мошенничества.",
      emptyTitle: "Рисков мошенничества нет",
      emptyDescription: "Добавьте риски мошенничества, чтобы начать этот раздел.",
      titlePlaceholder: "Название риска",
      descriptionPlaceholder: "Описание риска",
      addAction: "Добавить элемент риска",
      categoryLabel: "Выберите категорию",
      riskTypeLabel: "Тип риска",
      likelihoodLabel: "Вероятность",
      impactLabel: "Влияние",
      inherentRatingLabel: "Рейтинг неотъемлемого риска",
      auditAreaLabel: "Область аудита",
      auditAreaPlaceholder: "Выберите область аудита",
      significantBadge: "Существенный",
      procedureLinkedBadge: "Процедура связана",
      procedureUnlinkedBadge: "Требуется процедура"
    },
    itRisks: {
      title: "ИТ-риски",
      description: "Документируйте элементы ИТ-риска.",
      emptyTitle: "ИТ-рисков нет",
      emptyDescription: "Добавьте ИТ-риски, чтобы начать этот раздел.",
      titlePlaceholder: "Название риска",
      descriptionPlaceholder: "Описание риска",
      addAction: "Добавить элемент риска",
      categoryLabel: "Выберите категорию",
      riskTypeLabel: "Тип риска",
      likelihoodLabel: "Вероятность",
      impactLabel: "Влияние",
      inherentRatingLabel: "Рейтинг неотъемлемого риска",
      auditAreaLabel: "Область аудита",
      auditAreaPlaceholder: "Выберите область аудита",
      significantBadge: "Существенный",
      procedureLinkedBadge: "Процедура связана",
      procedureUnlinkedBadge: "Требуется процедура"
    },
    complianceRisks: {
      title: "Риски соответствия",
      description: "Документируйте элементы риска соответствия.",
      emptyTitle: "Рисков соответствия нет",
      emptyDescription: "Добавьте риски соответствия, чтобы начать этот раздел.",
      titlePlaceholder: "Название риска",
      descriptionPlaceholder: "Описание риска",
      addAction: "Добавить элемент риска",
      categoryLabel: "Выберите категорию",
      riskTypeLabel: "Тип риска",
      likelihoodLabel: "Вероятность",
      impactLabel: "Влияние",
      inherentRatingLabel: "Рейтинг неотъемлемого риска",
      auditAreaLabel: "Область аудита",
      auditAreaPlaceholder: "Выберите область аудита",
      significantBadge: "Существенный",
      procedureLinkedBadge: "Процедура связана",
      procedureUnlinkedBadge: "Требуется процедура"
    },
    financialStatementRisks: {
      title: "Риски финансовой отчётности",
      description: "Документируйте риски на уровне финансовой отчётности.",
      emptyTitle: "Рисков финансовой отчётности нет",
      emptyDescription: "Добавьте риски финансовой отчётности, чтобы начать этот раздел.",
      titlePlaceholder: "Название риска",
      descriptionPlaceholder: "Описание риска",
      addAction: "Добавить элемент риска",
      categoryLabel: "Выберите категорию",
      riskTypeLabel: "Тип риска",
      likelihoodLabel: "Вероятность",
      impactLabel: "Влияние",
      inherentRatingLabel: "Рейтинг неотъемлемого риска",
      auditAreaLabel: "Область аудита",
      auditAreaPlaceholder: "Выберите область аудита",
      significantBadge: "Существенный",
      procedureLinkedBadge: "Процедура связана",
      procedureUnlinkedBadge: "Требуется процедура"
    },
    assertionRisks: {
      title: "Риски предпосылок",
      description: "Документируйте элементы риска на уровне предпосылок.",
      emptyTitle: "Рисков предпосылок нет",
      emptyDescription: "Добавьте риски предпосылок, чтобы начать этот раздел.",
      titlePlaceholder: "Название риска",
      descriptionPlaceholder: "Описание риска",
      addAction: "Добавить элемент риска",
      categoryLabel: "Выберите категорию",
      riskTypeLabel: "Тип риска",
      likelihoodLabel: "Вероятность",
      impactLabel: "Влияние",
      inherentRatingLabel: "Рейтинг неотъемлемого риска",
      auditAreaLabel: "Область аудита",
      auditAreaPlaceholder: "Выберите область аудита",
      significantBadge: "Существенный",
      procedureLinkedBadge: "Процедура связана",
      procedureUnlinkedBadge: "Требуется процедура"
    },
    significantRisks: {
      title: "Значимые риски",
      description: "Документируйте значимые риски, требующие целенаправленного реагирования.",
      emptyTitle: "Значимых рисков нет",
      emptyDescription: "Добавьте значимые риски, чтобы начать этот раздел.",
      titlePlaceholder: "Название риска",
      descriptionPlaceholder: "Описание риска",
      addAction: "Добавить элемент риска",
      categoryLabel: "Выберите категорию",
      riskTypeLabel: "Тип риска",
      likelihoodLabel: "Вероятность",
      impactLabel: "Влияние",
      inherentRatingLabel: "Рейтинг неотъемлемого риска",
      auditAreaLabel: "Область аудита",
      auditAreaPlaceholder: "Выберите область аудита",
      significantBadge: "Существенный",
      procedureLinkedBadge: "Процедура связана",
      procedureUnlinkedBadge: "Требуется процедура"
    },
    categories: {
      title: "Категории рисков",
      description: "Управляйте определениями категорий рисков.",
      emptyTitle: "Категорий нет",
      emptyDescription: "Добавьте категории для организации элементов риска.",
      namePlaceholder: "Название категории",
      descriptionPlaceholder: "Описание категории",
      addAction: "Добавить категорию"
    },
    scoring: {
      title: "Оценка",
      description: "Сводка результатов оценки по реестру рисков.",
      emptyTitle: "Нет данных оценки",
      emptyDescription: "Показатели оценки появляются при добавлении элементов риска.",
      ratedItems: "Оценённые элементы",
      significant: "Значимый",
      likelihood: "Высокая вероятность",
      impact: "Высокое влияние",
      residual: "Значимый остаточный"
    },
    heatmap: {
      title: "Тепловая карта",
      description: "Распределение рейтингов рисков по реестру.",
      emptyTitle: "Нет данных тепловой карты",
      emptyDescription: "Ячейки тепловой карты появляются при записи рейтингов.",
      unratedLabel: "Без оценки",
      accountLabel: "Счёт",
      assertionLabel: "Утверждение",
      ratingLabel: "Оценка",
      significantLabel: "Существенный риск",
      emptyDetail: "Выберите ячейку тепловой карты для просмотра деталей.",
      filterSignificant: "Показывать только существенные и оценённые ячейки"
    },
    matrix: {
      title: "Матрица предпосылок",
      description: "Управляйте рейтингами предпосылок по счетам.",
      emptyTitle: "Нет рейтингов предпосылок",
      emptyDescription: "Добавьте рейтинги предпосылок для заполнения матрицы.",
      accountPlaceholder: "Название счёта",
      addAction: "Добавить рейтинг предпосылки",
      accountLabel: "Счёт",
      assertionLabel: "Утверждение",
      ratingLabel: "Оценка",
      significantLabel: "Существенный риск",
      emptyDetail: "Выберите ячейку матрицы для просмотра или обновления оценок.",
      selectRating: "Выберите оценку"
    },
    responses: {
      title: "Ответные меры",
      description: "Документируйте ответные меры для выявленных элементов риска.",
      emptyTitle: "Ответных мер нет",
      emptyDescription: "Добавьте ответные меры для фиксации запланированных действий.",
      riskItemLabel: "Выберите элемент риска",
      descriptionPlaceholder: "Описание ответной меры",
      addAction: "Добавить ответную меру"
    },
    procedures: {
      title: "Процедуры",
      description: "Свяжите запланированные процедуры с элементами риска.",
      emptyTitle: "Связанных процедур нет",
      emptyDescription: "Добавьте связи с процедурами для отображения выполнения ответных мер.",
      riskItemLabel: "Выберите элемент риска",
      referencePlaceholder: "Ссылка на процедуру",
      addAction: "Добавить связь с процедурой"
    },
    owners: {
      title: "Ответственные",
      description: "Назначьте ответственных за элементы реестра рисков.",
      emptyTitle: "Элементов риска нет",
      emptyDescription: "Элементы риска появятся здесь после создания.",
      ownerPlaceholder: "Идентификатор ответственного",
      updateAction: "Обновить ответственного",
      unassignedLabel: "Не назначено"
    },
    reviewNotes: {
      title: "Заметки проверки",
      description: "Фиксируйте заметки проверяющего и пункты для последующих действий.",
      emptyTitle: "Заметок проверки нет",
      emptyDescription: "Заметки проверки появляются в циклах проверки.",
      bodyPlaceholder: "Добавить заметку проверки",
      addAction: "Добавить заметку"
    },
    comments: {
      title: "Комментарии",
      description: "Фиксируйте внутренние комментарии, связанные с рисками.",
      emptyTitle: "Комментариев нет",
      emptyDescription: "Комментарии появятся здесь после добавления.",
      bodyPlaceholder: "Добавить внутренний комментарий",
      addAction: "Добавить комментарий"
    },
    history: {
      title: "История",
      description: "Хронология активности оценки рисков только для чтения.",
      emptyTitle: "Активности по рискам нет",
      emptyDescription: "Активность по рискам появится здесь по мере записи изменений.",
      versionLabel: "Версия оценки",
      updatedLabel: "Обновлено",
      actions: {
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
    settings: {
      title: "Настройки",
      description: "Архивируйте или восстановите эту оценку рисков.",
      archiveAction: "Архивировать оценку рисков",
      archiveConfirmAction: "Подтвердить архивирование",
      restoreAction: "Восстановить оценку рисков",
      restoreConfirmAction: "Подтвердить восстановление",
      cancelAction: "Отмена",
      archivedBanner: "Эта оценка рисков архивирована.",
      readOnlyNotice: "У вас доступ только для просмотра настроек оценки рисков."
    }
  },
  tr: {
    notFoundTitle: "Risk değerlendirmesi bulunamadı",
    notFoundDescription: "Bu iş için istenen risk değerlendirmesi çalışma alanı bulunamadı.",
    forbiddenTitle: "İzin gerekli",
    forbiddenDescription: "Bu bölüme erişmek için risk değerlendirmesi izni gerekiyor.",
    noWorkspaceTitle: "Çalışma alanı gerekli",
    noWorkspaceDescription: "Risk değerlendirmesini açmadan önce bir çalışma alanı seçin.",
    statuses: {
      not_started: "Başlamadı",
      in_progress: "Devam ediyor",
      submitted: "Gönderildi",
      under_review: "İnceleme altında",
      approved: "Onaylandı",
      archived: "Arşivlenmiş"
    },
    riskTypes: {
      inherent: "Doğal risk",
      control: "Kontrol riski",
      detection: "Tespit riski",
      fraud: "Suiistimal riski",
      it: "BT riski",
      compliance: "Uyum riski",
      financial_statement: "Finansal tablo riski",
      assertion: "İddia riski",
      significant: "Önemli risk"
    },
    ratingLevels: {
      low: "Düşük",
      moderate: "Orta",
      high: "Yüksek",
      significant: "Önemli"
    },
    likelihoods: {
      low: "Düşük",
      moderate: "Orta",
      high: "Yüksek"
    },
    impacts: {
      low: "Düşük",
      moderate: "Orta",
      high: "Yüksek"
    },
    responseTypes: {
      accept: "Kabul et",
      reduce: "Azalt",
      transfer: "Transfer et",
      avoid: "Kaçın",
      substantive_procedures: "Substantif prosedürler",
      test_of_controls: "Kontrol testleri"
    },
    assertions: {
      existence: "Varlık",
      completeness: "Tamlık",
      accuracy: "Doğruluk",
      cutoff: "Kesim",
      classification: "Sınıflandırma",
      presentation: "Sunum"
    },
    noteTypes: {
      review: "İnceleme notu",
      internal: "Dahili not"
    },
    actions: {
      add: "Ekle",
      update: "Güncelle",
      archive: "Arşivle",
      restore: "Geri yükle",
      submit: "Gönder",
      approve: "Onayla",
      return: "İade et"
    },
    workflow: {
      title: "Risk iş akışı",
      description: "Risk değerlendirmesi dokümantasyonunu gönder, iade et ve onayla.",
      submitAction: "İncelemeye gönder",
      returnAction: "Revizyon için iade et",
      returnConfirmAction: "İadeyi onayla",
      approveAction: "Risk değerlendirmesini onayla",
      acknowledgeAction: "Önemli riskleri onayla",
      cancelAction: "İptal",
      returnNotesLabel: "İade notu",
      returnNotesPlaceholder: "Yeniden göndermeden önce neyin revize edilmesi gerektiğini yazın.",
      readOnlyNotice: "Bu risk değerlendirmesi arşivlenmiştir ve salt okunurdur.",
      submittedNotice: "Bu risk değerlendirmesi gönderildi ve inceleme bekliyor.",
      approvedNotice: "Bu risk değerlendirmesi onaylandı.",
      acknowledgedNotice: "Önemli riskler onaylandı.",
      pendingAcknowledgmentNotice: "Onaydan önce önemli riskler onaylanmalıdır.",
      errorGeneric: "Risk iş akışı işlemi tamamlanamadı."
    },
    empty: {
      title: "Risk değerlendirmesi başlatılmadı",
      description: "Önemli riskleri, yanıtları ve inceleme hazırlığını belgelemek için risk değerlendirmesi oluşturun.",
      createAction: "Risk değerlendirmesi oluştur",
      creating: "Risk değerlendirmesi oluşturuluyor...",
      forbiddenDescription: "Bu alanı başlatmak için risk değerlendirmesi oluşturma izni gerekir."
    },
    workspace: {
      title: "Risk değerlendirmesi özeti",
      description: "Mevcut risk değerlendirmesi durumu ve temel göstergelere genel bakış.",
      statusTitle: "Durum özeti",
      statusDescription: "Bu risk değerlendirmesi için mevcut tamamlanma ve hazırlık göstergeleri.",
      progress: "Genel ilerleme",
      workflowTitle: "İş akışı",
      workflowDescription: "Risk değerlendirmesi için gönderim ve onay iş akışı.",
      heatmapPreviewTitle: "Isı haritası önizlemesi",
      heatmapPreviewDescription: "Mevcut değerlendirme sonuçlarına göre risk derecelendirmelerinin dağılımı.",
      heroEyebrow: "Risk değerlendirmesi",
      breadcrumbRiskAssessment: "Risk değerlendirmesi",
      backToEngagement: "İşe geri dön",
      planningGateTitle: "Planlama onayı gerekli",
      planningGateDescription: "Risk değerlendirmesine başlamadan önce denetim planlaması onaylanmalıdır.",
      navAriaLabel: "Risk değerlendirmesi çalışma alanı bölümleri",
      navOverview: "Pano",
      navInherentRisks: "Doğal riskler",
      navControlRisks: "Kontrol riskleri",
      navDetectionRisks: "Tespit riskleri",
      navFraudRisks: "Suiistimal riskleri",
      navItRisks: "BT riskleri",
      navComplianceRisks: "Uyum riskleri",
      navFinancialStatementRisks: "Finansal tablo riskleri",
      navAssertionRisks: "İddia riskleri",
      navSignificantRisks: "Önemli riskler",
      navCategories: "Kategoriler",
      navScoring: "Puanlama",
      navHeatmap: "Isı haritası",
      navMatrix: "Matris",
      navResponses: "Yanıtlar",
      navProcedures: "Prosedürler",
      navOwners: "Sorumlular",
      navReviewNotes: "İnceleme notları",
      navComments: "Yorumlar",
      navHistory: "Geçmiş",
      navSettings: "Ayarlar",
      loading: "Risk değerlendirmesi çalışma alanı yükleniyor",
      errorTitle: "Risk değerlendirmesi çalışma alanı yüklenemedi",
      errorDescription: "Bu risk değerlendirmesi yüklenirken bir hata oluştu.",
      archivedTitle: "Risk değerlendirmesi arşivlendi",
      archivedDescription: "Bu risk değerlendirmesi salt okunurdur. Güncellemeye devam etmek için geri yükleyin.",
      summaryStatus: "Risk durumu",
      summaryVersion: "Değerlendirme sürümü",
      summaryProgress: "Genel ilerleme",
      summarySignificant: "Önemli riskler",
      summaryPendingReview: "İnceleme bekliyor",
      summaryOpenItems: "Açık kalemler",
      sections: {
        overview: {
          title: "Risk panosu",
          description: "Durum, ilerleme ve inceleme hazırlığı göstergeleri."
        },
        "inherent-risks": {
          title: "Doğal riskler",
          description: "İlgili kontroller dikkate alınmadan önceki riskler."
        },
        "control-risks": {
          title: "Kontrol riskleri",
          description: "Kontrollerin tasarımı ve işleyişiyle ilgili riskler."
        },
        "detection-risks": {
          title: "Tespit riskleri",
          description: "Prosedürlerin hataları tespit edememesi riskleri."
        },
        "fraud-risks": {
          title: "Suiistimal riskleri",
          description: "Suiistimal risk faktörleri ve yönetimin kontrolü aşması."
        },
        "it-risks": {
          title: "BT riskleri",
          description: "Teknoloji, sistem erişimi ve veri bütünlüğü riskleri."
        },
        "compliance-risks": {
          title: "Uyum riskleri",
          description: "Düzenleyici ve yasal uyum riskleri."
        },
        "financial-statement-risks": {
          title: "Finansal tablo riskleri",
          description: "Finansal tablo düzeyinde önemli hata riskleri."
        },
        "assertion-risks": {
          title: "İddia riskleri",
          description: "İlgili hesaplara bağlı iddia düzeyindeki riskler."
        },
        "significant-risks": {
          title: "Önemli riskler",
          description: "Odaklanmış denetim yanıtı gerektiren yüksek öncelikli riskler."
        },
        categories: {
          title: "Risk kategorileri",
          description: "Risk kalemlerini düzenlemek için yapılandırılmış kategoriler."
        },
        scoring: {
          title: "Puanlama",
          description: "Belirlenen riskler genelinde toplu puanlama göstergeleri."
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
          description: "Belirlenen riskler için planlanan yanıtlar."
        },
        procedures: {
          title: "Prosedür bağlantıları",
          description: "Değerlendirilen risklere yanıt vermek için bağlı prosedürler."
        },
        owners: {
          title: "Risk sorumluları",
          description: "Her risk kalemi için atanan sorumlular."
        },
        "review-notes": {
          title: "İnceleme notları",
          description: "Risk değerlendirme döngülerinde kaydedilen inceleyici notları."
        },
        comments: {
          title: "Yorumlar",
          description: "Dahili yorumlar ve iş birliği notları."
        },
        history: {
          title: "Geçmiş",
          description: "Risk değerlendirmesi değişiklikleri ve onaylarının zaman çizelgesi."
        },
        settings: {
          title: "Ayarlar",
          description: "Bu risk değerlendirmesi için arşivleme ve geri yükleme kontrolleri."
        }
      }
    },
    inherentRisks: {
      title: "Doğal riskler",
      description: "Doğal risk kalemlerini belgeleyin.",
      emptyTitle: "Doğal risk yok",
      emptyDescription: "Kaydı başlatmak için doğal riskler ekleyin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk açıklaması",
      addAction: "Risk kalemi ekle",
      categoryLabel: "Kategori seçin",
      riskTypeLabel: "Risk türü",
      likelihoodLabel: "Olasılık",
      impactLabel: "Etki",
      inherentRatingLabel: "Doğal derecelendirme",
      auditAreaLabel: "Denetim alanı",
      auditAreaPlaceholder: "Denetim alanı seçin",
      significantBadge: "Önemli",
      procedureLinkedBadge: "Prosedür bağlı",
      procedureUnlinkedBadge: "Prosedür gerekli"
    },
    controlRisks: {
      title: "Kontrol riskleri",
      description: "Kontrol riski kalemlerini belgeleyin.",
      emptyTitle: "Kontrol riski yok",
      emptyDescription: "Bu bölümü başlatmak için kontrol riskleri ekleyin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk açıklaması",
      addAction: "Risk kalemi ekle",
      categoryLabel: "Kategori seçin",
      riskTypeLabel: "Risk türü",
      likelihoodLabel: "Olasılık",
      impactLabel: "Etki",
      inherentRatingLabel: "Doğal derecelendirme",
      auditAreaLabel: "Denetim alanı",
      auditAreaPlaceholder: "Denetim alanı seçin",
      significantBadge: "Önemli",
      procedureLinkedBadge: "Prosedür bağlı",
      procedureUnlinkedBadge: "Prosedür gerekli"
    },
    detectionRisks: {
      title: "Tespit riskleri",
      description: "Tespit riski kalemlerini belgeleyin.",
      emptyTitle: "Tespit riski yok",
      emptyDescription: "Bu bölümü başlatmak için tespit riskleri ekleyin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk açıklaması",
      addAction: "Risk kalemi ekle",
      categoryLabel: "Kategori seçin",
      riskTypeLabel: "Risk türü",
      likelihoodLabel: "Olasılık",
      impactLabel: "Etki",
      inherentRatingLabel: "Doğal derecelendirme",
      auditAreaLabel: "Denetim alanı",
      auditAreaPlaceholder: "Denetim alanı seçin",
      significantBadge: "Önemli",
      procedureLinkedBadge: "Prosedür bağlı",
      procedureUnlinkedBadge: "Prosedür gerekli"
    },
    fraudRisks: {
      title: "Suiistimal riskleri",
      description: "Suiistimal riski kalemlerini belgeleyin.",
      emptyTitle: "Suiistimal riski yok",
      emptyDescription: "Bu bölümü başlatmak için suiistimal riskleri ekleyin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk açıklaması",
      addAction: "Risk kalemi ekle",
      categoryLabel: "Kategori seçin",
      riskTypeLabel: "Risk türü",
      likelihoodLabel: "Olasılık",
      impactLabel: "Etki",
      inherentRatingLabel: "Doğal derecelendirme",
      auditAreaLabel: "Denetim alanı",
      auditAreaPlaceholder: "Denetim alanı seçin",
      significantBadge: "Önemli",
      procedureLinkedBadge: "Prosedür bağlı",
      procedureUnlinkedBadge: "Prosedür gerekli"
    },
    itRisks: {
      title: "BT riskleri",
      description: "BT riski kalemlerini belgeleyin.",
      emptyTitle: "BT riski yok",
      emptyDescription: "Bu bölümü başlatmak için BT riskleri ekleyin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk açıklaması",
      addAction: "Risk kalemi ekle",
      categoryLabel: "Kategori seçin",
      riskTypeLabel: "Risk türü",
      likelihoodLabel: "Olasılık",
      impactLabel: "Etki",
      inherentRatingLabel: "Doğal derecelendirme",
      auditAreaLabel: "Denetim alanı",
      auditAreaPlaceholder: "Denetim alanı seçin",
      significantBadge: "Önemli",
      procedureLinkedBadge: "Prosedür bağlı",
      procedureUnlinkedBadge: "Prosedür gerekli"
    },
    complianceRisks: {
      title: "Uyum riskleri",
      description: "Uyum riski kalemlerini belgeleyin.",
      emptyTitle: "Uyum riski yok",
      emptyDescription: "Bu bölümü başlatmak için uyum riskleri ekleyin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk açıklaması",
      addAction: "Risk kalemi ekle",
      categoryLabel: "Kategori seçin",
      riskTypeLabel: "Risk türü",
      likelihoodLabel: "Olasılık",
      impactLabel: "Etki",
      inherentRatingLabel: "Doğal derecelendirme",
      auditAreaLabel: "Denetim alanı",
      auditAreaPlaceholder: "Denetim alanı seçin",
      significantBadge: "Önemli",
      procedureLinkedBadge: "Prosedür bağlı",
      procedureUnlinkedBadge: "Prosedür gerekli"
    },
    financialStatementRisks: {
      title: "Finansal tablo riskleri",
      description: "Finansal tablo düzeyindeki riskleri belgeleyin.",
      emptyTitle: "Finansal tablo riski yok",
      emptyDescription: "Bu bölümü başlatmak için finansal tablo riskleri ekleyin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk açıklaması",
      addAction: "Risk kalemi ekle",
      categoryLabel: "Kategori seçin",
      riskTypeLabel: "Risk türü",
      likelihoodLabel: "Olasılık",
      impactLabel: "Etki",
      inherentRatingLabel: "Doğal derecelendirme",
      auditAreaLabel: "Denetim alanı",
      auditAreaPlaceholder: "Denetim alanı seçin",
      significantBadge: "Önemli",
      procedureLinkedBadge: "Prosedür bağlı",
      procedureUnlinkedBadge: "Prosedür gerekli"
    },
    assertionRisks: {
      title: "İddia riskleri",
      description: "İddia düzeyindeki risk kalemlerini belgeleyin.",
      emptyTitle: "İddia riski yok",
      emptyDescription: "Bu bölümü başlatmak için iddia riskleri ekleyin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk açıklaması",
      addAction: "Risk kalemi ekle",
      categoryLabel: "Kategori seçin",
      riskTypeLabel: "Risk türü",
      likelihoodLabel: "Olasılık",
      impactLabel: "Etki",
      inherentRatingLabel: "Doğal derecelendirme",
      auditAreaLabel: "Denetim alanı",
      auditAreaPlaceholder: "Denetim alanı seçin",
      significantBadge: "Önemli",
      procedureLinkedBadge: "Prosedür bağlı",
      procedureUnlinkedBadge: "Prosedür gerekli"
    },
    significantRisks: {
      title: "Önemli riskler",
      description: "Odaklanmış yanıt gerektiren önemli riskleri belgeleyin.",
      emptyTitle: "Önemli risk yok",
      emptyDescription: "Bu bölümü başlatmak için önemli riskler ekleyin.",
      titlePlaceholder: "Risk başlığı",
      descriptionPlaceholder: "Risk açıklaması",
      addAction: "Risk kalemi ekle",
      categoryLabel: "Kategori seçin",
      riskTypeLabel: "Risk türü",
      likelihoodLabel: "Olasılık",
      impactLabel: "Etki",
      inherentRatingLabel: "Doğal derecelendirme",
      auditAreaLabel: "Denetim alanı",
      auditAreaPlaceholder: "Denetim alanı seçin",
      significantBadge: "Önemli",
      procedureLinkedBadge: "Prosedür bağlı",
      procedureUnlinkedBadge: "Prosedür gerekli"
    },
    categories: {
      title: "Risk kategorileri",
      description: "Risk kategorisi tanımlarını yönetin.",
      emptyTitle: "Kategori yok",
      emptyDescription: "Risk kalemlerini düzenlemek için kategoriler ekleyin.",
      namePlaceholder: "Kategori adı",
      descriptionPlaceholder: "Kategori açıklaması",
      addAction: "Kategori ekle"
    },
    scoring: {
      title: "Puanlama",
      description: "Risk kaydı genelinde puanlama sonuçlarının özeti.",
      emptyTitle: "Puanlama verisi yok",
      emptyDescription: "Risk kalemleri eklendiğinde puanlama göstergeleri görünür.",
      ratedItems: "Derecelendirilmiş kalemler",
      significant: "Önemli",
      likelihood: "Yüksek olasılık",
      impact: "Yüksek etki",
      residual: "Önemli artık"
    },
    heatmap: {
      title: "Isı haritası",
      description: "Kayıt genelinde risk derecelendirme dağılımı.",
      emptyTitle: "Isı haritası verisi yok",
      emptyDescription: "Derecelendirmeler kaydedildiğinde ısı haritası hücreleri görünür.",
      unratedLabel: "Derecelendirilmemiş",
      accountLabel: "Hesap",
      assertionLabel: "İddia",
      ratingLabel: "Derecelendirme",
      significantLabel: "Önemli risk",
      emptyDetail: "Ayrıntıları görmek için ısı haritası hücresini seçin.",
      filterSignificant: "Yalnızca önemli ve derecelendirilmiş hücreleri göster"
    },
    matrix: {
      title: "İddia matrisi",
      description: "Hesaba göre iddia derecelendirmelerini yönetin.",
      emptyTitle: "İddia derecelendirmesi yok",
      emptyDescription: "Matrisi doldurmak için iddia derecelendirmeleri ekleyin.",
      accountPlaceholder: "Hesap adı",
      addAction: "İddia derecelendirmesi ekle",
      accountLabel: "Hesap",
      assertionLabel: "İddia",
      ratingLabel: "Derecelendirme",
      significantLabel: "Önemli risk",
      emptyDetail: "Derecelendirmeleri görmek veya güncellemek için matris hücresini seçin.",
      selectRating: "Derecelendirme seçin"
    },
    responses: {
      title: "Yanıtlar",
      description: "Belirlenen risk kalemleri için yanıtları belgeleyin.",
      emptyTitle: "Yanıt yok",
      emptyDescription: "Planlanan eylemleri kaydetmek için risk yanıtları ekleyin.",
      riskItemLabel: "Risk kalemi seçin",
      descriptionPlaceholder: "Yanıt açıklaması",
      addAction: "Yanıt ekle"
    },
    procedures: {
      title: "Prosedürler",
      description: "Planlanan prosedürleri risk kalemlerine bağlayın.",
      emptyTitle: "Bağlı prosedür yok",
      emptyDescription: "Yanıt yürütmesini eşlemek için prosedür bağlantıları ekleyin.",
      riskItemLabel: "Risk kalemi seçin",
      referencePlaceholder: "Prosedür referansı",
      addAction: "Prosedür bağlantısı ekle"
    },
    owners: {
      title: "Sorumlular",
      description: "Risk kaydı kalemlerine sorumlular atayın.",
      emptyTitle: "Risk kalemi yok",
      emptyDescription: "Risk kalemleri oluşturulduktan sonra burada görünecek.",
      ownerPlaceholder: "Sorumlu tanımlayıcısı",
      updateAction: "Sorumluyu güncelle",
      unassignedLabel: "Atanmamış"
    },
    reviewNotes: {
      title: "İnceleme notları",
      description: "İnceleyici notlarını ve takip noktalarını kaydedin.",
      emptyTitle: "İnceleme notu yok",
      emptyDescription: "İnceleme notları inceleme döngülerinde görünür.",
      bodyPlaceholder: "İnceleme notu ekle",
      addAction: "Not ekle"
    },
    comments: {
      title: "Yorumlar",
      description: "Risklerle ilgili dahili yorumları kaydedin.",
      emptyTitle: "Yorum yok",
      emptyDescription: "Yorumlar eklendikten sonra burada görünür.",
      bodyPlaceholder: "Dahili yorum ekle",
      addAction: "Yorum ekle"
    },
    history: {
      title: "Geçmiş",
      description: "Risk değerlendirmesi etkinliğinin salt okunur zaman çizelgesi.",
      emptyTitle: "Risk etkinliği yok",
      emptyDescription: "Değişiklikler kaydedildikçe risk etkinliği burada görünecek.",
      versionLabel: "Değerlendirme sürümü",
      updatedLabel: "Güncellendi",
      actions: {
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
    settings: {
      title: "Ayarlar",
      description: "Bu risk değerlendirmesini arşivleyin veya geri yükleyin.",
      archiveAction: "Risk değerlendirmesini arşivle",
      archiveConfirmAction: "Arşivlemeyi onayla",
      restoreAction: "Risk değerlendirmesini geri yükle",
      restoreConfirmAction: "Geri yüklemeyi onayla",
      cancelAction: "İptal",
      archivedBanner: "Bu risk değerlendirmesi arşivlenmiştir.",
      readOnlyNotice: "Risk değerlendirmesi ayarlarına yalnızca görüntüleme erişiminiz var."
    }
  },
};
