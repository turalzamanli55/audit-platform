import { describe, expect, it } from "vitest";
import {
  listContextResolvers,
  resolveModuleContext,
  fillUtteranceTemplate,
  inferModuleIdFromPath,
  collectAiRuntimeContext,
} from "@/lib/ai";

describe("AI Everywhere context resolvers", () => {
  it("registers resolvers for all major modules", () => {
    const resolvers = listContextResolvers();
    expect(resolvers.length).toBe(16);
    const ids = new Set(resolvers.map((resolver) => resolver.moduleId));
    expect(ids.has("planning")).toBe(true);
    expect(ids.has("materiality")).toBe(true);
    expect(ids.has("import-intelligence")).toBe(true);
    expect(ids.has("uaie")).toBe(true);
  });

  it("infers module from route and resolves capabilities", () => {
    expect(inferModuleIdFromPath("/en/app/engagements/demo/materiality")).toBe("materiality");
    const context = collectAiRuntimeContext({
      route: "/en/app/engagements/demo/materiality",
      moduleId: "materiality",
      locale: "en",
      workspaceId: "ws-1",
      organizationId: "org-1",
      permissionCodes: [],
    });
    const resolution = resolveModuleContext({
      context,
      selectedObjectId: "pkg-1",
      selectedObjectLabel: "Overall materiality",
      selectedObjectType: "materiality_package",
    });
    expect(resolution.moduleId).toBe("materiality");
    expect(resolution.capabilities.some((capability) => capability.id === "ask")).toBe(true);
    expect(resolution.capabilities.some((capability) => capability.id === "explain")).toBe(true);
    expect(resolution.capabilities.some((capability) => capability.id === "analyze")).toBe(true);
    expect(resolution.suggestions.length).toBeGreaterThan(0);
  });

  it("fills utterance templates without asking the user for page context", () => {
    const utterance = fillUtteranceTemplate("Explain {{object}} in {{module}}.", {
      object: "Revenue risk",
      module: "Risk Assessment",
    });
    expect(utterance).toBe("Explain Revenue risk in Risk Assessment.");
  });
});
