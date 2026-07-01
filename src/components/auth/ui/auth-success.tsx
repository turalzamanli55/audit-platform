import { IconCheck } from "@/components/ui/icons";

type AuthSuccessProps = {
  title: string;
  description?: string;
};

export function AuthSuccess({ title, description }: AuthSuccessProps) {
  return (
    <div
      className="flex flex-col items-center gap-4 py-6 text-center ds-animate-scale-in motion-reduce:animate-none"
      role="status"
      aria-live="polite"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-success">
        <IconCheck width={28} height={28} />
      </span>
      <div className="space-y-2">
        <p className="text-lg font-semibold tracking-tight text-foreground">{title}</p>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
    </div>
  );
}
