import { readFileSync, writeFileSync } from "node:fs";

const en = JSON.parse(readFileSync("src/i18n/messages/ai-workspace-en.json", "utf8"));

function deepMap(obj, mapFn) {
  if (typeof obj === "string") return mapFn(obj);
  if (Array.isArray(obj)) return obj.map((v) => deepMap(v, mapFn));
  const out = {};
  for (const [k, v] of Object.entries(obj)) out[k] = deepMap(v, mapFn);
  return out;
}

const overlays = {
  az: {
    "AI Workspace": "AI İş sahəsi",
    "Welcome to the System": "Sistemə xoş gəlmisiniz",
    "Start Conversation": "Söhbətə başla",
    "Show Examples": "Nümunələri göstər",
    "Open Documentation": "Sənədləri aç",
    "Hide Welcome": "Salamlamanı gizlət",
    "Never show again": "Bir daha göstərmə",
    History: "Tarixçə",
    Suggestions: "Tövsiyələr",
    Actions: "Əməliyyatlar",
    Knowledge: "Bilik",
    Conversation: "Söhbət",
    "Provider status": "Provayder statusu",
    Send: "Göndər",
    Retry: "Yenidən cəhd et",
    Module: "Modul",
    Company: "Şirkət",
    Workspace: "İş sahəsi",
    Organization: "Təşkilat",
    Permissions: "İcazələr",
    "Loading AI Workspace…": "AI İş sahəsi yüklənir…",
    "No conversation yet": "Hələ söhbət yoxdur",
    "No conversations yet": "Hələ söhbət yoxdur",
    "New conversation": "Yeni söhbət",
    "Use suggestion": "Tövsiyəni istifadə et",
    Preview: "Önizləmə",
    "Not configured": "Konfiqurasiya olunmayıb",
  },
  ru: {
    "Welcome to the System": "Добро пожаловать в систему",
    "Start Conversation": "Начать разговор",
    "Show Examples": "Показать примеры",
    "Open Documentation": "Открыть документацию",
    "Hide Welcome": "Скрыть приветствие",
    "Never show again": "Больше не показывать",
    History: "История",
    Suggestions: "Подсказки",
    Actions: "Действия",
    Knowledge: "Знания",
    Conversation: "Разговор",
    "Provider status": "Статус провайдера",
    Send: "Отправить",
    Retry: "Повторить",
    Module: "Модуль",
    Company: "Компания",
    Engagement: "Проект",
    Workspace: "Рабочая область",
    Organization: "Организация",
    Permissions: "Права",
    "Loading AI Workspace…": "Загрузка AI Workspace…",
    "No conversation yet": "Пока нет разговора",
    "No conversations yet": "Пока нет разговоров",
    "New conversation": "Новый разговор",
    "Use suggestion": "Использовать подсказку",
    Preview: "Просмотр",
    "Not configured": "Не настроено",
  },
  tr: {
    "AI Workspace": "AI Çalışma Alanı",
    "Welcome to the System": "Sisteme hoş geldiniz",
    "Start Conversation": "Sohbete başla",
    "Show Examples": "Örnekleri göster",
    "Open Documentation": "Belgeleri aç",
    "Hide Welcome": "Karşılama ekranını gizle",
    "Never show again": "Bir daha gösterme",
    History: "Geçmiş",
    Suggestions: "Öneriler",
    Actions: "Eylemler",
    Knowledge: "Bilgi",
    Conversation: "Sohbet",
    "Provider status": "Sağlayıcı durumu",
    Send: "Gönder",
    Retry: "Yeniden dene",
    Module: "Modül",
    Company: "Şirket",
    Engagement: "Denetim",
    Workspace: "Çalışma alanı",
    Organization: "Organizasyon",
    Permissions: "İzinler",
    "Loading AI Workspace…": "AI Çalışma Alanı yükleniyor…",
    "No conversation yet": "Henüz sohbet yok",
    "No conversations yet": "Henüz sohbet yok",
    "New conversation": "Yeni sohbet",
    "Use suggestion": "Öneriyi kullan",
    Preview: "Önizleme",
    "Not configured": "Yapılandırılmadı",
  },
};

for (const [locale, overlay] of Object.entries(overlays)) {
  const mapped = deepMap(en, (s) => overlay[s] ?? s);
  writeFileSync(`src/i18n/messages/ai-workspace-${locale}.json`, `${JSON.stringify(mapped, null, 2)}\n`);
}

console.log("ok");
