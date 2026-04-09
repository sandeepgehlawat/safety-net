import { SectionHeader } from "../primitives/SectionHeader";
import { HealthBars } from "../visuals/HealthBars";
import { Sparkline } from "../visuals/Sparkline";
import { LiquidityCurve } from "../visuals/LiquidityCurve";
import { Toggle } from "../visuals/Toggle";
import { TokenRow } from "../visuals/TokenRow";

export function Bento() {
  return (
    <section id="product" className="max-w-[1280px] mx-auto px-4 md:px-8 py-28">
      <SectionHeader
        n="01"
        eyebrow="The product"
        title={
          <>
            Built like an instrument,
            <br />
            <span className="font-serif italic">not a dashboard.</span>
          </>
        }
      />
      <div className="grid grid-cols-12 gap-6 mt-14">
        <div className="card col-span-12 lg:col-span-7 p-8 min-h-[420px] flex flex-col">
          <div className="flex items-center justify-between">
            <span className="label">02 · live monitor</span>
            <span className="font-mono text-[10px] text-mute flex items-center gap-1.5">
              <span aria-hidden="true" className="w-1 h-1 rounded-full bg-mint dot" /> per-block · 14ms latency
            </span>
          </div>
          <h3 className="mt-4 text-[28px] font-medium tracking-tight leading-[1.05]">
            Every position. Every block.
            <span className="text-mute"> Always on.</span>
          </h3>
          <p className="mt-2 text-[14px] text-mute max-w-md">
            The agent indexes Aave health factors, Uniswap LP ranges and Chainlink feeds on every
            new block. No polling delays. No missed liquidations.
          </p>
          <div className="mt-auto pt-8">
            <HealthBars />
          </div>
        </div>

        <div className="card-dark col-span-12 lg:col-span-5 p-8 min-h-[420px] flex flex-col relative overflow-hidden">
          <div aria-hidden="true" className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-mint/10 blur-3xl" />
          <span className="label !text-white/40">03 · saved to date</span>
          <div className="mt-auto">
            <div className="flex items-baseline gap-3">
              <div className="text-[88px] font-medium tracking-[-0.05em] leading-none tnum">
                $4.1M
              </div>
              <div className="text-mint font-mono text-xs">+$182k this week</div>
            </div>
            <div className="mt-4 text-white/60 text-[14px] max-w-xs">
              Liquidations prevented across <b className="text-white tnum">1,284</b> positions since
              launch. Real money kept in real wallets.
            </div>
            <div className="mt-8 flex items-center gap-4 text-[11px] font-mono text-white/40">
              <Sparkline />
              <span>30-day rescues</span>
            </div>
          </div>
        </div>

        <div className="card col-span-12 lg:col-span-5 p-7">
          <div className="flex items-center justify-between">
            <span className="label">04 · uniswap v3</span>
            <span className="font-mono text-[10px] text-mute">ETH/USDC · 0.05%</span>
          </div>
          <h3 className="mt-2 text-[18px] font-medium tracking-tight">
            Liquidity range, watched and rebalanced.
          </h3>
          <div className="mt-5">
            <LiquidityCurve />
          </div>
          <div className="mt-3 grid grid-cols-3 text-[11px] font-mono">
            <div>
              <div className="text-mute">lower</div>
              <div className="tnum">$2,840</div>
            </div>
            <div className="text-center">
              <div className="text-mute">price</div>
              <div className="tnum text-mint-deep">$3,210</div>
            </div>
            <div className="text-right">
              <div className="text-mute">upper</div>
              <div className="tnum">$3,560</div>
            </div>
          </div>
        </div>

        <div className="card col-span-6 lg:col-span-3 p-7 flex flex-col justify-between">
          <span className="label">05 · autopilot</span>
          <div>
            <div className="text-[28px] font-medium tracking-tight leading-tight">
              Hands-off
              <br />
              <span className="font-serif italic text-mute">if you wish.</span>
            </div>
            <p className="mt-2 text-[12px] text-mute">
              Pre-approve a budget. The agent acts without asking.
            </p>
          </div>
          <Toggle />
        </div>

        <div className="card col-span-6 lg:col-span-4 p-6">
          <div className="flex items-center justify-between">
            <span className="label">06 · drawdown alerts</span>
            <span className="font-mono text-[10px] text-mute">14 tokens</span>
          </div>
          <ul className="mt-3 divide-y divide-line">
            <TokenRow sym="ETH" px="$3,210" d="-2.1%" tone="ok" />
            <TokenRow sym="ARB" px="$0.84" d="-21.4%" tone="bad" />
            <TokenRow sym="LDO" px="$1.92" d="-4.6%" tone="warn" />
            <TokenRow sym="WBTC" px="$68,420" d="+1.0%" tone="ok" />
          </ul>
        </div>

        <div className="card col-span-12 p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden sweep">
          <div className="label whitespace-nowrap">07 · x402 micropayments</div>
          <div className="text-[15px]">
            <span className="font-medium tnum">$0.0004 / check.</span>{" "}
            <span className="text-mute">
              Your agent pays per poll. You only spend when it actually watches — and only ever pay
              real money when it actually saves you.
            </span>
          </div>
          <div className="md:ml-auto flex items-center gap-3 font-mono text-[10px] text-mute">
            streaming <span className="tnum text-ink">0.000412 USDC/s</span>
            <div className="w-24 h-1.5 rounded-full bg-fog overflow-hidden">
              <div className="h-full w-2/3 bg-ink" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
