import { SectionHeader } from "../primitives/SectionHeader";
import { Li } from "../primitives/Li";

export function Pricing() {
  return (
    <section id="pricing" className="max-w-[1280px] mx-auto px-4 md:px-8 py-28">
      <SectionHeader
        n="04"
        eyebrow="Pricing"
        title={
          <>
            Pay only when
            <br />
            you’re <span className="font-serif italic">actually saved.</span>
          </>
        }
      />
      <div className="grid md:grid-cols-2 gap-6 mt-14">
        <div className="card p-9 flex flex-col">
          <span className="label">Pay-as-you-save</span>
          <div className="mt-4 flex items-baseline gap-2">
            <div className="text-[64px] font-medium tracking-[-0.04em] leading-none tnum">10%</div>
            <div className="text-mute text-[14px]">of liquidation prevented</div>
          </div>
          <p className="mt-4 text-[14px] text-mute">
            Charged on success only, settled in stablecoins via x402. No save, no fee. Perfect for
            wallets you don’t touch every day.
          </p>
          <ul className="mt-7 space-y-2.5 text-[14px]">
            <Li>Unlimited positions</Li>
            <Li>Per-block monitoring</Li>
            <Li>Push, Telegram & email alerts</Li>
            <Li>Manual approval flow</Li>
          </ul>
          <div className="mt-auto pt-8">
            <button type="button" className="btn-ghost">
              Start free <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="card-dark p-9 flex flex-col relative overflow-hidden">
          <div aria-hidden="true" className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-mint/10 blur-3xl" />
          <div className="flex items-center justify-between">
            <span className="label !text-white/50">Flat — recommended</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-mint border border-mint/40 rounded-full px-2 py-0.5">
              autopilot
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <div className="text-[64px] font-medium tracking-[-0.04em] leading-none tnum">$19</div>
            <div className="text-white/50 text-[14px]">/ month</div>
          </div>
          <p className="mt-4 text-[14px] text-white/60">
            Streamed second-by-second over x402. Cancel mid-second if you like. Includes the full
            autopilot — the agent acts without asking.
          </p>
          <ul className="mt-7 space-y-2.5 text-[14px]">
            <Li dark>Everything in Pay-as-you-save</Li>
            <Li dark>Autopilot interventions</Li>
            <Li dark>Custom thresholds & strategies</Li>
            <Li dark>Priority block inclusion</Li>
            <Li dark>Private mempool routing</Li>
          </ul>
          <div className="mt-auto pt-8">
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-white text-ink rounded-full px-5 py-2.5 text-[13px] font-medium hover:bg-mint transition-colors"
            >
              Start 14-day trial <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
