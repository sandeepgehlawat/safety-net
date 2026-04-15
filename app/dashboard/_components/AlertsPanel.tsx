"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../_components/Providers";
import { graphql, QUERIES, MUTATIONS } from "../../_lib/api";
import { useWebSocket } from "../../_lib/hooks";
import { USE_MOCK_DATA, MOCK_ALERTS } from "../../_lib/mockData";

interface Alert {
  id: string;
  alertType: string;
  currentValue: number;
  previousValue: number;
  threshold: number;
  firedAt: string;
  suggestedAction?: string;
  simulation?: {
    id: string;
    action: string;
    amountUsd: number;
    healthFactorBefore: number;
    healthFactorAfter: number;
    gasEstimate: number;
    gasCostUsd: number;
  };
}

export function AlertsPanel() {
  const { token } = useAuth();
  const { lastMessage } = useWebSocket(token || undefined);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [executing, setExecuting] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchAlerts = async () => {
      try {
        if (USE_MOCK_DATA) {
          // Use mock data for development
          await new Promise((r) => setTimeout(r, 400));
          setAlerts(MOCK_ALERTS);
        } else {
          const data = await graphql<{ alerts: Alert[] }>(
            QUERIES.ALERTS,
            { limit: 10 },
            token
          );
          setAlerts(data.alerts || []);
        }
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
        setError(err instanceof Error ? err.message : "Failed to load alerts");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [token]);

  // Listen for new alerts
  useEffect(() => {
    if (lastMessage?.type === "AlertFired") {
      // Refresh alerts when a new one fires
      if (token) {
        graphql<{ alerts: Alert[] }>(QUERIES.ALERTS, { limit: 10 }, token)
          .then((data) => data.alerts?.length && setAlerts(data.alerts))
          .catch(console.error);
      }
    }
  }, [lastMessage, token]);

  const handleSnooze = async (alertId: string) => {
    if (!token) return;

    try {
      await graphql(MUTATIONS.SNOOZE_ALERT, { alertId, durationMinutes: 60 }, token);
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    } catch (err) {
      console.error("Failed to snooze alert:", err);
    }
  };

  const handleExecute = async (alert: Alert) => {
    if (!token) return;

    setExecuting(alert.id);

    try {
      await graphql(MUTATIONS.EXECUTE_INTERVENTION, { simulationId: alert.id }, token);
      setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    } catch (err) {
      console.error("Failed to execute intervention:", err);
    } finally {
      setExecuting(null);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getAlertConfig = (type: string) => {
    const configs: Record<string, { icon: string; color: string; bg: string; title: string }> = {
      health_factor: {
        icon: "⚠️",
        color: "text-red-600",
        bg: "bg-red-50",
        title: "Health Factor Critical",
      },
      out_of_range: {
        icon: "📊",
        color: "text-orange-600",
        bg: "bg-orange-50",
        title: "LP Out of Range",
      },
      drawdown: {
        icon: "📉",
        color: "text-amber-600",
        bg: "bg-amber-50",
        title: "Token Drawdown",
      },
    };
    return configs[type] || { icon: "🔔", color: "text-gray-600", bg: "bg-gray-50", title: "Alert" };
  };

  return (
    <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-line flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Recent Alerts</h2>
          <p className="text-sm text-mute mt-0.5">
            Notifications requiring your attention
          </p>
        </div>
        {alerts.length > 0 && (
          <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
            {alerts.length} active
          </span>
        )}
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-ink border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-mute">Loading alerts...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-red-50 grid place-items-center">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-medium text-red-600 mb-1">Failed to load alerts</p>
            <p className="text-sm text-mute">{error}</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 grid place-items-center">
              <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-1">All clear!</h3>
            <p className="text-mute">No active alerts at the moment. Your positions are safe.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => {
              const config = getAlertConfig(alert.alertType);
              const isExecuting = executing === alert.id;

              return (
                <div
                  key={alert.id}
                  className={`rounded-xl border-2 border-red-200 overflow-hidden ${config.bg}`}
                >
                  {/* Alert header */}
                  <div className="px-5 py-4 flex items-start justify-between border-b border-red-100">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.icon}</span>
                      <div>
                        <h3 className={`font-semibold ${config.color}`}>{config.title}</h3>
                        <p className="text-sm text-mute">{formatTimeAgo(alert.firedAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-3xl font-bold ${config.color}`}>
                        {alert.currentValue.toFixed(2)}
                      </p>
                      <p className="text-sm text-mute">
                        ↓ from {alert.previousValue.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Simulation preview */}
                  {alert.simulation && (
                    <div className="px-5 py-4 border-b border-red-100">
                      <p className="text-sm text-mute mb-3">Simulated outcome if you repay:</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/80 rounded-xl p-4 border border-red-100">
                          <p className="text-xs text-mute uppercase tracking-wide mb-2">Before</p>
                          <p className="text-2xl font-bold text-red-600">
                            HF {alert.simulation.healthFactorBefore.toFixed(2)}
                          </p>
                          <p className="text-sm text-mute mt-1">At risk of liquidation</p>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                          <p className="text-xs text-mute uppercase tracking-wide mb-2">After</p>
                          <p className="text-2xl font-bold text-emerald-600">
                            HF {alert.simulation.healthFactorAfter.toFixed(2)}
                          </p>
                          <p className="text-sm text-emerald-600 mt-1">Safe zone</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="px-5 py-4 bg-white/50">
                    <div className="flex items-center gap-3">
                      {alert.simulation && (
                        <button
                          onClick={() => handleExecute(alert)}
                          disabled={isExecuting}
                          className="flex-1 py-3 px-6 bg-ink text-white rounded-xl font-semibold text-sm hover:bg-ink/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isExecuting ? (
                            <>
                              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                              Executing...
                            </>
                          ) : (
                            <>
                              {alert.suggestedAction === "repay" ? "Repay" : alert.suggestedAction || "Execute"} ${alert.simulation.amountUsd.toLocaleString()}
                              <span className="text-white/60">· one tap</span>
                            </>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleSnooze(alert.id)}
                        disabled={isExecuting}
                        className="py-3 px-6 border border-line bg-white rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        Snooze 1h
                      </button>
                    </div>

                    {alert.simulation && (
                      <p className="text-xs text-mute mt-3 text-center">
                        Gas estimate: {alert.simulation.gasEstimate.toLocaleString()} · ${alert.simulation.gasCostUsd.toFixed(2)}
                        <span className="mx-2">·</span>
                        Transaction will be simulated first
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
