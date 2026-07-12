"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  type AiRuntimeContext,
  type AiModuleKnowledge,
  type AiLocale,
  type AiModuleId,
  type LlmPlatform,
  type LlmProviderCapabilities,
  type LlmHealthStatus,
} from "@/lib/ai";
import { createAiId } from "@/lib/ai/utils/id";
import type {
  AiWorkspaceConversationMeta,
  AiWorkspaceLabels,
  AiWorkspaceMessage,
} from "@/components/ai/types";
import type { AiActionCardItem } from "@/components/ai/actions/action-cards";
import {
  AI_WORKSPACE_SUGGESTION_SEEDS,
  type AiSuggestionItem,
} from "@/components/ai/suggestions/suggestion-panel";
import { evaluateAiPermission } from "@/lib/ai/permissions/ai-permission-layer";
import { EMPTY_LLM_CAPABILITIES } from "@/lib/ai/providers/provider";
import { getLlmProviderStatusAction } from "@/lib/actions/ai/llm-provider-actions";

const WELCOME_STORAGE_KEY = "ai-workspace-welcome-hidden";
const HISTORY_STORAGE_KEY = "ai-workspace-history-session";

type StoredSession = {
  conversations: AiWorkspaceConversationMeta[];
  messagesById: Record<string, AiWorkspaceMessage[]>;
  activeId: string | null;
};

export type AiWorkspaceHostValue = {
  labels: AiWorkspaceLabels;
  ready: boolean;
  core: AiCopilotCore | null;
  llm: LlmPlatform | null;
  context: AiRuntimeContext | null;
  knowledge: AiModuleKnowledge | null;
  modules: AiModuleKnowledge[];
  suggestions: AiSuggestionItem[];
  actions: AiActionCardItem[];
  conversations: AiWorkspaceConversationMeta[];
  activeConversationId: string | null;
  messages: AiWorkspaceMessage[];
  showWelcome: boolean;
  focusSignal: number;
  companyName: string;
  engagementName: string;
  organizationName: string;
  workspaceName: string;
  userLabel: string;
  providerLabel: string;
  modelLabel: string;
  providerConfigured: boolean;
  providerHealth: LlmHealthStatus;
  providerLatencyMs: number | null;
  tokenUsageLabel: string;
  estimatedCostLabel: string;
  capabilities: LlmProviderCapabilities;
  submitUtterance: (utterance: string) => void;
  createConversation: () => void;
  selectConversation: (id: string) => void;
  pinConversation: (id: string) => void;
  favoriteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  archiveConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  hideWelcome: () => void;
  neverShowWelcome: () => void;
  showExamples: () => void;
  focusComposer: () => void;
  closeMobilePanels: () => void;
  mobileHistoryOpen: boolean;
  mobileContextOpen: boolean;
  setMobileHistoryOpen: (open: boolean) => void;
  setMobileContextOpen: (open: boolean) => void;
};

const AiWorkspaceHostContext = createContext<AiWorkspaceHostValue | null>(null);

function detectDevice(): AiRuntimeContext["device"] {
  if (typeof window === "undefined") return "unknown";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1280) return "tablet";
  return "desktop";
}

function inferModuleId(pathname: string): AiModuleId | null {
  const segment = pathname.split("/").find((part) =>
    [
      "dashboard",
      "companies",
      "engagements",
      "planning",
      "materiality",
      "risk-assessment",
      "fieldwork",
      "review",
      "completion",
      "reporting",
      "opinion",
      "financial-statements",
      "trial-balance",
      "uaie",
      "import-intelligence",
      "settings",
      "users",
      "permissions",
      "ai",
    ].includes(part),
  );
  if (!segment || segment === "ai") return "dashboard";
  if (segment === "import-intelligence") return "import-intelligence";
  return segment as AiModuleId;
}

function readWelcomeHidden(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(WELCOME_STORAGE_KEY) === "1";
}

