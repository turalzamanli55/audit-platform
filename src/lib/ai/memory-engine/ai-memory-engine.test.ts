import { describe, expect, it } from "vitest";
import {
  bootstrapEnterpriseMemoryEngine,
  collectAiRuntimeContext,
  EME_MEMORY_REGISTRY,
  EnterpriseMemoryEngine,
} from "@/lib/ai";

function context(overrides: Record<string, unknown> = {}) {
  return collectAiRuntimeContext({
    route: "/en/app/companies",
    moduleId: "companies",
    locale: "en",
    userId: "user-1",
    workspaceId: "ws-1",
    organizationId: "org-1",
    companyId: "co-1",
    engagementId: "eng-1",
    permissionCodes: ["companies.read"],
    ...overrides,
  });
}

describe("Enterprise Memory Engine", () => {
  it("registers memory categories across user, workspace, company, engagement, organization, and learning levels", () => {
    const levels = new Set(EME_MEMORY_REGISTRY.map((entry) => entry.level));
    expect(levels.has("user")).toBe(true);
    expect(levels.has("workspace")).toBe(true);
    expect(levels.has("company")).toBe(true);
    expect(levels.has("engagement")).toBe(true);
    expect(levels.has("organization")).toBe(true);
    expect(levels.has("learning")).toBe(true);
    expect(EME_MEMORY_REGISTRY.length).toBeGreaterThanOrEqual(30);
  });

  it("stores and resolves user preferences without provider dependencies", () => {
    const engine = new EnterpriseMemoryEngine();
    const ctx = context();
    const record = engine.remember(ctx, {
      key: "preferred_language",
      level: "preference",
      category: "language",
      label: "Preferred Language",
      value: "en",
    });
    expect("ok" in record ? record.ok : true).not.toBe(false);
    const resolved = engine.resolve({ context: ctx });
    expect(resolved.preferences.language).toBe("en");
    expect(resolved.entries.some((entry) => entry.key === "preferred_language")).toBe(true);
  });

  it("isolates memories between tenants and workspaces", () => {
    const engine = bootstrapEnterpriseMemoryEngine();
    engine.remember(context({ organizationId: "org-a", workspaceId: "ws-a" }), {
      key: "firm_note",
      level: "organization",
      category: "methodology",
      label: "Methodology",
      value: "ISA",
    });
    const foreign = engine.resolve({
      context: context({ organizationId: "org-b", workspaceId: "ws-b" }),
    });
    expect(foreign.entries.some((entry) => entry.key === "firm_note")).toBe(false);
  });

  it("blocks secrets and produces learning candidates instead of auto-persisting", () => {
    const engine = new EnterpriseMemoryEngine();
    const ctx = context();
    const blocked = engine.remember(ctx, {
      key: "api_key",
      level: "user",
      category: "language",
      label: "Secret",
      value: "sk-test",
    });
    expect("ok" in blocked && blocked.ok === false).toBe(true);

    const signal = engine.ingestLearningSignal(ctx, {
      kind: "approved_mapping",
      key: "account_mapping",
      value: { from: "1000", to: "cash" },
      confidence: 0.9,
      moduleId: "uaie",
    });
    expect(signal.ok).toBe(true);
    if (signal.ok) {
      expect(signal.candidate.reviewDecision).toBe("pending");
      expect(engine.storage.listRecords({ level: "learning", status: "active" }).length).toBe(0);
      const promoted = engine.promoteCandidate(ctx, signal.candidate.id, "user-1");
      expect(promoted).toBeTruthy();
      expect(engine.storage.listRecords({ level: "learning", status: "active" }).length).toBe(1);
    }
  });

  it("ranks fresher and pinned memories higher", () => {
    const engine = new EnterpriseMemoryEngine();
    const ctx = context();
    engine.remember(ctx, {
      key: "old_pref",
      level: "user",
      category: "writing_style",
      label: "Old",
      value: "formal",
      policy: { confidence: 0.5, importance: 0.3 },
    });
    const pinned = engine.remember(ctx, {
      key: "pinned_pref",
      level: "user",
      category: "writing_style",
      label: "Pinned",
      value: "concise",
      pinned: true,
      policy: { confidence: 0.6, importance: 0.4 },
    });
    expect("ok" in pinned ? pinned.ok : true).not.toBe(false);
    engine.applyHumanAction(ctx, { action: "pin", memoryId: (pinned as { id: string }).id });
    const resolved = engine.resolve({ context: ctx, limit: 5 });
    expect(resolved.entries[0]?.key).toBe("pinned_pref");
  });

  it("supports keyword search and semantic contract-only mode", () => {
    const engine = new EnterpriseMemoryEngine();
    const ctx = context();
    engine.remember(ctx, {
      key: "erp_system",
      level: "company",
      category: "erp",
      label: "ERP",
      value: "SAP",
    });
    const keyword = engine.search({
      context: ctx,
      mode: "keyword",
      text: "SAP",
      level: "company",
    });
    expect(keyword.length).toBe(1);
    const semantic = engine.search({ context: ctx, mode: "semantic", text: "ERP" });
    expect(semantic.length).toBe(0);
  });

  it("maps resolved context to prompt-safe AiMemoryEntry objects", () => {
    const engine = new EnterpriseMemoryEngine();
    const ctx = context();
    engine.remember(ctx, {
      key: "ai_verbosity",
      level: "preference",
      category: "ai_verbosity",
      label: "AI Verbosity",
      value: "minimal",
    });
    const promptEntries = engine.toPromptMemory({ context: ctx });
    expect(promptEntries[0]?.key).toMatch(/^preference\./);
    expect(JSON.stringify(promptEntries)).not.toMatch(/password|api_key|token/i);
  });

  it("supports human control: forget, export, import, reset", () => {
    const engine = new EnterpriseMemoryEngine();
    const ctx = context();
    const created = engine.remember(ctx, {
      key: "temp_note",
      level: "user",
      category: "writing_style",
      label: "Note",
      value: "Use concise tables",
    }) as { id: string };
    engine.applyHumanAction(ctx, { action: "forget", memoryId: created.id });
    expect(engine.listMemories(ctx).some((entry) => entry.id === created.id)).toBe(false);

    engine.remember(ctx, {
      key: "export_me",
      level: "user",
      category: "language",
      label: "Language",
      value: "az",
    });
    const exported = engine.exportMemories(ctx);
    expect(exported.records.some((entry) => entry.key === "export_me")).toBe(true);

    engine.applyHumanAction(ctx, {
      action: "reset",
      scope: { userId: ctx.userId, workspaceId: ctx.workspaceId },
      levels: ["user"],
    });
    expect(engine.listMemories(ctx).length).toBe(0);

    const imported = engine.importMemories(ctx, exported);
    expect(imported).toBeGreaterThan(0);
  });

  it("exposes telemetry with hit rate and level counts", () => {
    const engine = new EnterpriseMemoryEngine();
    const ctx = context();
    engine.remember(ctx, {
      key: "verbosity",
      level: "preference",
      category: "ai_verbosity",
      label: "Verbosity",
      value: "standard",
    });
    engine.resolve({ context: ctx });
    const stats = engine.stats();
    expect(stats.telemetry.memoriesCreated).toBeGreaterThan(0);
    expect(stats.telemetry.byLevel.preference).toBeGreaterThan(0);
  });
});
