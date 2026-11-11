/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

// STATIC_EXPORT=1 builds plain files (out/) for static hosts such as Cloudflare Pages.
// Headers and redirects are then served from public/_headers and public/_redirects instead.
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig = staticExport
  ? { output: "export", images: { unoptimized: true } }
  : {
      async headers() {
        return [{ source: "/:path*", headers: securityHeaders }];
      },
      async redirects() {
        return [
          // Quiz feature was removed in 2.0. Keep old indexed URLs alive by sending them to the subject page.
          { source: "/:year/:subject/quiz", destination: "/:year/:subject", permanent: true },
        ];
      },
    };

export default nextConfig;
