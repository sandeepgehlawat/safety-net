import type { ReactNode } from "react";

type Props = {
  n: string;
  eyebrow: string;
  title: ReactNode;
  align?: "left" | "center";
};

export function SectionHeader({ n, eyebrow, title, align = "left" }: Props) {
  const center = align === "center";
  return (
    <div className={center ? "text-center" : ""}>
      <div className={`flex items-center gap-3 ${center ? "justify-center" : ""}`}>
        <span className="font-mono text-[10px] text-mute tnum">{n}</span>
        <div aria-hidden="true" className="w-8 h-px bg-line" />
        <span className="label !tracking-[0.22em]">{eyebrow}</span>
      </div>
      <h2 className="h-section mt-5 max-w-[820px]">{title}</h2>
    </div>
  );
}
