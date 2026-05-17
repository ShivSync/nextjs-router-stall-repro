"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Mimics the TenantProvider pattern used in production apps that subscribe to
// auth/tenant state from a database on mount. The bug under investigation only
// reproduces when this kind of provider is wrapping the entire layout.
type Tenant = { id: string; name: string; role: string };
const TenantContext = createContext<{ activeTenant: Tenant | null; loading: boolean }>({
  activeTenant: null,
  loading: true,
});

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [activeTenant, setActiveTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an on-mount fetch of tenant context (e.g., Supabase auth.getUser()
    // + a user_tenants lookup). Real apps do something like this.
    fetch("/api/tenant")
      .then((res) => res.json())
      .then((data) => {
        setActiveTenant(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <TenantContext.Provider value={{ activeTenant, loading }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}
