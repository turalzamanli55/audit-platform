"use client";

type AuditLogAccessPanelProps = {
  entries: Array<{
    id: string;
    action: string;
    resourceType: string;
    createdAt: string;
  }>;
};

export function AuditLogAccessPanel({ entries }: AuditLogAccessPanelProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 p-8 text-sm text-muted-foreground">
        No audit log entries in the current tenant filter.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border/60 bg-muted/30">
          <tr>
            <th className="px-4 py-3 font-medium">Action</th>
            <th className="px-4 py-3 font-medium">Resource</th>
            <th className="px-4 py-3 font-medium">When</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-b border-border/40 last:border-0">
              <td className="px-4 py-3 font-medium">{entry.action}</td>
              <td className="px-4 py-3 text-muted-foreground">{entry.resourceType}</td>
              <td className="px-4 py-3 text-muted-foreground">{entry.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
