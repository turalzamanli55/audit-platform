"use client";

import { evaluatePasswordStrength } from "@/lib/auth/password-strength";
import type { AuthExperienceLabels } from "@/i18n/auth-experience-types";
import { cn } from "@/lib/ui/cn";

type AuthPasswordStrengthProps = {
  password: string;
  labels: AuthExperienceLabels["passwordStrength"];
};

const levelLabels = (labels: AuthExperienceLabels["passwordStrength"]) => [
  "",
  labels.weak,
  labels.fair,
  labels.good,
  labels.strong,
];

const levelColors = [
  "bg-muted",
  "bg-destructive",
  "bg-warning",
  "bg-info",
  "bg-success",
];

export function AuthPasswordStrength({ password, labels }: AuthPasswordStrengthProps) {
  const { level } = evaluatePasswordStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-2" aria-live="polite">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{labels.label}</span>
        <span className="font-medium text-foreground">{levelLabels(labels)[level]}</span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((segment) => (
          <div
            key={segment}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300 motion-reduce:transition-none",
              segment <= level ? levelColors[level] : "bg-muted",
            )}
          />
        ))}
      </div>
    </div>
  );
}

type AuthPasswordRequirementsProps = {
  title: string;
  items: string[];
  password: string;
};

export function AuthPasswordRequirements({ title, items, password }: AuthPasswordRequirementsProps) {
  const { checks } = evaluatePasswordStrength(password);

  const met = [
    checks.minLength,
    checks.hasLetter && checks.hasNumber,
    checks.hasSymbol,
  ];

  return (
    <div className="rounded-2xl border border-border/50 bg-muted/20 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item, index) => (
          <li
            key={item}
            className={cn(
              "flex items-center gap-2 text-sm transition-colors duration-200 motion-reduce:transition-none",
              password && met[index] ? "text-success" : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                password && met[index] ? "bg-success" : "bg-muted-foreground/40",
              )}
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
