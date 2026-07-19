"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { downloadCsv, downloadJson, timestampedName } from "@/lib/platform-console/export-utils";
import type { ActivityRow } from "@/lib/platform-console/data";
import { usePlatformLabels } from "@/i18n/use-platform-labels";
import { fillPlatform } from "@/i18n/platform-labels";

function severityVariant(severity: string): "success" | "warning" | "destructive" | "secondary" {
  if (severity === "critical") return "destructive";
  if (severity === "warning") return "warning";
  return "secondary";
}

export function ActivityCenter({ events }: { events: ActivityRow[] }) {
  const t = usePlatformLabels();
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
    downloadCsv(
      timestampedName("platform-activity", "csv"),
      [t.common.timestamp, t.common.event, t.common.severity, t.common.actor, t.activityCenter.csvCompany],
      filtered.map((e) => [new Date(e.createdAt).toISOString(), e.eventCode, e.severity, e.actorEmail, e.organizationName]),
    );
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
          <Label htmlFor="act-search">{t.common.search}</Label>
          <Input id="act-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.activityCenter.searchPlaceholder} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="act-sev">{t.common.severity}</Label>
          <Select id="act-sev" value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="all">{t.common.all}</option>
            <option value="info">{t.common.info}</option>
            <option value="warning">{t.common.warning}</option>
            <option value="critical">{t.common.critical}</option>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="act-company">{t.common.company}</Label>
          <Select id="act-company" value={company} onChange={(e) => setCompany(e.target.value)}>
            <option value="all">{t.common.all}</option>
            {companies.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="act-actor">{t.common.actor}</Label>
          <Select id="act-actor" value={actor} onChange={(e) => setActor(e.target.value)}>
            <option value="all">{t.common.all}</option>
            {actors.map((email) => (
              <option key={email} value={email}>
                {email}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="act-from">{t.activityCenter.from}</Label>
          <Input id="act-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="act-to">{t.activityCenter.to}</Label>
          <Input id="act-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {fillPlatform(t.activityCenter.summary, { count: filtered.length, total: events.length })}
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={resetFilters}>
            {t.activityCenter.reset}
          </Button>
          <Button size="sm" variant="outline" onClick={exportCsv} disabled={filtered.length === 0}>
            {t.common.exportCsv}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => downloadJson(timestampedName("platform-activity", "json"), filtered)}
            disabled={filtered.length === 0}
          >
            {t.common.exportJson}
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={t.activityCenter.emptyTitle} description={t.activityCenter.emptyDescription} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5">{t.common.timestamp}</th>
                <th className="px-4 py-2.5">{t.common.event}</th>
                <th className="px-4 py-2.5">{t.common.severity}</th>
                <th className="px-4 py-2.5">{t.common.actor}</th>
                <th className="px-4 py-2.5">{t.common.company}</th>
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
