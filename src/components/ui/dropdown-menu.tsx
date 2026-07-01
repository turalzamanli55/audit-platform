"use client";

import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { Portal } from "@/components/ui/portal";
import { cn } from "@/lib/ui/cn";
import { claimActiveDropdown } from "@/lib/ui/dropdown-registry";
import { computeFloatingPosition } from "@/lib/ui/floating-position";
import { headerControlOpenClass, headerMenuItemClass } from "@/lib/ui/header-interaction";
import { Z_INDEX } from "@/lib/ui/z-index";

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
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({ visibility: "hidden" });
  const triggerId = useId();
  const menuId = useId();
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const previousPathnameRef = useRef(pathname);

  const close = useCallback(() => setOpen(false), []);

  const focusMenuItem = useCallback((index: number) => {
    const items = menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)');
    items?.[index]?.focus();
  }, []);

  const updatePosition = useCallback(() => {
    const triggerEl = triggerRef.current;
    const menuEl = menuRef.current;
    if (!triggerEl || !menuEl) return;

    const triggerRect = triggerEl.getBoundingClientRect();
    const menuRect = menuEl.getBoundingClientRect();
    const position = computeFloatingPosition(triggerRect, menuRect, {
      align,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });

    const maxHeight = Math.max(
      120,
      position.placement === "bottom" ?
        window.innerHeight - position.top - 8
      : position.top - 8,
    );

    setMenuStyle({
      top: position.top,
      left: position.left,
      maxHeight,
      visibility: "visible",
    });
  }, [align]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, children, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const release = claimActiveDropdown(close);

    const handlePointer = (event: globalThis.MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      close();
    };

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    const handleReposition = () => updatePosition();

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    const frame = requestAnimationFrame(() => {
      updatePosition();
      focusMenuItem(0);
    });

    return () => {
      release();
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
      cancelAnimationFrame(frame);
    };
  }, [open, close, focusMenuItem, updatePosition]);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;
    previousPathnameRef.current = pathname;
    const frame = requestAnimationFrame(() => setOpen(false));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (wasOpenRef.current && !open) {
      const focusable =
        triggerRef.current?.querySelector<HTMLElement>("button,[href],[tabindex]") ??
        triggerRef.current;
      focusable?.focus();
    }
    wasOpenRef.current = open;
  }, [open]);

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

      if (event.key === "Tab") {
        close();
      }
    },
    [close, focusMenuItem],
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
      <div ref={triggerRef} className={cn("relative inline-flex", className)}>
        {mergedTrigger}
      </div>
      {open ?
        <Portal>
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            onKeyDown={handleMenuKeyDown}
            style={{
              position: "fixed",
              zIndex: Z_INDEX.dropdown,
              ...menuStyle,
            }}
            className="min-w-[12rem] overflow-hidden overflow-y-auto rounded-xl border border-border/60 bg-popover p-1.5 text-popover-foreground shadow-lg ds-animate-scale-in motion-reduce:animate-none"
          >
            {children}
          </div>
        </Portal>
      : null}
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
