export const AI_WORKSPACE_PATH = "/ai";

export type AiWorkspaceMessageRole =
  | "assistant"
  | "user"
  | "system"
  | "warning"
  | "suggestion"
  | "action"
  | "workflow"
  | "knowledge";

export type AiWorkspaceMessageBlock =
  | { type: "markdown"; content: string }
  | { type: "status"; tone: "info" | "success" | "warning" | "error"; title: string; body?: string }
  | { type: "timeline"; items: Array<{ id: string; label: string; detail?: string }> }
  | { type: "workflow"; title: string; steps: string[] }
  | {
      type: "action";
      actionId: string;
      label: string;
      description: string;
      available: boolean;
      permissionSummary: string;
      estimatedResult: string;
    }
  | {
      type: "reference";
      title: string;
      href?: string;
      meta?: string;
    }
  | {
      type: "search";
      query: string;
      results: Array<{ id: string; title: string; subtitle?: string }>;
    }
  | {
      type: "knowledge";
      moduleName: string;
      purpose: string;
      related: string[];
    };

export type AiWorkspaceMessage = {
  id: string;
  role: AiWorkspaceMessageRole;
  createdAt: string;
  blocks: AiWorkspaceMessageBlock[];
};

export type AiWorkspaceConversationMeta = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  favorite: boolean;
  archived: boolean;
  messageCount: number;
};

export type AiWorkspaceHistoryBucket = "today" | "yesterday" | "thisWeek" | "older" | "favorites";

export type AiWorkspaceLabels = {
  meta: { title: string; description: string };
  nav: { label: string };
  header: {
    title: string;
    conversation: string;
    module: string;
    company: string;
    engagement: string;
    model: string;
    provider: string;
    none: string;
    unconfigured: string;
  };
  welcome: {
    title: string;
    subtitle: string;
    understands: string;
    module: string;
    company: string;
    engagement: string;
    workflow: string;
    permissions: string;
    knowledge: string;
    actions: string;
    start: string;
    examples: string;
    documentation: string;
    hide: string;
    neverAgain: string;
  };
  history: {
    title: string;
    search: string;
    today: string;
    yesterday: string;
    thisWeek: string;
    older: string;
    favorites: string;
    pin: string;
    unpin: string;
    rename: string;
    archive: string;
    delete: string;
    favorite: string;
    unfavorite: string;
    empty: string;
    newConversation: string;
  };
  conversation: {
    title: string;
    emptyTitle: string;
    emptyDescription: string;
    foundationNotice: string;
    plannerIntent: string;
    providerUnavailable: string;
  };
  composer: {
    placeholder: string;
    send: string;
    characters: string;
    context: string;
    module: string;
    workspace: string;
    shortcutSend: string;
    enterSends: string;
    ctrlEnterSends: string;
  };
  context: {
    title: string;
    route: string;
    module: string;
    company: string;
    engagement: string;
    user: string;
    workspace: string;
    organization: string;
    locale: string;
    theme: string;
    workflow: string;
    permissions: string;
    filters: string;
    selection: string;
    unsaved: string;
    yes: string;
    no: string;
  };
  suggestions: {
    title: string;
    empty: string;
    intent: string;
    apply: string;
  };
  actions: {
    title: string;
    empty: string;
    permission: string;
    availability: string;
    available: string;
    unavailable: string;
    estimated: string;
    preview: string;
    neverExecute: string;
  };
  knowledge: {
    title: string;
    purpose: string;
    inputs: string;
    outputs: string;
    dependencies: string;
    workflow: string;
    related: string;
    empty: string;
  };
  provider: {
    title: string;
    configured: string;
    model: string;
    capabilities: string;
    streaming: string;
    vision: string;
    embeddings: string;
    structuredOutput: string;
    health: string;
    readOnly: string;
  };
  loading: {
    workspace: string;
    conversation: string;
    history: string;
    context: string;
    suggestions: string;
    knowledge: string;
  };
  empty: {
    conversation: string;
    suggestions: string;
    history: string;
    actions: string;
    knowledge: string;
  };
  error: {
    provider: string;
    permission: string;
    workspace: string;
    conversation: string;
    context: string;
    retry: string;
  };
  roles: {
    assistant: string;
    user: string;
    system: string;
    warning: string;
    suggestion: string;
    action: string;
    workflow: string;
    knowledge: string;
  };
};
