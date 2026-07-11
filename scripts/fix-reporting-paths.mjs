import fs from "fs";
import path from "path";

const replacements = [
  [
    /@\/components\/reporting\/create\/completion-create-experience/g,
    "@/components/reporting/create/reporting-create-experience",
  ],
  [
    /@\/components\/reporting\/items\/completion-item-row/g,
    "@/components/reporting/items/reporting-item-row",
  ],
  [
    /@\/components\/reporting\/sections\/completion-section-experiences/g,
    "@/components/reporting/sections/reporting-section-experiences",
  ],
  [
    /@\/components\/reporting\/overview\/completion-overview-experience/g,
    "@/components/reporting/overview/reporting-overview-experience",
  ],
  [
    /@\/lib\/actions\/reporting\/completion-action/g,
    "@/lib/actions/reporting/reporting-action",
  ],
  [
    /@\/repositories\/reporting\/completion-repository/g,
    "@/repositories/reporting/reporting-repository",
  ],
  [/from "\.\/completion-action"/g, 'from "./reporting-action"'],
  [/validateArchiveCompletionInput/g, "validateArchiveReportingInput"],
];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!/\.(ts|tsx)$/.test(entry.name)) continue;
    let content = fs.readFileSync(full, "utf8");
    const original = content;
    for (const [pattern, replacement] of replacements) {
      content = content.replace(pattern, replacement);
    }
    if (content !== original) {
      fs.writeFileSync(full, content);
      console.log("fixed", full);
    }
  }
}

for (const dir of [
  "src/components/reporting",
  "src/lib/actions/reporting",
  "src/lib/reporting",
  "src/app/[locale]/(protected)/app/engagements/[slug]/reporting",
]) {
  walk(dir);
}

const sectionPath = "src/components/reporting/sections/reporting-section-experiences.tsx";
let section = fs.readFileSync(sectionPath, "utf8");
if (!section.includes("export const IfrsNotesExperience")) {
  section += `
export const IfrsNotesExperience = ManagementLetterExperience;
export const AuditFindingsExperience = FinancialStatementsExperience;
export const RecommendationsExperience = FinancialStatementsExperience;
export const AppendicesExperience = ExecutiveSummaryExperience;
`;
  fs.writeFileSync(sectionPath, section);
  console.log("added section aliases");
}