function readSession(): StoredSession {
  if (typeof window === "undefined") {
    return { conversations: [], messagesById: {}, activeId: null };
  }
  try {
    const raw = window.sessionStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return { conversations: [], messagesById: {}, activeId: null };
    return JSON.parse(raw) as StoredSession;
  } catch {
    return { conversations: [], messagesById: {}, activeId: null };
  }
}

function writeSession(session: StoredSession) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(session));
}

function buildPreviewMessages(
  labels: AiWorkspaceLabels,
  utterance: string,
  preview: ReturnType<AiCopilotCore["previewTurn"]>,
  knowledge: AiModuleKnowledge | null,
): AiWorkspaceMessage[] {
  const now = new Date().toISOString();
  const user: AiWorkspaceMessage = {
    id: createAiId("msg"),
    role: "user",
    createdAt: now,
    blocks: [{ type: "markdown", content: utterance }],
  };

  const assistantBlocks: AiWorkspaceMessage["blocks"] = [
    {
      type: "status",
      tone: preview.providerAvailable ? "success" : "warning",
      title: preview.providerAvailable
        ? labels.conversation.plannerIntent
        : labels.conversation.providerUnavailable,
      body: `${labels.conversation.plannerIntent}: ${preview.planner.intent} (${Math.round(preview.planner.confidence * 100)}%)`,
    },
    {
      type: "markdown",
      content: [
        `### ${labels.conversation.plannerIntent}`,
        preview.planner.rationale,
        "",
        "### Prompt assembly",
        `- System directives: ${preview.prompt.systemDirectives.length}`,
        `- Context locale: ${preview.prompt.context.locale}`,
        `- Knowledge modules: ${preview.prompt.knowledge.length}`,
        "",
        "_No live model response. Governed foundation preview only._",
      ].join("\n"),
    },
  ];

  if (preview.planner.suggestedActionId) {
    assistantBlocks.push({
      type: "action",
      actionId: preview.planner.suggestedActionId,
      label: preview.planner.suggestedActionKind ?? preview.planner.suggestedActionId,
      description: preview.planner.rationale,
      available: false,
      permissionSummary: labels.actions.neverExecute,
      estimatedResult: "Instruction envelope only — not executed.",
    });
  }

  if (knowledge) {
    assistantBlocks.push({
      type: "knowledge",
      moduleName: knowledge.name,
      purpose: knowledge.purpose,
      related: knowledge.relatedModules,
    });
    if (knowledge.workflow.length > 0) {
      assistantBlocks.push({
        type: "workflow",
        title: knowledge.name,
        steps: knowledge.workflow,
      });
    }
  }

  if (preview.planner.intent === "search") {
    assistantBlocks.push({
      type: "search",
      query: utterance,
      results: [
        {
          id: "platform-search",
          title: "Platform search preview",
          subtitle: "Planner search intent — no index query executed.",
        },
      ],
    });
  }

  const assistant: AiWorkspaceMessage = {
    id: createAiId("msg"),
    role: "assistant",
    createdAt: now,
    blocks: assistantBlocks,
  };

  return [user, assistant];
}

