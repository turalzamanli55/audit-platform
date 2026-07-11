"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/ui/cn";
import {
  type WorkspaceNavGroup,
  type WorkspaceNavItem,
} from "@/lib/workspace/workspace-nav";
import { workspaceTokens } from "./workspace-tokens";

export type { WorkspaceNavItem, WorkspaceNavGroup };

type WorkspaceSidebarProps<T extends string = string> = {
  items: WorkspaceNavItem<T>[];
  groups?: WorkspaceNavGroup<T>[];
  ariaLabel: string;
  isReadOnly?: boolean;
  readOnlyExcept?: T[];
  overviewId?: T;
  className?: string;
};

function isActive<T extends string>(
  pathname: string,
  item: WorkspaceNavItem<T>,
  overviewId?: T,
): boolean {
  if (overviewId && item.id === overviewId) {
    return pathname === item.href || pathname === `${item.href}/`;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function WorkspaceSidebar<T extends string = string>({
  items,
  groups,
  ariaLabel,
  isReadOnly = false,
  readOnlyExcept = [],
  overviewId,
  className,
}: WorkspaceSidebarProps<T>) {
  const pathname = usePathname();

  const renderItem = (item: WorkspaceNavItem<T>) => {
    const active = isActive(pathname, item, overviewId);
    const readOnly = isReadOnly && !readOnlyExcept.includes(item.id);

    return (
      <li key={item.id} className="shrink-0 lg:shrink">
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          aria-disabled={readOnly}
          className={cn(
            workspaceTokens.navItem,
            active ? workspaceTokens.navItemActive : workspaceTokens.navItemInactive,
            readOnly && "pointer-events-none opacity-50",
          )}
        >
          {item.label}
        </Link>
      </li>
    );
  };

  const scrollClasses =
    "-mx-1 flex gap-1 overflow-x-auto overscroll-x-contain px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden";

  return (
    <nav aria-label={ariaLabel} className={className}>
      {groups && groups.length > 0 ? (
        <div className={cn(scrollClasses, "lg:gap-5")}>
          {groups.map((group) => (
            <div key={group.id} className="shrink-0 lg:shrink">
              <p className={workspaceTokens.navGroupLabel}>{group.label}</p>
              <ul className="flex gap-1 lg:flex-col lg:gap-0.5">{group.items.map(renderItem)}</ul>
            </div>
          ))}
        </div>
      ) : (
        <ul className={scrollClasses}>{items.map(renderItem)}</ul>
      )}
    </nav>
  );
}
