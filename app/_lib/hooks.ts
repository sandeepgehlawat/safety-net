"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createWebSocket, WsMessage, getGlobalStats } from "./api";
import { USE_MOCK_DATA } from "./mockData";

// Hook for WebSocket connection
export function useWebSocket(token?: string) {
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WsMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // In mock mode, just simulate connection
    if (USE_MOCK_DATA) {
      setConnected(true);
      return;
    }

    const ws = createWebSocket(token);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      console.log("[WS] Connected to Safety Net backend");
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as WsMessage;
        setLastMessage(msg);
      } catch (e) {
        console.error("[WS] Failed to parse message:", e);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      console.log("[WS] Disconnected");
    };

    ws.onerror = (error) => {
      console.error("[WS] Error:", error);
    };

    return () => {
      ws.close();
    };
  }, [token]);

  const send = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { connected, lastMessage, send };
}

// Mock ticker events
const MOCK_TICKER_EVENTS = [
  "Protected $12,450 on Aave position for 0x1a2b...3c4d",
  "Health factor restored to 2.1 for 0x5e6f...7g8h",
  "LP position rebalanced on Uniswap v3",
  "Alert triggered: HF dropped below 1.5",
  "Autopilot repaid $3,200 USDC debt",
  "New position detected on Morpho",
  "Token watchlist alert: ARB -15%",
  "Saved $8,750 from potential liquidation",
];

// Hook for live ticker (public, no auth required)
export function useLiveTicker() {
  const [events, setEvents] = useState<string[]>([]);
  const { lastMessage, connected } = useWebSocket();

  useEffect(() => {
    if (USE_MOCK_DATA) {
      // Initialize with some mock events
      setEvents(MOCK_TICKER_EVENTS.slice(0, 5));

      // Simulate live events
      let idx = 0;
      const interval = setInterval(() => {
        idx = (idx + 1) % MOCK_TICKER_EVENTS.length;
        const event = MOCK_TICKER_EVENTS[idx]!;
        setEvents((prev) => [event, ...prev].slice(0, 20));
      }, 8000);

      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (!USE_MOCK_DATA && lastMessage?.type === "TickerEvent") {
      setEvents((prev) => {
        const newEvents = [lastMessage.message, ...prev];
        return newEvents.slice(0, 20); // Keep last 20
      });
    }
  }, [lastMessage]);

  return { events, connected: USE_MOCK_DATA ? true : connected };
}

// Hook for global stats
export function useGlobalStats() {
  const [stats, setStats] = useState<{
    total_saved_usd: string;
    saved_this_week_usd: string;
    total_positions: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      // Mock global stats
      setTimeout(() => {
        setStats({
          total_saved_usd: "2,847,392",
          saved_this_week_usd: "142,500",
          total_positions: 12847,
        });
        setLoading(false);
      }, 300);
      return;
    }

    getGlobalStats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, error };
}

// Hook for block info
export function useBlockInfo() {
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (lastMessage?.type === "BlockProcessed") {
      setBlockNumber(lastMessage.block_number);
      setLatencyMs(lastMessage.latency_ms);
    }
  }, [lastMessage]);

  return { blockNumber, latencyMs };
}

// Hook for token prices
export function useTokenPrices() {
  const [prices, setPrices] = useState<
    Map<string, { price: number; change: number; status: string }>
  >(new Map());
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (lastMessage?.type === "TokenUpdate") {
      setPrices((prev) => {
        const next = new Map(prev);
        next.set(lastMessage.symbol, {
          price: lastMessage.price_usd,
          change: lastMessage.change_pct,
          status: lastMessage.status,
        });
        return next;
      });
    }
  }, [lastMessage]);

  return prices;
}
