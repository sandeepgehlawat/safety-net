"use client";

import { LivePill } from "../primitives/LivePill";
import { ConnectWalletButton } from "../ConnectWalletButton";

export function FinalCTA() {
  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-8 py-28 text-center grain">
      <LivePill>Connect in under 10 seconds</LivePill>
      <h2 className="h-display mt-7">
        Sleep through the
        <br />
        <span className="font-serif italic">next wick.</span>
      </h2>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-7">
        <ConnectWalletButton variant="cta" />
        <a href="/docs" className="btn-ghost">
          Read the docs <span aria-hidden="true" className="text-mute">↗</span>
        </a>
      </div>
    </section>
  );
}
