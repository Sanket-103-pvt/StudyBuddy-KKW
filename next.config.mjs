/** @type {import('next').NextConfig} */
const nextConfig = {
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
