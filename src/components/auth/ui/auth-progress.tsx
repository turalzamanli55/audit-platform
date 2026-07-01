type AuthProgressProps = {
  label: string;
  value: number;
  max?: number;
};

export function AuthProgress({ label, value, max = 100 }: AuthProgressProps) {
  const percent = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className="space-y-2" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
