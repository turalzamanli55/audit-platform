"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { IconChevronLeft, IconChevronRight } from "./icons";
import { useCommonLabels } from "@/i18n/use-common-labels";
import { cn } from "@/lib/ui/cn";

export type BreadcrumbItem = {
  label: ReactNode;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

function Separator() {
  return (
    <IconChevronRight className="text-muted-foreground/40" aria-hidden />
  );
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const { breadcrumbLabel } = useCommonLabels();

  if (items.length === 0) return null;

  const current = items[items.length - 1];
  const ancestors = items.slice(0, -1);
  const backHref = ancestors.length > 0 ? ancestors[ancestors.length - 1]?.href : undefined;

  return (
    <nav aria-label={breadcrumbLabel} className={className}>
      <div className="flex min-w-0 items-center gap-2 lg:hidden">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <IconChevronLeft />
            <span className="truncate">{ancestors[ancestors.length - 1]?.label}</span>
          </Link>
        ) : null}
        <span aria-current="page" className="truncate text-sm font-medium text-foreground">
          {current?.label}
        </span>
      </div>

      <ol className="hidden flex-wrap items-center gap-1.5 text-sm lg:flex">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex min-w-0 items-center gap-1.5">
              {index > 0 ? <Separator /> : null}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn("truncate", isLast ? "font-medium text-foreground" : "text-muted-foreground")}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="truncate text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
