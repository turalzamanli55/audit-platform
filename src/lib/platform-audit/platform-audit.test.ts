import { describe, expect, it } from "vitest";
import {
  calculateEvidenceCompletionPct,
  emptyEpacEvidence,
  deriveCertificationLevel,
} from "./types";
import { platformAuditEngine } from "./engine";
import { expandAliases, normalizeIdentity, resolveModuleRoots, discoverCodebaseRoots } from "./evidence-engine/aliases";
import { CONFIDENCE_WEIGHT } from "./evidence-engine/types";

describe("EPAC evidence math", () => {
  it("returns 0% when no evidence exists", () => {
    expect(calculateEvidenceCompletionPct(emptyEpacEvidence())).toBe(0);
  });

  it("returns 100% only when all evidence dimensions are present", () => {
    const evidence = emptyEpacEvidence({
      database: true,
      migration: true,
      repository: true,
      serverAction: true,
      route: true,
      workspace: true,
      component: true,
      localization: true,
      tests: true,
      permissions: true,
      workflow: true,
      documentation: true,
    });
    expect(calculateEvidenceCompletionPct(evidence)).toBe(100);
  });

  it("derives certification only from completion thresholds", () => {
    expect(deriveCertificationLevel(0)).toBe("prototype");
    expect(deriveCertificationLevel(96)).toBe("enterprise_certified");
  });
});

describe("EPAC evidence engine aliases", () => {
  it("resolves mod_companies to company roots without exact folder match", () => {
    const roots = discoverCodebaseRoots(process.cwd());
    const resolved = resolveModuleRoots("mod_companies", "Companies", roots);
    expect(resolved.matchedRoots.includes("company")).toBe(true);
    expect(normalizeIdentity("mod_company")).toBe("company");
    expect(expandAliases("mod_organizations").some((a) => normalizeIdentity(a) === "organization")).toBe(
      true,
    );
  });

  it("maps confidence weights", () => {
    expect(CONFIDENCE_WEIGHT.verified).toBe(100);
    expect(CONFIDENCE_WEIGHT.missing).toBe(0);
  });
});

describe("EPAC engine v2", () => {
  it(
    "runs semantic evidence audit from PROJECT_BIBLE",
    () => {
      const report = platformAuditEngine.run({ persist: false });
      expect(report.documentation.domains.length).toBeGreaterThan(0);
      expect(report.modules.length).toBeGreaterThan(0);
      expect(report.capabilities.length).toBeGreaterThan(0);
      expect(report.evidenceResolution.filesScanned).toBeGreaterThan(0);
      expect(report.verifiedCompletionPct).toBeGreaterThanOrEqual(0);
      expect(report.evidenceConfidencePct).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(report.falsePositives)).toBe(true);
      // Module resolution should find company via aliases
      const company = report.modules.find(
        (m) => m.id.includes("compan") || m.matchedRoots.includes("company"),
      );
      expect(company).toBeTruthy();
    },
    300_000,
  );
});
