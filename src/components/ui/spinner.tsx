import { cn } from "@/lib/ui/cn";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
};

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[2.5px]",
};

export function Spinner({ size = "md", className, label = "Loading" }: SpinnerProps) {
  return (
    <span
      className={cn("inline-flex items-center justify-center", className)}
      role="status"
      aria-label={label}
    >
      <span
        className={cn(
          "animate-spin rounded-full border-current border-r-transparent text-primary",
          sizeClasses[size],
        )}
        aria-hidden="true"
      />
    </span>
  );
}
