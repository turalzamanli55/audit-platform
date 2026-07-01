"use client";

import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/ui/cn";
import { headerControlOpenClass, headerMenuItemClass } from "@/lib/ui/header-interaction";

type DropdownContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  menuId: string;
};

const DropdownContext = createContext<DropdownContextValue | null>(null);

type DropdownMenuProps = {
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "end";
  className?: string;
};

type TriggerProps = {
  className?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  "aria-expanded"?: boolean;
  "aria-haspopup"?: "menu" | boolean;
  "aria-controls"?: string;
  id?: string;
  disabled?: boolean;
  "data-state"?: "open" | "closed";
};

export function DropdownMenu({ trigger, children, align = "end", className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerId = useId();
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const focusMenuItem = useCallback((index: number) => {
    const items = menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)');
    items?.[index]?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const handlePointer = (event: globalThis.MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleEscape);

    const frame = requestAnimationFrame(() => focusMenuItem(0));

    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleEscape);
      cancelAnimationFrame(frame);
    };
  }, [open, focusMenuItem]);

  const handleMenuKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const items = menuRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="menuitem"]:not(:disabled)',
      );
      if (!items?.length) return;

      const currentIndex = Array.from(items).findIndex((item) => item === document.activeElement);

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        focusMenuItem(next);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        const next = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        focusMenuItem(next);
      }

      if (event.key === "Home") {
        event.preventDefault();
        focusMenuItem(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        focusMenuItem(items.length - 1);
      }
    },
    [focusMenuItem],
  );

  const mergedTrigger =
    isValidElement(trigger) ?
      cloneElement(trigger as ReactElement<TriggerProps>, {
        id: triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": open ? menuId : undefined,
        "data-state": open ? "open" : "closed",
        onClick: (event: MouseEvent<HTMLElement>) => {
          (trigger as ReactElement<TriggerProps>).props.onClick?.(event);
          if (!event.defaultPrevented && !(trigger as ReactElement<TriggerProps>).props.disabled) {
            setOpen((current) => !current);
          }
        },
        onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
          (trigger as ReactElement<TriggerProps>).props.onKeyDown?.(event);
          if ((trigger as ReactElement<TriggerProps>).props.disabled) return;

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((current) => !current);
          }

          if (event.key === "ArrowDown" && !open) {
            event.preventDefault();
            setOpen(true);
          }
        },
        className: cn(
          (trigger as ReactElement<TriggerProps>).props.className,
          open && headerControlOpenClass,
        ),
      })
    : trigger;

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerId, menuId }}>
      <div ref={containerRef} className={cn("relative inline-flex", className)}>
        {mergedTrigger}
        {open ? (
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            onKeyDown={handleMenuKeyDown}
            className={cn(
              "absolute top-[calc(100%+0.375rem)] z-[1400] min-w-[12rem] overflow-hidden rounded-xl border border-border/60 bg-popover p-1.5 text-popover-foreground shadow-lg ds-animate-scale-in",
              align === "end" ? "right-0" : "left-0",
            )}
          >
            {children}
          </div>
        ) : null}
      </div>
    </DropdownContext.Provider>
  );
}

function useDropdown() {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("Dropdown item must be used within DropdownMenu");
  return context;
}

type DropdownMenuItemProps = {
  children: ReactNode;
  onSelect?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  className?: string;
  selected?: boolean;
};

export function DropdownMenuItem({
  children,
  onSelect,
  destructive = false,
  disabled = false,
  selected = false,
  className,
}: DropdownMenuItemProps) {
  const { setOpen } = useDropdown();

  const handleClick = useCallback(() => {
    if (disabled) return;
    onSelect?.();
    setOpen(false);
  }, [disabled, onSelect, setOpen]);

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      aria-current={selected ? "true" : undefined}
      onClick={handleClick}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        headerMenuItemClass,
        destructive ?
          "text-destructive hover:bg-destructive/10"
        : "text-foreground hover:bg-muted",
        selected && "bg-accent/60 font-medium",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator() {
  return <div role="separator" className="my-1.5 h-px bg-border" />;
}

export function DropdownMenuLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </div>
  );
}
