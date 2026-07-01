import { Card } from "@/components/ui/card";
import { Grid } from "@/components/layout/grid";
import type { ReactNode } from "react";

type DashboardStatProps = {
  label: string;
  value: string;
  hint: string;
};

export function DashboardStat({ label, value, hint }: DashboardStatProps) {
  return (
    <Card padding="md" className="transition-shadow duration-200 hover:shadow-md">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{hint}</p>
    </Card>
  );
}

export function DashboardStatsGrid({ children }: { children: ReactNode }) {
  return <Grid cols={4} gap="md">{children}</Grid>;
}
