# Next.js App Router — 2nd-visit `<Link>` SPA-nav stall

Minimal reproduction for a Next.js App Router bug: clicking a sidebar `<Link>` to a previously-visited route in the same session hangs ~15-20 seconds before the URL commits.

## Reproduces on

- `next@16.2.2`, `next@16.2.6` (stable), `next@16.3.0-canary.21`
- React 19.2.4
- Behind any reverse proxy (Coolify Traefik, Vercel edge) with HTTP/2 + TLS
- App Router + `"use client"` destination pages

## Does NOT reproduce on

- `next build && next start` against `http://localhost:3000` (no proxy, HTTP/1.1)

## Live demo

https://nextjs-bug.meridiansuite.ai (Coolify + Traefik on Contabo)

## Repro steps

1. Open the live demo in a fresh Chrome / Chromium tab.
2. Click sidebar **Page A** — URL commits in ~80ms.
3. Click sidebar **Page B** — fast.
4. Click sidebar **Page C** — fast.
5. Click sidebar **Page A** again — **URL does not commit within 20 seconds**.

Network observations during the hung 2nd-visit click:

- `/a?_rsc=<hash>` RSC payload returns in ~250ms (HTTP 200).
- All static chunks load in ~60ms.
- No requests in-flight at click time.
- DOM does not update; URL does not commit.

Bypassing the SPA path with `window.location.href = '/a'` (hard nav) completes in ~1s reliably.

## Local repro (against `next start`)

```bash
pnpm install
pnpm build
pnpm start
# Open http://localhost:3000 and try the steps above.
# The bug does NOT reproduce locally — only behind a real proxy.
```

To reproduce locally, put the app behind any HTTP/2 + TLS reverse proxy (Traefik, Caddy, nginx). The `Dockerfile` is set up for Coolify.

## What I tried

- ✓ Removed `useLinkStatus` — no change.
- ✓ Removed per-route `loading.tsx` — no change.
- ✓ Converted destination pages from heavy `"use client"` → RSC + client island — no change.
- ✓ Tested 16.2.5's segment-prefetch security fix (`GHSA-267c-6grr-h53f`) — no change.
- ✓ Workaround: swap sidebar `<Link>` → plain `<a>` (hard-nav). Adds ~500-1000ms per click but works reliably.

## Environment

```
Node: 22 (Alpine)
Next.js: 16.2.6
React: 19.2.4
Deploy: Coolify on Contabo, Traefik reverse proxy, Let's Encrypt TLS
Browser tested: Chromium 134 (Playwright)
```
