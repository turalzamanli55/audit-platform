"use client";

import { useMemo, useState } from "react";
import { Alert, Button, Input } from "@/components/ui";
import { MaterialityWorkspaceSectionShell } from "@/components/materiality/workspace/materiality-workspace-section-shell";
import {
  calculateMaterialityAmount,
  formatCurrency,
} from "@/lib/materiality/materiality-workspace-display";
import type { MaterialityBenchmarkView, MaterialityWorkspaceView } from "@/lib/materiality/materiality-workspace-view";
import type { MaterialityBenchmarkType } from "@/types/materiality";

type MaterialityCalculatorLabels = {
  title: string;
  description: string;
  benchmarkLabel: string;
  benchmarkPlaceholder: string;
  amountLabel: string;
  amountPlaceholder: string;
  percentageLabel: string;
  percentagePlaceholder: string;
  calculatedLabel: string;
  manualOverrideLabel: string;
  overrideReasonLabel: string;
  overrideReasonPlaceholder: string;
  applyAction: string;
  selectBenchmarkAction: string;
  autoCalcNotice: string;
  manualOverrideNotice: string;
  noBenchmarksTitle: string;
  noBenchmarksDescription: string;
  benchmarkTypes: Record<MaterialityBenchmarkType, string>;
};

type MaterialityCalculatorPanelProps = {
  materiality: MaterialityWorkspaceView;
  labels: MaterialityCalculatorLabels;
  canUpdate?: boolean;
  onSelectBenchmark?: (benchmarkId: string) => void;
  onApplyCalculation?: (input: {
    benchmarkId: string | null;
    amount: number;
    percentage: number;
    isManualOverride: boolean;
    overrideReason: string | null;
  }) => void;
};

export function MaterialityCalculatorPanel({
  materiality,
  labels,
  canUpdate = false,
  onSelectBenchmark,
  onApplyCalculation,
}: MaterialityCalculatorPanelProps) {
  const selectedBenchmark = materiality.benchmarks.find(
    (benchmark) => benchmark.id === materiality.selectedBenchmarkId,
  );
  const [activeBenchmarkId, setActiveBenchmarkId] = useState<string>(
    selectedBenchmark?.id ?? materiality.benchmarks[0]?.id ?? "",
  );
  const [amount, setAmount] = useState(
    String(selectedBenchmark?.benchmarkAmount ?? materiality.benchmarks[0]?.benchmarkAmount ?? ""),
  );
  const [percentage, setPercentage] = useState(
    String(selectedBenchmark?.percentage ?? materiality.benchmarks[0]?.percentage ?? ""),
  );
  const [manualOverride, setManualOverride] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");

  const activeBenchmark = materiality.benchmarks.find((benchmark) => benchmark.id === activeBenchmarkId);

  const calculatedAmount = useMemo(() => {
    const parsedAmount = Number(amount);
    const parsedPercentage = Number(percentage);
    if (!Number.isFinite(parsedAmount) || !Number.isFinite(parsedPercentage)) return null;
    return calculateMaterialityAmount(parsedAmount, parsedPercentage);
  }, [amount, percentage]);

  const handleBenchmarkSelect = (benchmark: MaterialityBenchmarkView) => {
    setActiveBenchmarkId(benchmark.id);
    setAmount(String(benchmark.benchmarkAmount));
    setPercentage(String(benchmark.percentage));
    onSelectBenchmark?.(benchmark.id);
  };

  const handleApply = () => {
    if (!canUpdate || calculatedAmount == null) return;
    onApplyCalculation?.({
      benchmarkId: activeBenchmarkId || null,
      amount: Number(amount),
      percentage: Number(percentage),
      isManualOverride: manualOverride,
      overrideReason: manualOverride ? overrideReason.trim() || null : null,
    });
  };

  if (materiality.benchmarks.length === 0) {
    return (
      <MaterialityWorkspaceSectionShell title={labels.title} description={labels.description} headingId="materiality-calculator">
        <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 px-6 py-10 text-center">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">{labels.noBenchmarksTitle}</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{labels.noBenchmarksDescription}</p>
        </div>
      </MaterialityWorkspaceSectionShell>
    );
  }

  return (
    <MaterialityWorkspaceSectionShell title={labels.title} description={labels.description} headingId="materiality-calculator">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-3 rounded-2xl border border-border/50 bg-card/80 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {labels.benchmarkLabel}
          </p>
          <ul className="space-y-2">
            {materiality.benchmarks.map((benchmark) => {
              const active = benchmark.id === activeBenchmarkId;
              return (
                <li key={benchmark.id}>
                  <button
                    type="button"
                    onClick={() => handleBenchmarkSelect(benchmark)}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                      active
                        ? "border-foreground/20 bg-foreground/[0.04]"
                        : "border-border/50 bg-card hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {benchmark.benchmarkLabel ??
                            labels.benchmarkTypes[benchmark.benchmarkType] ??
                            benchmark.benchmarkType}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatCurrency(benchmark.benchmarkAmount, materiality.currencyCode)} ·{" "}
                          {benchmark.percentage}%
                        </p>
                      </div>
                      {benchmark.isSelected ? (
                        <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium">
                          {labels.selectBenchmarkAction}
                        </span>
                      ) : null}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-4 rounded-2xl border border-border/50 bg-card/80 p-5">
          <Alert variant="info">{manualOverride ? labels.manualOverrideNotice : labels.autoCalcNotice}</Alert>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">{labels.amountLabel}</span>
              <Input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder={labels.amountPlaceholder}
                inputMode="decimal"
                disabled={!canUpdate}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">{labels.percentageLabel}</span>
              <Input
                value={percentage}
                onChange={(event) => setPercentage(event.target.value)}
                placeholder={labels.percentagePlaceholder}
                inputMode="decimal"
                disabled={!canUpdate}
              />
            </label>
          </div>

          <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {labels.calculatedLabel}
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {calculatedAmount != null
                ? formatCurrency(calculatedAmount, materiality.currencyCode)
                : "—"}
            </p>
            {activeBenchmark?.calculatedMateriality != null ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Saved: {formatCurrency(activeBenchmark.calculatedMateriality, materiality.currencyCode)}
              </p>
            ) : null}
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={manualOverride}
              onChange={(event) => setManualOverride(event.target.checked)}
              disabled={!canUpdate}
              className="rounded border-border"
            />
            {labels.manualOverrideLabel}
          </label>

          {manualOverride ? (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">{labels.overrideReasonLabel}</span>
              <Input
                value={overrideReason}
                onChange={(event) => setOverrideReason(event.target.value)}
                placeholder={labels.overrideReasonPlaceholder}
                disabled={!canUpdate}
              />
            </label>
          ) : null}

          {canUpdate ? (
            <Button type="button" onClick={handleApply} disabled={calculatedAmount == null}>
              {labels.applyAction}
            </Button>
          ) : null}
        </div>
      </div>
    </MaterialityWorkspaceSectionShell>
  );
}
