import { Spinner } from "@/components/ui/spinner";

type AuthLoadingProps = {
  label: string;
};

export function AuthLoading({ label }: AuthLoadingProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-8" role="status" aria-live="polite">
      <Spinner size="md" label={label} />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
