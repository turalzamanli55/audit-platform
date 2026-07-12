"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/ui/cn";

type ContextMenuState = {
  x: number;
  y: number;
  content: ReactNode;
} | null;

type ContextMenuContextValue = {
  open: (event: React.MouseEvent, content: ReactNode) => void;
  close: () => void;
};

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

export function ContextMenuProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ContextMenuState>(null);

  const close = useCallback(() => setState(null), []);

  const open = useCallback((event: React.MouseEvent, content: ReactNode) => {
    event.preventDefault();
    setState({ x: event.clientX, y: event.clientY, content });
  }, []);

  useEffect(() => {
    if (!state) return;

    const handlePointer = () => close();
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [state, close]);

  return (
    <ContextMenuContext.Provider value={{ open, close }}>
      {children}
      {state ? (
        <div
          className="fixed z-[1450] min-w-[10rem] overflow-hidden rounded-xl border border-border/60 bg-popover p-1.5 shadow-lg ds-animate-scale-in"
          style={{ top: state.y, left: state.x }}
          role="menu"
          onMouseDown={(event) => event.stopPropagation()}
        >
          {state.content}
        </div>
      ) : null}
    </ContextMenuContext.Provider>
  );
}

export function useContextMenu() {
  const context = useContext(ContextMenuContext);
  if (!context) throw new Error("useContextMenu must be used within ContextMenuProvider");
  return context;
}

export function useContextMenuOptional() {
  return useContext(ContextMenuContext);
}

type ContextMenuItemProps = {
  children: ReactNode;
  onSelect?: () => void;
  destructive?: boolean;
};

export function ContextMenuItem({ children, onSelect, destructive = false }: ContextMenuItemProps) {
  const { close } = useContextMenu();

  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => {
        onSelect?.();
        close();
      }}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        destructive ? "text-destructive hover:bg-destructive/10" : "text-foreground",
      )}
    >
      {children}
    </button>
  );
}

type ContextMenuTriggerProps = {
  children: ReactNode;
  menu: ReactNode;
};

export function ContextMenuTrigger({ children, menu }: ContextMenuTriggerProps) {
  const { open } = useContextMenu();

  return (
    <div onContextMenu={(event) => open(event, menu)} className="contents">
      {children}
    </div>
  );
}
