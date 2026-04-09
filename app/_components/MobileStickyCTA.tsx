"use client";

import { useEffect, useState } from "react";
import { ConnectWalletButton } from "./ConnectWalletButton";

export default function MobileStickyCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setShow(window.scrollY > 800);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={`md:hidden fixed bottom-4 inset-x-4 z-40 transition-all duration-500 ${
        show ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
      }`}
    >
      <div className={show ? "" : "pointer-events-none"}>
        <ConnectWalletButton variant="mobile" className="shadow-lg" />
      </div>
    </div>
  );
}
