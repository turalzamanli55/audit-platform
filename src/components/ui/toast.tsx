"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { IconAlertCircle, IconCheck, IconInfo, IconX } from "./icons";
import { useShellLabels, useUiLabels } from "@/i18n/use-shell-labels";
import { cn } from "@/lib/ui/cn";

export type ToastVariant = "success" | "error" | "info" | "warning";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: { label: string; onClick: () => void };
};

type ToastContextValue = {
  toasts: ToastItem[];
  toast: (item: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function variantIcon(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return <IconCheck className="text-success" />;
    case "error":
      return <IconAlertCircle className="text-destructive" />;
    case "warning":
      return <IconAlertCircle className="text-warning" />;
    default:
      return <IconInfo className="text-info" />;
  }
}

function variantClasses(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return "border-success/20 bg-card";
    case "error":
      return "border-destructive/20 bg-card";
    case "warning":
      return "border-warning/20 bg-card";
    default:
      return "border-border/60 bg-card";
  }
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const ui = useUiLabels();
  const variant = item.variant ?? "info";

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg ds-animate-slide-up",
        variantClasses(variant),
      )}
    >
      <div className="mt-0.5">{variantIcon(variant)}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{item.title}</p>
        {item.description ? (
          <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
        ) : null}
        {item.action ? (
          <button
            type="button"
            onClick={item.action.onClick}
            className="mt-2 text-sm font-medium text-primary hover:underline"
          >
            {item.action.label}
          </button>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label={ui.dismiss}
      >
        <IconX />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const shell = useShellLabels();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (item: Omit<ToastItem, "id">) => {
      const id = crypto.randomUUID();
      const next: ToastItem = { ...item, id };
      setToasts((current) => [...current.slice(-2), next]);

      const duration = item.duration ?? (item.variant === "error" ? 8000 : 5000);
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[1600] flex flex-col gap-3"
        aria-label={shell.notifications}
      >
        {toasts.map((item) => (
          <ToastCard key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
