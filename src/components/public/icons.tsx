import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = "shrink-0";

export function PublicIconSpark(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={22} height={22} aria-hidden {...props}>
      <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75L19 15z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  );
}

export function PublicIconShield(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={22} height={22} aria-hidden {...props}>
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PublicIconLayers(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={22} height={22} aria-hidden {...props}>
      <path d="M12 3l9 5-9 5-9-5 9-5z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M3 12l9 5 9-5M3 17l9 5 9-5" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}

export function PublicIconFile(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={22} height={22} aria-hidden {...props}>
      <path d="M8 3h8l4 4v14a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M16 3v5h5M10 13h8M10 17h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function PublicIconChart(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={22} height={22} aria-hidden {...props}>
      <path d="M4 20V4M4 20h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M8 16v-4M12 16V8M16 16v-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function PublicIconScale(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={22} height={22} aria-hidden {...props}>
      <path d="M12 3v18M5 7h14M7 7l-2 4h4l-2-4zM17 7l-2 4h4l-2-4z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PublicIconZap(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={22} height={22} aria-hidden {...props}>
      <path d="M13 2L4 14h7l-1 8 10-14h-7l0-6z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}

export function PublicIconLock(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={22} height={22} aria-hidden {...props}>
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function PublicIconBrain(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={22} height={22} aria-hidden {...props}>
      <path d="M8.5 8a3 3 0 015-2.2A3.5 3.5 0 0117 9c2.2 0 3 1.5 3 3.5a3 3 0 01-1 2.2V17a2 2 0 01-2 2h-8a2 2 0 01-2-2v-2.3A3 3 0 015 12.5C5 10.5 6.5 8.5 8.5 8z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M12 8v11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function PublicIconBuilding(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={22} height={22} aria-hidden {...props}>
      <path d="M4 20V8l8-4 8 4v12" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M9 20v-6h6v6M9 10h.01M15 10h.01M9 14h.01M15 14h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
