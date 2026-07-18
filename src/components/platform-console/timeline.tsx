import type { TimelineEvent } from "@/lib/platform-console/detail-data";
import { EmptyState } from "@/components/ui/empty-state";

function dotClass(severity: string): string {
  if (severity === "critical") return "bg-destructive";
  if (severity === "warning") return "bg-amber-500";
  return "bg-primary/60";
}

/** Chronological event timeline used across company / user / license views. */
export function Timeline({ events, empty }: { events: TimelineEvent[]; empty?: string }) {
  if (events.length === 0) {
    return <EmptyState title="No events" description={empty ?? "No activity has been recorded yet."} />;
  }

  return (
    <ol className="relative space-y-4 border-l border-border/60 pl-6">
      {events.map((event) => (
        <li key={event.id} className="relative">
          <span className={`absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full ${dotClass(event.severity)}`} />
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-medium text-foreground">{event.title}</p>
            <time className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</time>
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="uppercase tracking-wide">{event.category}</span>
            {event.detail ? ` · ${event.detail}` : ""}
          </p>
        </li>
      ))}
    </ol>
  );
}
