"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../_components/Providers";
import { DashboardNav } from "../_components/DashboardNav";
import { StatsBar } from "../_components/StatsBar";
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

export default function PositionsPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { lastMessage } = useWebSocket(token || undefined);
  const [mounted, setMounted] = useState(false);
  const [lendingPositions, setLendingPositions] = useState<LendingPosition[]>([]);
  const [lpPositions, setLpPositions] = useState<LpPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.push("/");
    }
  }, [token, router, mounted]);

  // Fetch positions
  useEffect(() => {
    if (!token) return;

    const fetchPositions = async () => {
      try {
        if (USE_MOCK_DATA) {
          // Use mock data for development
          await new Promise((r) => setTimeout(r, 500));
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

  // Real-time updates
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

  if (!mounted || !token || !user) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-ink border-t-transparent rounded-full" />
      </div>
    );
  }

  const getHealthStatus = (hf: number) => {
    if (hf >= 2) return { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "Healthy" };
    if (hf >= 1.5) return { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "Moderate" };
    if (hf >= 1.2) return { color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", label: "Warning" };
    return { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", label: "Critical" };
  };

  const getProtocolInfo = (protocol: string) => {
    const protocols: Record<string, { name: string; color: string }> = {
      aave_v3: { name: "Aave v3", color: "from-[#B6509E] to-[#2EBAC6]" },
      morpho: { name: "Morpho", color: "from-[#0F62FE] to-[#00D4FF]" },
      spark: { name: "Spark", color: "from-[#F2A900] to-[#FF6B00]" },
      compound: { name: "Compound", color: "from-[#00D395] to-[#070A0E]" },
      euler: { name: "Euler", color: "from-[#E4524F] to-[#8B1F1D]" },
    };
    return protocols[protocol] || { name: protocol, color: "from-gray-400 to-gray-600" };
  };

  const formatUsd = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const totalCollateral = lendingPositions.reduce((sum, p) => sum + p.collateralUsd, 0);
  const totalDebt = lendingPositions.reduce((sum, p) => sum + p.debtUsd, 0);

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <DashboardNav />
      <StatsBar />

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">All Positions</h1>
          <p className="text-mute">
            Detailed view of all your DeFi positions across protocols
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <SummaryCard
            label="Total Collateral"
            value={formatUsd(totalCollateral)}
            icon="💰"
          />
          <SummaryCard
            label="Total Debt"
            value={formatUsd(totalDebt)}
            icon="📉"
          />
          <SummaryCard
            label="Lending Positions"
            value={lendingPositions.length.toString()}
            icon="🏦"
          />
          <SummaryCard
            label="LP Positions"
            value={lpPositions.length.toString()}
            icon="💧"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-ink border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-mute">Loading positions...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 grid place-items-center">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-medium text-red-600 mb-2">Failed to load positions</p>
            <p className="text-mute">{error}</p>
          </div>
        ) : lendingPositions.length === 0 && lpPositions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-8">
            {/* Lending Positions */}
            {lendingPositions.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4">Lending Positions</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {lendingPositions.map((pos) => {
                    const status = getHealthStatus(pos.healthFactor);
                    const protocol = getProtocolInfo(pos.protocol);
                    return (
                      <div
                        key={pos.id}
                        className={`p-6 rounded-2xl border ${status.border} ${status.bg} bg-white shadow-sm`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${protocol.color} grid place-items-center text-white text-xl font-bold shadow-lg`}>
                              {protocol.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{protocol.name}</h3>
                              <p className="text-sm text-mute capitalize">{pos.chain}</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${status.bg} ${status.color} border ${status.border}`}>
                            {status.label}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-mute mb-1">Health Factor</p>
                            <p className={`text-2xl font-bold ${status.color}`}>
                              {pos.healthFactor.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-mute mb-1">Collateral</p>
                            <p className="text-lg font-semibold">{formatUsd(pos.collateralUsd)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-mute mb-1">Debt</p>
                            <p className="text-lg font-semibold">{formatUsd(pos.debtUsd)}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-line/50">
                          <div className="flex justify-between text-xs text-mute mb-1">
                            <span>Liquidation</span>
                            <span>Alert at {pos.alertThreshold}</span>
                          </div>
                          <div className="h-2 bg-white rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${status.color.replace("text-", "bg-")}`}
                              style={{ width: `${Math.min((pos.healthFactor / 3) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* LP Positions */}
            {lpPositions.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4">LP Positions</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {lpPositions.map((pos) => (
                    <div
                      key={pos.id}
                      className={`p-6 rounded-2xl border bg-white shadow-sm ${
                        pos.inRange ? "border-emerald-200" : "border-red-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex -space-x-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white grid place-items-center text-white text-xs font-bold">
                              {pos.token0.symbol.slice(0, 2)}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white grid place-items-center text-white text-xs font-bold">
                              {pos.token1.symbol.slice(0, 2)}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {pos.token0.symbol}/{pos.token1.symbol}
                            </h3>
                            <p className="text-sm text-mute">
                              {pos.feeTier / 10000}% fee · Uniswap v3
                            </p>
                          </div>
                        </div>
                        <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                          pos.inRange
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                          {pos.inRange ? "In Range" : "Out of Range"}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-mute mb-1">Lower</p>
                          <p className="font-mono font-semibold">${pos.lowerPriceUsd.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-3 bg-ink/5 rounded-lg border border-ink/10">
                          <p className="text-xs text-mute mb-1">Current</p>
                          <p className="font-mono font-bold">${pos.currentPriceUsd.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-mute mb-1">Upper</p>
                          <p className="font-mono font-semibold">${pos.upperPriceUsd.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="text-xs text-mute">
                        Token ID: <span className="font-mono">{pos.tokenId}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl border border-line p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-mute">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-100 grid place-items-center">
        <svg className="w-10 h-10 text-mute" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">No positions found</h3>
      <p className="text-mute max-w-md mx-auto mb-6">
        Connect your wallet to a DeFi protocol like Aave, Morpho, or Uniswap to start monitoring your positions.
      </p>
      <div className="flex items-center justify-center gap-4">
        <a
          href="https://app.aave.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-ink text-white rounded-lg text-sm font-medium hover:bg-ink/90 transition-colors"
        >
          Open Aave
        </a>
        <a
          href="https://app.uniswap.org"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 border border-line rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Open Uniswap
        </a>
      </div>
    </div>
  );
}
