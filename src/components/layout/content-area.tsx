import type { ReactNode } from "react";

type ContentAreaProps = {
  children: ReactNode;
  className?: string;
};

export function ContentArea({ children, className = "" }: ContentAreaProps) {
  return (
    <main
      id="main-content"
      className={`flex-1 overflow-y-auto bg-background p-4 md:p-6 ${className}`}
      role="main"
    >
      <div className="ds-container">{children}</div>
    </main>
  );
}
