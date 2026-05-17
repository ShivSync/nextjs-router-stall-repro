"use client";

import { useEffect, useState } from "react";
import { useTenant } from "./TenantProvider";

// Destination page that consumes the tenant context AND triggers an on-mount
// fetch dependent on the tenant. This mirrors the pattern in outreach where
// every page calls useTenant() then does Supabase reads scoped to the tenant.
export function HeavyClientPage({ label }: { label: string }) {
  const { activeTenant, loading } = useTenant();
  const [stats, setStats] = useState<{ status: number; ms: number } | null>(null);

  useEffect(() => {
    if (!activeTenant) return;
    const t0 = performance.now();
    fetch(`/api/echo?tenant_id=${activeTenant.id}`)
      .then((res) => setStats({ status: res.status, ms: Math.round(performance.now() - t0) }))
      .catch(() => null);
  }, [activeTenant]);

  return (
    <div>
      <h1>{label}</h1>
      <p>Tenant: {loading ? "loading..." : activeTenant?.name}</p>
      <p>On-mount fetch: {stats ? `${stats.status} in ${stats.ms}ms` : "in flight..."}</p>
      <p style={{ color: "#6b7280", fontSize: 13 }}>
        Click a different sidebar Link, then come back. The 2nd visit may hang.
      </p>
    </div>
  );
}
