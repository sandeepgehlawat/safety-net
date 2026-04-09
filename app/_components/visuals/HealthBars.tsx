type Tone = "ok" | "warn" | "bad";

const POSITIONS: ReadonlyArray<{ n: string; h: number; tone: Tone }> = [
  { n: "ETH/USDC · Aave v3", h: 1.18, tone: "bad" },
  { n: "wstETH/ETH · Aave v3", h: 2.4, tone: "ok" },
  { n: "ARB/USDC · Uniswap LP", h: 1.62, tone: "warn" },
  { n: "WBTC long · Aave v3", h: 3.1, tone: "ok" },
];

const TONE_BG: Record<Tone, string> = {
  bad: "bg-coral",
  warn: "bg-amber",
  ok: "bg-mint",
};

export function HealthBars() {
  return (
    <div className="space-y-3.5">
      {POSITIONS.map((p) => (
        <div key={p.n} className="flex items-center gap-4 text-[13px]">
          <div className="w-52 truncate text-mute font-mono text-[11px]">{p.n}</div>
          <div className="flex-1 h-1.5 rounded-full bg-fog overflow-hidden border border-line">
            <div
              className={`h-full ${TONE_BG[p.tone]}`}
              style={{ width: `${Math.min(p.h / 4, 1) * 100}%` }}
            />
          </div>
          <div className="w-12 text-right font-mono text-[11px] tnum">{p.h.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
}
