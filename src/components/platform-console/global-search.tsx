"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { SearchItem } from "@/lib/platform-console/detail-data";
import { usePlatformLabels } from "@/i18n/use-platform-labels";
import { fillPlatform } from "@/i18n/platform-labels";

const TYPE_ORDER = [
  "Company",
  "User",
  "Organization",
  "Workspace",
  "Engagement",
  "Invitation",
  "License",
  "Security Event",
  "Audit Event",
];

export function GlobalSearch({ items, basePath }: { items: SearchItem[]; basePath: string }) {
  const t = usePlatformLabels();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("all");

  const typeLabel = (value: string) => t.globalSearch.types[value as keyof typeof t.globalSearch.types] ?? value;

  const types = useMemo(() => {
    const present = new Set(items.map((i) => i.type));
    return TYPE_ORDER.filter((t) => present.has(t));
  }, [items]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term && type === "all") return [] as SearchItem[];
    return items.filter((item) => {
      if (type !== "all" && item.type !== type) return false;
      if (!term) return true;
      return item.keywords.includes(term) || item.title.toLowerCase().includes(term);
    });
  }, [items, query, type]);

  const grouped = useMemo(() => {
    const map = new Map<string, SearchItem[]>();
    for (const item of results) {
      const list = map.get(item.type) ?? [];
      list.push(item);
      map.set(item.type, list);
    }
    return TYPE_ORDER.filter((t) => map.has(t)).map((t) => ({ type: t, items: (map.get(t) ?? []).slice(0, 25) }));
  }, [results]);

  function resolveHref(href: string | null): string | null {
    return href ? `${basePath}${href.replace(/^\/app\/platform/, "")}` : null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.globalSearch.placeholder}
          className="flex-1"
        />
        <div className="flex flex-wrap gap-1.5">
          <FilterChip label={t.common.all} active={type === "all"} onClick={() => setType("all")} />
          {types.map((typeValue) => (
            <FilterChip key={typeValue} label={typeLabel(typeValue)} active={type === typeValue} onClick={() => setType(typeValue)} />
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {query.trim() || type !== "all"
          ? results.length === 1
            ? fillPlatform(t.globalSearch.summaryOne, { count: results.length })
            : fillPlatform(t.globalSearch.summaryMany, { count: results.length })
          : t.globalSearch.prompt}
      </p>

      {query.trim() || type !== "all" ? (
        results.length === 0 ? (
          <EmptyState title={t.globalSearch.emptyTitle} description={t.globalSearch.emptyDescription} />
        ) : (
          <div className="space-y-6">
            {grouped.map((group) => (
              <section key={group.type} className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{typeLabel(group.type)}</h3>
                <div className="overflow-hidden rounded-xl border border-border/60">
                  {group.items.map((item) => {
                    const href = resolveHref(item.href);
                    const content = (
                      <div className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted/40">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{item.title}</p>
                          <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
                        </div>
                        <Badge variant="secondary">{typeLabel(item.type)}</Badge>
                      </div>
                    );
                    return href ? (
                      <Link key={item.id} href={href} className="block border-b border-border/50 last:border-0">
                        {content}
                      </Link>
                    ) : (
                      <div key={item.id} className="border-b border-border/50 last:border-0">
                        {content}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )
      ) : null}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
