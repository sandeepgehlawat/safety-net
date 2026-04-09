import { SectionHeader } from "../primitives/SectionHeader";
import { FAQ_ITEMS } from "../../_data/content";

export function FAQ() {
  return (
    <section id="faq" className="bg-fog border-y border-line">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-28 grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-4">
          <SectionHeader
            n="05"
            eyebrow="FAQ"
            title={
              <>
                Common <span className="font-serif italic">questions.</span>
              </>
            }
          />
        </div>
        <div className="col-span-12 lg:col-span-8">
          <ul className="divide-y divide-line border-y border-line">
            {FAQ_ITEMS.map((it) => (
              <li key={it.q} className="py-6">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="text-[18px] font-medium tracking-tight">{it.q}</span>
                    <span
                      aria-hidden="true"
                      className="text-mute group-open:rotate-45 transition-transform duration-300 text-2xl leading-none"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[14.5px] text-mute leading-relaxed max-w-2xl">{it.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
