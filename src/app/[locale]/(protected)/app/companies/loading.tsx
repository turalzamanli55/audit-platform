import { CompanyLoadingSkeleton, CompanyPageShell } from "@/components/company";

export default function CompaniesLoading() {
  return (
    <CompanyPageShell>
      <div className="space-y-8">
        <div className="space-y-3 border-b border-border/50 pb-8">
          <div className="h-3 w-24 animate-pulse rounded-lg bg-muted/80" />
          <div className="h-9 w-48 animate-pulse rounded-xl bg-muted/80" />
          <div className="h-4 w-full max-w-lg animate-pulse rounded-lg bg-muted/80" />
        </div>
        <div className="h-10 w-full max-w-md animate-pulse rounded-xl bg-muted/80" />
        <CompanyLoadingSkeleton variant="list" rows={5} />
      </div>
    </CompanyPageShell>
  );
}
