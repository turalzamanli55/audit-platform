import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const messagesDir = path.join(root, "src/i18n/messages");
const overlaysDir = path.join(root, "scripts/locale-overlays");

const locales = [
  { code: "az", overlay: "az-modules.json" },
  { code: "ru", overlay: "ru-modules.json" },
  { code: "tr", overlay: "tr-modules.json" },
];

for (const { code, overlay } of locales) {
  const localePath = path.join(messagesDir, `${code}.json`);
  const overlayPath = path.join(overlaysDir, overlay);
  const locale = JSON.parse(fs.readFileSync(localePath, "utf8"));
  const modules = JSON.parse(fs.readFileSync(overlayPath, "utf8"));

  for (const key of Object.keys(modules)) {
    locale[key] = modules[key];
  }

  fs.writeFileSync(localePath, `${JSON.stringify(locale, null, 2)}\n`, "utf8");
  console.log(`Applied ${overlay} -> ${code}.json`);
}
