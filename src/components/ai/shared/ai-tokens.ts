/** Shared class tokens for the Enterprise AI Workspace. */
export const aiWorkspaceTokens = {
  shell: "flex h-[calc(100dvh-var(--ds-header-height,3.75rem))] min-h-[32rem] flex-col overflow-hidden bg-background",
  header:
    "flex shrink-0 flex-wrap items-center gap-3 border-b border-border/50 bg-card/80 px-4 py-3 backdrop-blur-sm sm:px-5",
  grid: "grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)_20rem] 2xl:grid-cols-[17rem_minmax(0,1fr)_22rem]",
  leftRail: "hidden min-h-0 flex-col border-r border-border/50 bg-muted/15 lg:flex",
  center: "flex min-h-0 min-w-0 flex-col bg-background",
  rightRail: "hidden min-h-0 flex-col overflow-y-auto border-l border-border/50 bg-muted/10 xl:flex",
  panelTitle:
    "px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground",
  panelSection: "space-y-3 border-b border-border/40 px-4 py-4 last:border-b-0",
  chip: "inline-flex max-w-full items-center gap-1.5 truncate rounded-lg border border-border/50 bg-card/90 px-2.5 py-1 text-xs text-foreground",
  chipMuted: "text-muted-foreground",
  messageUser: "ml-auto max-w-[92%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-primary-foreground",
  messageAssistant:
    "mr-auto max-w-[96%] rounded-2xl rounded-bl-md border border-border/50 bg-card/95 px-4 py-3 shadow-xs",
  messageSystem:
    "mx-auto max-w-[96%] rounded-xl border border-dashed border-border/60 bg-muted/20 px-4 py-2.5 text-sm text-muted-foreground",
  messageWarning:
    "mr-auto max-w-[96%] rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-foreground",
  composerShell:
    "shrink-0 border-t border-border/50 bg-card/90 p-3 backdrop-blur-sm sm:p-4",
  composerField:
    "min-h-[2.75rem] w-full resize-none rounded-2xl border border-border/60 bg-background px-4 py-3 text-sm text-foreground shadow-xs outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30",
  empty:
    "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/60 bg-muted/10 px-6 py-10 text-center",
  skeleton: "animate-pulse rounded-xl bg-muted/60",
} as const;
