export function Testimonial() {
  return (
    <section aria-label="Customer testimonial" className="bg-fog border-y border-line">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-24">
        <blockquote className="max-w-3xl">
          <div className="font-serif italic text-[clamp(28px,4vw,52px)] leading-[1.15] tracking-[-0.02em]">
            “I had a 7-figure ETH loan on Aave during the March wick. I was asleep. Safety Net
            repaid 40k USDC on its own and saved me a six-figure liquidation penalty. It paid for
            itself a hundred times over in one night.”
          </div>
          <footer className="mt-8 flex items-center gap-3">
            <div aria-hidden="true" className="w-9 h-9 rounded-full bg-ink text-white grid place-items-center font-mono text-[11px]">
              0x
            </div>
            <div>
              <div className="text-[14px] font-medium">0xCygaar</div>
              <div className="text-[12px] text-mute">DeFi whale · anon</div>
            </div>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
