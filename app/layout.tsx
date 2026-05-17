"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/a", label: "Page A" },
  { href: "/b", label: "Page B" },
  { href: "/c", label: "Page C" },
  { href: "/d", label: "Page D" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <nav style={{ width: 200, padding: 16, background: "#f3f4f6", borderRight: "1px solid #e5e7eb" }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Sidebar</h2>
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
          <main style={{ flex: 1, padding: 32 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
