import json
from copy import deepcopy
from pathlib import Path

root = Path(r"C:/Users/Tural/audit")
en = json.loads((root / "src/i18n/messages/en.json").read_text(encoding="utf-8"))["riskAssessment"]

risk_sections = [
    "inherentRisks",
    "controlRisks",
    "detectionRisks",
    "fraudRisks",
    "itRisks",
    "complianceRisks",
    "financialStatementRisks",
    "assertionRisks",
    "significantRisks",
]

section_meta = {
    "inherentRisks": {"az": "təbii"},
    "controlRisks": {"az": "nəzarət"},
    "detectionRisks": {"az": "aşkarlama"},
    "fraudRisks": {"az": "fırıldaqçılıq"},
    "itRisks": {"az": "İT"},
    "complianceRisks": {"az": "uyğunluq"},
    "financialStatementRisks": {"az": "maliyyə hesabatı"},
    "assertionRisks": {"az": "iddia"},
    "significantRisks": {"az": "əhəmiyyətli"},
}

exact = {
    "az": {
        "Risk assessment not found": "Risk qiymətləndirməsi tapılmadı",
        "The risk assessment workspace you requested could not be found for this engagement.": "Tələb etdiyiniz risk qiymətləndirməsi iş sahəsi bu tapşırıq üçün tapılmadı.",
        "Permission required": "İcazə tələb olunur",
        "You need risk assessment permission to access this workspace.": "Bu iş sahəsinə daxil olmaq üçün risk qiymətləndirməsi icazəsi lazımdır.",
        "Workspace required": "İş sahəsi tələb olunur",
        "Select a workspace before opening risk assessment.": "Risk qiymətləndirməsini açmazdan əvvəl iş sahəsi seçin.",
        "Not started": "Başlanmayıb",
        "In progress": "Davam edir",
        "Submitted": "Təqdim olunub",
        "Under review": "Yoxlamadadır",
        "Approved": "Təsdiqlənib",
        "Archived": "Arxivlənib",
        "Inherent risk": "Təbii risk",
        "Control risk": "Nəzarət riski",
        "Detection risk": "Aşkarlama riski",
        "Fraud risk": "Fırıldaqçılıq riski",
        "IT risk": "İT riski",
        "Compliance risk": "Uyğunluq riski",
        "Financial statement risk": "Maliyyə hesabatı riski",
        "Assertion risk": "İddia riski",
        "Significant risk": "Əhəmiyyətli risk",
        "Low": "Aşağı",
        "Moderate": "Orta",
        "High": "Yüksək",
        "Significant": "Əhəmiyyətli",
        "Accept": "Qəbul et",
        "Reduce": "Azalt",
        "Transfer": "Köçür",
        "Avoid": "Yayın",
        "Substantive procedures": "Mahiyyət üzrə prosedurlar",
        "Test of controls": "Nəzarət testləri",
        "Existence": "Mövcudluq",
        "Completeness": "Tamlıq",
        "Accuracy": "Dəqiqlik",
        "Cutoff": "Dövrə aidetmə",
        "Classification": "Təsnifat",
        "Presentation": "Təqdimat",
        "Review note": "Yoxlama qeydi",
        "Internal note": "Daxili qeyd",
        "Add": "Əlavə et",
        "Update": "Yenilə",
        "Archive": "Arxivlə",
        "Restore": "Bərpa et",
        "Submit": "Təqdim et",
        "Approve": "Təsdiqlə",
        "Return": "Qaytar",
        "Risk workflow": "Risk iş axını",
        "Submit, return, and approve risk assessment documentation.": "Risk qiymətləndirməsi sənədlərini təqdim edin, qaytarın və təsdiqləyin.",
        "Submit for review": "Yoxlamaya təqdim et",
        "Return for revision": "Düzəliş üçün qaytar",
        "Confirm return": "Qaytarmanı təsdiqlə",
        "Approve risk assessment": "Risk qiymətləndirməsini təsdiqlə",
        "Acknowledge significant risks": "Əhəmiyyətli riskləri təsdiqlə",
        "Cancel": "Ləğv et",
        "Return notes": "Qaytarma qeydləri",
        "Describe what must be revised before resubmission.": "Yenidən təqdimatdan əvvəl nəyin düzəldilməli olduğunu təsvir edin.",
        "This risk assessment is archived and read-only.": "Bu risk qiymətləndirməsi arxivlənib və yalnız oxunur.",
        "This risk assessment is submitted and pending review.": "Bu risk qiymətləndirməsi təqdim olunub və yoxlama gözləyir.",
        "This risk assessment is approved.": "Bu risk qiymətləndirməsi təsdiqlənib.",
        "Significant risks have been acknowledged.": "Əhəmiyyətli risklər təsdiqlənib.",
        "Significant risks must be acknowledged before approval.": "Təsdiqdən əvvəl əhəmiyyətli risklər təsdiqlənməlidir.",
        "Unable to complete the risk assessment workflow action.": "Risk qiymətləndirməsi iş axını əməliyyatını tamamlamaq mümkün olmadı.",
        "Risk assessment not initiated": "Risk qiymətləndirməsi başlanmayıb",
        "Create a risk assessment to document significant risks, responses, and review readiness.": "Əhəmiyyətli riskləri, cavab tədbirlərini və yoxlama hazırlığını sənədləşdirmək üçün risk qiymətləndirməsi yaradın.",
        "Create risk assessment": "Risk qiymətləndirməsi yarat",
        "Creating risk assessment...": "Risk qiymətləndirməsi yaradılır...",
        "You need risk assessment creation permission to initiate this workspace.": "Bu iş sahəsini başlatmaq üçün risk qiymətləndirməsi yaratma icazəsi lazımdır.",
        "Risk assessment overview": "Risk qiymətləndirməsi icmalı",
        "Overview of current risk assessment status and key indicators.": "Cari risk qiymətləndirməsi statusu və əsas göstəricilərin icmalı.",
        "Status summary": "Status icmalı",
        "Current completion and readiness indicators for this risk assessment.": "Bu risk qiymətləndirməsi üzrə cari tamamlanma və hazırlıq göstəriciləri.",
        "Overall progress": "Ümumi irəliləyiş",
        "Workflow": "İş axını",
        "Submission and approval workflow for the risk assessment.": "Risk qiymətləndirməsi üçün təqdimat və təsdiq iş axını.",
        "Heatmap preview": "İstilik xəritəsi önizləməsi",
        "Distribution of risk ratings by current assessment outcomes.": "Cari qiymətləndirmə nəticələrinə görə risk reytinqlərinin bölgüsü.",
        "Risk assessment": "Risk qiymətləndirməsi",
        "Back to engagement": "Tapşırığa qayıt",
        "Planning approval required": "Planlaşdırma təsdiqi tələb olunur",
        "Audit planning must be approved before risk assessment can begin.": "Risk qiymətləndirməsinə başlamazdan əvvəl audit planlaşdırması təsdiqlənməlidir.",
        "Risk assessment workspace sections": "Risk qiymətləndirməsi iş sahəsi bölmələri",
        "Dashboard": "Panel",
        "Inherent risks": "Təbii risklər",
        "Control risks": "Nəzarət riskləri",
        "Detection risks": "Aşkarlama riskləri",
        "Fraud risks": "Fırıldaqçılıq riskləri",
        "IT risks": "İT riskləri",
        "Compliance risks": "Uyğunluq riskləri",
        "Financial statement risks": "Maliyyə hesabatı riskləri",
        "Assertion risks": "İddia riskləri",
        "Significant risks": "Əhəmiyyətli risklər",
        "Categories": "Kateqoriyalar",
        "Scoring": "Qiymətləndirmə",
        "Heatmap": "İstilik xəritəsi",
        "Matrix": "Matris",
        "Responses": "Cavab tədbirləri",
        "Procedures": "Prosedurlar",
        "Owners": "Məsul şəxslər",
        "Review notes": "Yoxlama qeydləri",
        "Comments": "Şərhlər",
        "History": "Tarixçə",
        "Settings": "Parametrlər",
        "Loading risk assessment workspace": "Risk qiymətləndirməsi iş sahəsi yüklənir",
        "Unable to load risk assessment workspace": "Risk qiymətləndirməsi iş sahəsi yüklənə bilmədi",
        "Something went wrong while loading this risk assessment.": "Bu risk qiymətləndirməsi yüklənərkən xəta baş verdi.",
        "Risk assessment archived": "Risk qiymətləndirməsi arxivlənib",
        "This risk assessment is read-only. Restore it to continue updates.": "Bu risk qiymətləndirməsi yalnız oxunur. Yeniləmələri davam etdirmək üçün onu bərpa edin.",
        "Risk status": "Risk statusu",
        "Assessment version": "Qiymətləndirmə versiyası",
        "Pending review": "Yoxlama gözləyir",
        "Open items": "Açıq bəndlər",
        "Risk dashboard": "Risk paneli",
        "Status, progress, and review readiness indicators.": "Status, irəliləyiş və yoxlama hazırlığı göstəriciləri.",
        "Risks before considering related controls.": "Əlaqəli nəzarətlər nəzərə alınmadan əvvəlki risklər.",
        "Risks related to design and operation of controls.": "Nəzarətlərin dizaynı və fəaliyyəti ilə bağlı risklər.",
        "Risks that procedures fail to detect misstatements.": "Prosedurların təhrifləri aşkar etməməsi riski.",
        "Fraud risk factors and management override considerations.": "Fırıldaqçılıq risk faktorları və rəhbərliyin nəzarəti aşma amilləri.",
        "Technology, system access, and data integrity risks.": "Texnologiya, sistemə giriş və məlumat bütövlüyü riskləri.",
        "Regulatory and legal compliance risks.": "Tənzimləyici və hüquqi uyğunluq riskləri.",
        "Financial statement level risks of material misstatement.": "Maliyyə hesabatı səviyyəsində əhəmiyyətli təhrif riskləri.",
        "Assertion-level risks linked to relevant accounts.": "Müvafiq hesablara bağlı iddia səviyyəli risklər.",
        "High-priority risks requiring focused audit response.": "Fokuslanmış audit cavabı tələb edən yüksək prioritetli risklər.",
        "Risk categories": "Risk kateqoriyaları",
        "Configured categories used to organize risk items.": "Risk bəndlərini təşkil etmək üçün istifadə olunan konfiqurasiya edilmiş kateqoriyalar.",
        "Aggregate scoring indicators across identified risks.": "Müəyyən edilmiş risklər üzrə ümumiləşdirilmiş qiymətləndirmə göstəriciləri.",
        "Visual distribution of risk ratings.": "Risk reytinqlərinin vizual bölgüsü.",
        "Assertion matrix": "İddia matrisi",
        "Account and assertion ratings overview.": "Hesab və iddia reytinqlərinə ümumi baxış.",
        "Risk responses": "Risk cavab tədbirləri",
        "Planned responses for identified risks.": "Müəyyən edilmiş risklər üçün planlaşdırılmış cavab tədbirləri.",
        "Procedure links": "Prosedur bağlantıları",
        "Linked procedures for addressing assessed risks.": "Qiymətləndirilmiş risklərin həlli üçün əlaqələndirilmiş prosedurlar.",
        "Risk owners": "Risk məsul şəxsləri",
        "Assigned owners for each risk item.": "Hər risk bəndi üçün təyin olunmuş məsul şəxslər.",
        "Reviewer notes captured during risk assessment cycles.": "Risk qiymətləndirməsi dövrlərində qeydə alınan yoxlayıcı qeydləri.",
        "Internal comments and collaboration notes.": "Daxili şərhlər və əməkdaşlıq qeydləri.",
        "Timeline of risk assessment changes and approvals.": "Risk qiymətləndirməsi dəyişiklikləri və təsdiqlərinin zaman xətti.",
        "Archive and restore controls for this risk assessment.": "Bu risk qiymətləndirməsi üçün arxivləmə və bərpa nəzarətləri.",
        "Audit area": "Audit sahəsi",
        "Select audit area": "Audit sahəsini seçin",
        "No categories": "Kateqoriya yoxdur",
        "Add categories to organize risk items.": "Risk bəndlərini təşkil etmək üçün kateqoriyalar əlavə edin.",
        "Category name": "Kateqoriya adı",
        "Category description": "Kateqoriya təsviri",
        "Add category": "Kateqoriya əlavə et",
        "Summary of scoring outcomes across the risk register.": "Risk reyestri üzrə qiymətləndirmə nəticələrinin xülasəsi.",
        "No scoring data": "Qiymətləndirmə məlumatı yoxdur",
        "Scoring indicators appear when risk items are added.": "Risk bəndləri əlavə edildikdə qiymətləndirmə göstəriciləri görünəcək.",
        "Rated items": "Qiymətləndirilmiş bəndlər",
        "High likelihood": "Yüksək ehtimallılıq",
        "High impact": "Yüksək təsir",
        "Significant residual": "Əhəmiyyətli qalıq risk",
        "Risk rating distribution across the register.": "Reyestr üzrə risk reytinqlərinin bölgüsü.",
        "No heatmap data": "İstilik xəritəsi məlumatı yoxdur",
        "Heatmap buckets appear when ratings are recorded.": "Reytinqlər qeydə alındıqda istilik xəritəsi qrupları görünəcək.",
        "Unrated": "Qiymətləndirilməyib",
        "Account": "Hesab",
        "Assertion": "İddia",
        "Rating": "Reytinq",
        "Select a heatmap cell to view details.": "Təfərrüatları görmək üçün istilik xəritəsi xanasını seçin.",
        "Show significant and rated cells only": "Yalnız əhəmiyyətli və qiymətləndirilmiş xanaları göstər",
        "Manage assertion ratings by account.": "Hesablar üzrə iddia reytinqlərini idarə edin.",
        "No assertion ratings": "İddia reytinqləri yoxdur",
        "Add assertion ratings to populate the matrix.": "Matrisi doldurmaq üçün iddia reytinqləri əlavə edin.",
        "Account name": "Hesab adı",
        "Add assertion rating": "İddia reytinqi əlavə et",
        "Select a matrix cell to view or update ratings.": "Reytinqləri görmək və ya yeniləmək üçün matris xanasını seçin.",
        "Select rating": "Reytinq seçin",
        "Document responses for identified risk items.": "Müəyyən edilmiş risk bəndləri üzrə cavab tədbirlərini sənədləşdirin.",
        "No responses": "Cavab tədbirləri yoxdur",
        "Add risk responses to capture planned actions.": "Planlaşdırılmış tədbirləri qeyd etmək üçün risk cavabları əlavə edin.",
        "Select risk item": "Risk bəndini seçin",
        "Response description": "Cavab tədbiri təsviri",
        "Add response": "Cavab tədbiri əlavə et",
        "Link planned procedures to risk items.": "Planlaşdırılmış prosedurları risk bəndlərinə bağlayın.",
        "No linked procedures": "Bağlı prosedur yoxdur",
        "Add procedure links to map response execution.": "Cavab tədbirlərinin icrasını xəritələmək üçün prosedur bağlantıları əlavə edin.",
        "Procedure reference": "Prosedur istinadı",
        "Add procedure link": "Prosedur bağlantısı əlavə et",
        "Assign owners to risk register items.": "Risk reyestri bəndlərinə məsul şəxslər təyin edin.",
        "No risk items": "Risk bəndi yoxdur",
        "Risk items will appear here once created.": "Yaradıldıqdan sonra risk bəndləri burada görünəcək.",
        "Owner identifier": "Məsul şəxs identifikatoru",
        "Update owner": "Məsul şəxsi yenilə",
        "Unassigned": "Təyin edilməyib",
        "Capture reviewer notes and follow-up points.": "Yoxlayıcı qeydlərini və növbəti addımları qeydə alın.",
        "No review notes": "Yoxlama qeydləri yoxdur",
        "Review notes appear during review cycles.": "Yoxlama qeydləri yoxlama dövrlərində görünür.",
        "Add review note": "Yoxlama qeydi əlavə et",
        "Add note": "Qeyd əlavə et",
        "Capture internal comments related to risks.": "Risklərlə bağlı daxili şərhləri qeydə alın.",
        "No comments": "Şərh yoxdur",
        "Comments appear here once added.": "Şərhlər əlavə edildikdən sonra burada görünəcək.",
        "Add internal comment": "Daxili şərh əlavə et",
        "Add comment": "Şərh əlavə et",
        "Read-only timeline of risk assessment activity.": "Risk qiymətləndirməsi fəaliyyətinin yalnız oxuma zaman xətti.",
        "No risk activity": "Risk fəaliyyəti yoxdur",
        "Risk activity will appear here as changes are recorded.": "Dəyişikliklər qeydə alındıqca risk fəaliyyəti burada görünəcək.",
        "Updated": "Yenilənib",
        "Risk assessment created": "Risk qiymətləndirməsi yaradıldı",
        "Risk assessment updated": "Risk qiymətləndirməsi yeniləndi",
        "Risk assessment submitted": "Risk qiymətləndirməsi təqdim olundu",
        "Risk assessment returned": "Risk qiymətləndirməsi qaytarıldı",
        "Risk assessment approved": "Risk qiymətləndirməsi təsdiqləndi",
        "Category added": "Kateqoriya əlavə edildi",
        "Risk item added": "Risk bəndi əlavə edildi",
        "Risk item updated": "Risk bəndi yeniləndi",
        "Assertion rating updated": "İddia reytinqi yeniləndi",
        "Response added": "Cavab tədbiri əlavə edildi",
        "Procedure linked": "Prosedur bağlandı",
        "Note added": "Qeyd əlavə edildi",
        "Significant risks acknowledged": "Əhəmiyyətli risklər təsdiqləndi",
        "Archive or restore this risk assessment.": "Bu risk qiymətləndirməsini arxivləyin və ya bərpa edin.",
        "Archive risk assessment": "Risk qiymətləndirməsini arxivlə",
        "Confirm archive": "Arxivləməni təsdiqlə",
        "Restore risk assessment": "Risk qiymətləndirməsini bərpa et",
        "Confirm restore": "Bərpanı təsdiqlə",
        "This risk assessment is archived.": "Bu risk qiymətləndirməsi arxivlənib.",
        "You have view-only access to risk assessment settings.": "Risk qiymətləndirməsi parametrlərinə yalnız baxış girişiniz var.",
    },
    "ru": {},
    "tr": {},
}

