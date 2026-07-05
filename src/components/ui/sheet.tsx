"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { IconX } from "./icons";
import { Portal } from "./portal";
import { useUiLabels } from "@/i18n/use-shell-labels";
import { cn } from "@/lib/ui/cn";

type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  side?: "right" | "left";
};

export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  side = "right",
}: SheetProps) {
  const ui = useUiLabels();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[1500]">
        <button
          type="button"
          className="absolute inset-0 bg-overlay ds-animate-fade-in"
          aria-label={ui.closePanel}
          onClick={() => onOpenChange(false)}
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sheet-title"
          tabIndex={-1}
          className={cn(
            "absolute top-0 flex h-full w-full max-w-md flex-col border-border/60 bg-card shadow-xl",
            side === "right" ? "right-0 border-l ds-animate-slide-up" : "left-0 border-r",
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-border/60 px-6 py-5">
            <div className="space-y-1">
              <h2 id="sheet-title" className="text-lg font-semibold tracking-tight">
                {title}
              </h2>
              {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={ui.close}
            >
              <IconX />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        </div>
      </div>
    </Portal>
  );
}
