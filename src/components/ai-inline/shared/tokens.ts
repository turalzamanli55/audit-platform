export const aiInlineTokens = {
  toolbar: "inline-flex flex-wrap items-center gap-2",
  button:
    "inline-flex h-8 items-center gap-1.5 rounded-lg border border-border/60 bg-card px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  buttonPrimary:
    "inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  menuItem:
    "flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-foreground hover:bg-muted/70",
  chip: "rounded-full border border-border/50 bg-muted/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground",
  panel: "space-y-4",
  sectionTitle: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
} as const;
