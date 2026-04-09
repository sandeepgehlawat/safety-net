"use client";

import { useEffect, useRef, useState } from "react";
import { Mark } from "./primitives/Mark";
import { NAV_LINKS } from "../_data/nav";

const DISMISS_KEY = "sn:announce:dismissed:v1";
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  // hydrate dismiss state
  useEffect(() => {
    try {
      setShowBar(localStorage.getItem(DISMISS_KEY) !== "1");
    } catch {
      setShowBar(true);
    }
  }, []);

  const dismissBar = () => {
    setShowBar(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  };

  // lock body scroll while mobile menu open (via class, not inline style)
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    return () => {
      document.documentElement.classList.remove("menu-open");
    };
  }, [open]);

  // escape to close + simple focus trap
  useEffect(() => {
    if (!open) return;
    const sheet = sheetRef.current;
    const focusables = sheet
      ? Array.from(sheet.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      : [];
    focusables[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {showBar && (
        <div className="relative z-[60] bg-ink text-white text-[12px]">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-9 flex items-center justify-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-2 text-white/60 font-mono uppercase tracking-[0.18em] text-[10px]">
              <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-mint dot" /> new
            </span>
            <span className="text-white/85">
              Safety Net now supports <b className="text-white">Morpho Blue</b> and{" "}
              <b className="text-white">Pendle PT</b> positions
            </span>
            <a
              href="/changelog"
              className="ml-1 text-mint inline-flex items-center gap-1 group"
            >
              Read changelog{" "}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </a>
            <button
              type="button"
              onClick={dismissBar}
              aria-label="Dismiss announcement"
              className="ml-2 text-white/50 hover:text-white text-[14px] leading-none px-1"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="sticky top-5 z-50 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="relative rounded-[20px] border border-line/80 bg-paper/65 backdrop-blur-2xl shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_24px_60px_-30px_rgba(12,12,12,0.28)]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

            <div className="flex items-center pl-5 pr-2 h-[60px]">
              <a href="#hero" aria-label="Safety Net — home" className="group flex items-center gap-3 pr-6">
                <Mark />
                <div className="flex items-baseline gap-1.5 leading-none">
                  <span className="font-serif italic text-[22px] tracking-[-0.01em]">Safety</span>
                  <span className="font-serif italic text-[22px] tracking-[-0.01em] text-mute">
                    Net
                  </span>
                </div>
              </a>

              <div aria-hidden="true" className="hidden md:block w-px h-7 bg-gradient-to-b from-transparent via-line to-transparent" />

              <nav aria-label="Primary" className="hidden md:flex items-center ml-4">
                {NAV_LINKS.map((l, i, arr) => (
                  <span key={l.label} className="flex items-center">
                    <a href={l.href} className="nav-link-mono">
                      {l.label}
                    </a>
                    {i < arr.length - 1 && (
                      <span aria-hidden="true" className="w-1 h-1 rounded-full bg-line mx-0.5" />
                    )}
                  </span>
                ))}
              </nav>

              <div className="ml-auto flex items-center gap-3">
                <div
                  className="hidden lg:flex items-center gap-2.5 pl-3 pr-3.5 h-9 rounded-full border border-line bg-white/60"
                  aria-label="Mainnet status: 14ms latency"
                >
                  <span className="relative flex w-1.5 h-1.5">
                    <span aria-hidden="true" className="absolute inset-0 rounded-full bg-mint opacity-40 animate-ping" />
                    <span aria-hidden="true" className="relative w-1.5 h-1.5 rounded-full bg-mint" />
                  </span>
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-graphite">
                    mainnet
                  </span>
                  <span aria-hidden="true" className="w-px h-3 bg-line" />
                  <span className="font-mono text-[9.5px] tnum text-mute">14ms</span>
                </div>

                <a
                  href="/signin"
                  className="hidden md:inline-flex items-center font-mono text-[10px] uppercase tracking-[0.22em] text-mute hover:text-ink transition-colors duration-500 px-2"
                >
                  Sign in
                </a>

                <button type="button" className="btn-wallet group hidden sm:inline-flex" aria-label="Connect wallet">
                  <span className="btn-wallet-icon" aria-hidden="true">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 7h15a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7Zm0 0V6a2 2 0 0 1 2-2h11"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <circle cx="17" cy="13" r="1.4" fill="currentColor" />
                    </svg>
                  </span>
                  <span className="btn-wallet-label">Connect wallet</span>
                  <span aria-hidden="true" className="btn-wallet-arr">→</span>
                </button>

                <button
                  type="button"
                  className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-line bg-white/60"
                  aria-label={open ? "Close menu" : "Open menu"}
                  aria-expanded={open}
                  aria-controls="mobile-menu"
                  onClick={() => setOpen((v) => !v)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                    {open ? (
                      <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    ) : (
                      <path d="M4 8 H20 M4 16 H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[55] md:hidden"
        >
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            ref={sheetRef}
            className="absolute top-20 left-4 right-4 rounded-[20px] border border-line bg-paper p-6 shadow-[0_24px_60px_-20px_rgba(12,12,12,0.4)]"
          >
            <ul className="flex flex-col">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-[18px] font-medium tracking-tight border-b border-line/60 last:border-b-0"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="btn-ink w-full justify-center mt-6"
              onClick={() => setOpen(false)}
            >
              Connect wallet <span aria-hidden="true" className="arr">→</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
