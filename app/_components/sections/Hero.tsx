"use client";

import { useEffect, useState } from "react";
import { Check } from "../primitives/Check";
import { ProductWindow } from "../visuals/ProductWindow";
import { ConnectWalletButton } from "../ConnectWalletButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3460";

export function Hero() {
  const [stats, setStats] = useState({
    total_saved_usd: "182,419,002",
    total_positions: 14,
  });

  useEffect(() => {
    // Fetch real stats from backend
    fetch(`${API_URL}/stats`)
      .then((res) => res.json())
      .then((data) => {
        if (data.total_saved_usd) {
          setStats({
            total_saved_usd: formatNumber(parseFloat(data.total_saved_usd)),
            total_positions: data.total_positions || 14,
          });
        }
      })
      .catch(() => {
        // Use default stats if backend unavailable
      });
  }, []);

  return (
    <section id="hero" className="relative grain">
      <div
        aria-hidden="true"
        className="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_70%_60%_at_30%_40%,black_30%,transparent_85%)]"
      />
      <div className="relative max-w-[1280px] mx-auto px-4 md:px-8 pt-24 pb-28 grid grid-cols-12 gap-8 items-center">
        <div className="col-span-12 lg:col-span-7">
          <div
            className="pill rise rise-1"
            aria-label={`Watching $${stats.total_saved_usd} across ${stats.total_positions} protocols`}
          >
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full bg-mint dot"
            />
            Saved <b className="text-ink tnum">${stats.total_saved_usd}</b> across{" "}
            {stats.total_positions} protocols
          </div>
          <h1 className="h-display mt-7 rise rise-2">
            Never get
            <br />
            <span className="font-serif italic font-normal">liquidated</span>{" "}
            <span className="text-mute">again.</span>
          </h1>
          <p className="mt-7 max-w-[520px] text-[17px] leading-[1.55] text-mute rise rise-3">
            Safety Net is an autonomous on-chain guardian. It watches every Aave
            loan, every Uniswap range and every token you hold — and quietly
            intervenes the second something turns red.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-7 rise rise-4">
            <ConnectWalletButton variant="cta" />
            <button type="button" className="btn-ghost">
              Watch a 90-sec demo
              <span aria-hidden="true" className="text-mute">
                ↗
              </span>
            </button>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-[12px] text-mute rise rise-5">
            <Check>Read-only by default</Check>
            <Check>You approve every signer</Check>
            <Check>Non-custodial</Check>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 rise rise-3">
          <ProductWindow />
        </div>
      </div>
    </section>
  );
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
