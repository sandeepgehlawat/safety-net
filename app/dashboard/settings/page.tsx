"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../_components/Providers";
import { useDisconnect } from "wagmi";
import { DashboardNav } from "../_components/DashboardNav";
import { StatsBar } from "../_components/StatsBar";
import { graphql } from "../../_lib/api";
import { USE_MOCK_DATA } from "../../_lib/mockData";

const UPDATE_NOTIFICATIONS = `
  mutation UpdateNotifications($fcmToken: String, $telegramChatId: String, $email: String, $enabled: Boolean!) {
    updateNotifications(fcmToken: $fcmToken, telegramChatId: $telegramChatId, email: $email, enabled: $enabled) {
      id
      notificationsEnabled
    }
  }
`;

const UPDATE_ALERT_THRESHOLD = `
  mutation UpdateAlertThreshold($positionId: ID!, $threshold: Float!) {
    updateAlertThreshold(positionId: $positionId, threshold: $threshold) {
      id
      alertThreshold
    }
  }
`;

export default function SettingsPage() {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [email, setEmail] = useState("");
  const [telegramId, setTelegramId] = useState("");
  const [defaultThreshold, setDefaultThreshold] = useState("1.20");

  useEffect(() => {
    setMounted(true);
    // Pre-fill with mock data in development
    if (USE_MOCK_DATA) {
      setEmail("user@example.com");
      setTelegramId("987654321");
      setDefaultThreshold("1.50");
    }
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.push("/");
    }
  }, [token, router, mounted]);

  const handleSaveNotifications = async () => {
    if (!token) return;
    setSaving(true);

    try {
      if (USE_MOCK_DATA) {
        // Simulate save in mock mode
        await new Promise((r) => setTimeout(r, 500));
      } else {
        await graphql(
          UPDATE_NOTIFICATIONS,
          {
            email: email || null,
            telegramChatId: telegramId || null,
            enabled: notificationsEnabled,
          },
          token
        );
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    logout();
    router.push("/");
  };

  if (!mounted || !token || !user) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-ink border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <DashboardNav />
      <StatsBar />

      <main className="max-w-[800px] mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">Settings</h1>
          <p className="text-mute">
            Configure your Safety Net preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Account section */}
          <section className="bg-white rounded-2xl border border-line overflow-hidden">
            <div className="px-6 py-4 border-b border-line">
              <h2 className="font-semibold">Account</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-mute mb-1">Wallet Address</p>
                <div className="flex items-center gap-3">
                  <code className="flex-1 px-4 py-3 bg-gray-50 rounded-lg font-mono text-sm">
                    {user.wallet_address}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(user.wallet_address)}
                    className="px-4 py-3 border border-line rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-mute mb-1">Subscription Tier</p>
                  <p className="px-4 py-3 bg-gray-50 rounded-lg font-medium capitalize">
                    {user.tier || "Free"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-mute mb-1">Autopilot Status</p>
                  <p className={`px-4 py-3 rounded-lg font-medium ${
                    user.autopilot_enabled
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-50 text-mute"
                  }`}>
                    {user.autopilot_enabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications section */}
          <section className="bg-white rounded-2xl border border-line overflow-hidden">
            <div className="px-6 py-4 border-b border-line flex items-center justify-between">
              <h2 className="font-semibold">Notifications</h2>
              {saved && (
                <span className="text-sm text-emerald-600 font-medium">✓ Saved</span>
              )}
            </div>
            <div className="p-6 space-y-6">
              {/* Master toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium">Enable Notifications</p>
                  <p className="text-sm text-mute">Receive alerts when positions need attention</p>
                </div>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    notificationsEnabled ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                      notificationsEnabled ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {notificationsEnabled && (
                <>
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="text-sm font-medium block mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
                    />
                    <p className="text-xs text-mute mt-1">
                      Receive email alerts for critical events
                    </p>
                  </div>

                  {/* Telegram */}
                  <div>
                    <label htmlFor="telegram" className="text-sm font-medium block mb-2">
                      Telegram Chat ID
                    </label>
                    <input
                      id="telegram"
                      type="text"
                      value={telegramId}
                      onChange={(e) => setTelegramId(e.target.value)}
                      placeholder="123456789"
                      className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink font-mono"
                    />
                    <p className="text-xs text-mute mt-1">
                      Message @SafetyNetBot on Telegram to get your chat ID
                    </p>
                  </div>

                  <button
                    onClick={handleSaveNotifications}
                    disabled={saving}
                    className="w-full py-3 bg-ink text-white rounded-lg font-medium hover:bg-ink/90 transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Notification Settings"}
                  </button>
                </>
              )}
            </div>
          </section>

          {/* Alert thresholds */}
          <section className="bg-white rounded-2xl border border-line overflow-hidden">
            <div className="px-6 py-4 border-b border-line">
              <h2 className="font-semibold">Alert Thresholds</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="threshold" className="text-sm font-medium block mb-2">
                  Default Health Factor Alert
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id="threshold"
                    type="number"
                    step="0.01"
                    min="1.0"
                    max="3.0"
                    value={defaultThreshold}
                    onChange={(e) => setDefaultThreshold(e.target.value)}
                    className="w-32 px-4 py-3 border border-line rounded-lg text-center font-mono focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
                  />
                  <div className="flex-1">
                    <input
                      type="range"
                      min="1.0"
                      max="2.0"
                      step="0.05"
                      value={defaultThreshold}
                      onChange={(e) => setDefaultThreshold(e.target.value)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-mute mt-1">
                      <span>1.0 (Risky)</span>
                      <span>2.0 (Safe)</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-mute mt-2">
                  You&apos;ll be alerted when your health factor drops below this value
                </p>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <span className="text-amber-500">⚠️</span>
                  <div>
                    <p className="text-sm font-medium text-amber-900">Recommendation</p>
                    <p className="text-sm text-amber-800 mt-1">
                      We recommend setting your alert threshold to at least 1.2 to give yourself
                      enough time to react before liquidation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Guardian signer */}
          <section className="bg-white rounded-2xl border border-line overflow-hidden">
            <div className="px-6 py-4 border-b border-line">
              <h2 className="font-semibold">Guardian Signer</h2>
            </div>
            <div className="p-6">
              <div className="p-4 bg-gray-50 rounded-xl mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Autopilot Permissions</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    user.autopilot_enabled
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {user.autopilot_enabled ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-mute">
                  The guardian signer allows Safety Net to execute transactions on your behalf
                  when autopilot is enabled.
                </p>
              </div>

              {user.autopilot_enabled && (
                <button className="w-full py-3 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors">
                  Revoke Guardian Access
                </button>
              )}
            </div>
          </section>

          {/* Danger zone */}
          <section className="bg-white rounded-2xl border border-red-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-red-100 bg-red-50">
              <h2 className="font-semibold text-red-700">Danger Zone</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Disconnect Wallet</p>
                  <p className="text-sm text-mute">
                    Remove your wallet and all associated data from Safety Net
                  </p>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
