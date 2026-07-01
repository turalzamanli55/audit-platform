import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type ContentAreaProps = {
  children: ReactNode;
  className?: string;
  flush?: boolean;
};

export function ContentArea({ children, className = "", flush = false }: ContentAreaProps) {
  return (
    <main
      id="main-content"
      className={cn(
        "flex-1 overflow-y-auto overflow-x-clip bg-background",
        flush ? "p-0" : "py-5 sm:py-6 md:py-8",
        className,
      )}
      role="main"
    >
      <div className={cn(!flush && "ds-container")}>{children}</div>
    </main>
  );
}