export function AiWorkspaceHostProvider({
  labels,
  companyName,
  engagementName,
  children,
}: {
  labels: AiWorkspaceLabels;
  companyName?: string;
  engagementName?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const { resolvedTheme } = useTheme();
  const tenant = useTenant();
  const [ready, setReady] = useState(false);
  const [core, setCore] = useState<AiCopilotCore | null>(null);
  const [llm, setLlm] = useState<LlmPlatform | null>(null);
  const [context, setContext] = useState<AiRuntimeContext | null>(null);
  const [modules, setModules] = useState<AiModuleKnowledge[]>([]);
  const [suggestions, setSuggestions] = useState<AiSuggestionItem[]>([]);
  const [actions, setActions] = useState<AiActionCardItem[]>([]);
  const [conversations, setConversations] = useState<AiWorkspaceConversationMeta[]>([]);
  const [messagesById, setMessagesById] = useState<Record<string, AiWorkspaceMessage[]>>({});
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [focusSignal, setFocusSignal] = useState(0);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);
  const [mobileContextOpen, setMobileContextOpen] = useState(false);
  const [providerConfigured, setProviderConfigured] = useState(false);
  const [providerHealth, setProviderHealth] = useState<LlmHealthStatus>("disabled");
  const [providerLatencyMs, setProviderLatencyMs] = useState<number | null>(null);
  const [providerLabelState, setProviderLabelState] = useState<string | null>(null);
  const [modelLabelState, setModelLabelState] = useState<string | null>(null);
  const [capabilitiesState, setCapabilitiesState] = useState<LlmProviderCapabilities | null>(null);
  const [tokenUsageLabel, setTokenUsageLabel] = useState(labels.header.none);
  const [estimatedCostLabel, setEstimatedCostLabel] = useState(labels.header.none);

  const organizationName =
    tenant.organizations.find((item) => item.id === tenant.currentOrganizationId)?.name ?? "";
  const workspaceName =
    tenant.workspaces.find((item) => item.id === tenant.currentWorkspaceId)?.name ?? "";
  const userLabel = tenant.permissionCodes[0] ? "Signed-in user" : "User";

  useEffect(() => {
    const boot = bootstrapAiFoundation();
    setCore(boot.core);
    setLlm(boot.llm.platform);
    setModules(boot.core.knowledgeEngine.listModules());
    setReady(true);

    const stored = readSession();
    setConversations(stored.conversations);
    setMessagesById(stored.messagesById);
    setActiveConversationId(stored.activeId);
    setShowWelcome(!readWelcomeHidden());

    void getLlmProviderStatusAction()
      .then((status) => {
        setProviderConfigured(status.configured);
        setProviderHealth(status.health);
        setProviderLatencyMs(status.latencyMs);
        setProviderLabelState(status.defaultProviderLabel);
        setModelLabelState(status.modelLabel);
        setCapabilitiesState(status.capabilities);
        setTokenUsageLabel(
          `${status.tokenUsage.inputTokens} in / ${status.tokenUsage.outputTokens} out`,
        );
        setEstimatedCostLabel(`$${status.estimatedCostUsd.toFixed(4)}`);
      })
      .catch(() => {
        setProviderConfigured(false);
        setProviderHealth("disabled");
      });
  }, []);

  useEffect(() => {
    if (!core) return;
    const moduleId = inferModuleId(pathname);
    const collected = core.contextEngine.collect({
      route: pathname,
      moduleId,
      locale: locale as AiLocale,
      organizationId: tenant.currentOrganizationId,
      workspaceId: tenant.currentWorkspaceId,
      companySlug: null,
      engagementSlug: null,
      userId: "session-user",
      roleSlugs: tenant.roleSlugs,
      permissionCodes: tenant.permissionCodes,
      theme: resolvedTheme === "dark" ? "dark" : "light",
      device: detectDevice(),
      hasUnsavedChanges: false,
      navigationPath: pathname.split("/").filter(Boolean),
    });
    setContext(collected);

    const defs = core.actionRegistry.list();
    setActions(
      defs.map((definition) => {
        const permission = evaluateAiPermission({
          context: collected,
          requirement: definition.permission,
        });
        return {
          definition,
          permission,
          estimatedResult: `Would emit ${definition.kind} instruction.`,
        };
      }),
    );

    setSuggestions(
      AI_WORKSPACE_SUGGESTION_SEEDS.map((utterance, index) => ({
        id: `suggestion-${index}`,
        utterance,
        decision: core.planner.plan({
          utterance,
          context: collected,
          availableModules: core.knowledgeEngine.listModules(),
          availableActionIds: core.actionRegistry.listIds(),
        }),
      })),
    );
  }, [
    core,
    pathname,
    locale,
    tenant.currentOrganizationId,
    tenant.currentWorkspaceId,
    tenant.permissionCodes,
    tenant.roleSlugs,
    resolvedTheme,
  ]);

  useEffect(() => {
    writeSession({
      conversations,
      messagesById,
      activeId: activeConversationId,
    });
  }, [conversations, messagesById, activeConversationId]);

  const knowledge = useMemo(() => {
    if (!context?.moduleId) return modules[0] ?? null;
    return modules.find((module) => module.id === context.moduleId) ?? modules[0] ?? null;
  }, [context?.moduleId, modules]);

  const ensureConversation = useCallback(() => {
    if (activeConversationId) return activeConversationId;
    const id = createAiId("conv");
    const now = new Date().toISOString();
    const meta: AiWorkspaceConversationMeta = {
      id,
      title: "New conversation",
      createdAt: now,
      updatedAt: now,
      pinned: false,
      favorite: false,
      archived: false,
      messageCount: 0,
    };
    setConversations((current) => [meta, ...current]);
    setMessagesById((current) => ({ ...current, [id]: [] }));
    setActiveConversationId(id);
    return id;
  }, [activeConversationId]);

  const submitUtterance = useCallback(
    (utterance: string) => {
      if (!core || !context) return;
      const conversationId = ensureConversation();
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
          selectedObjectType: context.selectedObjectType,
          selectedObjectId: context.selectedObjectId,
          auditYear: context.auditYear,
        },
        { utterance },
      );

      const nextMessages = buildPreviewMessages(labels, utterance, preview, knowledge);
      setMessagesById((current) => ({
        ...current,
        [conversationId]: [...(current[conversationId] ?? []), ...nextMessages],
      }));
      setConversations((current) =>
        current.map((item) =>
          item.id === conversationId
            ? {
                ...item,
                title: item.messageCount === 0 ? utterance.slice(0, 48) : item.title,
                updatedAt: new Date().toISOString(),
                messageCount: item.messageCount + nextMessages.length,
              }
            : item,
        ),
      );
      setShowWelcome(false);

      if (!providerConfigured) return;

      const streamMessageId = createAiId("msg");
      const streamMessage: AiWorkspaceMessage = {
        id: streamMessageId,
        role: "assistant",
        createdAt: new Date().toISOString(),
        blocks: [{ type: "markdown", content: "" }],
      };
      setMessagesById((current) => ({
        ...current,
        [conversationId]: [...(current[conversationId] ?? []), streamMessage],
      }));

      void (async () => {
        try {
          const response = await fetch("/api/ai/stream", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ utterance }),
          });
          if (!response.ok || !response.body) {
            setMessagesById((current) => ({
              ...current,
              [conversationId]: (current[conversationId] ?? []).map((message) =>
                message.id === streamMessageId
                  ? {
                      ...message,
                      blocks: [
                        {
                          type: "status",
                          tone: "warning",
                          title: labels.conversation.providerUnavailable,
                        },
                      ],
                    }
                  : message,
              ),
            }));
            return;
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          let assembled = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const event = JSON.parse(line) as {
                  kind?: string;
                  text?: string;
                  message?: string;
                };
                if (event.kind === "text" && event.text) {
                  assembled += event.text;
                  const snapshot = assembled;
                  setMessagesById((current) => ({
                    ...current,
                    [conversationId]: (current[conversationId] ?? []).map((message) =>
                      message.id === streamMessageId
                        ? {
                            ...message,
                            blocks: [{ type: "markdown", content: snapshot }],
                          }
                        : message,
                    ),
                  }));
                }
              } catch {
                // ignore malformed stream lines
              }
            }
          }
        } catch {
          setMessagesById((current) => ({
            ...current,
            [conversationId]: (current[conversationId] ?? []).map((message) =>
              message.id === streamMessageId
                ? {
                    ...message,
                    blocks: [
                      {
                        type: "status",
                        tone: "error",
                        title: labels.error.provider,
                      },
                    ],
                  }
                : message,
            ),
          }));
        }
      })();
    },
    [core, context, ensureConversation, labels, knowledge, providerConfigured],
  );

  const createConversation = useCallback(() => {
    const id = createAiId("conv");
    const now = new Date().toISOString();
    const meta: AiWorkspaceConversationMeta = {
      id,
      title: "New conversation",
      createdAt: now,
      updatedAt: now,
      pinned: false,
      favorite: false,
      archived: false,
      messageCount: 0,
    };
    setConversations((current) => [meta, ...current]);
    setMessagesById((current) => ({ ...current, [id]: [] }));
    setActiveConversationId(id);
    setShowWelcome(false);
    setFocusSignal((value) => value + 1);
  }, []);

  const defaultProvider = llm?.defaultProvider();
  const routeDecision = useMemo(() => {
    if (!llm) return null;
    try {
      return llm.route({ task: "general_chat", preferLatency: "low" });
    } catch {
      return null;
    }
  }, [llm]);

  const value: AiWorkspaceHostValue = {
    labels,
    ready,
    core,
    llm,
    context,
    knowledge,
    modules,
    suggestions,
    actions,
    conversations,
    activeConversationId,
    messages: activeConversationId ? (messagesById[activeConversationId] ?? []) : [],
    showWelcome,
    focusSignal,
    companyName: companyName ?? "",
    engagementName: engagementName ?? "",
    organizationName,
    workspaceName,
    userLabel,
    providerLabel: providerLabelState
      ? providerConfigured
        ? providerLabelState
        : `${providerLabelState} (${labels.header.unconfigured})`
      : defaultProvider
        ? `${defaultProvider.label} (${labels.header.unconfigured})`
        : labels.header.unconfigured,
    modelLabel: modelLabelState ?? routeDecision?.model.displayName ?? labels.header.unconfigured,
    providerConfigured,
    providerHealth,
    providerLatencyMs,
    tokenUsageLabel,
    estimatedCostLabel,
    capabilities:
      capabilitiesState ?? defaultProvider?.getCapabilities() ?? EMPTY_LLM_CAPABILITIES,
    submitUtterance,
    createConversation,
    selectConversation: (id) => {
      setActiveConversationId(id);
      setShowWelcome(false);
      setMobileHistoryOpen(false);
    },
    pinConversation: (id) =>
      setConversations((current) =>
        current.map((item) => (item.id === id ? { ...item, pinned: !item.pinned } : item)),
      ),
    favoriteConversation: (id) =>
      setConversations((current) =>
        current.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item)),
      ),
    renameConversation: (id, title) =>
      setConversations((current) =>
        current.map((item) => (item.id === id ? { ...item, title } : item)),
      ),
    archiveConversation: (id) =>
      setConversations((current) =>
        current.map((item) => (item.id === id ? { ...item, archived: true } : item)),
      ),
    deleteConversation: (id) => {
      setConversations((current) => current.filter((item) => item.id !== id));
      setMessagesById((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      if (activeConversationId === id) setActiveConversationId(null);
    },
    hideWelcome: () => setShowWelcome(false),
    neverShowWelcome: () => {
      window.localStorage.setItem(WELCOME_STORAGE_KEY, "1");
      setShowWelcome(false);
    },
    showExamples: () => {
      setShowWelcome(false);
      if (suggestions[0]) submitUtterance(suggestions[0].utterance);
    },
    focusComposer: () => setFocusSignal((value) => value + 1),
    closeMobilePanels: () => {
      setMobileHistoryOpen(false);
      setMobileContextOpen(false);
    },
    mobileHistoryOpen,
    mobileContextOpen,
    setMobileHistoryOpen,
    setMobileContextOpen,
  };

  return (
    <AiWorkspaceHostContext.Provider value={value}>{children}</AiWorkspaceHostContext.Provider>
  );
}

export function useAiWorkspaceHost(): AiWorkspaceHostValue {
  const value = useContext(AiWorkspaceHostContext);
  if (!value) {
    throw new Error("useAiWorkspaceHost must be used within AiWorkspaceHostProvider");
  }
  return value;
}
