import { PROTOCOLS } from "../../_data/content";

export function LogoWall() {
  return (
    <section aria-label="Supported protocols" className="border-y border-line bg-fog">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row items-center gap-8">
        <div className="label whitespace-nowrap">Watching positions on</div>
        <div className="flex-1 grid grid-cols-4 md:grid-cols-8 gap-6 items-center">
          {PROTOCOLS.map((n) => (
            <div
              key={n}
              className="font-mono text-[13px] tracking-[0.2em] text-graphite/70 hover:text-ink transition text-center"
            >
              {n}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
