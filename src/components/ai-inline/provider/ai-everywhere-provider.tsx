"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { useTenant } from "@/providers/tenant-provider";
import { useLanguage } from "@/providers";
import {
  bootstrapAiFoundation,
  type AiCopilotCore,
  type AiCopilotTurnPreview,
  type AiLocale,
  type AiModuleKnowledge,
  type AiRuntimeContext,
} from "@/lib/ai";
import {
  fillUtteranceTemplate,
  inferModuleIdFromPath,
  resolveModuleContext,
  type AiInlineCapability,
  type AiModuleContextResolution,
} from "@/lib/ai/context-resolvers";
import { evaluateAiPermission } from "@/lib/ai/permissions/ai-permission-layer";
import {
  AI_EVERYWHERE_LABELS_EN,
  type AiEverywhereLabels,
} from "@/components/ai-inline/shared/labels";
import type { AiWorkspaceMessage } from "@/components/ai/types";
import { createAiId } from "@/lib/ai/utils/id";

export type AiEverywhereSelection = {
  objectType: string;
  objectId: string;
  objectLabel?: string;
};

export type AiEverywhereHostValue = {
  labels: AiEverywhereLabels;
  open: boolean;
  setOpen: (open: boolean) => void;
  core: AiCopilotCore | null;
  context: AiRuntimeContext | null;
  resolution: AiModuleContextResolution | null;
  knowledge: AiModuleKnowledge | null;
  messages: AiWorkspaceMessage[];
  selection: AiEverywhereSelection | null;
  lastPreview: AiCopilotTurnPreview | null;
  canUseAi: boolean;
  openAsk: (selection?: AiEverywhereSelection | null) => void;
  openExplain: (selection?: AiEverywhereSelection | null) => void;
  openAnalyze: (selection?: AiEverywhereSelection | null) => void;
  openSummarize: (selection?: AiEverywhereSelection | null) => void;
  runCapability: (capability: AiInlineCapability, selection?: AiEverywhereSelection | null) => void;
  submitUtterance: (utterance: string) => void;
  clearConversation: () => void;
};

const AiEverywhereContext = createContext<AiEverywhereHostValue | null>(null);

function detectDevice(): AiRuntimeContext["device"] {
  if (typeof window === "undefined") return "unknown";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1280) return "tablet";
  return "desktop";
}

function buildAssistantMessage(
  preview: AiCopilotTurnPreview,
  utterance: string,
): AiWorkspaceMessage {
  const blocks: AiWorkspaceMessage["blocks"] = [
    {
      type: "status",
      tone: "info",
      title: `Intent: ${preview.planner.intent}`,
      body: preview.planner.rationale,
    },
    {
      type: "markdown",
      content: preview.skillResult?.description
        ? `${preview.skillResult.title}: ${preview.skillResult.description}`
        : `Governed preview for: ${utterance}`,
    },
  ];

  if (preview.knowledgeGraphContext?.citations?.length) {
    blocks.push({
      type: "reference",
      title: "Knowledge references",
      meta: `${preview.knowledgeGraphContext.citations.length} citations`,
    });
  }

  if (preview.orchestration?.usage) {
    blocks.push({
      type: "timeline",
      items: [
        {
          id: "orch",
          label: `Strategy: ${preview.orchestration.strategy}`,
          detail: preview.orchestration.summary,
        },
      ],
    });
  }

  return {
    id: createAiId("msg"),
    role: "assistant",
    createdAt: new Date().toISOString(),
    blocks,
  };
}

