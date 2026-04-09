"use client";

import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { injected } from "wagmi/connectors";
import { useRouter } from "next/navigation";
import { useAuth } from "./Providers";
import { connectWallet } from "../_lib/api";
import { useState, useCallback, useEffect } from "react";

interface ConnectWalletButtonProps {
  className?: string;
  variant?: "nav" | "cta" | "mobile";
}

export function ConnectWalletButton({
  className = "",
  variant = "nav",
}: ConnectWalletButtonProps) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { token, user, setAuth, logout } = useAuth();

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Auto-authenticate when wallet connects
  useEffect(() => {
    if (isConnected && address && !token && !isAuthenticating) {
      authenticate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, token]);

  const authenticate = useCallback(async () => {
    if (!address) return;

    setIsAuthenticating(true);
    setError(null);

    try {
      // Create SIWE message
      const domain = window.location.host;
      const uri = window.location.origin;
      const nonce = Math.random().toString(36).substring(2, 15);
      const issuedAt = new Date().toISOString();

      const message = `${domain} wants you to sign in with your Ethereum account:
${address}

Sign in to Safety Net

URI: ${uri}
Version: 1
Chain ID: 1
Nonce: ${nonce}
Issued At: ${issuedAt}`;

      // Sign the message
      const signature = await signMessageAsync({ message });

      // Send to backend
      const result = await connectWallet(message, signature);

      setAuth({
        token: result.token,
        user: result.user,
      });

      // Redirect to dashboard after successful auth
      router.push("/dashboard");
    } catch (err) {
      console.error("Authentication failed:", err);
      setError(err instanceof Error ? err.message : "Authentication failed");
      // Disconnect wallet on auth failure
      disconnect();
    } finally {
      setIsAuthenticating(false);
    }
  }, [address, signMessageAsync, setAuth, disconnect]);

  const handleConnect = useCallback(() => {
    setError(null);
    // Use injected connector (MetaMask, etc.)
    connect({ connector: injected() });
  }, [connect]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    logout();
    setShowDropdown(false);
  }, [disconnect, logout]);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Loading state
  if (isConnecting || isAuthenticating) {
    const loadingClass =
      variant === "nav"
        ? "btn-wallet group"
        : variant === "mobile"
          ? "btn-ink w-full justify-center"
          : "btn-ink";

    return (
      <button type="button" className={`${loadingClass} ${className}`} disabled>
        <span className="animate-pulse">
          {isConnecting ? "Connecting..." : "Signing..."}
        </span>
      </button>
    );
  }

  // Connected state
  if (isConnected && user) {
    if (variant === "nav") {
      return (
        <div className="relative">
          <button
            type="button"
            className={`btn-wallet group ${className}`}
            onClick={() => setShowDropdown(!showDropdown)}
            aria-expanded={showDropdown}
          >
            <span className="btn-wallet-icon" aria-hidden="true">
              <span className="w-2 h-2 rounded-full bg-mint" />
            </span>
            <span className="btn-wallet-label font-mono">
              {formatAddress(user.wallet_address)}
            </span>
            <span aria-hidden="true" className="btn-wallet-arr">
              ↓
            </span>
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-line bg-paper shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-line">
                  <p className="text-xs text-mute">Connected as</p>
                  <p className="font-mono text-sm truncate">
                    {formatAddress(user.wallet_address)}
                  </p>
                  <p className="text-xs text-mute mt-1 capitalize">
                    {user.tier} tier
                  </p>
                </div>
                <div className="p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDropdown(false);
                      router.push("/dashboard");
                    }}
                    className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      );
    }

    // CTA or mobile variant - show "Go to Dashboard" button
    const connectedClass =
      variant === "mobile"
        ? "btn-ink w-full justify-center"
        : "btn-ink";

    return (
      <button
        type="button"
        className={`${connectedClass} ${className}`}
        onClick={() => router.push("/dashboard")}
      >
        Go to Dashboard <span aria-hidden="true" className="arr">→</span>
      </button>
    );
  }

  // Disconnected state
  if (variant === "nav") {
    return (
      <button
        type="button"
        className={`btn-wallet group ${className}`}
        onClick={handleConnect}
        aria-label="Connect wallet"
      >
        <span className="btn-wallet-icon" aria-hidden="true">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 7h15a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7Zm0 0V6a2 2 0 0 1 2-2h11"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="17" cy="13" r="1.4" fill="currentColor" />
          </svg>
        </span>
        <span className="btn-wallet-label">Connect wallet</span>
        <span aria-hidden="true" className="btn-wallet-arr">
          →
        </span>
      </button>
    );
  }

  // CTA variant
  const ctaClass =
    variant === "mobile"
      ? "btn-ink w-full justify-center"
      : "btn-ink";

  return (
    <button
      type="button"
      className={`${ctaClass} ${className}`}
      onClick={handleConnect}
    >
      Connect wallet <span aria-hidden="true" className="arr">→</span>
      {error && (
        <span className="absolute -bottom-6 left-0 text-xs text-red-500">
          {error}
        </span>
      )}
    </button>
  );
}
