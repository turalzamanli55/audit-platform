import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/ui/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
};

export function Textarea({ className = "", error, ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      <textarea
        className={cn(
          "min-h-[6rem] w-full resize-y rounded-xl border bg-card px-3.5 py-2.5 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
          error ? "border-destructive" : "border-input",
          className,
        )}
        {...props}
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
