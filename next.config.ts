import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), payment=(self)" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const staticCache = (value: string) => [{ key: "Cache-Control", value }];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // scripts/e2e.mjs builds into its own folder so it can run next to a normal `npm run dev`.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  compress: true,
  // The Buy Data page uses relative asset paths (app.js, images/…), so it must be served from a URL
  // inside /buy-data/; a rewrite of the bare /buy-data would make them resolve to the site root.
  async redirects() {
    return [{ source: "/buy-data", destination: "/buy-data/index.html", permanent: false }];
  },
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/index.html" }],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/:file(.*\\.(?:webp|png|jpg|jpeg|svg))",
        headers: staticCache("public, max-age=86400, stale-while-revalidate=604800"),
      },
      {
        source: "/:file(app|commercial-listings|font-loader|listing-pricing|ghana-locations).js",
        headers: staticCache("public, max-age=3600, stale-while-revalidate=86400"),
      },
      { source: "/styles.css", headers: staticCache("public, max-age=3600, stale-while-revalidate=86400") },
      { source: "/index.html", headers: staticCache("public, max-age=0, must-revalidate") },
    ];
  },
};

export default nextConfig;
