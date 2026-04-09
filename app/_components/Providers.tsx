"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "../_lib/wagmi";
import { useState, createContext, useContext, useCallback, useEffect } from "react";

// Auth context for storing session
interface AuthState {
  token: string | null;
  user: {
    id: string;
    wallet_address: string;
    tier: string;
    autopilot_enabled: boolean;
  } | null;
}

interface AuthContextValue extends AuthState {
  setAuth: (auth: AuthState) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within Providers");
  return ctx;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  // Auth state with localStorage persistence
  const [auth, setAuthState] = useState<AuthState>({
    token: null,
    user: null,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("safetynet:auth");
      if (stored) {
        setAuthState(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const setAuth = useCallback((newAuth: AuthState) => {
    setAuthState(newAuth);
    try {
      if (newAuth.token) {
        localStorage.setItem("safetynet:auth", JSON.stringify(newAuth));
      } else {
        localStorage.removeItem("safetynet:auth");
      }
    } catch {
      // Ignore
    }
  }, []);

  const logout = useCallback(() => {
    setAuth({ token: null, user: null });
  }, [setAuth]);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={{ ...auth, setAuth, logout }}>
          {children}
        </AuthContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
