"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../_components/Providers";
import { graphql, QUERIES, MUTATIONS } from "../../_lib/api";
import { useWebSocket } from "../../_lib/hooks";
import { USE_MOCK_DATA, MOCK_WATCHLIST } from "../../_lib/mockData";

interface TokenWatch {
  id: string;
  tokenAddress: string;
  symbol: string;
  priceUsd: number;
  changePct: number;
  alertThresholdPct: number;
  status: string;
}

export function WatchlistPanel() {
  const { token } = useAuth();
  const { lastMessage } = useWebSocket(token || undefined);
  const [watchlist, setWatchlist] = useState<TokenWatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newToken, setNewToken] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchWatchlist = async () => {
      try {
        if (USE_MOCK_DATA) {
          // Use mock data for development
          await new Promise((r) => setTimeout(r, 300));
          setWatchlist(MOCK_WATCHLIST);
        } else {
          const data = await graphql<{ tokenWatchlist: TokenWatch[] }>(
            QUERIES.TOKEN_WATCHLIST,
            {},
            token
          );
          setWatchlist(data.tokenWatchlist || []);
        }
      } catch (err) {
        console.error("Failed to fetch watchlist:", err);
        setError(err instanceof Error ? err.message : "Failed to load watchlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [token]);

  // Update prices from WebSocket
  useEffect(() => {
    if (lastMessage?.type === "TokenUpdate") {
      setWatchlist((prev) =>
        prev.map((w) =>
          w.symbol === lastMessage.symbol
            ? {
                ...w,
                priceUsd: lastMessage.price_usd,
                changePct: lastMessage.change_pct,
                status: lastMessage.status,
              }
            : w
        )
      );
    }
  }, [lastMessage]);

  const handleAdd = async () => {
    if (!token || !newToken) return;

    setAdding(true);

    try {
      const data = await graphql<{ addToWatchlist: TokenWatch }>(
        MUTATIONS.ADD_TO_WATCHLIST,
        { tokenAddress: newToken, alertThresholdPct: -20 },
        token
      );
      setWatchlist((prev) => [...prev, data.addToWatchlist]);
      setNewToken("");
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to add token:", err);
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!token) return;

    try {
      await graphql(MUTATIONS.REMOVE_FROM_WATCHLIST, { watchId: id }, token);
      setWatchlist((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      console.error("Failed to remove token:", err);
    }
  };

  const getStatusConfig = (changePct: number, threshold: number) => {
    if (changePct >= 0) {
      return { color: "text-emerald-600", bg: "bg-emerald-50", status: "ok" };
    }
    if (changePct > threshold) {
      return { color: "text-amber-600", bg: "bg-amber-50", status: "warn" };
    }
    return { color: "text-red-600", bg: "bg-red-50", status: "alert" };
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(4)}`;
  };

  const getTokenIcon = (symbol: string) => {
    const icons: Record<string, string> = {
      ETH: "🔷",
      WBTC: "🟠",
      ARB: "🔵",
      LDO: "🔴",
      USDC: "💵",
      USDT: "💴",
    };
    return icons[symbol] || "🪙";
  };

  return (
    <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-line flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Token Watchlist</h2>
          <p className="text-sm text-mute mt-0.5">
            {watchlist.length} tokens tracked
          </p>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-ink border-t-transparent rounded-full" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-red-50 grid place-items-center">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-medium text-red-600 mb-1">Failed to load watchlist</p>
            <p className="text-sm text-mute">{error}</p>
          </div>
        ) : (
          <>
            {/* Token list */}
            {watchlist.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gray-100 grid place-items-center">
                  <svg className="w-6 h-6 text-mute" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">No tokens tracked</h3>
                <p className="text-sm text-mute mb-4">Add tokens to monitor their price and receive alerts.</p>
              </div>
            ) : (
              <div className="space-y-2 mb-4">
                {watchlist.map((w) => {
                  const status = getStatusConfig(w.changePct, w.alertThresholdPct);
                  return (
                    <div
                      key={w.id}
                      className={`flex items-center justify-between p-3 rounded-xl ${status.bg} transition-all hover:shadow-sm group`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getTokenIcon(w.symbol)}</span>
                        <div>
                          <p className="font-semibold text-sm">{w.symbol}</p>
                          <p className="text-xs text-mute font-mono">
                            {formatPrice(w.priceUsd)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2.5 py-1 rounded-lg text-sm font-medium ${status.color} ${status.bg}`}>
                          {w.changePct >= 0 ? "+" : ""}
                          {w.changePct.toFixed(1)}%
                        </div>
                        <button
                          onClick={() => handleRemove(w.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/50 transition-all"
                          title="Remove from watchlist"
                        >
                          <svg className="w-4 h-4 text-mute" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add token section */}
            {showAddForm ? (
              <div className="p-4 rounded-xl bg-gray-50 border border-line">
                <p className="text-sm font-medium mb-3">Add token to watchlist</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newToken}
                    onChange={(e) => setNewToken(e.target.value)}
                    placeholder="0x... token address"
                    className="flex-1 px-3 py-2.5 text-sm border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink font-mono"
                  />
                  <button
                    onClick={handleAdd}
                    disabled={adding || !newToken}
                    className="px-4 py-2.5 bg-ink text-white text-sm font-medium rounded-lg disabled:opacity-50 hover:bg-ink/90 transition-colors"
                  >
                    {adding ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      "Add"
                    )}
                  </button>
                </div>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="mt-2 text-xs text-mute hover:text-ink transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full py-3 px-4 border-2 border-dashed border-line rounded-xl text-sm text-mute hover:border-ink hover:text-ink transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add token to watchlist
              </button>
            )}

            {/* Legend */}
            {watchlist.length > 0 && (
              <div className="mt-4 pt-4 border-t border-line">
                <p className="text-xs text-mute mb-2">Alert thresholds</p>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-mute">Positive</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-mute">&gt;-20%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-mute">≤-20%</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
