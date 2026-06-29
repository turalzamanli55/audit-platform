"use client";

import type { ReactNode } from "react";

type DesktopNavProps = {
  children?: ReactNode;
};

export function DesktopNav({ children }: DesktopNavProps) {
  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="Desktop navigation">
      {children}
    </nav>
  );
}
