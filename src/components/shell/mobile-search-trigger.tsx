"use client";

import { Button } from "@/components/ui/button";
import { IconSearch } from "@/components/ui/icons";
import { useShell } from "./shell-provider";
import { cn } from "@/lib/ui/cn";

type MobileSearchTriggerProps = {
  label: string;
  className?: string;
};

export function MobileSearchTrigger({ label, className }: MobileSearchTriggerProps) {
  const { setCommandPaletteOpen } = useShell();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("h-10 w-10", className)}
      aria-label={label}
      onClick={() => setCommandPaletteOpen(true)}
    >
      <IconSearch />
    </Button>
  );
}
