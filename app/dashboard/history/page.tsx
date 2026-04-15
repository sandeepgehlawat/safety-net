"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../_components/Providers";
import { DashboardNav } from "../_components/DashboardNav";
import { StatsBar } from "../_components/StatsBar";
import { graphql } from "../../_lib/api";
import { USE_MOCK_DATA, MOCK_TRANSACTIONS } from "../../_lib/mockData";

interface Transaction {
  id: string;
  txType: string;
  status: string;
  txHash: string | null;
  amountUsd: number;
  gasCostUsd: number | null;
  isAutopilot: boolean;
  chain: string;
  submittedAt: string | null;
  confirmedAt: string | null;
}

const TRANSACTIONS_QUERY = `
  query Transactions($limit: Int) {
    transactions(limit: $limit) {
      id
      txType
      status
      txHash
      amountUsd
      gasCostUsd
      isAutopilot
      chain
      submittedAt
      confirmedAt
    }
  }
`;

export default function HistoryPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "repay" | "rebalance" | "withdraw">("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.push("/");
    }
  }, [token, router, mounted]);

  useEffect(() => {
    if (!token) return;

    const fetchTransactions = async () => {
      try {
        if (USE_MOCK_DATA) {
          // Use mock data for development
          await new Promise((r) => setTimeout(r, 400));
          setTransactions(MOCK_TRANSACTIONS);
        } else {
          const data = await graphql<{ transactions: Transaction[] }>(
            TRANSACTIONS_QUERY,
            { limit: 50 },
            token
          );
          setTransactions(data.transactions || []);
        }
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setError(err instanceof Error ? err.message : "Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token]);

  if (!mounted || !token || !user) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-ink border-t-transparent rounded-full" />
      </div>
    );
  }

  const filteredTransactions = filter === "all"
    ? transactions
    : transactions.filter((t) => t.txType === filter);

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string; label: string }> = {
      confirmed: { color: "text-emerald-600", bg: "bg-emerald-50", label: "Confirmed" },
      pending: { color: "text-amber-600", bg: "bg-amber-50", label: "Pending" },
      submitted: { color: "text-blue-600", bg: "bg-blue-50", label: "Submitted" },
      failed: { color: "text-red-600", bg: "bg-red-50", label: "Failed" },
    };
    return configs[status] || { color: "text-gray-600", bg: "bg-gray-50", label: status };
  };

  const getTxTypeConfig = (type: string) => {
    const configs: Record<string, { icon: string; label: string; color: string }> = {
      repay: { icon: "💳", label: "Debt Repayment", color: "text-emerald-600" },
      rebalance: { icon: "⚖️", label: "LP Rebalance", color: "text-blue-600" },
      withdraw: { icon: "📤", label: "Withdraw", color: "text-orange-600" },
    };
    return configs[type] || { icon: "📋", label: type, color: "text-gray-600" };
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatUsd = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  const totalSaved = transactions
    .filter((t) => t.status === "confirmed")
    .reduce((sum, t) => sum + t.amountUsd, 0);

  const totalGas = transactions
    .filter((t) => t.status === "confirmed")
    .reduce((sum, t) => sum + (t.gasCostUsd || 0), 0);

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <DashboardNav />
      <StatsBar />

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">Transaction History</h1>
          <p className="text-mute">
            All interventions executed by Safety Net
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-line p-4">
            <p className="text-sm text-mute mb-1">Total Transactions</p>
            <p className="text-2xl font-bold">{transactions.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-line p-4">
            <p className="text-sm text-mute mb-1">Amount Saved</p>
            <p className="text-2xl font-bold text-emerald-600">{formatUsd(totalSaved)}</p>
          </div>
          <div className="bg-white rounded-xl border border-line p-4">
            <p className="text-sm text-mute mb-1">Gas Spent</p>
            <p className="text-2xl font-bold">{formatUsd(totalGas)}</p>
          </div>
          <div className="bg-white rounded-xl border border-line p-4">
            <p className="text-sm text-mute mb-1">Autopilot Actions</p>
            <p className="text-2xl font-bold">{transactions.filter((t) => t.isAutopilot).length}</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6">
          {(["all", "repay", "rebalance", "withdraw"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-ink text-white"
                  : "bg-white border border-line text-mute hover:text-ink"
              }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Transactions list */}
        <div className="bg-white rounded-2xl border border-line overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-ink border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-mute">Loading history...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-red-50 grid place-items-center">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-medium text-red-600">{error}</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 grid place-items-center">
                <svg className="w-8 h-8 text-mute" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-1">No transactions yet</h3>
              <p className="text-mute">
                Interventions will appear here when Safety Net takes action to protect your positions.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs font-medium text-mute uppercase tracking-wide">
                <div className="col-span-3">Type</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Gas</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-3">Date</div>
              </div>

              {/* Table rows */}
              {filteredTransactions.map((tx) => {
                const typeConfig = getTxTypeConfig(tx.txType);
                const statusConfig = getStatusConfig(tx.status);
                return (
                  <div
                    key={tx.id}
                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
                  >
                    <div className="col-span-3 flex items-center gap-3">
                      <span className="text-xl">{typeConfig.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{typeConfig.label}</p>
                        <div className="flex items-center gap-2 text-xs text-mute">
                          <span className="capitalize">{tx.chain}</span>
                          {tx.isAutopilot && (
                            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-medium">
                              Autopilot
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className={`font-semibold ${typeConfig.color}`}>
                        {formatUsd(tx.amountUsd)}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-mute">{formatUsd(tx.gasCostUsd || 0)}</p>
                    </div>
                    <div className="col-span-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                    <div className="col-span-3 flex items-center justify-between">
                      <p className="text-sm text-mute">{formatDate(tx.confirmedAt || tx.submittedAt)}</p>
                      {tx.txHash && (
                        <a
                          href={`https://etherscan.io/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View ↗
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
