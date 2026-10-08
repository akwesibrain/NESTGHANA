import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), payment=(self)" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const staticCache = (value: string) => [{ key: "Cache-Control", value }];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/index.html" },
        { source: "/buy-data", destination: "/buy-data/index.html" },
        { source: "/buy-data/", destination: "/buy-data/index.html" },
      ],
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
        source: "/:file(app|commercial-listings|font-loader|supabase|supabase-config|ghana-locations).js",
        headers: staticCache("public, max-age=3600, stale-while-revalidate=86400"),
      },
      { source: "/styles.css", headers: staticCache("public, max-age=3600, stale-while-revalidate=86400") },
      { source: "/index.html", headers: staticCache("public, max-age=0, must-revalidate") },
    ];
  },
};

export default nextConfig;
