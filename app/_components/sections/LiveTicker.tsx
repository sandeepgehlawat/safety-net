import { TICKER_ITEMS } from "../../_data/content";

const DOUBLED = [...TICKER_ITEMS, ...TICKER_ITEMS];

export function LiveTicker() {
  return (
    <section aria-label="Live agent activity" className="border-b border-line bg-paper overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-3 flex items-center gap-6">
        <div className="label flex items-center gap-2 whitespace-nowrap">
          <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-mint dot" />
          live agent log
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="ticker flex gap-10 whitespace-nowrap font-mono text-[11px] text-mute">
            {DOUBLED.map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
