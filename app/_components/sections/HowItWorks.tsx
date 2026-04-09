import { SectionHeader } from "../primitives/SectionHeader";
import { HOW_IT_WORKS_STEPS } from "../../_data/content";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-[1280px] mx-auto px-4 md:px-8 py-28">
      <SectionHeader
        n="03"
        eyebrow="How it works"
        title={
          <>
            Four steps from connected wallet
            <br />
            to <span className="font-serif italic">peace of mind.</span>
          </>
        }
      />
      <div className="mt-16 relative">
        <div aria-hidden="true" className="absolute left-[14px] top-0 bottom-0 w-px bg-line hidden md:block" />
        <ol className="space-y-10">
          {HOW_IT_WORKS_STEPS.map((s) => (
            <li key={s.n} className="grid grid-cols-12 gap-6 items-start">
              <div className="col-span-12 md:col-span-1 flex items-center gap-4">
                <div className="w-7 h-7 rounded-full border border-line bg-paper grid place-items-center font-mono text-[10px] tnum">
                  {s.n}
                </div>
              </div>
              <div className="col-span-12 md:col-span-4">
                <div className="text-[24px] font-medium tracking-tight">{s.t}</div>
              </div>
              <div className="col-span-12 md:col-span-7">
                <p className="text-[15px] text-mute leading-relaxed max-w-lg">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
