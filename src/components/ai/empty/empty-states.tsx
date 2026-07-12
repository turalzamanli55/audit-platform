import { aiWorkspaceTokens } from "@/components/ai/shared/ai-tokens";
import { cn } from "@/lib/ui/cn";

export function AiEmptyState({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn(aiWorkspaceTokens.empty, className)} role="status">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? <p className="max-w-sm text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}