# NOTE: RU/TR maps are filled from current locale files where present and fallback to curated translations below.
exact["ru"] = {
    k: v for k, v in {
        "Risk assessment not found": "Оценка рисков не найдена",
        "The risk assessment workspace you requested could not be found for this engagement.": "Запрошенное рабочее пространство оценки рисков для этого задания не найдено.",
        "Permission required": "Требуется разрешение",
        "You need risk assessment permission to access this workspace.": "Для доступа к этому рабочему пространству требуется разрешение на оценку рисков.",
        "Workspace required": "Требуется рабочее пространство",
        "Select a workspace before opening risk assessment.": "Выберите рабочее пространство перед открытием оценки рисков.",
        "Not started": "Не начато",
        "In progress": "В процессе",
        "Submitted": "Отправлено",
        "Under review": "На проверке",
        "Approved": "Утверждено",
        "Archived": "Архивировано",
        "Inherent risk": "Неотъемлемый риск",
        "Control risk": "Риск контроля",
        "Detection risk": "Риск необнаружения",
        "Fraud risk": "Риск мошенничества",
        "IT risk": "ИТ-риск",
        "Compliance risk": "Комплаенс-риск",
        "Financial statement risk": "Риск финансовой отчетности",
        "Assertion risk": "Риск предпосылки",
        "Significant risk": "Значимый риск",
        "Low": "Низкий",
        "Moderate": "Умеренный",
        "High": "Высокий",
        "Significant": "Значимый",
        "Accept": "Принять",
        "Reduce": "Снизить",
        "Transfer": "Передать",
        "Avoid": "Избежать",
        "Substantive procedures": "Процедуры по существу",
        "Test of controls": "Тесты средств контроля",
        "Existence": "Существование",
        "Completeness": "Полнота",
        "Accuracy": "Точность",
        "Cutoff": "Отнесение к периоду",
        "Classification": "Классификация",
        "Presentation": "Представление",
        "Review note": "Примечание проверки",
        "Internal note": "Внутреннее примечание",
        "Add": "Добавить",
        "Update": "Обновить",
        "Archive": "Архивировать",
        "Restore": "Восстановить",
        "Submit": "Отправить",
        "Approve": "Утвердить",
        "Return": "Вернуть",
        "Risk workflow": "Рабочий процесс по рискам",
        "Submit, return, and approve risk assessment documentation.": "Отправляйте, возвращайте и утверждайте документацию по оценке рисков.",
        "Submit for review": "Отправить на проверку",
        "Return for revision": "Вернуть на доработку",
        "Confirm return": "Подтвердить возврат",
        "Approve risk assessment": "Утвердить оценку рисков",
        "Acknowledge significant risks": "Подтвердить значимые риски",
        "Cancel": "Отмена",
        "Return notes": "Примечания к возврату",
        "Describe what must be revised before resubmission.": "Опишите, что нужно доработать перед повторной отправкой.",
        "This risk assessment is archived and read-only.": "Эта оценка рисков архивирована и доступна только для чтения.",
        "This risk assessment is submitted and pending review.": "Эта оценка рисков отправлена и ожидает проверки.",
        "This risk assessment is approved.": "Эта оценка рисков утверждена.",
        "Significant risks have been acknowledged.": "Значимые риски подтверждены.",
        "Significant risks must be acknowledged before approval.": "Перед утверждением необходимо подтвердить значимые риски.",
        "Unable to complete the risk assessment workflow action.": "Не удалось выполнить действие рабочего процесса оценки рисков.",
        "Risk assessment not initiated": "Оценка рисков не инициирована",
        "Create a risk assessment to document significant risks, responses, and review readiness.": "Создайте оценку рисков для документирования значимых рисков, ответных мер и готовности к проверке.",
        "Create risk assessment": "Создать оценку рисков",
        "Creating risk assessment...": "Создание оценки рисков...",
        "You need risk assessment creation permission to initiate this workspace.": "Для инициации этого рабочего пространства требуется разрешение на создание оценки рисков.",
        "Risk assessment overview": "Обзор оценки рисков",
        "Overview of current risk assessment status and key indicators.": "Обзор текущего статуса оценки рисков и ключевых индикаторов.",
        "Status summary": "Сводка статуса",
        "Current completion and readiness indicators for this risk assessment.": "Текущие показатели завершенности и готовности по этой оценке рисков.",
        "Overall progress": "Общий прогресс",
        "Workflow": "Рабочий процесс",
        "Submission and approval workflow for the risk assessment.": "Рабочий процесс отправки и утверждения оценки рисков.",
        "Heatmap preview": "Предпросмотр тепловой карты",
        "Distribution of risk ratings by current assessment outcomes.": "Распределение рейтингов рисков по текущим результатам оценки.",
        "Risk assessment": "Оценка рисков",
        "Back to engagement": "Назад к заданию",
        "Planning approval required": "Требуется утверждение планирования",
        "Audit planning must be approved before risk assessment can begin.": "Планирование аудита должно быть утверждено до начала оценки рисков.",
        "Risk assessment workspace sections": "Разделы рабочего пространства оценки рисков",
        "Dashboard": "Панель",
        "Inherent risks": "Неотъемлемые риски",
        "Control risks": "Риски контроля",
        "Detection risks": "Риски необнаружения",
        "Fraud risks": "Риски мошенничества",
        "IT risks": "ИТ-риски",
        "Compliance risks": "Комплаенс-риски",
        "Financial statement risks": "Риски финансовой отчетности",
        "Assertion risks": "Риски предпосылок",
        "Significant risks": "Значимые риски",
        "Categories": "Категории",
        "Scoring": "Оценивание",
        "Heatmap": "Тепловая карта",
        "Matrix": "Матрица",
        "Responses": "Ответные меры",
        "Procedures": "Процедуры",
        "Owners": "Ответственные",
        "Review notes": "Заметки проверки",
        "Comments": "Комментарии",
        "History": "История",
        "Settings": "Настройки",
        "Loading risk assessment workspace": "Загрузка рабочего пространства оценки рисков",
        "Unable to load risk assessment workspace": "Не удалось загрузить рабочее пространство оценки рисков",
        "Something went wrong while loading this risk assessment.": "При загрузке этой оценки рисков произошла ошибка.",
        "Risk assessment archived": "Оценка рисков архивирована",
        "This risk assessment is read-only. Restore it to continue updates.": "Эта оценка рисков доступна только для чтения. Восстановите ее, чтобы продолжить обновления.",
        "Risk status": "Статус рисков",
        "Assessment version": "Версия оценки",
        "Pending review": "Ожидает проверки",
        "Open items": "Открытые пункты",
        "Risk dashboard": "Панель рисков",
        "Status, progress, and review readiness indicators.": "Индикаторы статуса, прогресса и готовности к проверке.",
        "Risks before considering related controls.": "Риски до учета соответствующих средств контроля.",
        "Risks related to design and operation of controls.": "Риски, связанные с проектированием и функционированием средств контроля.",
        "Risks that procedures fail to detect misstatements.": "Риски того, что процедуры не выявят искажения.",
        "Fraud risk factors and management override considerations.": "Факторы риска мошенничества и аспекты обхода контроля руководством.",
        "Technology, system access, and data integrity risks.": "Риски технологий, доступа к системам и целостности данных.",
        "Regulatory and legal compliance risks.": "Риски регуляторного и правового соответствия.",
        "Financial statement level risks of material misstatement.": "Риски существенного искажения на уровне финансовой отчетности.",
        "Assertion-level risks linked to relevant accounts.": "Риски на уровне предпосылок, связанные с соответствующими счетами.",
        "High-priority risks requiring focused audit response.": "Риски высокого приоритета, требующие сфокусированной аудиторской реакции.",
        "Risk categories": "Категории рисков",
        "Configured categories used to organize risk items.": "Настроенные категории, используемые для организации пунктов рисков.",
        "Aggregate scoring indicators across identified risks.": "Сводные показатели оценивания по выявленным рискам.",
        "Visual distribution of risk ratings.": "Визуальное распределение рейтингов рисков.",
        "Assertion matrix": "Матрица предпосылок",
        "Account and assertion ratings overview.": "Обзор рейтингов по счетам и предпосылкам.",
        "Risk responses": "Ответные меры по рискам",
        "Planned responses for identified risks.": "Планируемые ответные меры по выявленным рискам.",
        "Procedure links": "Связи процедур",
        "Linked procedures for addressing assessed risks.": "Связанные процедуры для реагирования на оцененные риски.",
        "Risk owners": "Ответственные за риски",
        "Assigned owners for each risk item.": "Назначенные ответственные по каждому пункту риска.",
        "Reviewer notes captured during risk assessment cycles.": "Заметки проверяющего, зафиксированные в циклах оценки рисков.",
        "Internal comments and collaboration notes.": "Внутренние комментарии и заметки по совместной работе.",
        "Timeline of risk assessment changes and approvals.": "Хронология изменений и утверждений оценки рисков.",
        "Archive and restore controls for this risk assessment.": "Элементы управления архивацией и восстановлением для этой оценки рисков.",
        "Audit area": "Область аудита",
        "Select audit area": "Выберите область аудита",
        "No categories": "Нет категорий",
        "Add categories to organize risk items.": "Добавьте категории для организации пунктов рисков.",
        "Category name": "Название категории",
        "Category description": "Описание категории",
        "Add category": "Добавить категорию",
        "Summary of scoring outcomes across the risk register.": "Сводка результатов оценивания по реестру рисков.",
        "No scoring data": "Нет данных оценивания",
        "Scoring indicators appear when risk items are added.": "Индикаторы оценивания появятся после добавления пунктов рисков.",
        "Rated items": "Оцененные пункты",
        "High likelihood": "Высокая вероятность",
        "High impact": "Высокое влияние",
        "Significant residual": "Значимый остаточный риск",
        "Risk rating distribution across the register.": "Распределение рейтингов рисков по реестру.",
        "No heatmap data": "Нет данных для тепловой карты",
        "Heatmap buckets appear when ratings are recorded.": "Сегменты тепловой карты появятся после фиксации рейтингов.",
        "Unrated": "Без оценки",
        "Account": "Счет",
        "Assertion": "Предпосылка",
        "Rating": "Рейтинг",
        "Select a heatmap cell to view details.": "Выберите ячейку тепловой карты для просмотра деталей.",
        "Show significant and rated cells only": "Показывать только значимые и оцененные ячейки",
        "Manage assertion ratings by account.": "Управляйте рейтингами предпосылок по счетам.",
        "No assertion ratings": "Нет рейтингов предпосылок",
        "Add assertion ratings to populate the matrix.": "Добавьте рейтинги предпосылок для заполнения матрицы.",
        "Account name": "Наименование счета",
        "Add assertion rating": "Добавить рейтинг предпосылки",
        "Select a matrix cell to view or update ratings.": "Выберите ячейку матрицы для просмотра или обновления рейтингов.",
        "Select rating": "Выберите рейтинг",
        "Document responses for identified risk items.": "Документируйте ответные меры по выявленным пунктам рисков.",
        "No responses": "Нет ответных мер",
        "Add risk responses to capture planned actions.": "Добавьте ответные меры по рискам для фиксации планируемых действий.",
        "Select risk item": "Выберите пункт риска",
        "Response description": "Описание ответной меры",
        "Add response": "Добавить ответную меру",
        "Link planned procedures to risk items.": "Свяжите планируемые процедуры с пунктами рисков.",
        "No linked procedures": "Нет связанных процедур",
        "Add procedure links to map response execution.": "Добавьте связи процедур для увязки выполнения ответных мер.",
        "Procedure reference": "Ссылка на процедуру",
        "Add procedure link": "Добавить связь процедуры",
        "Assign owners to risk register items.": "Назначьте ответственных по пунктам реестра рисков.",
        "No risk items": "Нет пунктов рисков",
        "Risk items will appear here once created.": "Пункты рисков появятся здесь после создания.",
        "Owner identifier": "Идентификатор ответственного",
        "Update owner": "Обновить ответственного",
        "Unassigned": "Не назначено",
        "Capture reviewer notes and follow-up points.": "Фиксируйте заметки проверяющего и последующие действия.",
        "No review notes": "Нет заметок проверки",
        "Review notes appear during review cycles.": "Заметки проверки появляются в ходе циклов проверки.",
        "Add review note": "Добавить заметку проверки",
        "Add note": "Добавить заметку",
        "Capture internal comments related to risks.": "Фиксируйте внутренние комментарии, связанные с рисками.",
        "No comments": "Нет комментариев",
        "Comments appear here once added.": "Комментарии появятся здесь после добавления.",
        "Add internal comment": "Добавить внутренний комментарий",
        "Add comment": "Добавить комментарий",
        "Read-only timeline of risk assessment activity.": "Хронология активности оценки рисков только для чтения.",
        "No risk activity": "Нет активности по рискам",
        "Risk activity will appear here as changes are recorded.": "Активность по рискам появится здесь по мере фиксации изменений.",
        "Updated": "Обновлено",
        "Risk assessment created": "Оценка рисков создана",
        "Risk assessment updated": "Оценка рисков обновлена",
        "Risk assessment submitted": "Оценка рисков отправлена",
        "Risk assessment returned": "Оценка рисков возвращена",
        "Risk assessment approved": "Оценка рисков утверждена",
        "Category added": "Категория добавлена",
        "Risk item added": "Пункт риска добавлен",
        "Risk item updated": "Пункт риска обновлен",
        "Assertion rating updated": "Рейтинг предпосылки обновлен",
        "Response added": "Ответная мера добавлена",
        "Procedure linked": "Процедура связана",
        "Note added": "Заметка добавлена",
        "Significant risks acknowledged": "Значимые риски подтверждены",
        "Archive or restore this risk assessment.": "Архивируйте или восстановите эту оценку рисков.",
        "Archive risk assessment": "Архивировать оценку рисков",
        "Confirm archive": "Подтвердить архивацию",
        "Restore risk assessment": "Восстановить оценку рисков",
        "Confirm restore": "Подтвердить восстановление",
        "This risk assessment is archived.": "Эта оценка рисков архивирована.",
        "You have view-only access to risk assessment settings.": "У вас доступ только для просмотра настроек оценки рисков.",
    }.items()
}

