"use client";

import { SearchCommandTrigger } from "./search-command-trigger";

type MobileSearchTriggerProps = {
  placeholder: string;
  label: string;
  className?: string;
};

export function MobileSearchTrigger({ placeholder, label, className }: MobileSearchTriggerProps) {
  return (
    <SearchCommandTrigger
      placeholder={placeholder}
      label={label}
      className={className}
      compact
    />
  );
}
