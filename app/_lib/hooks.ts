"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createWebSocket, WsMessage, getGlobalStats } from "./api";

// Hook for WebSocket connection
export function useWebSocket(token?: string) {
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WsMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
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

// Hook for live ticker (public, no auth required)
export function useLiveTicker() {
  const [events, setEvents] = useState<string[]>([]);
  const { lastMessage, connected } = useWebSocket();

  useEffect(() => {
    if (lastMessage?.type === "TickerEvent") {
      setEvents((prev) => {
        const newEvents = [lastMessage.message, ...prev];
        return newEvents.slice(0, 20); // Keep last 20
      });
    }
  }, [lastMessage]);

  return { events, connected };
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
