"use client";

import type { ReactNode } from "react";

type AuditOpinionFormationWorkspaceProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

/**
 * Workspace shell for audit opinion formation (mod_audit-engine).
 */
export function AuditOpinionFormationWorkspace({
  title,
  subtitle,
  children,
}: AuditOpinionFormationWorkspaceProps) {
  return (
    <section
      aria-label={title}
      className="flex min-h-[60vh] flex-col gap-6 px-6 py-8"
    >
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
          Audit Engine
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-2xl text-muted-foreground">{subtitle}</p>
      </header>
      <div className="flex-1">{children}</div>
    </section>
  );
}
