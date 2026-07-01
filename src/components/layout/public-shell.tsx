import type { ReactNode } from "react";

/**
 * @deprecated Use `@/components/public` PublicShell or PublicAuthShell directly.
 */
export function PublicShell({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
