import type { ReactNode } from "react";

export type StatusTone = "ok" | "warn" | "down" | "neutral";

function toneClasses(tone: StatusTone): string {
  switch (tone) {
    case "ok":
      return "border-emerald-500/30 text-emerald-600 dark:text-emerald-400";
    case "warn":
      return "border-amber-500/30 text-amber-600 dark:text-amber-400";
    case "down":
      return "border-destructive/40 text-destructive";
    default:
      return "border-border/60 text-muted-foreground";
  }
}

export function StatCard(props: { label: string; value: string; detail?: string; tone?: StatusTone }) {
  return (
    <div className={`rounded-xl border bg-card px-4 py-3 ${toneClasses(props.tone ?? "neutral")}`}>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{props.label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{props.value}</p>
      {props.detail ? <p className="mt-1 text-xs text-muted-foreground">{props.detail}</p> : null}
    </div>
  );
}

export function StatusPill(props: { label: string; tone: StatusTone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${toneClasses(
        props.tone,
      )}`}
    >
      {props.label}
    </span>
  );
}

export function PlatformSection(props: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">{props.title}</h2>
        {props.description ? (
          <p className="text-sm text-muted-foreground">{props.description}</p>
        ) : null}
      </div>
      {props.children}
    </section>
  );
}

export function PlatformPageHeader(props: { title: string; description: string; eyebrow?: string }) {
  return (
    <header className="space-y-2">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {props.eyebrow ?? "Platform Owner Console"}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">{props.title}</h1>
      <p className="max-w-3xl text-sm text-muted-foreground">{props.description}</p>
    </header>
  );
}

export function DataTable(props: { columns: string[]; rows: ReactNode[][]; empty?: string }) {
  if (props.rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
        {props.empty ?? "No records yet."}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60 [-webkit-overflow-scrolling:touch]">
      <table className="min-w-full text-sm">
        <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            {props.columns.map((column) => (
              <th key={column} className="whitespace-nowrap px-3 py-3 font-medium sm:px-4">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-border/50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-3 py-3 align-top sm:px-4">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FoundationNotice(props: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
      {props.children}
    </div>
  );
}
