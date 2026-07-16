"use client";

import type { ReactNode } from "react";

type AuditLogAccessWorkspaceProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuditLogAccessWorkspace({
  title,
  subtitle,
  children,
}: AuditLogAccessWorkspaceProps) {
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
