"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../_components/Providers";
import { useWebSocket } from "../../_lib/hooks";
import { USE_MOCK_DATA, MOCK_STATS } from "../../_lib/mockData";

export function StatsBar() {
  const { token } = useAuth();
  const { lastMessage, connected: wsConnected } = useWebSocket(token || undefined);
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [positionsChecked, setPositionsChecked] = useState<number>(0);

  // In mock mode, always show as connected with mock data
  const connected = USE_MOCK_DATA ? true : wsConnected;

  // Initialize with mock data
  useEffect(() => {
    if (USE_MOCK_DATA) {
      setBlockNumber(MOCK_STATS.blockNumber);
      setLatencyMs(MOCK_STATS.latencyMs);
      setPositionsChecked(MOCK_STATS.positionsChecked);

      // Simulate live block updates
      const interval = setInterval(() => {
        setBlockNumber((prev) => (prev ? prev + 1 : MOCK_STATS.blockNumber));
        setLatencyMs(Math.floor(Math.random() * 15) + 8);
      }, 12000); // ~12 second block time

      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (!USE_MOCK_DATA && lastMessage?.type === "BlockProcessed") {
      setBlockNumber(lastMessage.block_number);
      setLatencyMs(lastMessage.latency_ms);
      setPositionsChecked(lastMessage.positions_checked);
    }
  }, [lastMessage]);

  return (
    <div className="bg-ink text-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-11 flex items-center justify-between">
        {/* Left side - Connection status */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className={`relative flex w-2 h-2`}>
              {connected && (
                <span className="absolute inset-0 rounded-full bg-mint opacity-40 animate-ping" />
              )}
              <span className={`relative w-2 h-2 rounded-full ${connected ? "bg-mint" : "bg-amber-400"}`} />
            </span>
            <span className="text-xs text-white/70">
              {connected ? "Connected" : "Connecting..."}
            </span>
          </div>

          {blockNumber && (
            <div className="hidden sm:flex items-center gap-2">
              <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-xs text-white/70">Block</span>
              <span className="font-mono text-xs text-white">{blockNumber.toLocaleString()}</span>
            </div>
          )}

          {latencyMs !== null && (
            <div className="hidden md:flex items-center gap-2">
              <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xs text-white/70">Latency</span>
              <span className={`font-mono text-xs ${
                latencyMs < 20 ? "text-mint" : latencyMs < 100 ? "text-amber-400" : "text-red-400"
              }`}>
                {latencyMs}ms
              </span>
            </div>
          )}

          {positionsChecked > 0 && (
            <div className="hidden lg:flex items-center gap-2">
              <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-white/70">Checked</span>
              <span className="font-mono text-xs text-white">{positionsChecked}</span>
            </div>
          )}
        </div>

        {/* Right side - Status message */}
        <div className="flex items-center gap-2 text-xs text-white/70">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Monitoring your positions 24/7</span>
        </div>
      </div>
    </div>
  );
}
