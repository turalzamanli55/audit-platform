import type { ReactNode } from "react";

type HeaderProps = {
  children?: ReactNode;
};

export function Header({ children }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-[1100] flex h-[var(--ds-header-height)] items-center border-b border-border bg-card px-4 shadow-xs"
      role="banner"
    >
      <div className="ds-container flex w-full items-center justify-between gap-4">
        {children}
      </div>
    </header>
  );
}
