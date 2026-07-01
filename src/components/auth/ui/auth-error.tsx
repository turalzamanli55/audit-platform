import { IconAlertCircle } from "@/components/ui/icons";

type AuthErrorProps = {
  message: string;
};

export function AuthError({ message }: AuthErrorProps) {
  return (
    <div
      className="flex items-start gap-3 rounded-2xl border border-destructive/25 bg-destructive/5 px-4 py-3.5 ds-animate-fade-in motion-reduce:animate-none"
      role="alert"
    >
      <IconAlertCircle className="mt-0.5 shrink-0 text-destructive" />
      <p className="text-sm leading-relaxed text-foreground">{message}</p>
    </div>
  );
}
