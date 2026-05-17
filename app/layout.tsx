"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TenantProvider, useTenant } from "./_components/TenantProvider";
import { RealtimeProvider, useRealtime } from "./_components/RealtimeProvider";
import { ThemeProvider } from "./_components/ThemeProvider";
import { ToastProvider } from "./_components/ToastProvider";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/a", label: "Page A" },
  { href: "/b", label: "Page B" },
  { href: "/c", label: "Page C" },
  { href: "/d", label: "Page D" },
];

function Sidebar() {
  const pathname = usePathname();
  const { activeTenant, loading } = useTenant();
  const realtime = useRealtime();
  return (
    <nav style={{ width: 220, padding: 16, background: "#f3f4f6", borderRight: "1px solid #e5e7eb" }}>
      <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Sidebar</h2>
      <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>
        Tenant: {loading ? "loading..." : activeTenant?.name ?? "none"}
      </p>
      <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 16 }}>
        Realtime: {realtime.connected ? `tick ${realtime.lastTick ?? 0}` : "disconnected"}
      </p>
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          style={{
            display: "block",
            padding: "8px 12px",
            marginBottom: 4,
            borderRadius: 6,
            textDecoration: "none",
            color: pathname === item.href ? "#fff" : "#111827",
            background: pathname === item.href ? "#3b82f6" : "transparent",
            fontSize: 14,
          }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <ThemeProvider>
          <ToastProvider>
            <TenantProvider>
              <RealtimeProvider>
                <div style={{ display: "flex", minHeight: "100vh" }}>
                  <Sidebar />
                  <main style={{ flex: 1, padding: 32 }}>{children}</main>
                </div>
              </RealtimeProvider>
            </TenantProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
