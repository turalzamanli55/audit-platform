"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { ActivityRow } from "@/lib/platform-console/data";

function severityVariant(severity: string): "success" | "warning" | "destructive" | "secondary" {
  if (severity === "critical") return "destructive";
  if (severity === "warning") return "warning";
  return "secondary";
}

function toCsvValue(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function ActivityCenter({ events }: { events: ActivityRow[] }) {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("all");
  const [company, setCompany] = useState("all");
  const [actor, setActor] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const companies = useMemo(
    () => Array.from(new Set(events.map((e) => e.organizationName))).sort(),
    [events],
  );
  const actors = useMemo(() => Array.from(new Set(events.map((e) => e.actorEmail))).sort(), [events]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const fromTime = from ? new Date(from).getTime() : null;
    const toTime = to ? new Date(to).getTime() + 24 * 60 * 60 * 1000 - 1 : null;
    return events.filter((e) => {
      if (term && !e.eventCode.toLowerCase().includes(term) && !e.actorEmail.toLowerCase().includes(term) && !e.organizationName.toLowerCase().includes(term)) {
        return false;
      }
      if (severity !== "all" && e.severity !== severity) return false;
      if (company !== "all" && e.organizationName !== company) return false;
      if (actor !== "all" && e.actorEmail !== actor) return false;
      const t = new Date(e.createdAt).getTime();
      if (fromTime !== null && t < fromTime) return false;
      if (toTime !== null && t > toTime) return false;
      return true;
    });
  }, [events, search, severity, company, actor, from, to]);

  function exportCsv() {
    const header = ["Timestamp", "Event", "Severity", "Actor", "Company"];
    const lines = filtered.map((e) =>
      [new Date(e.createdAt).toISOString(), e.eventCode, e.severity, e.actorEmail, e.organizationName]
        .map(toCsvValue)
        .join(","),
    );
    const csv = [header.map(toCsvValue).join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `platform-activity-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function resetFilters() {
    setSearch("");
    setSeverity("all");
    setCompany("all");
    setActor("all");
    setFrom("");
    setTo("");
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-xl border border-border/60 p-4 md:grid-cols-3 lg:grid-cols-6">
        <div className="space-y-1 md:col-span-3 lg:col-span-2">
          <Label htmlFor="act-search">Search</Label>
          <Input id="act-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Event, actor, company" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="act-sev">Severity</Label>
          <Select id="act-sev" value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="all">All</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="act-company">Company</Label>
          <Select id="act-company" value={company} onChange={(e) => setCompany(e.target.value)}>
            <option value="all">All</option>
            {companies.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="act-actor">Actor</Label>
          <Select id="act-actor" value={actor} onChange={(e) => setActor(e.target.value)}>
            <option value="all">All</option>
            {actors.map((email) => (
              <option key={email} value={email}>
                {email}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="act-from">From</Label>
          <Input id="act-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="act-to">To</Label>
          <Input id="act-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} of {events.length} events
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={resetFilters}>
            Reset
          </Button>
          <Button size="sm" variant="outline" onClick={exportCsv} disabled={filtered.length === 0}>
            Export CSV
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No matching activity" description="Adjust the filters to see more events." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5">Timestamp</th>
                <th className="px-4 py-2.5">Event</th>
                <th className="px-4 py-2.5">Severity</th>
                <th className="px-4 py-2.5">Actor</th>
                <th className="px-4 py-2.5">Company</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((event) => (
                <tr key={event.id}>
                  <td className="px-4 py-2.5 text-muted-foreground">{new Date(event.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2.5 font-medium">{event.eventCode}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant={severityVariant(event.severity)}>{event.severity}</Badge>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{event.actorEmail}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{event.organizationName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
