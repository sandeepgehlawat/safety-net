// API Client for Safety Net Backend
// Backend runs on port 3460

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3460";
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3460/ws";

// GraphQL client
export async function graphql<T>(
  query: string,
  variables?: Record<string, unknown>,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/graphql`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors[0]?.message || "GraphQL error");
  }

  return json.data as T;
}

// Auth: Connect wallet
export async function connectWallet(message: string, signature: string) {
  const res = await fetch(`${API_URL}/auth/connect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, signature }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res.json() as Promise<{
    token: string;
    user: {
      id: string;
      wallet_address: string;
      tier: string;
      autopilot_enabled: boolean;
    };
  }>;
}

// Fetch global stats (public)
export async function getGlobalStats() {
  const res = await fetch(`${API_URL}/stats`);
  return res.json() as Promise<{
    total_saved_usd: string;
    saved_this_week_usd: string;
    total_positions: number;
  }>;
}

// GraphQL Queries
export const QUERIES = {
  ME: `
    query Me {
      me {
        id
        walletAddress
        tier
        autopilotEnabled
        autopilotBudgetUsd
      }
    }
  `,

  LENDING_POSITIONS: `
    query LendingPositions {
      lendingPositions {
        id
        protocol
        chain
        healthFactor
        collateralUsd
        debtUsd
        alertThreshold
        indexedAt
      }
    }
  `,

  LP_POSITIONS: `
    query LpPositions {
      lpPositions {
        id
        tokenId
        token0 { symbol address }
        token1 { symbol address }
        feeTier
        lowerPriceUsd
        upperPriceUsd
        currentPriceUsd
        inRange
      }
    }
  `,

  TOKEN_WATCHLIST: `
    query TokenWatchlist {
      tokenWatchlist {
        id
        tokenAddress
        symbol
        priceUsd
        changePct
        alertThresholdPct
        status
      }
    }
  `,

  ALERTS: `
    query Alerts($limit: Int) {
      alerts(limit: $limit) {
        id
        alertType
        currentValue
        previousValue
        threshold
        firedAt
        suggestedAction
        simulation {
          id
          action
          amountUsd
          healthFactorBefore
          healthFactorAfter
          gasEstimate
          gasCostUsd
        }
      }
    }
  `,
};

// GraphQL Mutations
export const MUTATIONS = {
  SET_AUTOPILOT: `
    mutation SetAutopilot($enabled: Boolean!, $budgetUsd: Float) {
      setAutopilot(enabled: $enabled, budgetUsd: $budgetUsd) {
        id
        autopilotEnabled
        autopilotBudgetUsd
      }
    }
  `,

  SNOOZE_ALERT: `
    mutation SnoozeAlert($alertId: ID!, $durationMinutes: Int!) {
      snoozeAlert(alertId: $alertId, durationMinutes: $durationMinutes) {
        id
        status
      }
    }
  `,

  ADD_TO_WATCHLIST: `
    mutation AddToWatchlist($tokenAddress: String!, $alertThresholdPct: Float) {
      addToWatchlist(tokenAddress: $tokenAddress, alertThresholdPct: $alertThresholdPct) {
        id
        tokenAddress
        symbol
        priceUsd
        changePct
        alertThresholdPct
        status
      }
    }
  `,

  EXECUTE_INTERVENTION: `
    mutation ExecuteIntervention($simulationId: ID!) {
      executeIntervention(simulationId: $simulationId) {
        id
        txHash
        status
      }
    }
  `,

  REMOVE_FROM_WATCHLIST: `
    mutation RemoveFromWatchlist($watchId: ID!) {
      removeFromWatchlist(watchId: $watchId)
    }
  `,
};

// WebSocket client
export function createWebSocket(token?: string): WebSocket {
  const url = token ? `${WS_URL}?token=${token}` : WS_URL;
  return new WebSocket(url);
}

// WebSocket message types
export type WsMessage =
  | { type: "PositionUpdate"; position_id: string; health_factor?: number; in_range?: boolean; block_number: number }
  | { type: "AlertFired"; alert_id: string; position_id: string; alert_type: string; current_value: number; threshold: number }
  | { type: "TxStatus"; tx_id: string; status: string; tx_hash?: string }
  | { type: "TokenUpdate"; symbol: string; price_usd: number; change_pct: number; status: string }
  | { type: "BlockProcessed"; block_number: number; latency_ms: number; positions_checked: number }
  | { type: "TickerEvent"; event_type: string; message: string; timestamp_ms: number };
