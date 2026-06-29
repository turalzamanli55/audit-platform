"use client";

import type { ReactNode } from "react";

type MobileNavProps = {
  children?: ReactNode;
  open?: boolean;
};

export function MobileNav({ children, open = false }: MobileNavProps) {
  if (!open) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[1200] border-t border-border bg-card p-2 shadow-lg lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around gap-1">{children}</div>
    </nav>
  );
}
