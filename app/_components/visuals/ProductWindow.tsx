export function ProductWindow() {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="flex items-center gap-2 px-4 h-9 border-b border-line bg-fog">
        <div aria-hidden="true" className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-coral" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber" />
          <div className="w-2.5 h-2.5 rounded-full bg-mint" />
        </div>
        <div className="ml-3 font-mono text-[10px] text-mute tracking-wider">
          safetynet.app/dashboard
        </div>
        <div className="ml-auto pill !py-0.5 !px-2 !text-[10px]">
          <span aria-hidden="true" className="w-1 h-1 rounded-full bg-mint dot" /> live · block 19,482,711
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2">
          <span className="label">Critical alert</span>
          <span className="ml-auto font-mono text-[10px] text-mute">12s ago</span>
        </div>
        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-[28px] font-medium tracking-tight">HF 1.18</div>
          <div className="text-[12px] text-coral font-mono">↓ from 1.42</div>
        </div>
        <p className="mt-1 text-[13px] text-mute leading-relaxed">
          Your <b className="text-ink">ETH/USDC</b> position on Aave v3 is approaching liquidation.
          Repay <b className="text-ink">$500 USDC</b> to bring health factor to{" "}
          <b className="text-ink">1.80</b>?
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="rounded-[8px] bg-fog border border-line p-2">
            <div className="text-mute">before</div>
            <div className="mt-1 text-coral">HF 1.18 · debt $9,420</div>
          </div>
          <div className="rounded-[8px] bg-[#e8f7ee] border border-mint/40 p-2">
            <div className="text-mint-deep">after</div>
            <div className="mt-1">HF 1.80 · debt $8,920</div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="flex-1 bg-ink text-white rounded-full text-[12px] font-medium py-2.5"
          >
            Repay $500 · one tap
          </button>
          <button
            type="button"
            className="px-3 rounded-full text-[12px] font-medium border border-line bg-white"
          >
            Snooze
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-mute">
          <span>gas est. 142k · $0.41</span>
          <span>tx will simulate first</span>
        </div>
      </div>
    </div>
  );
}
