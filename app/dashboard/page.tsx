"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_components/Providers";
import { DashboardNav } from "./_components/DashboardNav";
import { PositionsPanel } from "./_components/PositionsPanel";
import { AlertsPanel } from "./_components/AlertsPanel";
import { WatchlistPanel } from "./_components/WatchlistPanel";
import { AutopilotPanel } from "./_components/AutopilotPanel";
import { StatsBar } from "./_components/StatsBar";

export default function DashboardPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to home if not authenticated (after mount to avoid hydration issues)
  useEffect(() => {
    if (mounted && !token) {
      router.push("/");
    }
  }, [token, router, mounted]);

  // Show loading during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-ink grid place-items-center">
            <svg viewBox="0 0 24 24" width="24" height="24" className="text-mint animate-pulse">
              <path
                d="M12 2 L21 6 V12 C21 17 17 21 12 22 C7 21 3 17 3 12 V6 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>
          <p className="text-mute">Loading Safety Net...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  if (!token || !user) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-ink border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-mute">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <DashboardNav />
      <StatsBar />

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">
            Welcome back
          </h1>
          <p className="text-mute">
            Your positions are being monitored 24/7. Here&apos;s the current status.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <PositionsPanel />
            <AlertsPanel />
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            <AutopilotPanel />
            <WatchlistPanel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 border-t border-line mt-8">
        <div className="flex items-center justify-between text-sm text-mute">
          <p>Safety Net v1.0</p>
          <div className="flex items-center gap-4">
            <a href="/docs" className="hover:text-ink transition-colors">Docs</a>
            <a href="/support" className="hover:text-ink transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