export function AiEverywhereProvider({
  children,
  labels = AI_EVERYWHERE_LABELS_EN,
}: {
  children: ReactNode;
  labels?: AiEverywhereLabels;
}) {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const { resolvedTheme } = useTheme();
  const tenant = useTenant();
  const [open, setOpen] = useState(false);
  const [core] = useState(() => bootstrapAiFoundation().core);
  const [messages, setMessages] = useState<AiWorkspaceMessage[]>([]);
  const [selection, setSelection] = useState<AiEverywhereSelection | null>(null);
  const [lastPreview, setLastPreview] = useState<AiCopilotTurnPreview | null>(null);

  const moduleId = inferModuleIdFromPath(pathname);

  const context = useMemo(() => {
    return core.contextEngine.collect({
      route: pathname,
      moduleId: moduleId === "dashboard" || moduleId === "settings" ? moduleId : moduleId,
      locale: locale as AiLocale,
      organizationId: tenant.currentOrganizationId,
      workspaceId: tenant.currentWorkspaceId,
      userId: "session-user",
      roleSlugs: tenant.roleSlugs,
      permissionCodes: tenant.permissionCodes,
      theme: resolvedTheme === "dark" ? "dark" : "light",
      device: detectDevice(),
      navigationPath: pathname.split("/").filter(Boolean),
      selectedObjectType: selection?.objectType ?? null,
      selectedObjectId: selection?.objectId ?? null,
    });
  }, [core, pathname, moduleId, locale, tenant, resolvedTheme, selection]);

  const resolution = useMemo(
    () =>
      resolveModuleContext({
        context,
        selectedObjectType: selection?.objectType,
        selectedObjectId: selection?.objectId,
        selectedObjectLabel: selection?.objectLabel,
      }),
    [context, selection],
  );

  const knowledge = useMemo(() => {
    const modules = core.knowledgeEngine.listModules();
    if (!context.moduleId) return modules[0] ?? null;
    return modules.find((entry) => entry.id === context.moduleId) ?? modules[0] ?? null;
  }, [core, context.moduleId]);

  const canUseAi = evaluateAiPermission({
    context,
    requirement: { requireWorkspace: true },
  }).allowed;

  const submitUtterance = useCallback(
    (utterance: string) => {
      if (!canUseAi) return;
      const preview = core.previewTurn(
        {
          route: context.route,
          moduleId: context.moduleId,
          locale: context.locale,
          organizationId: context.organizationId,
          workspaceId: context.workspaceId,
          companyId: context.companyId,
          companySlug: context.companySlug,
          engagementId: context.engagementId,
          engagementSlug: context.engagementSlug,
          userId: context.userId,
          roleSlugs: context.roleSlugs,
          permissionCodes: context.permissionCodes,
          theme: context.theme,
          device: context.device,
          hasUnsavedChanges: context.hasUnsavedChanges,
          navigationPath: context.navigationPath,
          workflowId: context.workflowId,
          workflowStatus: context.workflowStatus,
          filters: context.filters,
          selectedObjectType: selection?.objectType ?? context.selectedObjectType,
          selectedObjectId: selection?.objectId ?? context.selectedObjectId,
          auditYear: context.auditYear,
        },
        { utterance },
      );
      setLastPreview(preview);
      const userMessage: AiWorkspaceMessage = {
        id: createAiId("msg"),
        role: "user",
        createdAt: new Date().toISOString(),
        blocks: [{ type: "markdown", content: utterance }],
      };
      setMessages((current) => [...current, userMessage, buildAssistantMessage(preview, utterance)]);
      setOpen(true);
    },
    [canUseAi, core, context, selection],
  );

  const runCapability = useCallback(
    (capability: AiInlineCapability, nextSelection?: AiEverywhereSelection | null) => {
      if (nextSelection) setSelection(nextSelection);
      const active = nextSelection ?? selection;
      const utterance = fillUtteranceTemplate(capability.utteranceTemplate, {
        object: active?.objectLabel ?? active?.objectId,
        module: resolution.displayName,
        selection: active?.objectLabel ?? active?.objectId,
      });
      submitUtterance(utterance);
    },
    [selection, resolution.displayName, submitUtterance],
  );

  const openWithKind = useCallback(
    (kind: "ask" | "explain" | "analyze" | "summarize", nextSelection?: AiEverywhereSelection | null) => {
      const capability =
        resolution.capabilities.find((entry) => entry.id === kind) ??
        resolution.capabilities.find((entry) => entry.kind === kind);
      if (capability) {
        runCapability(capability, nextSelection);
        return;
      }
      if (nextSelection) setSelection(nextSelection);
      setOpen(true);
    },
    [resolution.capabilities, runCapability],
  );

  const value: AiEverywhereHostValue = {
    labels,
    open,
    setOpen,
    core,
    context,
    resolution,
    knowledge,
    messages,
    selection,
    lastPreview,
    canUseAi,
    openAsk: (next) => openWithKind("ask", next),
    openExplain: (next) => openWithKind("explain", next),
    openAnalyze: (next) => openWithKind("analyze", next),
    openSummarize: (next) => openWithKind("summarize", next),
    runCapability,
    submitUtterance,
    clearConversation: () => setMessages([]),
  };

  return (
    <AiEverywhereContext.Provider value={value}>{children}</AiEverywhereContext.Provider>
  );
}

export function useAiEverywhere(): AiEverywhereHostValue {
  const value = useContext(AiEverywhereContext);
  if (!value) {
    throw new Error("useAiEverywhere must be used within AiEverywhereProvider");
  }
  return value;
}

export function useAiEverywhereOptional(): AiEverywhereHostValue | null {
  return useContext(AiEverywhereContext);
}
