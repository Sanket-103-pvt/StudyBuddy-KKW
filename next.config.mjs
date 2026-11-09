/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Quiz feature was removed in 2.0. Keep old indexed URLs alive by sending them to the subject page.
      { source: "/:year/:subject/quiz", destination: "/:year/:subject", permanent: true },
      // Third and fourth year (AI&DS) are not live yet. Temporary redirect, because they will return.
      { source: "/third-year/:path*", destination: "/", permanent: false },
      { source: "/fourth-year/:path*", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
