import { Badge } from "@/components/ui/badge";

type TrustBadgeProps = {
  label: string;
};

export function TrustBadge({ label }: TrustBadgeProps) {
  return (
    <Badge variant="outline" size="md" className="bg-card/60 px-3 py-1 backdrop-blur-sm">
      {label}
    </Badge>
  );
}
