"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { IconX } from "./icons";
import { Portal } from "./portal";
import { useUiLabels } from "@/i18n/use-shell-labels";
import { cn } from "@/lib/ui/cn";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
}: ModalProps) {
  const ui = useUiLabels();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previous = document.activeElement as HTMLElement | null;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4">
        <button
          type="button"
          className="absolute inset-0 bg-overlay ds-animate-fade-in"
          aria-label={ui.closeDialog}
          onClick={() => onOpenChange(false)}
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby={description ? "modal-description" : undefined}
          tabIndex={-1}
          className={cn(
            "relative z-10 w-full rounded-2xl border border-border/60 bg-card p-6 shadow-xl ds-animate-scale-in",
            sizeClasses[size],
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 id="modal-title" className="text-lg font-semibold tracking-tight text-foreground">
                {title}
              </h2>
              {description ? (
                <p id="modal-description" className="text-sm text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={ui.close}
            >
              <IconX />
            </button>
          </div>
          <div className="mt-6">{children}</div>
          {footer ? <div className="mt-6 flex justify-end gap-2">{footer}</div> : null}
        </div>
      </div>
    </Portal>
  );
}
