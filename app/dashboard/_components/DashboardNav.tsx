"use client";

import { useAuth } from "../../_components/Providers";
import { useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export function DashboardNav() {
  const { user, logout } = useAuth();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDisconnect = () => {
    disconnect();
    logout();
    setShowDropdown(false);
    router.push("/");
  };

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-line">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-xl bg-ink grid place-items-center">
            <svg viewBox="0 0 24 24" width="20" height="20" className="text-mint">
              <path
                d="M12 2 L21 6 V12 C21 17 17 21 12 22 C7 21 3 17 3 12 V6 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <span className="font-serif italic text-xl">Safety Net</span>
            <span className="ml-2 px-2 py-0.5 text-[10px] font-medium bg-mint/10 text-mint rounded-full">
              BETA
            </span>
          </div>
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-1 bg-gray-100/80 rounded-xl p-1">
          <NavLink href="/dashboard" active>Overview</NavLink>
          <NavLink href="/dashboard/positions">Positions</NavLink>
          <NavLink href="/dashboard/history">History</NavLink>
          <NavLink href="/dashboard/settings">Settings</NavLink>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Network badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-mint/10 border border-mint/20">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-mint opacity-40 animate-ping" />
              <span className="relative w-2 h-2 rounded-full bg-mint" />
            </span>
            <span className="text-xs font-medium text-mint">Mainnet</span>
          </div>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-line bg-white hover:bg-gray-50 transition-colors"
            >
              {/* Avatar */}
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-400 to-indigo-400 grid place-items-center text-white text-xs font-bold">
                {user?.wallet_address?.slice(2, 4).toUpperCase() || "??"}
              </div>
              <span className="hidden sm:block font-mono text-sm">
                {user ? formatAddress(user.wallet_address) : "..."}
              </span>
              <svg
                className={`w-4 h-4 text-mute transition-transform ${showDropdown ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                  onKeyDown={(e) => e.key === "Escape" && setShowDropdown(false)}
                  role="button"
                  tabIndex={0}
                  aria-label="Close dropdown"
                />
                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-line bg-white shadow-xl z-50 overflow-hidden">
                  {/* User info header */}
                  <div className="px-4 py-4 bg-gradient-to-br from-gray-50 to-white border-b border-line">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-400 grid place-items-center text-white font-bold">
                        {user?.wallet_address?.slice(2, 4).toUpperCase() || "??"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm truncate">{user?.wallet_address}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-ink/10 rounded-full capitalize">
                            {user?.tier || "free"} tier
                          </span>
                          {user?.autopilot_enabled && (
                            <span className="px-2 py-0.5 text-[10px] font-medium bg-mint/10 text-mint rounded-full">
                              Autopilot ON
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="p-2">
                    <DropdownLink href="/dashboard" icon="📊" onClick={() => setShowDropdown(false)}>
                      Dashboard
                    </DropdownLink>
                    <DropdownLink href="/dashboard/settings" icon="⚙️" onClick={() => setShowDropdown(false)}>
                      Settings
                    </DropdownLink>
                    <DropdownLink href="/docs" icon="📖" onClick={() => setShowDropdown(false)}>
                      Documentation
                    </DropdownLink>
                    <div className="my-2 border-t border-line" />
                    <button
                      onClick={handleDisconnect}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <span>🚪</span>
                      Disconnect Wallet
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children, active = false }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 text-sm rounded-lg transition-colors ${
        active
          ? "bg-white shadow-sm font-medium text-ink"
          : "text-mute hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}

function DropdownLink({
  href,
  icon,
  children,
  onClick
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-gray-50 transition-colors"
    >
      <span>{icon}</span>
      {children}
    </Link>
  );
}