exact["tr"] = {
    k: v for k, v in {
        "Risk assessment not found": "Risk değerlendirmesi bulunamadı",
        "The risk assessment workspace you requested could not be found for this engagement.": "İstediğiniz risk değerlendirmesi çalışma alanı bu görev için bulunamadı.",
        "Permission required": "İzin gerekli",
        "You need risk assessment permission to access this workspace.": "Bu çalışma alanına erişmek için risk değerlendirmesi izni gerekir.",
        "Workspace required": "Çalışma alanı gerekli",
        "Select a workspace before opening risk assessment.": "Risk değerlendirmesini açmadan önce bir çalışma alanı seçin.",
        "Not started": "Başlanmadı",
        "In progress": "Devam ediyor",
        "Submitted": "Gönderildi",
        "Under review": "İncelemede",
        "Approved": "Onaylandı",
        "Archived": "Arşivlendi",
        "Inherent risk": "Doğal risk",
        "Control risk": "Kontrol riski",
        "Detection risk": "Tespit riski",
        "Fraud risk": "Hile riski",
        "IT risk": "IT riski",
        "Compliance risk": "Uyum riski",
        "Financial statement risk": "Finansal tablo riski",
        "Assertion risk": "İddia riski",
        "Significant risk": "Önemli risk",
        "Low": "Düşük",
        "Moderate": "Orta",
        "High": "Yüksek",
        "Significant": "Önemli",
        "Accept": "Kabul et",
        "Reduce": "Azalt",
        "Transfer": "Devret",
        "Avoid": "Kaçın",
        "Substantive procedures": "Maddi doğrulama prosedürleri",
        "Test of controls": "Kontrol testleri",
        "Existence": "Varlık",
        "Completeness": "Tamlık",
        "Accuracy": "Doğruluk",
        "Cutoff": "Dönemsellik",
        "Classification": "Sınıflandırma",
        "Presentation": "Sunum",
        "Review note": "İnceleme notu",
        "Internal note": "Dahili not",
        "Add": "Ekle",
        "Update": "Güncelle",
        "Archive": "Arşivle",
        "Restore": "Geri yükle",
        "Submit": "Gönder",
        "Approve": "Onayla",
        "Return": "İade et",
        "Risk workflow": "Risk iş akışı",
        "Submit, return, and approve risk assessment documentation.": "Risk değerlendirmesi dokümantasyonunu gönderin, iade edin ve onaylayın.",
        "Submit for review": "İncelemeye gönder",
        "Return for revision": "Revizyon için iade et",
        "Confirm return": "İadeyi onayla",
        "Approve risk assessment": "Risk değerlendirmesini onayla",
        "Acknowledge significant risks": "Önemli riskleri teyit et",
        "Cancel": "İptal",
        "Return notes": "İade notları",
        "Describe what must be revised before resubmission.": "Yeniden gönderimden önce nelerin revize edilmesi gerektiğini açıklayın.",
        "This risk assessment is archived and read-only.": "Bu risk değerlendirmesi arşivlenmiştir ve salt okunurdur.",
        "This risk assessment is submitted and pending review.": "Bu risk değerlendirmesi gönderildi ve inceleme bekliyor.",
        "This risk assessment is approved.": "Bu risk değerlendirmesi onaylandı.",
        "Significant risks have been acknowledged.": "Önemli riskler teyit edildi.",
        "Significant risks must be acknowledged before approval.": "Onaydan önce önemli riskler teyit edilmelidir.",
        "Unable to complete the risk assessment workflow action.": "Risk değerlendirmesi iş akışı işlemi tamamlanamadı.",
        "Risk assessment not initiated": "Risk değerlendirmesi başlatılmadı",
        "Create a risk assessment to document significant risks, responses, and review readiness.": "Önemli riskleri, yanıtları ve inceleme hazırlığını belgelemek için bir risk değerlendirmesi oluşturun.",
        "Create risk assessment": "Risk değerlendirmesi oluştur",
        "Creating risk assessment...": "Risk değerlendirmesi oluşturuluyor...",
        "You need risk assessment creation permission to initiate this workspace.": "Bu çalışma alanını başlatmak için risk değerlendirmesi oluşturma iznine ihtiyacınız var.",
        "Risk assessment overview": "Risk değerlendirmesi özeti",
        "Overview of current risk assessment status and key indicators.": "Mevcut risk değerlendirmesi durumu ve temel göstergelerin özeti.",
        "Status summary": "Durum özeti",
        "Current completion and readiness indicators for this risk assessment.": "Bu risk değerlendirmesi için mevcut tamamlanma ve hazırlık göstergeleri.",
        "Overall progress": "Genel ilerleme",
        "Workflow": "İş akışı",
        "Submission and approval workflow for the risk assessment.": "Risk değerlendirmesi için gönderim ve onay iş akışı.",
        "Heatmap preview": "Isı haritası önizlemesi",
        "Distribution of risk ratings by current assessment outcomes.": "Mevcut değerlendirme sonuçlarına göre risk derecelendirmelerinin dağılımı.",
        "Risk assessment": "Risk değerlendirmesi",
        "Back to engagement": "Göreve geri dön",
        "Planning approval required": "Planlama onayı gerekli",
        "Audit planning must be approved before risk assessment can begin.": "Risk değerlendirmesi başlamadan önce denetim planlaması onaylanmalıdır.",
        "Risk assessment workspace sections": "Risk değerlendirmesi çalışma alanı bölümleri",
        "Dashboard": "Gösterge paneli",
        "Inherent risks": "Doğal riskler",
        "Control risks": "Kontrol riskleri",
        "Detection risks": "Tespit riskleri",
        "Fraud risks": "Hile riskleri",
        "IT risks": "IT riskleri",
        "Compliance risks": "Uyum riskleri",
        "Financial statement risks": "Finansal tablo riskleri",
        "Assertion risks": "İddia riskleri",
        "Significant risks": "Önemli riskler",
        "Categories": "Kategoriler",
        "Scoring": "Puanlama",
        "Heatmap": "Isı haritası",
        "Matrix": "Matris",
        "Responses": "Yanıtlar",
        "Procedures": "Prosedürler",
        "Owners": "Sorumlular",
        "Review notes": "İnceleme notları",
        "Comments": "Yorumlar",
        "History": "Geçmiş",
        "Settings": "Ayarlar",
        "Loading risk assessment workspace": "Risk değerlendirmesi çalışma alanı yükleniyor",
        "Unable to load risk assessment workspace": "Risk değerlendirmesi çalışma alanı yüklenemedi",
        "Something went wrong while loading this risk assessment.": "Bu risk değerlendirmesi yüklenirken bir hata oluştu.",
        "Risk assessment archived": "Risk değerlendirmesi arşivlendi",
        "This risk assessment is read-only. Restore it to continue updates.": "Bu risk değerlendirmesi salt okunurdur. Güncellemelere devam etmek için geri yükleyin.",
        "Risk status": "Risk durumu",
        "Assessment version": "Değerlendirme sürümü",
        "Pending review": "İnceleme bekliyor",
        "Open items": "Açık öğeler",
        "Risk dashboard": "Risk panosu",
        "Status, progress, and review readiness indicators.": "Durum, ilerleme ve inceleme hazırlığı göstergeleri.",
        "Risks before considering related controls.": "İlgili kontroller dikkate alınmadan önceki riskler.",
        "Risks related to design and operation of controls.": "Kontrollerin tasarımı ve işleyişiyle ilgili riskler.",
        "Risks that procedures fail to detect misstatements.": "Prosedürlerin yanlışlıkları tespit edememesi riski.",
        "Fraud risk factors and management override considerations.": "Hile risk faktörleri ve yönetimin kontrolü aşma hususları.",
        "Technology, system access, and data integrity risks.": "Teknoloji, sistem erişimi ve veri bütünlüğü riskleri.",
        "Regulatory and legal compliance risks.": "Düzenleyici ve hukuki uyum riskleri.",
        "Financial statement level risks of material misstatement.": "Finansal tablo düzeyinde önemli yanlışlık riskleri.",
        "Assertion-level risks linked to relevant accounts.": "İlgili hesaplarla bağlantılı iddia düzeyi riskleri.",
        "High-priority risks requiring focused audit response.": "Odaklı denetim yanıtı gerektiren yüksek öncelikli riskler.",
        "Risk categories": "Risk kategorileri",
        "Configured categories used to organize risk items.": "Risk öğelerini düzenlemek için kullanılan yapılandırılmış kategoriler.",
        "Aggregate scoring indicators across identified risks.": "Belirlenen riskler genelinde toplulaştırılmış puanlama göstergeleri.",
        "Visual distribution of risk ratings.": "Risk derecelendirmelerinin görsel dağılımı.",
        "Assertion matrix": "İddia matrisi",
        "Account and assertion ratings overview.": "Hesap ve iddia derecelendirmelerine genel bakış.",
        "Risk responses": "Risk yanıtları",
        "Planned responses for identified risks.": "Belirlenen riskler için planlanan yanıtlar.",
        "Procedure links": "Prosedür bağlantıları",
        "Linked procedures for addressing assessed risks.": "Değerlendirilen riskleri ele almak için bağlantılı prosedürler.",
        "Risk owners": "Risk sorumluları",
        "Assigned owners for each risk item.": "Her risk öğesi için atanmış sorumlular.",
        "Reviewer notes captured during risk assessment cycles.": "Risk değerlendirmesi döngülerinde kaydedilen inceleyici notları.",
        "Internal comments and collaboration notes.": "Dahili yorumlar ve iş birliği notları.",
        "Timeline of risk assessment changes and approvals.": "Risk değerlendirmesi değişiklikleri ve onaylarının zaman çizelgesi.",
        "Archive and restore controls for this risk assessment.": "Bu risk değerlendirmesi için arşivleme ve geri yükleme kontrolleri.",
        "Audit area": "Denetim alanı",
        "Select audit area": "Denetim alanını seçin",
        "No categories": "Kategori yok",
        "Add categories to organize risk items.": "Risk öğelerini düzenlemek için kategori ekleyin.",
        "Category name": "Kategori adı",
        "Category description": "Kategori açıklaması",
        "Add category": "Kategori ekle",
        "Summary of scoring outcomes across the risk register.": "Risk sicili genelinde puanlama sonuçlarının özeti.",
        "No scoring data": "Puanlama verisi yok",
        "Scoring indicators appear when risk items are added.": "Risk öğeleri eklendiğinde puanlama göstergeleri görünür.",
        "Rated items": "Derecelendirilmiş öğeler",
        "High likelihood": "Yüksek olasılık",
        "High impact": "Yüksek etki",
        "Significant residual": "Önemli artık risk",
        "Risk rating distribution across the register.": "Sicil genelinde risk derecelendirme dağılımı.",
        "No heatmap data": "Isı haritası verisi yok",
        "Heatmap buckets appear when ratings are recorded.": "Derecelendirmeler kaydedildiğinde ısı haritası dilimleri görünür.",
        "Unrated": "Derecelendirilmemiş",
        "Account": "Hesap",
        "Assertion": "İddia",
        "Rating": "Derecelendirme",
        "Select a heatmap cell to view details.": "Ayrıntıları görmek için bir ısı haritası hücresi seçin.",
        "Show significant and rated cells only": "Yalnızca önemli ve derecelendirilmiş hücreleri göster",
        "Manage assertion ratings by account.": "Hesaba göre iddia derecelendirmelerini yönetin.",
        "No assertion ratings": "İddia derecelendirmesi yok",
        "Add assertion ratings to populate the matrix.": "Matrisi doldurmak için iddia derecelendirmeleri ekleyin.",
        "Account name": "Hesap adı",
        "Add assertion rating": "İddia derecelendirmesi ekle",
        "Select a matrix cell to view or update ratings.": "Derecelendirmeleri görmek veya güncellemek için bir matris hücresi seçin.",
        "Select rating": "Derecelendirme seçin",
        "Document responses for identified risk items.": "Belirlenen risk öğeleri için yanıtları belgelendirin.",
        "No responses": "Yanıt yok",
        "Add risk responses to capture planned actions.": "Planlanan eylemleri kaydetmek için risk yanıtları ekleyin.",
        "Select risk item": "Risk öğesi seçin",
        "Response description": "Yanıt açıklaması",
        "Add response": "Yanıt ekle",
        "Link planned procedures to risk items.": "Planlanan prosedürleri risk öğelerine bağlayın.",
        "No linked procedures": "Bağlı prosedür yok",
        "Add procedure links to map response execution.": "Yanıt uygulamasını eşlemek için prosedür bağlantıları ekleyin.",
        "Procedure reference": "Prosedür referansı",
        "Add procedure link": "Prosedür bağlantısı ekle",
        "Assign owners to risk register items.": "Risk sicili öğelerine sorumlu atayın.",
        "No risk items": "Risk öğesi yok",
        "Risk items will appear here once created.": "Risk öğeleri oluşturulduğunda burada görünecek.",
        "Owner identifier": "Sorumlu tanımlayıcısı",
        "Update owner": "Sorumluyu güncelle",
        "Unassigned": "Atanmamış",
        "Capture reviewer notes and follow-up points.": "İnceleyici notlarını ve takip maddelerini kaydedin.",
        "No review notes": "İnceleme notu yok",
        "Review notes appear during review cycles.": "İnceleme notları inceleme döngülerinde görünür.",
        "Add review note": "İnceleme notu ekle",
        "Add note": "Not ekle",
        "Capture internal comments related to risks.": "Risklerle ilgili dahili yorumları kaydedin.",
        "No comments": "Yorum yok",
        "Comments appear here once added.": "Yorumlar eklendiğinde burada görünür.",
        "Add internal comment": "Dahili yorum ekle",
        "Add comment": "Yorum ekle",
        "Read-only timeline of risk assessment activity.": "Risk değerlendirmesi faaliyetinin salt okunur zaman çizelgesi.",
        "No risk activity": "Risk faaliyeti yok",
        "Risk activity will appear here as changes are recorded.": "Değişiklikler kaydedildikçe risk faaliyeti burada görünecek.",
        "Updated": "Güncellendi",
        "Risk assessment created": "Risk değerlendirmesi oluşturuldu",
        "Risk assessment updated": "Risk değerlendirmesi güncellendi",
        "Risk assessment submitted": "Risk değerlendirmesi gönderildi",
        "Risk assessment returned": "Risk değerlendirmesi iade edildi",
        "Risk assessment approved": "Risk değerlendirmesi onaylandı",
        "Category added": "Kategori eklendi",
        "Risk item added": "Risk öğesi eklendi",
        "Risk item updated": "Risk öğesi güncellendi",
        "Assertion rating updated": "İddia derecelendirmesi güncellendi",
        "Response added": "Yanıt eklendi",
        "Procedure linked": "Prosedür bağlandı",
        "Note added": "Not eklendi",
        "Significant risks acknowledged": "Önemli riskler teyit edildi",
        "Archive or restore this risk assessment.": "Bu risk değerlendirmesini arşivleyin veya geri yükleyin.",
        "Archive risk assessment": "Risk değerlendirmesini arşivle",
        "Confirm archive": "Arşivlemeyi onayla",
        "Restore risk assessment": "Risk değerlendirmesini geri yükle",
        "Confirm restore": "Geri yüklemeyi onayla",
        "This risk assessment is archived.": "Bu risk değerlendirmesi arşivlendi.",
        "You have view-only access to risk assessment settings.": "Risk değerlendirmesi ayarlarına yalnızca görüntüleme erişiminiz var.",
    }.items()
}


