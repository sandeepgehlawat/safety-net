"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../_components/Providers";
import { graphql, QUERIES } from "../../_lib/api";
import { useWebSocket } from "../../_lib/hooks";
import { USE_MOCK_DATA, MOCK_LENDING_POSITIONS, MOCK_LP_POSITIONS } from "../../_lib/mockData";

interface LendingPosition {
  id: string;
  protocol: string;
  chain: string;
  healthFactor: number;
  collateralUsd: number;
  debtUsd: number;
  alertThreshold: number;
  indexedAt: string;
}

interface LpPosition {
  id: string;
  tokenId: string;
  token0: { symbol: string; address: string };
  token1: { symbol: string; address: string };
  feeTier: number;
  lowerPriceUsd: number;
  upperPriceUsd: number;
  currentPriceUsd: number;
  inRange: boolean;
}

export function PositionsPanel() {
  const { token } = useAuth();
  const { lastMessage } = useWebSocket(token || undefined);
  const [lendingPositions, setLendingPositions] = useState<LendingPosition[]>([]);
  const [lpPositions, setLpPositions] = useState<LpPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"lending" | "lp">("lending");

  // Fetch positions on mount
  useEffect(() => {
    if (!token) return;

    const fetchPositions = async () => {
      try {
        if (USE_MOCK_DATA) {
          // Use mock data for development
          await new Promise((r) => setTimeout(r, 500)); // Simulate network delay
          setLendingPositions(MOCK_LENDING_POSITIONS);
          setLpPositions(MOCK_LP_POSITIONS);
        } else {
          const [lendingData, lpData] = await Promise.all([
            graphql<{ lendingPositions: LendingPosition[] }>(QUERIES.LENDING_POSITIONS, {}, token),
            graphql<{ lpPositions: LpPosition[] }>(QUERIES.LP_POSITIONS, {}, token),
          ]);
          setLendingPositions(lendingData.lendingPositions || []);
          setLpPositions(lpData.lpPositions || []);
        }
      } catch (err) {
        console.error("Failed to fetch positions:", err);
        setError(err instanceof Error ? err.message : "Failed to load positions");
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, [token]);

  // Update positions from WebSocket
  useEffect(() => {
    if (lastMessage?.type === "PositionUpdate") {
      if (lastMessage.health_factor !== undefined) {
        setLendingPositions((prev) =>
          prev.map((p) =>
            p.id === lastMessage.position_id
              ? { ...p, healthFactor: lastMessage.health_factor! }
              : p
          )
        );
      }
      if (lastMessage.in_range !== undefined) {
        setLpPositions((prev) =>
          prev.map((p) =>
            p.id === lastMessage.position_id
              ? { ...p, inRange: lastMessage.in_range! }
              : p
          )
        );
      }
    }
  }, [lastMessage]);

  const getHealthStatus = (hf: number) => {
    if (hf >= 2) return { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "Healthy" };
    if (hf >= 1.5) return { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "Moderate" };
    if (hf >= 1.2) return { color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", label: "Warning" };
    return { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", label: "Critical" };
  };

  const getProtocolInfo = (protocol: string) => {
    const protocols: Record<string, { name: string; color: string; icon: string }> = {
      aave_v3: { name: "Aave v3", color: "from-[#B6509E] to-[#2EBAC6]", icon: "A" },
      morpho: { name: "Morpho", color: "from-[#0F62FE] to-[#00D4FF]", icon: "M" },
      spark: { name: "Spark", color: "from-[#F2A900] to-[#FF6B00]", icon: "S" },
      compound: { name: "Compound", color: "from-[#00D395] to-[#070A0E]", icon: "C" },
    };
    return protocols[protocol] || { name: protocol, color: "from-gray-400 to-gray-600", icon: "?" };
  };

  const formatUsd = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-line flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Your Positions</h2>
          <p className="text-sm text-mute mt-0.5">
            {lendingPositions.length + lpPositions.length} active positions being monitored
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setActiveTab("lending")}
            className={`px-4 py-2 text-sm rounded-lg transition-all ${
              activeTab === "lending"
                ? "bg-white shadow-sm font-medium text-ink"
                : "text-mute hover:text-ink"
            }`}
          >
            Lending
            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-gray-200 rounded-md">
              {lendingPositions.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("lp")}
            className={`px-4 py-2 text-sm rounded-lg transition-all ${
              activeTab === "lp"
                ? "bg-white shadow-sm font-medium text-ink"
                : "text-mute hover:text-ink"
            }`}
          >
            LP Ranges
            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-gray-200 rounded-md">
              {lpPositions.length}
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-ink border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-mute">Loading positions...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-red-50 grid place-items-center">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-medium text-red-600 mb-1">Failed to load positions</p>
            <p className="text-sm text-mute">{error}</p>
          </div>
        ) : lendingPositions.length === 0 && lpPositions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 grid place-items-center">
              <svg className="w-8 h-8 text-mute" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-1">No positions found</h3>
            <p className="text-mute max-w-md mx-auto">
              Connect your wallet to DeFi protocols like Aave, Morpho, or Uniswap to start monitoring.
            </p>
          </div>
        ) : activeTab === "lending" ? (
          lendingPositions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-mute">No lending positions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lendingPositions.map((pos) => {
                const status = getHealthStatus(pos.healthFactor);
                const protocol = getProtocolInfo(pos.protocol);
                return (
                  <div
                    key={pos.id}
                    className={`p-5 rounded-xl border ${status.border} ${status.bg} transition-all hover:shadow-md`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${protocol.color} grid place-items-center text-white text-lg font-bold shadow-lg`}>
                          {protocol.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{protocol.name}</h3>
                          <p className="text-sm text-mute flex items-center gap-2">
                            <span className="capitalize">{pos.chain}</span>
                            <span className="w-1 h-1 rounded-full bg-mute" />
                            <span>Alert at HF {pos.alertThreshold}</span>
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${status.bg} ${status.color} border ${status.border}`}>
                        {status.label}
                      </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-3 gap-6 mb-4">
                      <div className="bg-white/60 rounded-lg p-3">
                        <p className="text-xs text-mute mb-1 uppercase tracking-wide">Health Factor</p>
                        <p className={`text-2xl font-bold ${status.color}`}>
                          {pos.healthFactor.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3">
                        <p className="text-xs text-mute mb-1 uppercase tracking-wide">Collateral</p>
                        <p className="text-xl font-semibold">{formatUsd(pos.collateralUsd)}</p>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3">
                        <p className="text-xs text-mute mb-1 uppercase tracking-wide">Debt</p>
                        <p className="text-xl font-semibold">{formatUsd(pos.debtUsd)}</p>
                      </div>
                    </div>

                    {/* Health bar */}
                    <div>
                      <div className="flex justify-between text-xs text-mute mb-1.5">
                        <span>Liquidation (1.0)</span>
                        <span>Alert ({pos.alertThreshold})</span>
                        <span>Safe (3.0+)</span>
                      </div>
                      <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            pos.healthFactor >= 2 ? "bg-emerald-500" :
                            pos.healthFactor >= 1.5 ? "bg-amber-500" :
                            pos.healthFactor >= 1.2 ? "bg-orange-500" : "bg-red-500"
                          }`}
                          style={{ width: `${Math.min((pos.healthFactor / 3) * 100, 100)}%` }}
                        />
                      </div>
                      {/* Alert threshold marker */}
                      <div className="relative h-0">
                        <div
                          className="absolute -top-3 w-0.5 h-3 bg-ink/30"
                          style={{ left: `${(pos.alertThreshold / 3) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          lpPositions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-mute">No LP positions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lpPositions.map((pos) => {
                const rangePercent = ((pos.currentPriceUsd - pos.lowerPriceUsd) / (pos.upperPriceUsd - pos.lowerPriceUsd)) * 100;
                return (
                  <div
                    key={pos.id}
                    className={`p-5 rounded-xl border ${pos.inRange ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"} transition-all hover:shadow-md`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white grid place-items-center text-white text-xs font-bold shadow-md">
                            {pos.token0.symbol.slice(0, 2)}
                          </div>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white grid place-items-center text-white text-xs font-bold shadow-md">
                            {pos.token1.symbol.slice(0, 2)}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {pos.token0.symbol}/{pos.token1.symbol}
                          </h3>
                          <p className="text-sm text-mute">
                            {pos.feeTier / 10000}% fee tier · Uniswap v3
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        pos.inRange
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}>
                        {pos.inRange ? "In Range" : "Out of Range"}
                      </div>
                    </div>

                    {/* Price range visualization */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-white/60 rounded-lg p-3 text-center">
                        <p className="text-xs text-mute mb-1 uppercase tracking-wide">Lower</p>
                        <p className="font-mono font-semibold">${pos.lowerPriceUsd.toLocaleString()}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center border-2 border-ink/20">
                        <p className="text-xs text-mute mb-1 uppercase tracking-wide">Current</p>
                        <p className="font-mono font-bold text-lg">${pos.currentPriceUsd.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 text-center">
                        <p className="text-xs text-mute mb-1 uppercase tracking-wide">Upper</p>
                        <p className="font-mono font-semibold">${pos.upperPriceUsd.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Range bar */}
                    <div>
                      <div className="h-4 bg-white rounded-full overflow-hidden shadow-inner relative">
                        {/* Range background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100 to-transparent" />
                        {/* Current price marker */}
                        <div
                          className={`absolute top-0 bottom-0 w-1 ${pos.inRange ? "bg-emerald-500" : "bg-red-500"} shadow-lg`}
                          style={{ left: `${Math.max(0, Math.min(100, rangePercent))}%`, transform: "translateX(-50%)" }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-mute mt-1">
                        <span>Lower bound</span>
                        <span>Upper bound</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
