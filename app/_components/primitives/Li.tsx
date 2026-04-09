import type { ReactNode } from "react";

export function Li({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <li className="flex items-center gap-2.5">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        className={dark ? "text-mint" : "text-ink"}
        aria-hidden="true"
      >
        <path d="M4 12 L10 18 L20 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span className={dark ? "text-white/85" : ""}>{children}</span>
    </li>
  );
}
