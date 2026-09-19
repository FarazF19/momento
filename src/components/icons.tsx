import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ArrowIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M5 12h13M13 6l6 6-6 6" /></svg>;
}

export function SearchIcon(props: IconProps) {
  return <svg {...base} {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
}

export function PinIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.4" /></svg>;
}

export function CalendarIcon(props: IconProps) {
  return <svg {...base} {...props}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>;
}

export function BookmarkIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-4-6 4Z" /></svg>;
}

export function CheckIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="m5 12 4 4L19 6" /></svg>;
}

export function CloseIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="m6 6 12 12M18 6 6 18" /></svg>;
}

export function MenuIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
}
