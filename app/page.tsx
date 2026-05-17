export default function Home() {
  return (
    <div>
      <h1>Next.js App Router — Sidebar Link 2nd-Visit Stall Repro</h1>
      <p>
        Open this page behind a reverse proxy (Coolify Traefik, Vercel edge, or any
        production-grade proxy with HTTP/2 + TLS).
      </p>
      <ol>
        <li>Click <strong>Page A</strong> in the sidebar — fast (~80ms URL commit).</li>
        <li>Click <strong>Page B</strong> — fast.</li>
        <li>Click <strong>Page C</strong> — fast.</li>
        <li>
          Click <strong>Page A</strong> again — URL <strong>never commits</strong> within
          20s. Window stays on Page C.
        </li>
      </ol>
      <p>
        Bug reproduces on next@16.2.2, 16.2.6 (stable), and 16.3.0-canary.21.
      </p>
      <p>
        Does <strong>not</strong> reproduce on <code>next build &amp;&amp; next start</code>{" "}
        against localhost (no proxy, HTTP/1.1).
      </p>
    </div>
  );
}
