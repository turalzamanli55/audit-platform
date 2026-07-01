import type { ReactNode } from "react";

type CompanyAvatarProps = {
  name: string;
  /** Optional optimized image element supplied by the parent (e.g. next/image). */
  image?: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE_CLASSES = {
  sm: "h-8 w-8 text-xs rounded-lg",
  md: "h-10 w-10 text-sm rounded-xl",
  lg: "h-12 w-12 text-base rounded-xl",
} as const;

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

/**
 * Company identity avatar — custom image slot or refined initials fallback.
 */
export function CompanyAvatar({ name, image, size = "md", className = "" }: CompanyAvatarProps) {
  const initials = initialsFromName(name);

  if (image) {
    return (
      <span
        className={`inline-flex shrink-0 overflow-hidden ring-1 ring-border/50 ${SIZE_CLASSES[size]} ${className}`}
      >
        {image}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center bg-accent font-medium text-accent-foreground ring-1 ring-border/40 ${SIZE_CLASSES[size]} ${className}`}
    >
      {initials}
    </span>
  );
}

export function CompanyAvatarLabel({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  return (
    <span className="sr-only">
      {name}
      {children}
    </span>
  );
}
