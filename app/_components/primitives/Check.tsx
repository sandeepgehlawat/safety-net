import type { ReactNode } from "react";

export function Check({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="12" height="12" viewBox="0 0 24 24" className="text-mint-deep" aria-hidden="true">
        <path
          d="M4 12 L10 18 L20 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      {children}
    </span>
  );
}
