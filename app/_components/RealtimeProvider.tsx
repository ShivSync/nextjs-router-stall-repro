"use client";

import { createContext, useContext, useEffect, useState } from "react";

type RealtimeState = { connected: boolean; lastTick: number | null };
const RealtimeContext = createContext<RealtimeState>({ connected: false, lastTick: null });

// Mimics Supabase realtime: opens a persistent stream on mount, updates state on
// each incoming message. This is the most outreach-specific ingredient missing
// from the bare repro — the Live Activity widget keeps a WebSocket open.
export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<RealtimeState>({ connected: false, lastTick: null });

  useEffect(() => {
    const es = new EventSource("/api/stream");
    es.onopen = () => setState((s) => ({ ...s, connected: true }));
    es.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        setState((s) => ({ ...s, lastTick: msg.tick }));
      } catch {}
    };
    es.onerror = () => setState((s) => ({ ...s, connected: false }));
    return () => es.close();
  }, []);

  return <RealtimeContext.Provider value={state}>{children}</RealtimeContext.Provider>;
}

export function useRealtime() {
  return useContext(RealtimeContext);
}
