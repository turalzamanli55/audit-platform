import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = "shrink-0";

export function IconSearch(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={20} height={20} aria-hidden {...props}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={16} height={16} aria-hidden {...props}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChevronUp(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={16} height={16} aria-hidden {...props}>
      <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={16} height={16} aria-hidden {...props}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChevronLeft(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={16} height={16} aria-hidden {...props}>
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconX(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={18} height={18} aria-hidden {...props}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={20} height={20} aria-hidden {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconPanelLeft(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={20} height={20} aria-hidden {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M9 4v16" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function IconCommand(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={14} height={14} aria-hidden {...props}>
      <path
        d="M7.5 8.5h9M8.5 7.5v9M15.5 7.5v9M7.5 15.5h9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconBuilding(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={18} height={18} aria-hidden {...props}>
      <path d="M4 20V6.5L12 3l8 3.5V20" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M9 20v-5h6v5M9 10h.01M15 10h.01M9 14h.01M15 14h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconLayoutDashboard(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={18} height={18} aria-hidden {...props}>
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <rect x="13" y="3" width="8" height="5" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <rect x="13" y="10" width="8" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function IconBriefcase(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={18} height={18} aria-hidden {...props}>
      <path d="M3 9h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 9V7a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function IconSun(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={18} height={18} aria-hidden {...props}>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconMoon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={18} height={18} aria-hidden {...props}>
      <path d="M20 14.5A8.5 8.5 0 019.5 4 7 7 0 1020 14.5z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={16} height={16} aria-hidden {...props}>
      <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconAlertCircle(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={18} height={18} aria-hidden {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconInfo(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={18} height={18} aria-hidden {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconBell(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={18} height={18} aria-hidden {...props}>
      <path
        d="M12 3a5 5 0 00-5 5v2.5c0 .69-.28 1.35-.78 1.84L5 14.5h14l-1.22-1.16A2.6 2.6 0 0117 10.5V8a5 5 0 00-5-5z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M10 17.5a2 2 0 004 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconUser(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={18} height={18} aria-hidden {...props}>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M5.5 19.5c.94-2.8 3.28-4.5 6.5-4.5s5.56 1.7 6.5 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconGlobe(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={18} height={18} aria-hidden {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3 12h18M12 3c2.5 2.7 2.5 14.3 0 18M12 3c-2.5 2.7-2.5 14.3 0 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconSparkles(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={18} height={18} aria-hidden {...props}>
      <path d="M12 3l1.2 4.2L17.5 8.5 13.2 9.7 12 14l-1.2-4.3L6.5 8.5l4.3-1.3L12 3zM5 16l.8 2.8L8.5 19.5l-2.7.7L5 23l-.8-2.8L1.5 19.5l2.7-.7L5 16zM19 14l.6 2.1L21.5 16.5l-1.9.5L19 19l-.6-2.1L16.5 16.5l1.9-.5L19 14z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={18} height={18} aria-hidden {...props}>
      <rect x="4" y="5" width="16" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={18} height={18} aria-hidden {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconStar(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={18} height={18} aria-hidden {...props}>
      <path d="M12 3.5l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7L12 3.5z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}

export function IconZap(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={18} height={18} aria-hidden {...props}>
      <path d="M13 2L5 14h6l-1 8 8-12h-6l1-8z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={16} height={16} aria-hidden {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconTrendingUp(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={18} height={18} aria-hidden {...props}>
      <path d="M4 16l6-6 4 4 6-8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 6h5v5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconFileText(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={18} height={18} aria-hidden {...props}>
      <path d="M8 4h8l4 4v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.75" />
      <path d="M16 4v4h4M10 13h6M10 17h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} width={18} height={18} aria-hidden {...props}>
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3.5 19c.6-2.5 2.7-4 5.5-4s4.9 1.5 5.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M16 8.5a2.5 2.5 0 010 5M19.5 19c-.4-1.7-1.8-3-3.5-3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
