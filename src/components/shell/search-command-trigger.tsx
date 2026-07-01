"use client";

import { IconCommand, IconSearch } from "@/components/ui/icons";
import { useShell } from "./shell-provider";
import { cn } from "@/lib/ui/cn";

type SearchCommandTriggerProps = {
  placeholder: string;
  label: string;
  className?: string;
  /** Compact single-row layout for mobile header */
  compact?: boolean;
  shortcutLabel?: string;
};

export function SearchCommandTrigger({
  placeholder,
  label,
  className,
  compact = false,
  shortcutLabel = "Command K",
}: SearchCommandTriggerProps) {
  const { commandPaletteOpen, setCommandPaletteOpen } = useShell();

  return (
    <button
      type="button"
      onClick={() => setCommandPaletteOpen(true)}
      aria-label={label}
      aria-expanded={commandPaletteOpen}
      aria-haspopup="dialog"
      className={cn(
        "group cursor-pointer text-muted-foreground transition-all duration-200 hover:border-border-strong hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99] motion-reduce:transform-none",
        compact ?
          "flex h-9 w-full min-w-0 items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-2.5 text-sm sm:h-10 sm:gap-2.5 sm:px-3"
        : "flex h-10 w-full max-w-md items-center gap-3 rounded-xl border border-border/60 bg-muted/30 px-3.5 text-sm",
        commandPaletteOpen && "border-primary/40 bg-muted/60 ring-2 ring-ring/25",
        className,
      )}
    >
      <IconSearch
        width={compact ? 18 : 20}
        height={compact ? 18 : 20}
        className="shrink-0 transition-colors group-hover:text-foreground"
      />
      <span className="min-w-0 flex-1 truncate text-left">{placeholder}</span>
      {!commandPaletteOpen ? (
        <span
          className="hidden h-4 w-px shrink-0 animate-pulse bg-muted-foreground/50 motion-reduce:animate-none sm:inline"
          aria-hidden
        />
      ) : null}
      <kbd className="hidden shrink-0 items-center gap-0.5 rounded-md border border-border/60 bg-card px-2 py-0.5 text-[0.6875rem] font-medium text-muted-foreground sm:inline-flex">
        <IconCommand />
        K
      </kbd>
      <span className="sr-only">{shortcutLabel}</span>
    </button>
  );
}
