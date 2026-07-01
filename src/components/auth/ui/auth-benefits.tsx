import { IconCheck } from "@/components/ui/icons";

type AuthBenefitsProps = {
  items: string[];
};

export function AuthBenefits({ items }: AuthBenefitsProps) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <IconCheck width={12} height={12} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
