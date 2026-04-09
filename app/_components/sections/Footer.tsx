import { Mark } from "../primitives/Mark";
import { LivePill } from "../primitives/LivePill";
import { FOOTER_COLUMNS } from "../../_data/footer";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-20">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 md:col-span-4">
            <div className="flex items-center gap-3">
              <Mark />
              <span className="font-semibold tracking-tight">Safety Net</span>
            </div>
            <p className="mt-5 text-[14px] text-mute max-w-xs leading-relaxed">
              The autonomous on-chain guardian for DeFi positions. Built by people who’ve been
              liquidated, so you don’t have to be.
            </p>
            <div className="mt-6">
              <LivePill>All systems operational</LivePill>
            </div>
          </div>
          {FOOTER_COLUMNS.map((c) => (
            <nav key={c.h} aria-label={c.h} className="col-span-6 md:col-span-2">
              <div className="label">{c.h}</div>
              <ul className="mt-4 space-y-2.5 text-[13.5px]">
                {c.l.map((link) => (
                  <li key={link.label} className="text-mute hover:text-ink transition">
                    <a
                      href={link.href}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-line flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-mute">
          <div>© {new Date().getFullYear()} Safety Net Labs · Non-custodial · Made on the internet</div>
          <div className="font-mono tnum">block 19,482,711 · 14ms · all green</div>
        </div>
      </div>
    </footer>
  );
}