def translate_section_leaf(lang, section_key, field):
    if lang == "az":
        n = section_meta[section_key]["az"]
        plural = "İT riskləri" if section_key == "itRisks" else f"{n.capitalize()} risklər"
        if field == "title":
            return plural
        if field == "description":
            return f"{plural} bəndlərini sənədləşdirin."
        if field == "emptyTitle":
            return f"{plural} yoxdur"
        if field == "emptyDescription":
            return "Bu bölməni başlatmaq üçün risk bəndləri əlavə edin."
        if field == "titlePlaceholder":
            return "Risk başlığı"
        if field == "descriptionPlaceholder":
            return "Risk təsviri"
        if field == "addAction":
            return "Risk bəndi əlavə et"
        if field == "categoryLabel":
            return "Kateqoriya seçin"
        if field == "riskTypeLabel":
            return "Risk növü"
        if field == "likelihoodLabel":
            return "Ehtimallılıq"
        if field == "impactLabel":
            return "Təsir"
        if field == "inherentRatingLabel":
            return "Təbii reytinq"
        if field == "auditAreaLabel":
            return "Audit sahəsi"
        if field == "auditAreaPlaceholder":
            return "Audit sahəsini seçin"
        if field == "significantBadge":
            return "Əhəmiyyətli"
        if field == "procedureLinkedBadge":
            return "Prosedur bağlıdır"
        if field == "procedureUnlinkedBadge":
            return "Prosedur tələb olunur"
    if lang == "ru":
        plural = {
            "inherentRisks": "Неотъемлемые риски",
            "controlRisks": "Риски контроля",
            "detectionRisks": "Риски необнаружения",
            "fraudRisks": "Риски мошенничества",
            "itRisks": "ИТ-риски",
            "complianceRisks": "Комплаенс-риски",
            "financialStatementRisks": "Риски финансовой отчетности",
            "assertionRisks": "Риски предпосылок",
            "significantRisks": "Значимые риски",
        }[section_key]
        if field == "title":
            return plural
        if field == "description":
            return "Документируйте пункты рисков в этом разделе."
        if field == "emptyTitle":
            return f"{plural} отсутствуют"
        if field == "emptyDescription":
            return "Добавьте пункты рисков, чтобы начать этот раздел."
        if field == "titlePlaceholder":
            return "Заголовок риска"
        if field == "descriptionPlaceholder":
            return "Описание риска"
        if field == "addAction":
            return "Добавить пункт риска"
        if field == "categoryLabel":
            return "Выберите категорию"
        if field == "riskTypeLabel":
            return "Тип риска"
        if field == "likelihoodLabel":
            return "Вероятность"
        if field == "impactLabel":
            return "Влияние"
        if field == "inherentRatingLabel":
            return "Неотъемлемый рейтинг"
        if field == "auditAreaLabel":
            return "Область аудита"
        if field == "auditAreaPlaceholder":
            return "Выберите область аудита"
        if field == "significantBadge":
            return "Значимый"
        if field == "procedureLinkedBadge":
            return "Процедура связана"
        if field == "procedureUnlinkedBadge":
            return "Требуется процедура"
    if lang == "tr":
        plural = {
            "inherentRisks": "Doğal riskler",
            "controlRisks": "Kontrol riskleri",
            "detectionRisks": "Tespit riskleri",
            "fraudRisks": "Hile riskleri",
            "itRisks": "IT riskleri",
            "complianceRisks": "Uyum riskleri",
            "financialStatementRisks": "Finansal tablo riskleri",
            "assertionRisks": "İddia riskleri",
            "significantRisks": "Önemli riskler",
        }[section_key]
        if field == "title":
            return plural
        if field == "description":
            return "Bu bölümdeki risk öğelerini belgelendirin."
        if field == "emptyTitle":
            return f"{plural} yok"
        if field == "emptyDescription":
            return "Bu bölümü başlatmak için risk öğeleri ekleyin."
        if field == "titlePlaceholder":
            return "Risk başlığı"
        if field == "descriptionPlaceholder":
            return "Risk açıklaması"
        if field == "addAction":
            return "Risk öğesi ekle"
        if field == "categoryLabel":
            return "Kategori seçin"
        if field == "riskTypeLabel":
            return "Risk türü"
        if field == "likelihoodLabel":
            return "Olasılık"
        if field == "impactLabel":
            return "Etki"
        if field == "inherentRatingLabel":
            return "Doğal derecelendirme"
        if field == "auditAreaLabel":
            return "Denetim alanı"
        if field == "auditAreaPlaceholder":
            return "Denetim alanını seçin"
        if field == "significantBadge":
            return "Önemli"
        if field == "procedureLinkedBadge":
            return "Prosedür bağlı"
        if field == "procedureUnlinkedBadge":
            return "Prosedür gerekli"
    return None


