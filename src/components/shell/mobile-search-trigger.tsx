"use client";

import { IconSearch } from "@/components/ui/icons";
import { useShell } from "./shell-provider";
import { cn } from "@/lib/ui/cn";

type MobileSearchTriggerProps = {
  placeholder: string;
  label: string;
  className?: string;
};

export function MobileSearchTrigger({
  placeholder,
  label,
  className,
}: MobileSearchTriggerProps) {
  const { setCommandPaletteOpen } = useShell();

  return (
    <button
      type="button"
      onClick={() => setCommandPaletteOpen(true)}
      aria-label={label}
      className={cn(
        "group flex h-10 w-full min-w-0 items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 px-3 text-sm text-muted-foreground transition-all duration-200 hover:border-border-strong hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99] motion-reduce:transform-none",
        className,
      )}
    >
      <IconSearch
        width={18}
        height={18}
        className="shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
      />
      <span className="min-w-0 flex-1 truncate text-left">{placeholder}</span>
    </button>
  );
}
