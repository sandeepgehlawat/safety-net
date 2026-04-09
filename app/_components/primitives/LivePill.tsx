import type { ReactNode } from "react";

export function LivePill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`pill ${className}`}>
      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-mint dot" />
      {children}
    </span>
  );
}