def localize(lang, node, path=()):
    if isinstance(node, dict):
        out = {}
        for k, v in node.items():
            out[k] = localize(lang, v, path + (k,))
        return out
    if not isinstance(node, str):
        return node

    if len(path) >= 2 and path[0] in risk_sections:
        val = translate_section_leaf(lang, path[0], path[1])
        if val is not None:
            return val

    if path == ("history", "actions", "risk_assessment.archived"):
        return {"az": "Risk qiymətləndirməsi arxivləndi", "ru": "Оценка рисков архивирована", "tr": "Risk değerlendirmesi arşivlendi"}[lang]
    if path == ("history", "actions", "risk_assessment.restored"):
        return {"az": "Risk qiymətləndirməsi bərpa edildi", "ru": "Оценка рисков восстановлена", "tr": "Risk değerlendirmesi geri yüklendi"}[lang]

    mapped = exact[lang].get(node)
    if mapped is not None:
        return mapped
    return f"__MISSING__:{node}"


result = {}
missing = {"az": set(), "ru": set(), "tr": set()}
for lang in ("az", "ru", "tr"):
    obj = localize(lang, deepcopy(en))

    def scan(n):
        if isinstance(n, dict):
            for v in n.values():
                scan(v)
        elif isinstance(n, str) and n.startswith("__MISSING__:"):
            missing[lang].add(n.replace("__MISSING__:", ""))

    scan(obj)
    result[lang] = obj

if any(missing.values()):
    for lang in ("az", "ru", "tr"):
        if missing[lang]:
            print(lang, "MISSING:", len(missing[lang]))
            for s in sorted(missing[lang]):
                print(" ", s)
    raise SystemExit(1)

out = "/** @type {Record<'az'|'ru'|'tr', object>} */\n"
out += "export const riskAssessment = " + json.dumps(result, ensure_ascii=False, indent=2) + ";\n"
(root / "scripts/locale-overlays/maps/riskAssessment.mjs").write_text(out, encoding="utf-8")
print("wrote riskAssessment.mjs")
