export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      let i = 0;
      const interval = setInterval(() => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ tick: i++, ts: Date.now() })}\n\n`)
        );
      }, 2000);
      // Auto-cleanup after 5 min
      setTimeout(() => {
        clearInterval(interval);
        controller.close();
      }, 300_000);
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
