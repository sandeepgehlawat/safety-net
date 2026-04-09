"use client";

import { useEffect, useState } from "react";
import { TICKER_ITEMS } from "../../_data/content";

// WebSocket URL for live ticker
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://safety-net-backend-production.up.railway.app/ws";

export function LiveTicker() {
  const [events, setEvents] = useState<string[]>([...TICKER_ITEMS]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      try {
        ws = new WebSocket(WS_URL);

        ws.onopen = () => {
          setConnected(true);
          console.log("[LiveTicker] Connected to backend");
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === "TickerEvent") {
              setEvents((prev) => {
                const newEvents = [msg.message, ...prev];
                return newEvents.slice(0, 20);
              });
            }
          } catch (e) {
            // Ignore parse errors
          }
        };

        ws.onclose = () => {
          setConnected(false);
          // Reconnect after 3 seconds
          reconnectTimeout = setTimeout(connect, 3000);
        };

        ws.onerror = () => {
          setConnected(false);
        };
      } catch (e) {
        // WebSocket not available, use static data
        setConnected(false);
      }
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      ws?.close();
    };
  }, []);

  // Double events for seamless scroll
  const doubled = [...events, ...events];

  return (
    <section
      aria-label="Live agent activity"
      className="border-b border-line bg-paper overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-3 flex items-center gap-6">
        <div className="label flex items-center gap-2 whitespace-nowrap">
          <span
            aria-hidden="true"
            className={`w-1.5 h-1.5 rounded-full ${
              connected ? "bg-mint" : "bg-mute"
            } dot`}
          />
          {connected ? "live agent log" : "agent log"}
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="ticker flex gap-10 whitespace-nowrap font-mono text-[11px] text-mute">
            {doubled.map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
