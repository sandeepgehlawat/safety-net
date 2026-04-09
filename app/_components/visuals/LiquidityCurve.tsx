// Pre-computed bell-ish curve points (static).
const CURVE = (() => {
  const pts: string[] = [];
  for (let x = 0; x <= 100; x += 2) {
    const y = 60 - Math.exp(-Math.pow((x - 50) / 18, 2)) * 50;
    pts.push(`${x},${y}`);
  }
  return pts.join(" ");
})();

export function LiquidityCurve() {
  return (
    <div className="relative h-24 rounded-[10px] border border-line bg-fog overflow-hidden">
      <div aria-hidden="true" className="absolute inset-y-0 left-[20%] right-[25%] bg-mint/[0.12] border-x border-dashed border-mint/50" />
      <svg viewBox="0 0 100 70" className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden="true">
        <polyline points={CURVE} fill="none" stroke="rgba(12,12,12,0.55)" strokeWidth="0.8" />
      </svg>
      <div aria-hidden="true" className="absolute inset-y-0 left-[55%] w-[2px] bg-ink" />
      <div aria-hidden="true" className="absolute left-[55%] -translate-x-1/2 top-1 w-1.5 h-1.5 rounded-full bg-ink" />
    </div>
  );
}
