import fs from "fs";
import path from "path";

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!full.endsWith(".ts")) continue;
    let content = fs.readFileSync(full, "utf8");
    const original = content;
    content = content
      .replace(/completionPackageId/g, "reportingPackageId")
      .replace(/reviewPackageId/g, "reportingPackageId")
      .replace(/reportSectionId: validated\.reviewItemId/g, "reportSectionId: validated.reportSectionId")
      .replace(/reviewItemId: validated\.reportSectionId/g, "reportSectionId: validated.reportSectionId")
      .replace(/reviewItemId: validated\.completionItemId/g, "reportSectionId: validated.reportSectionId")
      .replace(/commentType: "completion"/g, 'commentType: "reporting"');
    if (content !== original) {
      fs.writeFileSync(full, content);
      console.log("fixed", full);
    }
  }
}

walk("src/lib/actions/reporting");
