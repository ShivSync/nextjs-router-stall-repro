"use client";

import { useEffect, useState } from "react";
import { useTenant } from "./TenantProvider";
import { useRealtime } from "./RealtimeProvider";

// Destination page that mirrors outreach's pre-RSC-conversion shape: many
// useEffect-on-mount fetches in parallel, all scoped to the tenant from
// context, plus a live indicator from the realtime stream.
export function HeavyClientPage({ label }: { label: string }) {
  const { activeTenant, loading } = useTenant();
  const realtime = useRealtime();
  const [stats, setStats] = useState<Array<{ endpoint: string; ms: number; status: number }>>([]);

  useEffect(() => {
    if (!activeTenant) return;
    // Mirror outreach's pre-O-PERF-4 pattern: 10+ parallel reads on mount.
    const endpoints = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    Promise.all(
      endpoints.map(async (k) => {
        const t0 = performance.now();
        const res = await fetch(`/api/echo?tenant_id=${activeTenant.id}&key=${k}`);
        return { endpoint: k, ms: Math.round(performance.now() - t0), status: res.status };
      })
    ).then(setStats);
  }, [activeTenant]);

  return (
    <div>
      <h1>{label}</h1>
      <p>Tenant: {loading ? "loading..." : activeTenant?.name}</p>
      <p>Realtime: {realtime.connected ? `tick ${realtime.lastTick ?? 0}` : "—"}</p>
      <p>On-mount parallel fetches ({stats.length}/10):</p>
      <ul style={{ fontSize: 12, color: "#374151" }}>
        {stats.map((s) => (
          <li key={s.endpoint}>
            /api/echo?key={s.endpoint} → {s.status} in {s.ms}ms
          </li>
        ))}
      </ul>
    </div>
  );
}
