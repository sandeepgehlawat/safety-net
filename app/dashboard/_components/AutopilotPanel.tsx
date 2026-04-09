"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../_components/Providers";
import { graphql, MUTATIONS } from "../../_lib/api";

export function AutopilotPanel() {
  const { user, token, setAuth } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [budget, setBudget] = useState("5000");
  const [saving, setSaving] = useState(false);
  const [permissions, setPermissions] = useState({
    repay: true,
    rebalance: true,
    withdraw: false,
  });

  // Sync with user data
  useEffect(() => {
    if (user) {
      setEnabled(user.autopilot_enabled || false);
    }
  }, [user]);

  const handleToggle = async () => {
    if (!token || !user) return;
    setSaving(true);

    try {
      const newEnabled = !enabled;
      await graphql<{
        setAutopilot: { autopilotEnabled: boolean; autopilotBudgetUsd: number };
      }>(
        MUTATIONS.SET_AUTOPILOT,
        { enabled: newEnabled, budgetUsd: parseFloat(budget) },
        token
      );

      setEnabled(newEnabled);
      setAuth({
        token,
        user: { ...user, autopilot_enabled: newEnabled },
      });
    } catch (err) {
      console.error("Failed to update autopilot:", err);
      // Revert on error
      setEnabled(!enabled);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
      {/* Header with toggle */}
      <div className="px-6 py-4 border-b border-line flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Autopilot</h2>
          <p className="text-sm text-mute mt-0.5">
            Automatic interventions
          </p>
        </div>
        <button
          onClick={handleToggle}
          disabled={saving}
          className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
            enabled ? "bg-emerald-500" : "bg-gray-200"
          } ${saving ? "opacity-50" : ""}`}
          aria-label={enabled ? "Disable autopilot" : "Enable autopilot"}
        >
          <span
            className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${
              enabled ? "left-7" : "left-1"
            }`}
          />
        </button>
      </div>

      <div className="p-6">
        {enabled ? (
          <>
            {/* Active status card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 grid place-items-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-emerald-900">Autopilot Active</p>
                  <p className="text-sm text-emerald-700">Protecting your positions 24/7</p>
                </div>
              </div>
              <p className="text-sm text-emerald-800">
                Safety Net will automatically execute interventions when your positions reach critical levels,
                without requiring manual approval.
              </p>
            </div>

            {/* Budget setting */}
            <div className="mb-6">
              <label htmlFor="autopilot-budget" className="text-sm font-semibold block mb-2">
                Daily Spending Limit
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-mute font-medium">$</span>
                <input
                  id="autopilot-budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-line rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <p className="text-xs text-mute mt-2">
                Maximum amount the autopilot can spend per day on gas and repayments
              </p>
            </div>

            {/* Permissions */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Allowed Actions</h3>
              <div className="space-y-3">
                <PermissionToggle
                  id="perm-repay"
                  label="Repay debt"
                  description="Automatically repay loans when health factor drops"
                  enabled={permissions.repay}
                  onChange={(v) => setPermissions((p) => ({ ...p, repay: v }))}
                />
                <PermissionToggle
                  id="perm-rebalance"
                  label="Rebalance LP positions"
                  description="Adjust Uniswap v3 ranges when out of bounds"
                  enabled={permissions.rebalance}
                  onChange={(v) => setPermissions((p) => ({ ...p, rebalance: v }))}
                />
                <PermissionToggle
                  id="perm-withdraw"
                  label="Withdraw collateral"
                  description="Remove collateral from lending protocols"
                  enabled={permissions.withdraw}
                  onChange={(v) => setPermissions((p) => ({ ...p, withdraw: v }))}
                  disabled
                  disabledReason="Disabled for safety"
                />
              </div>
            </div>

            {/* Security note */}
            <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-start gap-3">
                <span className="text-amber-500 mt-0.5">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-amber-900">Security Note</p>
                  <p className="text-sm text-amber-800 mt-1">
                    Autopilot uses a guardian signer with limited permissions.
                    You can revoke access at any time from Settings.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Disabled state */
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 grid place-items-center">
              <svg className="w-8 h-8 text-mute" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Autopilot is off</h3>
            <p className="text-sm text-mute mb-6 max-w-xs mx-auto">
              Enable autopilot to let Safety Net automatically protect your positions
              when they reach critical levels.
            </p>

            {/* Feature highlights */}
            <div className="text-left space-y-3 p-4 rounded-xl bg-gray-50 border border-line">
              <Feature icon="⚡" text="Instant response to market moves" />
              <Feature icon="🔒" text="Scoped permissions - you stay in control" />
              <Feature icon="💰" text="Set daily spending limits" />
              <Feature icon="🔔" text="Get notified of every action" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PermissionToggle({
  id,
  label,
  description,
  enabled,
  onChange,
  disabled = false,
  disabledReason,
}: {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  disabledReason?: string;
}) {
  return (
    <div className={`flex items-start justify-between p-3 rounded-xl border ${
      disabled ? "border-gray-100 bg-gray-50 opacity-60" : "border-line hover:border-ink/20"
    } transition-colors`}>
      <label htmlFor={id} className={`flex-1 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-mute mt-0.5">{description}</p>
        {disabled && disabledReason && (
          <p className="text-xs text-amber-600 mt-1">{disabledReason}</p>
        )}
      </label>
      <input
        id={id}
        type="checkbox"
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="w-5 h-5 rounded border-line text-emerald-500 focus:ring-emerald-500 mt-0.5"
      />
    </div>
  );
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg">{icon}</span>
      <span className="text-sm text-mute">{text}</span>
    </div>
  );
}
