import type { ReactNode } from "react";

type FooterProps = {
  children?: ReactNode;
};

export function Footer({ children }: FooterProps) {
  return (
    <footer
      className="flex h-[var(--ds-footer-height)] items-center border-t border-border bg-card px-4 text-xs text-muted-foreground"
      role="contentinfo"
    >
      <div className="ds-container flex w-full items-center justify-between gap-4">
        {children}
      </div>
    </footer>
  );
}
