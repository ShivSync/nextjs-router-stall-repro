export const dynamic = "force-dynamic";

export async function GET() {
  // Simulate a slow DB query (~150ms) the way auth context fetches typically resolve.
  await new Promise((r) => setTimeout(r, 150));
  return Response.json({
    id: "tenant-abc",
    name: "Acme Corp",
    role: "admin",
  });
}
