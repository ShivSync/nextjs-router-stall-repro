"use client";

import { useEffect, useState } from "react";

// Mimics the pattern that triggers the bug in the original report:
// "use client" page that does async work on mount. The specific work doesn't
// matter — what matters is that the destination route is a client component
// that hydrates with non-trivial dependencies. The bug fires on 2nd-visit
// regardless of what useEffect actually does.
export function HeavyClientPage({ label }: { label: string }) {
  const [ticks, setTicks] = useState(0);
  const [randomFetch, setRandomFetch] = useState<{ status: number; ms: number } | null>(null);

  useEffect(() => {
    // Simulate a real on-mount fetch (PostgREST/REST API style).
    const t0 = performance.now();
    fetch("/api/echo")
      .then((res) => setRandomFetch({ status: res.status, ms: Math.round(performance.now() - t0) }))
      .catch(() => null);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTicks((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <h1>{label}</h1>
      <p>This is a "use client" page that runs useEffect on mount.</p>
      <p>Mount fetch: {randomFetch ? `${randomFetch.status} in ${randomFetch.ms}ms` : "in flight..."}</p>
      <p>Ticks since mount: {ticks}</p>
      <p style={{ color: "#6b7280", fontSize: 13 }}>
        Now click a different sidebar link, then come back here. The 2nd visit will hang ~20s
        behind a proxy.
      </p>
    </div>
  );
}
