const PTS = [50, 46, 48, 40, 42, 35, 30, 32, 25, 22, 18, 15, 12, 14, 10, 8, 12, 6, 9, 5];
const PATH = PTS.map((y, i) => `${(i / (PTS.length - 1)) * 100},${y}`).join(" ");

export function Sparkline() {
  return (
    <svg viewBox="0 0 100 50" className="w-32 h-8" aria-hidden="true">
      <polyline points={PATH} fill="none" stroke="rgb(31 209 137)" strokeWidth="1.5" />
    </svg>
  );
}
