"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconSearch } from "@/components/ui/icons";
import { Portal } from "@/components/ui/portal";
import { useShell } from "./shell-provider";
import { cn } from "@/lib/ui/cn";

export type CommandPaletteItem = {
  id: string;
  label: string;
  description?: string;
  group: string;
  href?: string;
  keywords?: string[];
  onSelect?: () => void;
};

type CommandPaletteProps = {
  items: CommandPaletteItem[];
  labels: {
    title: string;
    placeholder: string;
    empty: string;
    recent: string;
    navigation: string;
    actions: string;
    settings: string;
    close: string;
  };
  locale: string;
};

function groupLabel(group: string, labels: CommandPaletteProps["labels"]) {
  switch (group) {
    case "recent":
      return labels.recent;
    case "navigation":
      return labels.navigation;
    case "actions":
      return labels.actions;
    case "settings":
      return labels.settings;
    default:
      return group;
  }
}

export function CommandPalette({ items, labels, locale }: CommandPaletteProps) {
  const { commandPaletteOpen, setCommandPaletteOpen } = useShell();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((item) => {
      const haystack = [item.label, item.description, ...(item.keywords ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [items, query]);

  const groups = useMemo(() => {
    const map = new Map<string, CommandPaletteItem[]>();
    for (const item of filtered) {
      const list = map.get(item.group) ?? [];
      list.push(item);
      map.set(item.group, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const flatItems = useMemo(() => groups.flatMap(([, groupItems]) => groupItems), [groups]);

  const selectItem = useCallback(
    (item: CommandPaletteItem) => {
      if (item.onSelect) {
        item.onSelect();
      } else if (item.href) {
        router.push(`/${locale}${item.href}`);
      }
      setCommandPaletteOpen(false);
    },
    [locale, router, setCommandPaletteOpen],
  );

  const closePalette = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    setCommandPaletteOpen(false);
  }, [setCommandPaletteOpen]);

  useEffect(() => {
    if (!commandPaletteOpen) return;
    inputRef.current?.focus();
  }, [commandPaletteOpen]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, [setCommandPaletteOpen]);

  useEffect(() => {
    if (!commandPaletteOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePalette();
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, Math.max(flatItems.length - 1, 0)));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
      }
      if (event.key === "Enter" && flatItems[activeIndex]) {
        event.preventDefault();
        selectItem(flatItems[activeIndex]!);
      }
      if (event.key === " " && flatItems[activeIndex]) {
        event.preventDefault();
        selectItem(flatItems[activeIndex]!);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, flatItems, activeIndex, selectItem, closePalette]);

  if (!commandPaletteOpen) return null;

  let runningIndex = -1;

  return (
    <Portal>
      <div className="fixed inset-0 z-[1700] flex items-start justify-center px-4 pt-[12vh]">
        <button
          type="button"
          className="absolute inset-0 bg-overlay ds-animate-fade-in"
          aria-label={labels.close}
          onClick={closePalette}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={labels.title}
          className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-border/60 bg-popover shadow-xl ds-animate-scale-in"
        >
          <div className="flex items-center gap-3 border-b border-border/60 px-4">
            <IconSearch className="text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              placeholder={labels.placeholder}
              className="h-14 w-full bg-transparent text-sm text-foreground caret-primary outline-none placeholder:text-muted-foreground"
              autoComplete="off"
              spellCheck={false}
            />
            <kbd className="hidden rounded-md border border-border/60 bg-muted px-2 py-1 text-[0.6875rem] text-muted-foreground sm:inline">
              Esc
            </kbd>
          </div>
          <div className="max-h-[min(24rem,50vh)] overflow-y-auto p-2">
            {flatItems.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">{labels.empty}</p>
            ) : (
              groups.map(([group, groupItems]) => (
                <div key={group} className="mb-2">
                  <p className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {groupLabel(group, labels)}
                  </p>
                  <ul>
                    {groupItems.map((item) => {
                      runningIndex += 1;
                      const index = runningIndex;
                      const active = index === activeIndex;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => selectItem(item)}
                            className={cn(
                              "flex w-full flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left transition-colors",
                              active ? "bg-accent text-accent-foreground" : "hover:bg-muted",
                            )}
                          >
                            <span className="text-sm font-medium">{item.label}</span>
                            {item.description ? (
                              <span className="text-xs text-muted-foreground">{item.description}</span>
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
