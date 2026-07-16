"use client";

import type { AuditOpinionType } from "@/constants/audit-engine";

type AuditOpinionFormationPanelProps = {
  opinionType: AuditOpinionType;
  derivedOpinionType: AuditOpinionType;
  consistent: boolean;
};

export function AuditOpinionFormationPanel({
  opinionType,
  derivedOpinionType,
  consistent,
}: AuditOpinionFormationPanelProps) {
  return (
    <div className="grid gap-4 rounded-xl border border-border/60 p-6">
      <div>
        <h2 className="text-lg font-medium">Opinion formation</h2>
        <p className="text-sm text-muted-foreground">
          Selected opinion must match ISA-derived facts before issuance.
        </p>
      </div>
      <dl className="grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Selected</dt>
          <dd className="text-base font-medium capitalize">{opinionType}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Derived</dt>
          <dd className="text-base font-medium capitalize">{derivedOpinionType}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Consistency</dt>
          <dd className="text-base font-medium">{consistent ? "Aligned" : "Mismatch"}</dd>
        </div>
      </dl>
    </div>
  );
}
