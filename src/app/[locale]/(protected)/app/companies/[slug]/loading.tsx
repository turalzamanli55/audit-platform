import { CompanyLoadingSkeleton, CompanyPageShell } from "@/components/company";

export default function CompanyDetailLoading() {
  return (
    <CompanyPageShell>
      <CompanyLoadingSkeleton variant="detail" />
    </CompanyPageShell>
  );
}
