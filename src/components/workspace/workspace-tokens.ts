/** Shared design tokens — single source for workspace UI class names. */
export const workspaceTokens = {
  pageGap: "space-y-6",
  sectionGap: "space-y-5",
  chromeGap: "space-y-8",
  layoutGrid: "grid gap-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[13rem_minmax(0,1fr)]",
  heroBorder: "border-b border-border/50 pb-8",
  heroEyebrow: "text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground",
  heroTitle: "text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-[2rem] lg:leading-tight",
  heroSubtitle: "text-sm text-muted-foreground",
  sectionTitle: "text-lg font-semibold tracking-tight text-foreground sm:text-xl",
  sectionDescription: "max-w-2xl text-sm text-muted-foreground",
  card: "rounded-2xl border border-border/50 bg-card/90 shadow-xs",
  cardHeader: "flex items-start justify-between gap-3 border-b border-border/40 px-4 py-3.5 sm:px-5",
  cardBody: "p-4 sm:p-5",
  kpiGrid: "grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3",
  kpiLabel: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
  kpiValue: "mt-1.5 text-2xl font-semibold tracking-tight text-foreground tabular-nums",
  kpiHint: "mt-1 text-xs leading-snug text-muted-foreground",
  sectionEyebrow: "text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground",
  navItem:
    "flex items-center rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 lg:px-4 lg:py-2.5",
  navItemActive: "bg-foreground/[0.06] text-foreground",
  navItemInactive: "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
  navGroupLabel:
    "mb-1.5 hidden px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground lg:block",
  contextChip:
    "inline-flex min-h-10 items-center gap-2 rounded-xl border border-border/50 bg-card/90 px-3.5 py-2 text-sm",
  listRow:
    "flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-border/50 bg-muted/10 px-3 py-2.5 transition-colors hover:border-border-strong hover:bg-card/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  actionLink:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-border/50 bg-card/90 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  moduleTile:
    "rounded-xl border border-border/50 bg-muted/10 p-4 transition-all hover:border-border-strong hover:bg-card/90",
  bucketTile:
    "rounded-xl border border-border/50 bg-card/90 px-3 py-3 transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  calendarRow:
    "flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-muted/10 px-4 py-3 transition-colors hover:border-border-strong hover:bg-card/90",
  backButton:
    "inline-flex h-10 shrink-0 items-center rounded-xl border border-border/60 bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  commandHero:
    "rounded-[1.75rem] border border-border/40 bg-gradient-to-br from-card via-card to-muted/15 p-5 sm:p-6",
  emptyInline:
    "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/10 px-4 py-8 text-center",
  progressTrack: "h-2 overflow-hidden rounded-full bg-muted",
  progressFill: "h-full rounded-full bg-primary transition-all",
} as const;

export type WorkspaceKpiVariant = "default" | "warning" | "success" | "destructive";

export type WorkspaceKpiCard = {
  id: string;
  label: string;
  value: string;
  hint?: string;
  href?: string;
  variant?: WorkspaceKpiVariant;
};

export type WorkspaceWorkflowStep = {
  id: string;
  label: string;
  status: "pending" | "current" | "complete" | "upcoming";
};
